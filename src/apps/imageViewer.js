import { BaseApp } from "./base/BaseApp.js";
export function initImageViewer(win, initData) {
  const fileInput = win.querySelector(".img-file-input");
  const urlInput = win.querySelector(".img-url-input");
  const loadBtn = win.querySelector(".img-load-btn");
  const preview = win.querySelector(".img-preview");
  const placeholder = win.querySelector(".img-placeholder");
  const status = win.querySelector(".img-status");

  const setStatus = (text) => {
    if (status) status.textContent = text;
  };

  const showPlaceholder = (message) => {
    if (placeholder) {
      placeholder.style.display = "flex";
      placeholder.textContent = message || "Drop an image or click Open";
    }
    if (preview) preview.style.display = "none";
  };

  const setImage = (src, label) => {
    if (!preview || !placeholder) return;
    if (!src) {
      showPlaceholder("No image loaded");
      setStatus("No image loaded");
      return;
    }
    preview.onload = () => {
      placeholder.style.display = "none";
      preview.style.display = "block";
      setStatus(`Loaded ${label || "image"}`);
    };
    preview.onerror = () => {
      showPlaceholder("Failed to load image");
      setStatus("Failed to load image");
    };
    preview.src = src;
    preview.alt = label || "Image preview";
  };

  if (initData?.src) setImage(initData.src, initData.name);

  fileInput?.addEventListener("change", (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImage(ev.target.result, file.name);
    reader.readAsDataURL(file);
  });

  const loadUrl = () => {
    const url = urlInput?.value.trim();
    if (url) setImage(url, url);
  };

  loadBtn?.addEventListener("click", loadUrl);
  urlInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      loadUrl();
    }
  });
}

export function getImageViewerContent(initData) {
    const name = initData?.name || "";
    const src = initData?.src || "";

    const root = document.createElement("div");
    root.classList.add("img-viewer");

    const toolbar = document.createElement("div");
    toolbar.classList.add("img-toolbar");

    const fileLabel = document.createElement("label");
    fileLabel.classList.add("task-btn", "file-btn");
    const fileLabelText = document.createElement("span");
    fileLabelText.textContent = "Open Image";
    fileLabel.appendChild(fileLabelText);
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.classList.add("img-file-input");
    fileLabel.appendChild(fileInput);
    toolbar.appendChild(fileLabel);

    const urlInput = document.createElement("input");
    urlInput.type = "text";
    urlInput.classList.add("img-url-input");
    urlInput.placeholder = "Paste image URL and click Load";
    urlInput.value = src || "";
    toolbar.appendChild(urlInput);

    const loadButton = document.createElement("button");
    loadButton.classList.add("task-btn", "img-load-btn");
    loadButton.textContent = "Load";
    toolbar.appendChild(loadButton);

    const status = document.createElement("div");
    status.classList.add("img-status");
    status.textContent = src ? `Loaded ${name || "image"}` : "No image loaded";
    toolbar.appendChild(status);

    root.appendChild(toolbar);

    const display = document.createElement("div");
    display.classList.add("img-display");

    const placeholder = document.createElement("div");
    placeholder.classList.add("img-placeholder");
    placeholder.textContent = "Drop an image or click Open";
    if (src) placeholder.style.display = "none";
    display.appendChild(placeholder);

    const preview = document.createElement("img");
    preview.classList.add("img-preview");
    preview.alt = name || "Image preview";
    if (src) {
      preview.src = src;
    } else {
      preview.style.display = "none";
    }
    display.appendChild(preview);

    root.appendChild(display);

    return root;

}

export class ImageViewerApp extends BaseApp {
  getWindowContent() {
    return getImageViewerContent(this.initData, this.services);
  }

  mount() {
    return initImageViewer(this.windowEl, this.initData, this.services.windowManager, this.services, this);
  }
}
