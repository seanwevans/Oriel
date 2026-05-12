import { publish } from "../eventBus.js";

const env = typeof import.meta !== "undefined" ? import.meta.env || {} : {};

function getEnv(key, fallback) {
  const value = env?.[key];
  if (typeof value === "string" && value.trim() !== "") return value;
  return fallback;
}

const browserProxyPrefix = getEnv("VITE_BROWSER_PROXY_PREFIX", "https://r.jina.ai/");

export const NETWORK_CONFIG = {
  browserHome: getEnv("VITE_BROWSER_HOME", "https://example.com/"),
  browserProxyPrefix,
  radioBrowserBase: getEnv(
    "VITE_RADIO_BROWSER_BASE",
    "https://de1.api.radio-browser.info/json"
  ),
  radioGardenProxy: getEnv(
    "VITE_RADIO_GARDEN_PROXY",
    `${browserProxyPrefix}http://radio.garden`
  ),
  rssProxyRoot: getEnv("VITE_RSS_PROXY_ROOT", "https://api.allorigins.win/raw?url="),
  mailProxyRoot: getEnv("VITE_MAIL_PROXY_ROOT", "")
};

const NETWORK_STORAGE_KEY = "oriel-network-defaults";

const BROWSER_FRAME_SANDBOX = "allow-forms allow-popups";

function sanitizeNetworkOverrides(raw = {}) {
  return Object.entries(raw).reduce(
    (acc, [key, value]) => {
      if (value === undefined || value === null || (typeof value === "string" && value.trim() === "")) {
        acc.clearedKeys.add(key);
        return acc;
      }
      acc.sanitized[key] = value;
      return acc;
    },
    { sanitized: {}, clearedKeys: new Set() }
  );
}

function loadStoredNetworkConfig() {
  try {
    const raw = localStorage.getItem(NETWORK_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") return sanitizeNetworkOverrides(parsed).sanitized;
  } catch (err) {
    console.warn("Failed to parse stored network config", err);
  }
  return {};
}

function persistNetworkConfig(cfg) {
  const { sanitized } = sanitizeNetworkOverrides(cfg);
  const explicitOverrides = Object.entries(sanitized).reduce((acc, [key, value]) => {
    if (value !== baseNetworkConfig[key]) acc[key] = value;
    return acc;
  }, {});
  localStorage.setItem(NETWORK_STORAGE_KEY, JSON.stringify(explicitOverrides));
}

const baseNetworkConfig = { ...NETWORK_CONFIG };

let mergedNetworkConfig = { ...baseNetworkConfig, ...loadStoredNetworkConfig() };

let BROWSER_HOME = mergedNetworkConfig.browserHome;
let BROWSER_PROXY_PREFIX = mergedNetworkConfig.browserProxyPrefix;
let RADIO_BROWSER_BASE = mergedNetworkConfig.radioBrowserBase;
let RADIO_GARDEN_PROXY = mergedNetworkConfig.radioGardenProxy;
let RSS_PROXY_ROOT = mergedNetworkConfig.rssProxyRoot;
let MAIL_PROXY_ROOT = mergedNetworkConfig.mailProxyRoot;

function syncNetworkConfig(overrides = null) {
  if (overrides) {
    const { sanitized, clearedKeys } = sanitizeNetworkOverrides(overrides);
    const withoutCleared = { ...mergedNetworkConfig };
    clearedKeys.forEach((key) => delete withoutCleared[key]);
    mergedNetworkConfig = { ...baseNetworkConfig, ...withoutCleared, ...sanitized };
    persistNetworkConfig(mergedNetworkConfig);
  }
  BROWSER_HOME = mergedNetworkConfig.browserHome;
  BROWSER_PROXY_PREFIX = mergedNetworkConfig.browserProxyPrefix;
  RADIO_BROWSER_BASE = mergedNetworkConfig.radioBrowserBase;
  RADIO_GARDEN_PROXY = mergedNetworkConfig.radioGardenProxy;
  RSS_PROXY_ROOT = mergedNetworkConfig.rssProxyRoot;
  MAIL_PROXY_ROOT = mergedNetworkConfig.mailProxyRoot;
  return mergedNetworkConfig;
}

export function getNetworkDefaults() {
  return { ...mergedNetworkConfig };
}

export function updateNetworkDefaults(partial = {}) {
  const updated = syncNetworkConfig(partial);
  publish("network:config-update", { config: updated });
  return updated;
}

export { BROWSER_HOME, BROWSER_PROXY_PREFIX, RADIO_BROWSER_BASE, RADIO_GARDEN_PROXY, RSS_PROXY_ROOT };
export { BROWSER_FRAME_SANDBOX };
export { MAIL_PROXY_ROOT };
export function normalizeHttpUrl(raw) {
  const trimmed = (raw || "").trim();
  if (!trimmed) return null;
  const schemeMatch = trimmed.match(/^([a-z][a-z\d+.-]*):/i);
  const hostPortLike = /^[^/?#\s:]+:\d+(?:[/?#]|$)/.test(trimmed);
  if (schemeMatch && !/^https?:\/\//i.test(trimmed) && !hostPortLike) return null;
  if (!/^https?:\/\//i.test(trimmed)) return `https://${trimmed}`;
  return trimmed;
}

export function stripHtmlText(html) {
  const div = document.createElement("div");
  div.innerHTML = html || "";
  div.querySelectorAll("script,style").forEach((n) => n.remove());
  return (div.textContent || "").trim();
}


export function stripScriptTags(html) {
  return String(html || "").replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
}

export function resetNetworkDefaults() {
  mergedNetworkConfig = { ...baseNetworkConfig };
  localStorage.removeItem(NETWORK_STORAGE_KEY);
  const reset = syncNetworkConfig();
  publish("network:config-update", { config: reset });
  return reset;
}

function resolveRefreshWindows(windowManagerOrWindows) {
  if (Array.isArray(windowManagerOrWindows)) return windowManagerOrWindows;
  if (Array.isArray(windowManagerOrWindows?.windows)) return windowManagerOrWindows.windows;
  if (windowManagerOrWindows === undefined) return globalThis.window?.wm?.windows;
  return undefined;
}

export function refreshNetworkedWindows(windowManagerOrWindows) {
  const windows = resolveRefreshWindows(windowManagerOrWindows);
  if (!Array.isArray(windows)) return;

  windows.forEach((win) => {
    if (!win?.el) return;
    if (win.type === "browser") {
      win.el.browserReload?.();
    } else if (win.type === "rss") {
      win.el.reloadRssWithDefaults?.();
    } else if (win.type === "radio") {
      win.el.reloadRadioWithDefaults?.();
    } else if (win.type === "radiogarden") {
      win.el.refreshRadioGardenWithDefaults?.();
    }
  });
}
