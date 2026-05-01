const imageInput = document.querySelector("#imageInput");
const dropZone = document.querySelector("#dropZone");
const previewWrap = document.querySelector("#previewWrap");
const imagePreview = document.querySelector("#imagePreview");
const analyzeButton = document.querySelector("#analyzeButton");
const copyButton = document.querySelector("#copyButton");
const resultCard = document.querySelector("#resultCard");
const statusPill = document.querySelector("#statusPill");

let imageDataUrl = "";
let currentAnalysis = "";

function setStatus(text, state = "") {
  statusPill.textContent = text;
  statusPill.className = `status-pill ${state}`.trim();
}

function updateAnalyzeButton() {
  analyzeButton.disabled = !imageDataUrl;
}

function formatAnalysis(text) {
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return escaped.replace(/^(\d\.\s[^\n]+)$/gm, "<h3>$1</h3>");
}

function showError(message) {
  resultCard.innerHTML = `<div class="error">${message}</div>`;
  copyButton.disabled = true;
  currentAnalysis = "";
  setStatus("Needs attention");
}

function renderFinalOutput(analysis) {
  resultCard.innerHTML = `
    <section class="final-output">
      <div class="final-input">
        <h3>Input Image</h3>
        <img src="${imageDataUrl}" alt="Uploaded input image" />
      </div>
      <div class="final-result">
        <h3>Resulted Output</h3>
        <div>${formatAnalysis(analysis)}</div>
      </div>
    </section>
  `;
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("The image could not be loaded."));
    reader.readAsDataURL(file);
  });
}

async function handleFile(file) {
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    showError("Please choose an image file.");
    return;
  }

  imageDataUrl = await readFileAsDataUrl(file);
  imagePreview.src = imageDataUrl;
  previewWrap.hidden = false;
  resultCard.innerHTML = '<p class="empty-state">Image loaded. Final output will show this input image first and the result below.</p>';
  copyButton.disabled = true;
  currentAnalysis = "";
  setStatus("Image loaded", "is-done");
  updateAnalyzeButton();
}

imageInput.addEventListener("change", () => {
  handleFile(imageInput.files[0]).catch((error) => showError(error.message));
});

dropZone.addEventListener("dragover", (event) => {
  event.preventDefault();
  dropZone.classList.add("is-dragging");
});

dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("is-dragging");
});

dropZone.addEventListener("drop", (event) => {
  event.preventDefault();
  dropZone.classList.remove("is-dragging");
  handleFile(event.dataTransfer.files[0]).catch((error) => showError(error.message));
});

analyzeButton.addEventListener("click", async () => {
  if (!imageDataUrl) return;

  analyzeButton.disabled = true;
  copyButton.disabled = true;
  resultCard.innerHTML = '<p class="empty-state">Analyzing the image...</p>';
  setStatus("Analyzing", "is-working");

  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imageDataUrl
      })
    });

    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.error || "The analysis failed.");
    }

    currentAnalysis = payload.analysis;
    renderFinalOutput(currentAnalysis);
    copyButton.disabled = false;
    setStatus("Done", "is-done");
  } catch (error) {
    showError(error.message);
  } finally {
    updateAnalyzeButton();
  }
});

copyButton.addEventListener("click", async () => {
  if (!currentAnalysis) return;
  await navigator.clipboard.writeText(currentAnalysis);
  setStatus("Copied", "is-done");
});

updateAnalyzeButton();
