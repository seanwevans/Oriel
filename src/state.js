const DESKTOP_STATE_KEY = "oriel-desktop-state";
function createDefaultDesktopState() {
  return {
    windows: [],
    wallpaper: null,
    themeCustom: null,
    appState: {}
  };
}

const createMemoryStorage = () => {
  const store = new Map();
  return {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => store.set(key, value),
    removeItem: (key) => store.delete(key)
  };
};

let memoryStorage = null;

function getMemoryStorage() {
  if (!memoryStorage) memoryStorage = createMemoryStorage();
  return memoryStorage;
}

function getLocalStorage() {
  return typeof localStorage !== "undefined" ? localStorage : null;
}

function normalizeDesktopState(parsed) {
  if (parsed && typeof parsed === "object") {
    return {
      ...createDefaultDesktopState(),
      ...parsed,
      appState: parsed.appState || {}
    };
  }
  return null;
}

function readDesktopStateFromStorage(storage, sourceLabel) {
  if (!storage) return null;

  try {
    const stored = storage.getItem(DESKTOP_STATE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return normalizeDesktopState(parsed);
    }
  } catch (err) {
    console.warn(`Failed to read desktop state from ${sourceLabel}`, err);
  }

  return null;
}

export function loadDesktopState() {
  return (
    readDesktopStateFromStorage(getLocalStorage(), "localStorage") ||
    readDesktopStateFromStorage(getMemoryStorage(), "memory") ||
    createDefaultDesktopState()
  );
}

export function persistDesktopState(state) {
  const serialized = JSON.stringify(state);
  const storage = getLocalStorage();

  try {
    if (!storage) throw new Error("localStorage is unavailable");
    storage.setItem(DESKTOP_STATE_KEY, serialized);
  } catch (err) {
    getMemoryStorage().setItem(DESKTOP_STATE_KEY, serialized);
    console.warn("Failed to persist desktop state to localStorage; using memory fallback", err);
  }
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
