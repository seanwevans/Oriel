const MINECRAFT_URL = "https://classic.minecraft.net/";

export function getMinecraftRoot() {
  return `
    <div class="minecraft-embed">
      <div class="minecraft-loading" aria-live="polite">
        <div class="minecraft-progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
          <div class="minecraft-progress-fill" style="width: 0%"></div>
        </div>
        <div class="minecraft-note">Loading Minecraft Classic from classic.minecraft.net…</div>
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

  if (iframe && !iframe.src) {
    let progress = 10;
    const tick = () => {
      progress = Math.min(progress + 10, 90);
      if (progressFill) progressFill.style.width = `${progress}%`;
      if (progressBar) progressBar.setAttribute("aria-valuenow", progress.toString());
    };

    const progressTimer = window.setInterval(tick, 400);

    iframe.addEventListener("load", () => {
      window.clearInterval(progressTimer);
      if (progressFill) progressFill.style.width = "100%";
      if (progressBar) progressBar.setAttribute("aria-valuenow", "100");
      if (note) note.textContent = "Minecraft Classic loaded.";
      window.setTimeout(() => {
        loading?.classList.add("minecraft-loading-hidden");
      }, 600);
    });

    iframe.addEventListener("error", () => {
      window.clearInterval(progressTimer);
      if (note) note.textContent = "Failed to load Minecraft Classic. Check your connection.";
    });

    iframe.src = MINECRAFT_URL;
  }
}
