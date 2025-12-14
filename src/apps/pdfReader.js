import { DEFAULT_PDF_DATA_URI } from "../defaults.js";

export function initPdfReader(win, initData) {
  const fileInput = win.querySelector(".pdf-file-input");
  const urlInput = win.querySelector(".pdf-url-input");
  const loadBtn = win.querySelector(".pdf-load-btn");
  const frame = win.querySelector(".pdf-frame");
  const status = win.querySelector(".pdf-status");

  const loadDocument = (src, label) => {
    if (!src) {
      frame.src = "";
      status.textContent = "No document loaded";
      return;
    }
    frame.src = src;
    status.textContent = `Loaded ${label}`;
  };

  const initialSrc = initData?.src || DEFAULT_PDF_DATA_URI;
  loadDocument(initialSrc, initData?.name || "Sample.pdf");

  fileInput?.addEventListener("change", (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => loadDocument(ev.target.result, file.name);
    reader.readAsDataURL(file);
  });

  loadBtn?.addEventListener("click", () => {
    const url = urlInput?.value.trim();
    if (url) loadDocument(url, url);
  });

  urlInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      loadBtn?.click();
    }
  });
}
