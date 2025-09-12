require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Octokit } = require("@octokit/rest");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { z } = require("zod");

// --- Initialize Clients ---
const app = express();
app.use(cors());
app.use(express.json());

// Legacy static UI disabled; React app runs separately on Vite dev server

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function limitArray(arr, max = 800) {
  if (!Array.isArray(arr)) return [];
  return arr.slice(0, max);
}

const BodySchema = z.object({
  repoUrl: z
    .string({ required_error: "repoUrl is required" })
    .url("repoUrl must be a valid URL")
    .refine((u) => /github\.com\//.test(u), {
      message: "Only GitHub URLs are supported",
    }),
});

// --- API Endpoint ---
app.post("/generate", async (req, res) => {
  try {
    const parse = BodySchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ error: parse.error.issues[0].message });
    }
    const { repoUrl } = parse.data;

    const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)(?:$|\.|\/)/);
    if (!match) {
      return res.status(400).json({ error: "Invalid GitHub URL format" });
    }
    const owner = match[1];
    const repo = match[2];

    const { data: repoInfo } = await octokit.repos.get({ owner, repo });

    // Helpers
    const safeGetContent = async (path) => {
      try {
        const { data } = await octokit.repos.getContent({ owner, repo, path });
        return Buffer.from(data.content, "base64").toString("utf8");
      } catch {
        return null;
      }
    };

    // Fetch tree, languages, license file
    const [{ data: tree }, { data: languagesMap }, licenseContent] =
      await Promise.all([
        octokit.git.getTree({
          owner,
          repo,
          tree_sha: repoInfo.default_branch,
          recursive: "1",
        }),
        octokit.repos.listLanguages({ owner, repo }),
        safeGetContent("LICENSE"),
      ]);

    const filePaths = tree.tree.map((t) => t.path);
    const languages = Object.keys(languagesMap || {});
    const license = repoInfo.license
      ? repoInfo.license.spdx_id || repoInfo.license.name
      : licenseContent
      ? "See LICENSE file"
      : "unlicensed";

    const context = {
      name: repoInfo.name,
      description: repoInfo.description || "",
      url: repoInfo.html_url,
      default_branch: repoInfo.default_branch,
      languages,
      license,
      file_paths_sample: limitArray(filePaths, 1200),
      topics: (await octokit.repos.getAllTopics({ owner, repo })).data.names,
    };

    // Ask AI to produce the full README in Markdown
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest",
    });
    const prompt = `Generate a complete, professional README.md in pure Markdown for the GitHub repository using ONLY the provided metadata for facts (license, tech stack/languages, and project structure derived from file paths). Infer a clear description, features, and realistic usage.\n\nMANDATORY SECTIONS (this exact order):\n1. # Project Title\n2. ## Description\n3. ## Features\n4. ## Installation\n5. ## Usage\n6. ## Tech Stack\n7. ## Project Structure\n8. ## License\n\nFormatting rules:\n- Use clean Markdown with lists and fenced code blocks where needed.\n- For Project Structure, render a concise tree view up to 3 levels deep using the provided file paths.\n- For Tech Stack, base it on the languages array.\n- Do not ask the user for information.\n- Output ONLY the final Markdown (no surrounding backticks).\n\nMetadata (JSON):\n${JSON.stringify(
      context,
      null,
      2
    )}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const readmeText = (response.text() || "").trim();
    return res.json({ readme: readmeText });
  } catch (error) {
    console.error("Error:", error);
    if (error.message.includes("503") || error.message.includes("overloaded")) {
      return res
        .status(503)
        .json({
          error:
            "The AI model is temporarily overloaded. Please try again in a moment.",
        });
    }
    res
      .status(500)
      .json({ error: "Failed to generate README. " + error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
