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
  rssProxyRoot: getEnv("VITE_RSS_PROXY_ROOT", "https://api.allorigins.win/raw?url=")
};
