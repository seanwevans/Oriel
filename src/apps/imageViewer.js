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
