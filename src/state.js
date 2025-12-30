const DESKTOP_STATE_KEY = "oriel-desktop-state";

export function loadDesktopState() {
  try {
    const stored = localStorage.getItem(DESKTOP_STATE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && typeof parsed === "object") {
        return {
          appState: {},
          windows: [],
          wallpaper: null,
          themeCustom: null,
          ...parsed,
          appState: parsed.appState || {}
        };
      }
    }
  } catch (err) {
    console.error("Failed to parse desktop state", err);
  }
  return { windows: [], wallpaper: null, themeCustom: null, appState: {} };
}

export function persistDesktopState(state) {
  localStorage.setItem(DESKTOP_STATE_KEY, JSON.stringify(state));
}

export function getAppState(key) {
  if (!key) return null;
  const state = loadDesktopState();
  return state.appState?.[key] || null;
}

export function updateAppState(key, partial = {}) {
  if (!key) return null;
  const state = loadDesktopState();
  const nextAppState = { ...(state.appState || {}) };
  const existing = nextAppState[key] || {};
  nextAppState[key] = { ...existing, ...partial };
  const mergedState = { ...state, appState: nextAppState };
  persistDesktopState(mergedState);
  return nextAppState[key];
}
