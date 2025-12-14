const DESKTOP_STATE_KEY = "oriel-desktop-state";

export function loadDesktopState() {
  try {
    const stored = localStorage.getItem(DESKTOP_STATE_KEY);
    if (stored) return JSON.parse(stored);
  } catch (err) {
    console.error("Failed to parse desktop state", err);
  }
  return { windows: [], wallpaper: null, themeCustom: null };
}

export function persistDesktopState(state) {
  localStorage.setItem(DESKTOP_STATE_KEY, JSON.stringify(state));
}
