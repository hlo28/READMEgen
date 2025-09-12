async function generateReadme() {
  const repoUrl = document.getElementById("repoUrl").value;
  const resultDiv = document.getElementById("result");
  const generateBtn = document.getElementById("generateBtn");

  // --- Loading State ---
  resultDiv.innerHTML = `
        <div class="flex justify-center items-center h-full pt-20">
            <svg class="animate-spin h-8 w-8 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="ml-3 text-gray-400">The AI is thinking...</p>
        </div>`;
  generateBtn.disabled = true;
  generateBtn.innerHTML = "Generating...";
  generateBtn.classList.add("opacity-50", "cursor-not-allowed");

  try {
    const response = await fetch("/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ repoUrl: repoUrl }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Network response was not ok");
    }

    // --- Success State with Copy Button ---
    resultDiv.innerHTML = `
            <div class="flex justify-between items-center mb-2">
                <h3 class="text-lg font-semibold text-white">Generated README.md</h3>
                <button onclick="copyToClipboard(this)" class="bg-gray-700 hover:bg-gray-600 text-sm font-medium py-1 px-3 rounded-lg transition-colors">Copy</button>
            </div>
            <pre id="readme-content" class="whitespace-pre-wrap font-mono text-sm p-4 bg-gray-950/50 rounded-md">${data.readme}</pre>
        `;
  } catch (error) {
    // --- Error State ---
    resultDiv.innerHTML = `<div class="flex justify-center items-center h-full pt-20"><p class="text-red-400">Error: ${error.message}</p></div>`;
  } finally {
    // --- Reset Button ---
    generateBtn.disabled = false;
    generateBtn.innerHTML = "✨ Generate";
    generateBtn.classList.remove("opacity-50", "cursor-not-allowed");
  }
}

function copyToClipboard(button) {
  const readmeContent = document.getElementById("readme-content").innerText;
  navigator.clipboard.writeText(readmeContent).then(
    () => {
      button.innerText = "Copied!";
      setTimeout(() => {
        button.innerText = "Copy";
      }, 2000); // Reset button text after 2 seconds
    },
    (err) => {
      console.error("Could not copy text: ", err);
      button.innerText = "Failed";
    }
  );
}
