import { DEFAULT_WALLPAPER } from "./defaults.js";

let wallpaperSettings = { url: DEFAULT_WALLPAPER, mode: "tile" };

export function getWallpaperSettings() {
  return wallpaperSettings;
}

export function applyWallpaperSettings(
  url = DEFAULT_WALLPAPER,
  mode = "tile",
  persist = false
) {
  wallpaperSettings = { url, mode };
  const body = document.body;
  if (url) {
    body.style.backgroundImage = `url('${url}')`;
    if (mode === "tile") {
      body.style.backgroundSize = "auto";
      body.style.backgroundRepeat = "repeat";
      body.style.backgroundPosition = "center";
    } else if (mode === "center") {
      body.style.backgroundSize = "auto";
      body.style.backgroundRepeat = "no-repeat";
      body.style.backgroundPosition = "center";
    } else if (mode === "cover") {
      body.style.backgroundSize = "cover";
      body.style.backgroundRepeat = "no-repeat";
      body.style.backgroundPosition = "center";
    }
  } else {
    body.style.backgroundImage = "none";
  }

  if (persist && window.wm) {
    window.wm.saveDesktopState();
  }
}
