import { BaseApp } from "./base/BaseApp.js";
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

export function getPdfReaderContent(initData) {
    const src = initData?.src || DEFAULT_PDF_DATA_URI;
    const name = initData?.name || "Sample.pdf";

    const root = document.createElement("div");
    root.classList.add("pdf-reader");

    const toolbar = document.createElement("div");
    toolbar.classList.add("pdf-toolbar");

    const fileLabel = document.createElement("label");
    fileLabel.classList.add("task-btn", "file-btn");
    const fileLabelText = document.createElement("span");
    fileLabelText.textContent = "Open File";
    fileLabel.appendChild(fileLabelText);
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "application/pdf";
    fileInput.classList.add("pdf-file-input");
    fileLabel.appendChild(fileInput);
    toolbar.appendChild(fileLabel);

    const urlInput = document.createElement("input");
    urlInput.type = "text";
    urlInput.classList.add("pdf-url-input");
    urlInput.placeholder = "Paste PDF URL and click Load";
    urlInput.value = "";
    toolbar.appendChild(urlInput);

    const loadButton = document.createElement("button");
    loadButton.classList.add("task-btn", "pdf-load-btn");
    loadButton.textContent = "Load";
    toolbar.appendChild(loadButton);

    const status = document.createElement("div");
    status.classList.add("pdf-status");
    status.textContent = `Loaded ${name}`;
    toolbar.appendChild(status);

    root.appendChild(toolbar);

    const viewer = document.createElement("div");
    viewer.classList.add("pdf-viewer");
    const frame = document.createElement("iframe");
    frame.classList.add("pdf-frame");
    frame.title = "PDF Viewer";
    frame.src = src;
    viewer.appendChild(frame);
    root.appendChild(viewer);

    return root;

}

export class PdfReaderApp extends BaseApp {
  getWindowContent() {
    return getPdfReaderContent(this.initData, this.services);
  }

  mount() {
    return initPdfReader(this.windowEl, this.initData, this.services.windowManager, this.services, this);
  }
}
