export function initArtist(win) {
  const promptInput = win.querySelector(".artist-prompt");
  const generateBtn = win.querySelector(".artist-generate");
  const status = win.querySelector(".artist-status");
  const preview = win.querySelector(".artist-preview");
  const placeholder = win.querySelector(".artist-placeholder");
  const link = win.querySelector(".artist-link");

  if (!promptInput || !generateBtn || !status || !preview || !placeholder || !link)
    return;

  const setStatus = (msg, isError = false) => {
    status.textContent = msg;
    status.classList.toggle("artist-status-error", isError);
  };

  const setLoading = (loading) => {
    generateBtn.disabled = loading;
    generateBtn.textContent = loading ? "Generating..." : "Generate";
  };

  const showPlaceholder = (msg) => {
    placeholder.style.display = "flex";
    placeholder.textContent = msg;
    preview.style.display = "none";
  };

  const displayImage = (url) => {
    preview.onload = () => {
      placeholder.style.display = "none";
      preview.style.display = "block";
      setStatus("Image ready. Right-click to save.");
      setLoading(false);
    };
    preview.onerror = () => {
      showPlaceholder("Failed to load image. Try again.");
      setStatus("Image request failed.", true);
      setLoading(false);
    };
    preview.src = url;
    link.href = url;
  };

  const requestImage = () => {
    const prompt = promptInput.value.trim();
    if (!prompt) {
      setStatus("Enter a description first.", true);
      return;
    }
    setLoading(true);
    setStatus("Requesting image from Pollinations...");
    showPlaceholder("Generating image...");

    const apiUrl =
      "https://image.pollinations.ai/prompt/" +
      encodeURIComponent(prompt) +
      `?width=1024&height=1024&seed=${Date.now()}`;

    displayImage(apiUrl);
  };

  generateBtn.addEventListener("click", requestImage);
  promptInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      requestImage();
    }
  });

  // Kick off an initial render using the default prompt
  requestImage();
}
