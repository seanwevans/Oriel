const MINECRAFT_URL = "https://classic.minecraft.net/";

export function getMinecraftRoot() {
  return `
    <div class="minecraft-embed">
      <div class="minecraft-loading" aria-live="polite">
        <div class="minecraft-progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
          <div class="minecraft-progress-fill" style="width: 0%"></div>
        </div>
        <div class="minecraft-note">Loading Minecraft Classic from classic.minecraft.net…</div>
        <div class="minecraft-actions">
          <button class="task-btn minecraft-retry" type="button">Reload</button>
          <a
            class="task-btn minecraft-open"
            href="https://classic.minecraft.net/"
            target="_blank"
            rel="noopener noreferrer"
          >Open in new tab</a>
        </div>
      </div>
      <iframe
        class="minecraft-iframe"
        title="Minecraft Classic"
        allow="fullscreen"
        allowfullscreen
        src=""
      ></iframe>
    </div>
  `;
}

export function initMinecraft(win) {
  const iframe = win.querySelector(".minecraft-iframe");
  const loading = win.querySelector(".minecraft-loading");
  const progressFill = win.querySelector(".minecraft-progress-fill");
  const progressBar = win.querySelector(".minecraft-progress-bar");
  const note = win.querySelector(".minecraft-note");
  const retryBtn = win.querySelector(".minecraft-retry");

  if (!iframe) return;

  let progressTimer = null;
  let loadTimeout = null;

  const clearTimers = () => {
    if (progressTimer) window.clearInterval(progressTimer);
    if (loadTimeout) window.clearTimeout(loadTimeout);
    progressTimer = null;
    loadTimeout = null;
  };

  const resetProgress = () => {
    if (progressFill) progressFill.style.width = "0%";
    if (progressBar) progressBar.setAttribute("aria-valuenow", "0");
  };

  const setStatus = (text) => {
    if (note) note.textContent = text;
  };

  const failLoad = (message) => {
    clearTimers();
    resetProgress();
    loading?.classList.remove("minecraft-loading-hidden");
    setStatus(message);
  };

  const startLoading = () => {
    resetProgress();
    loading?.classList.remove("minecraft-loading-hidden");
    setStatus("Loading Minecraft Classic from classic.minecraft.net…");

    let progress = 10;
    const tick = () => {
      progress = Math.min(progress + 10, 90);
      if (progressFill) progressFill.style.width = `${progress}%`;
      if (progressBar) progressBar.setAttribute("aria-valuenow", progress.toString());
    };

    progressTimer = window.setInterval(tick, 400);
    loadTimeout = window.setTimeout(() => {
      failLoad("Minecraft Classic is taking too long to load. Try reloading or open it in a new tab.");
    }, 12000);

    iframe.src = MINECRAFT_URL;
  };

  iframe.addEventListener("load", () => {
    clearTimers();
    if (progressFill) progressFill.style.width = "100%";
    if (progressBar) progressBar.setAttribute("aria-valuenow", "100");
    setStatus("Minecraft Classic loaded.");
    window.setTimeout(() => {
      loading?.classList.add("minecraft-loading-hidden");
    }, 600);
  });

  iframe.addEventListener("error", () => {
    failLoad("Failed to load Minecraft Classic. Check your connection or open it in a new tab.");
  });

  retryBtn?.addEventListener("click", () => {
    clearTimers();
    iframe.src = "";
    startLoading();
  });

  const iframeSrcAttr = iframe.getAttribute("src");

  if (!iframeSrcAttr) {
    startLoading();
  }
}
