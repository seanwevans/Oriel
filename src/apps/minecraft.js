const MINECRAFT_URL = "https://classic.minecraft.net/";

export function getMinecraftRoot() {
  return `
    <div class="minecraft-embed">
      <iframe
        class="minecraft-iframe"
        title="Minecraft Classic"
        allow="fullscreen"
        src=""
      ></iframe>
      <div class="minecraft-note">Loading Minecraft Classic from classic.minecraft.net…</div>
    </div>
  `;
}

export function initMinecraft(win) {
  const iframe = win.querySelector(".minecraft-iframe");
  if (iframe && !iframe.src) {
    iframe.src = MINECRAFT_URL;
  }
}
