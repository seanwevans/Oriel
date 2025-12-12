const DESKTOP_STATE_KEY = "oriel-desktop-state";
const DEFAULT_DESKTOP_STATE = { windows: [], wallpaper: null };

function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function isValidWindowEntry(win) {
  if (!win || typeof win !== "object") return false;
  const allowedKeys = new Set([
    "id",
    "type",
    "title",
    "left",
    "top",
    "width",
    "height",
    "minimized",
    "maximized",
    "prevRect",
    "zIndex"
  ]);
  const hasUnexpectedKey = Object.keys(win).some((key) => !allowedKeys.has(key));
  if (hasUnexpectedKey) return false;

  if (typeof win.type !== "string") return false;
  if (win.id !== undefined && typeof win.id !== "string") return false;
  if (win.title !== undefined && typeof win.title !== "string") return false;

  const numericFields = [win.left, win.top, win.width, win.height];
  if (numericFields.some((v) => v !== undefined && !isFiniteNumber(v))) return false;

  const booleanFields = [win.minimized, win.maximized];
  if (booleanFields.some((v) => v !== undefined && typeof v !== "boolean"))
    return false;

  if (win.prevRect && typeof win.prevRect !== "object") return false;
  if (win.zIndex !== undefined && !Number.isInteger(win.zIndex)) return false;

  return true;
}

function isValidWallpaper(wallpaper) {
  if (wallpaper === null) return true;
  if (!wallpaper || typeof wallpaper !== "object") return false;
  const allowedModes = new Set(["tile", "center", "cover"]);
  const allowedKeys = new Set(["url", "mode"]);
  if (Object.keys(wallpaper).some((key) => !allowedKeys.has(key))) return false;
  if (wallpaper.url !== undefined && typeof wallpaper.url !== "string") return false;
  if (wallpaper.mode !== undefined && !allowedModes.has(wallpaper.mode)) return false;
  return true;
}

function sanitizeDesktopState(state) {
  if (!state || typeof state !== "object") return null;
  const windows = Array.isArray(state.windows)
    ? state.windows.filter((win) => isValidWindowEntry(win))
    : [];

  if (!isValidWallpaper(state.wallpaper)) return null;

  return {
    windows,
    wallpaper: state.wallpaper ?? null
  };
}

export function loadDesktopState() {
  try {
    const stored = localStorage.getItem(DESKTOP_STATE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      const sanitized = sanitizeDesktopState(parsed);
      if (sanitized) return sanitized;
      localStorage.removeItem(DESKTOP_STATE_KEY);
    }
  } catch (err) {
    console.error("Failed to parse desktop state", err);
    localStorage.removeItem(DESKTOP_STATE_KEY);
  }
  return DEFAULT_DESKTOP_STATE;
}

export function persistDesktopState(state) {
  const sanitized = sanitizeDesktopState(state);
  const toStore = sanitized || DEFAULT_DESKTOP_STATE;
  localStorage.setItem(DESKTOP_STATE_KEY, JSON.stringify(toStore));
}
