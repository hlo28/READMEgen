import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./App.css";

function App() {
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [readme, setReadme] = useState("");
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("preview");

  async function generateReadme() {
    setLoading(true);
    setError("");
    setReadme("");
    setCopied(false);
    try {
      const apiBase = import.meta.env.VITE_API_BASE || "";
      const resp = await fetch(`${apiBase}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || "Failed to generate");
      setReadme(data.readme);
      setActiveTab("preview");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(readme);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-gray-100">
      

      <header className="relative z-10 max-w-6xl mx-auto px-6 pt-10 text-center">
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
          <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
            ReadMe Studio
          </span>
        </h1>
        <p className="mt-3 text-gray-400 max-w-2xl mx-auto">
          Generate beautiful, complete README.md files from any public GitHub
          repository.
        </p>
      </header>

      <main className="relative z-10 readme-studio-wrapper">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur shadow-xl overflow-hidden w-full readme-studio-card">
          {/* Input row */}
          <div className="p-6 border-b border-white/10">
            <label className="block text-sm text-gray-300 mb-2">
              GitHub Repository URL
            </label>
            <div className="flex flex-col sm:flex-row gap-3 readme-studio-input-row">
              <input
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/owner/repo"
                className="flex-1 bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/60 readme-studio-input"
              />
              <button
                onClick={generateReadme}
                disabled={loading || !repoUrl}
                className={`shrink-0 inline-flex justify-center items-center px-5 py-3 rounded-xl font-semibold transition readme-studio-button ${
                  loading || !repoUrl
                    ? "bg-purple-700/50 text-white/80 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-lg shadow-purple-600/20"
                }`}
              >
                {loading ? "Generating…" : "Generate"}
              </button>
            </div>
            {error && (
              <p className="mt-3 text-sm text-red-300">Error: {error}</p>
            )}
            {!error && !loading && !readme && (
              <p className="mt-3 text-xs text-gray-500">
                Example: https://github.com/facebook/react
              </p>
            )}
          </div>

          {/* Tabs */}
          <div className="px-4 sm:px-6 pt-4 pb-2 border-b border-white/10 flex items-center justify-between readme-studio-tabs">
            <div className="flex items-center gap-2 text-sm">
              <button
                className={`px-3 py-2 rounded-lg ${
                  activeTab === "preview" ? "bg-white/10" : "hover:bg-white/5"
                }`}
                onClick={() => setActiveTab("preview")}
              >
                Preview
              </button>
              <button
                className={`px-3 py-2 rounded-lg ${
                  activeTab === "markdown" ? "bg-white/10" : "hover:bg-white/5"
                }`}
                onClick={() => setActiveTab("markdown")}
              >
                Markdown
              </button>
            </div>
            {readme && (
              <button
                onClick={copyToClipboard}
                className="inline-flex items-center bg-white/10 hover:bg-white/20 text-xs sm:text-sm font-medium py-1.5 px-3 rounded-lg transition-colors"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            )}
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 readme-studio-content">
            {!readme && !loading && (
              <div className="text-center text-gray-500 py-20">
                Your generated README will appear here.
              </div>
            )}
            {activeTab === "markdown" && readme && (
              <pre className="whitespace-pre-wrap break-words font-mono leading-relaxed text-xs sm:text-sm p-4 bg-black/30 rounded-lg border border-white/10 shadow-inner max-h-[75vh] overflow-auto readme-studio-markdown">
                {readme}
              </pre>
            )}
            {activeTab === "preview" && readme && (
              <article className="prose prose-invert max-w-none prose-pre:bg-black/40 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-lg prose-code:break-words prose-pre:overflow-auto max-h-[75vh] overflow-auto readme-studio-preview">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {readme}
                </ReactMarkdown>
              </article>
            )}
            {loading && (
              <div className="flex items-center justify-center py-8 text-gray-400 text-sm">
                Generating README…
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
