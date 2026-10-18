import { buildBrief, readiness } from "./brief.js";

const form = document.querySelector("#brief-form");
const fields = Object.fromEntries(["project", "goal", "criteria", "verification", "constraints"].map((name) => [name, form.elements.namedItem(name)]));
const preview = document.querySelector("#preview");
const empty = document.querySelector("#preview-empty");
const completion = document.querySelector("#completion");
const hint = document.querySelector("#form-hint");
const buildButton = document.querySelector("#build-button");
const copyButton = document.querySelector("#copy-button");
const downloadButton = document.querySelector("#download-button");
let markdown = "";

function readFields() {
  return Object.fromEntries(Object.entries(fields).map(([key, input]) => [key, input.value]));
}

function updateReadiness() {
  const state = readiness(readFields());
  completion.textContent = `${state.percent}% READY`;
  buildButton.disabled = state.complete !== state.total;
  hint.textContent = state.complete === state.total ? "Ready to review and copy." : `Complete ${state.total - state.complete} required field${state.total - state.complete === 1 ? "" : "s"} to build your brief.`;
}

for (const input of Object.values(fields)) {
  input.addEventListener("input", () => {
    if (markdown) {
      markdown = "";
      preview.hidden = true;
      empty.hidden = false;
      copyButton.disabled = true;
      downloadButton.disabled = true;
      copyButton.textContent = "Copy markdown";
    }
    updateReadiness();
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  try {
    markdown = buildBrief(readFields());
    preview.textContent = markdown;
    preview.hidden = false;
    empty.hidden = true;
    copyButton.disabled = false;
    downloadButton.disabled = false;
  } catch (error) {
    hint.textContent = error.message;
  }
});

copyButton.addEventListener("click", async () => {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(markdown);
    } else {
      const helper = document.createElement("textarea");
      helper.value = markdown;
      helper.setAttribute("readonly", "");
      helper.style.position = "fixed";
      helper.style.opacity = "0";
      document.body.append(helper);
      helper.select();
      const copied = document.execCommand("copy");
      helper.remove();
      if (!copied) throw new Error("Clipboard access is unavailable in this browser.");
    }
    copyButton.textContent = "Copied";
    window.setTimeout(() => { copyButton.textContent = "Copy markdown"; }, 1400);
  } catch (error) {
    hint.textContent = error.message;
  }
});

downloadButton.addEventListener("click", () => {
  const filename = `${fields.project.value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "task"}-brief.md`;
  const url = URL.createObjectURL(new Blob([markdown], { type: "text/markdown;charset=utf-8" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
});

updateReadiness();
