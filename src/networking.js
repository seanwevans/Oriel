import { DEFAULT_RSS_SAMPLE, RADIO_FALLBACK_PRESETS, RSS_PRESETS } from "./defaults.js";
import { registerMediaElement } from "./audio.js";
import { NETWORK_CONFIG } from "./config.js";
import { publish } from "./eventBus.js";

const NETWORK_STORAGE_KEY = "oriel-network-defaults";

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
export function resetNetworkDefaults() {
  mergedNetworkConfig = { ...baseNetworkConfig };
  localStorage.removeItem(NETWORK_STORAGE_KEY);
  const reset = syncNetworkConfig();
  publish("network:config-update", { config: reset });
  return reset;
}

export function refreshNetworkedWindows() {
  const windows = window?.wm?.windows;
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

export const browserSessions = {};

export function initRssReader(win) {
  const urlInput = win.querySelector(".rss-url");
  const presetSelect = win.querySelector(".rss-preset");
  const loadBtn = win.querySelector(".rss-load");
  const status = win.querySelector(".rss-status");
  const list = win.querySelector(".rss-list");
  const titleEl = win.querySelector(".rss-preview-title");
  const metaEl = win.querySelector(".rss-preview-meta");
  const textEl = win.querySelector(".rss-preview-text");
  const linkEl = win.querySelector(".rss-preview-link");

  if (!urlInput || !presetSelect || !loadBtn || !status || !list || !titleEl || !metaEl || !textEl || !linkEl) return;

  let items = [];
  let selected = -1;
  let lastRequestedUrl = null;

  const setStatus = (text, isError = false) => {
    status.textContent = text;
    status.classList.toggle("rss-status-error", isError);
  };

  const normalizeUrl = (raw) => {
    const trimmed = raw.trim();
    if (!trimmed) return null;
    if (!/^https?:\/\//i.test(trimmed)) return `https://${trimmed}`;
    return trimmed;
  };

  const sanitizeText = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html || "";
    div.querySelectorAll("script,style").forEach((n) => n.remove());
    return (div.textContent || "").trim();
  };

  const formatDate = (value) => {
    const dt = new Date(value);
    if (Number.isNaN(dt.getTime())) return "No date";
    return dt.toLocaleString();
  };

  const renderItems = () => {
    list.innerHTML = "";
    if (!items.length) {
      list.innerHTML = '<div class="rss-empty">No items in this feed.</div>';
      return;
    }
    items.forEach((item, idx) => {
      const row = document.createElement("div");
      row.className = "rss-item" + (idx === selected ? " active" : "");
      row.dataset.index = idx.toString();
      row.innerHTML = `<div class="rss-item-title">${item.title || "(Untitled)"}</div><div class="rss-item-date">${formatDate(
        item.date
      )}</div>`;
      list.appendChild(row);
    });
  };

  const showItem = (idx) => {
    const item = items[idx];
    selected = idx;
    renderItems();
    if (!item) return;
    titleEl.textContent = item.title || "(Untitled)";
    metaEl.textContent = `${formatDate(item.date)} · ${item.link || "No link"}`;
    textEl.textContent = sanitizeText(item.summary) || "(No description)";
    if (item.link) {
      linkEl.href = item.link;
      linkEl.style.display = "inline";
    } else {
      linkEl.style.display = "none";
    }
  };

  const parseFeed = (xmlText) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlText, "application/xml");
    if (doc.querySelector("parsererror")) throw new Error("Invalid feed");
    const nodes = doc.querySelectorAll("item, entry");
    return Array.from(nodes).map((node) => {
      const get = (sel) => node.querySelector(sel)?.textContent?.trim() || "";
      const resolveLink = () => {
        const linkEl = node.querySelector("link[href]");
        if (linkEl) return linkEl.getAttribute("href") || "";
        return get("link");
      };
      return {
        title: get("title"),
        link: resolveLink(),
        date: get("pubDate") || get("updated") || get("published"),
        summary: get("description") || get("summary") || get("content")
      };
    });
  };

  const applyItems = (listItems) => {
    items = listItems;
    selected = items.length ? 0 : -1;
    renderItems();
    if (selected >= 0) showItem(selected);
  };

  const loadFeed = async (rawUrl) => {
    const normalized = normalizeUrl(rawUrl);
    if (!normalized) return;
    lastRequestedUrl = normalized;
    setStatus("Loading...");
    try {
      const proxyUrl = `${RSS_PROXY_ROOT}${encodeURIComponent(normalized)}`;
      const res = await fetch(proxyUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      let text;

      try {
        const data = await res.json();
        text = data?.contents || "";
      } catch (jsonErr) {
        console.warn("RSS proxy did not return JSON, falling back to text", jsonErr);
        text = await res.text();
      }

      const parsed = parseFeed(text);
      if (!parsed.length) throw new Error("Empty feed");
      applyItems(parsed);
      setStatus(`Loaded ${parsed.length} items`);
    } catch (err) {
      console.error("RSS load error", err);
      setStatus("Failed to load feed. Showing sample items.", true);
      applyItems(DEFAULT_RSS_SAMPLE);
    }
  };

  list.addEventListener("click", (e) => {
    const target = e.target.closest(".rss-item");
    if (!target) return;
    const idx = parseInt(target.dataset.index || "-1", 10);
    if (!Number.isNaN(idx)) showItem(idx);
  });

  presetSelect.addEventListener("change", () => {
    const value = presetSelect.value;
    urlInput.value = value;
    loadFeed(value);
  });

  loadBtn.addEventListener("click", () => loadFeed(urlInput.value));
  urlInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") loadFeed(urlInput.value);
  });

  if (RSS_PRESETS?.length && !urlInput.value) {
    urlInput.value = RSS_PRESETS[0].url || "";
  }

  applyItems(DEFAULT_RSS_SAMPLE);
  loadFeed(urlInput.value);

  win.reloadRssWithDefaults = () => {
    const target = urlInput.value || lastRequestedUrl || RSS_PRESETS?.[0]?.url || "";
    if (target) loadFeed(target);
  };
}

export function initBrowser(win, sessions = browserSessions) {
  const urlInput = win.querySelector(".browser-url");
  const frame = win.querySelector(".browser-frame");
  const status = win.querySelector(".browser-status");
  const backBtn = win.querySelector('[data-action="back"]');
  const fwdBtn = win.querySelector('[data-action="forward"]');
  const refreshBtn = win.querySelector('[data-action="refresh"]');
  const homeBtn = win.querySelector('[data-action="home"]');
  const goBtn = win.querySelector('[data-action="go"]');
  const sessionId = win.dataset.id;

  if (!urlInput || !frame || !status) return;

  const resetSession = () => {
    sessions[sessionId] = {
      history: [],
      index: -1
    };
  };
  resetSession();

  const setStatus = (text) => {
    status.textContent = text;
  };

  const normalizeUrl = (raw) => {
    const trimmed = raw.trim();
    if (!trimmed) return null;
    if (!/^https?:\/\//i.test(trimmed)) {
      return `https://${trimmed}`;
    }
    return trimmed;
  };

  const buildProxiedUrl = (url) => {
    try {
      const parsed = new URL(url);
      const portPart = parsed.port ? `:${parsed.port}` : "";
      return `${BROWSER_PROXY_PREFIX}${parsed.protocol}//${parsed.hostname}${portPart}${parsed.pathname}${parsed.search}${parsed.hash}`;
    } catch (err) {
      return `${BROWSER_PROXY_PREFIX}https://${url.replace(/^\/+/, "")}`;
    }
  };

  const updateNavState = () => {
    const session = sessions[sessionId];
    if (!session) return;
    const hasBack = session.index > 0;
    const hasForward = session.index < session.history.length - 1;
    if (backBtn) backBtn.disabled = !hasBack;
    if (fwdBtn) fwdBtn.disabled = !hasForward;
  };

  let lastLoadToken = 0;

  const renderProxiedContent = async (url) => {
    const token = ++lastLoadToken;
    const proxied = buildProxiedUrl(url);
    setStatus(`Loading ${url} (via text proxy)...`);
    frame.removeAttribute("src");
    frame.srcdoc = "";
    try {
      const res = await fetch(proxied);
      if (token !== lastLoadToken) return;
      const text = await res.text();
      frame.srcdoc = text || `<p>Proxy returned an empty response for ${url}.</p>`;
      setStatus(`Loaded ${url}`);
    } catch (err) {
      console.error(err);
      if (token !== lastLoadToken) return;
      frame.removeAttribute("srcdoc");
      frame.src = proxied;
      setStatus(`Opening ${url} directly...`);
    }
  };

  const loadUrl = (rawUrl, pushHistory = true) => {
    const url = normalizeUrl(rawUrl);
    const session = sessions[sessionId];
    if (!url || !session) return;
    if (pushHistory) {
      session.history = session.history.slice(0, session.index + 1);
      session.history.push(url);
      session.index = session.history.length - 1;
    }
    urlInput.value = url;
    renderProxiedContent(url);
    updateNavState();
  };

  if (backBtn)
    backBtn.onclick = () => {
      const session = sessions[sessionId];
      if (!session || session.index <= 0) return;
      session.index -= 1;
      const target = session.history[session.index];
      urlInput.value = target;
      renderProxiedContent(target);
      updateNavState();
    };

  if (fwdBtn)
    fwdBtn.onclick = () => {
      const session = sessions[sessionId];
      if (!session || session.index >= session.history.length - 1) return;
      session.index += 1;
      const target = session.history[session.index];
      urlInput.value = target;
      renderProxiedContent(target);
      updateNavState();
    };

  if (refreshBtn)
    refreshBtn.onclick = () => {
      const session = sessions[sessionId];
      if (!session || session.index < 0) return;
      const target = session.history[session.index];
      renderProxiedContent(target);
    };

  if (homeBtn) homeBtn.onclick = () => loadUrl(BROWSER_HOME);
  if (goBtn) goBtn.onclick = () => loadUrl(urlInput.value);

  urlInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") loadUrl(urlInput.value);
  });

  frame.addEventListener("load", () => {
    const session = sessions[sessionId];
    if (!session) return;
    const currentUrl = session.history[session.index] || "";
    setStatus(currentUrl ? `Loaded ${currentUrl}` : "Ready");
  });

  const reloadWithDefaults = () => {
    resetSession();
    loadUrl(BROWSER_HOME);
  };

  reloadWithDefaults();
  win.browserReload = reloadWithDefaults;
}

export function initRadioGarden(win) {
  const input = win.querySelector(".radio-search-input");
  const searchBtn = win.querySelector(".radio-search-btn");
  const results = win.querySelector(".radio-results");
  const status = win.querySelector(".radio-status");
  const openSite = win.querySelector(".radio-open-site");

  const setStatus = (text, isError = false) => {
    if (!status) return;
    status.textContent = text;
    status.classList.toggle("radio-status-error", isError);
  };

  let lastSearchTerm = null;

  const buildLink = (path) => `https://radio.garden${path}`;

  const renderResults = (stations) => {
    if (!results) return;
    if (!stations.length) {
      results.innerHTML = `<div class="radio-empty">No stations found for that search.</div>`;
      return;
    }
    results.innerHTML = stations
      .map((station) => {
        const title = station.page?.title || "Unknown Station";
        const subtitle = station.page?.subtitle || "";
        const url = station.page?.url ? buildLink(station.page.url) : null;
        return `<div class="radio-card" role="listitem">
                  <div class="radio-card-main">
                    <div class="radio-card-title">${title}</div>
                    <div class="radio-card-sub">${subtitle}</div>
                  </div>
                  <div class="radio-card-actions">
                    <button class="radio-pill" data-radio-link="${url || ""}" ${url ? "" : "disabled"}>Open</button>
                    <button class="radio-pill ghost" data-copy-link="${url || ""}" ${url ? "" : "disabled"}>Copy Link</button>
                  </div>
                </div>`;
      })
      .join("");
  };

  const parseRadioJson = (text) => {
    const start = text.indexOf("{");
    if (start === -1) throw new Error("Unexpected response format");
    return JSON.parse(text.slice(start));
  };

  const extractStations = (data) => {
    const sections = Array.isArray(data?.data?.content) ? data.data.content : [];
    const lists = sections.filter((section) => Array.isArray(section.items));
    return lists.flatMap((list) => list.items || []).filter((item) => item.page?.type === "channel");
  };

  const runSearch = async (query) => {
    const trimmed = query.trim();
    if (!trimmed) {
      setStatus("Enter a station, city, or country to search.", true);
      return;
    }
    lastSearchTerm = trimmed;
    setStatus(`Searching for "${trimmed}"…`);
    if (results) results.innerHTML = "";
    try {
      const res = await fetch(
        `${RADIO_GARDEN_PROXY}/api/ara/content/search?q=${encodeURIComponent(trimmed)}`
      );
      const text = await res.text();
      const data = parseRadioJson(text);
      const stations = extractStations(data);
      renderResults(stations);
      setStatus(`Showing ${stations.length} result${stations.length === 1 ? "" : "s"} for "${trimmed}".`);
    } catch (err) {
      console.error(err);
      setStatus("Could not reach radio.garden right now. Try again later.", true);
    }
  };

  const handleActionClick = (e) => {
    const openBtn = e.target.closest("[data-radio-link]");
    const copyBtn = e.target.closest("[data-copy-link]");
    if (openBtn) {
      const link = openBtn.getAttribute("data-radio-link");
      if (link) window.open(link, "_blank", "noopener,noreferrer");
    }
    if (copyBtn) {
      const link = copyBtn.getAttribute("data-copy-link");
      if (!link) return;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
          .writeText(link)
          .then(() => setStatus("Copied link to clipboard."));
      } else {
        const temp = document.createElement("textarea");
        temp.value = link;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand("copy");
        temp.remove();
        setStatus("Copied link to clipboard.");
      }
    }
  };

  if (results) results.addEventListener("click", handleActionClick);

  if (openSite) {
    openSite.addEventListener("click", () =>
      window.open("https://radio.garden", "_blank", "noopener,noreferrer")
    );
  }

  if (searchBtn) {
    searchBtn.addEventListener("click", () => runSearch(input?.value || ""));
  }

  if (input) {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") runSearch(input.value);
    });
  }

  win.querySelectorAll(".radio-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      const q = chip.getAttribute("data-query") || "";
      if (input) input.value = q;
      runSearch(q);
    });
  });

  win.refreshRadioGardenWithDefaults = () => {
    if (lastSearchTerm) runSearch(lastSearchTerm);
    else setStatus("Ready. Enter a station, city, or country to search.");
  };
}

export async function initRadio(win) {
  const listEl = win.querySelector(".radio-list");
  const queryEl = win.querySelector(".radio-query");
  const searchBtn = win.querySelector(".radio-search-btn");
  const topBtn = win.querySelector(".radio-top-btn");
  const statusEl = win.querySelector(".radio-status");
  const nowEl = win.querySelector(".radio-now");
  const metaEl = win.querySelector(".radio-meta");
  const playBtn = win.querySelector(".radio-play");
  const stopBtn = win.querySelector(".radio-stop");
  const audioEl = win.querySelector(".radio-audio");

  if (!listEl || !queryEl || !searchBtn || !topBtn || !audioEl) return;

  registerMediaElement(audioEl);

  let stations = [];
  let selectedIndex = -1;
  let lastRequest = null;
  const RADIO_CACHE_KEY = "oriel-radio-cache-v1";

  const setStatus = (msg, isError = false) => {
    statusEl.textContent = msg;
    statusEl.classList.toggle("radio-error", !!isError);
  };

  const loadCachedStations = () => {
    try {
      const raw = localStorage.getItem(RADIO_CACHE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (err) {
      console.warn("Could not read cached stations", err);
      return null;
    }
  };

  const persistCachedStations = (data) => {
    try {
      localStorage.setItem(RADIO_CACHE_KEY, JSON.stringify(data));
    } catch (err) {
      console.warn("Could not cache radio stations", err);
    }
  };

  const renderStations = () => {
    listEl.innerHTML = "";
    if (!stations.length) {
      listEl.innerHTML = "<div class='radio-empty'>No stations loaded yet.</div>";
      return;
    }
    stations.forEach((st, idx) => {
      const btn = document.createElement("button");
      btn.className = "radio-item" + (idx === selectedIndex ? " active" : "");
      btn.dataset.index = idx.toString();
      btn.setAttribute("role", "option");
      const tags = (st.tags || "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .slice(0, 3)
        .join(", ");
      btn.innerHTML = `
        <div class="radio-station-title">${st.name || "Unnamed Station"}</div>
        <div class="radio-meta-line">${st.country || ""}${
        st.language ? " · " + st.language : ""
      }</div>
        <div class="radio-meta-line">${
          st.codec ? st.codec.toUpperCase() + " · " : ""
        }${st.bitrate ? st.bitrate + " kbps" : ""}${
        tags ? " · " + tags : ""
      }</div>`;
      btn.addEventListener("click", () => selectStation(idx));
      listEl.appendChild(btn);
    });
  };

  const selectStation = (idx) => {
    selectedIndex = idx;
    const st = stations[idx];
    listEl.querySelectorAll(".radio-item").forEach((el, i) => {
      el.classList.toggle("active", i === selectedIndex);
    });
    const prettyName = `${st.name || "Unknown"}${
      st.country ? " · " + st.country : ""
    }`;
    nowEl.textContent = `Now tuned to ${prettyName}`;
    metaEl.textContent = `Codec: ${st.codec || "n/a"} · Bitrate: ${
      st.bitrate || "--"
    } kbps${st.tags ? " · Tags: " + st.tags.split(",").slice(0, 5).join(", ") : ""}`;
    const streamUrl = st.url_resolved || st.url;
    if (streamUrl) {
      audioEl.src = streamUrl;
      setStatus("Station ready. Press Play to start.");
    } else {
      setStatus("This station does not have a playable stream.", true);
    }
  };

  const fetchStations = async (url, description) => {
    lastRequest = { url, description };
    setStatus(`Loading ${description}...`);
    listEl.innerHTML = "<div class='radio-empty'>Fetching stations...</div>";
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
      const data = await res.json();
      stations = Array.isArray(data) ? data.slice(0, 30) : [];
      persistCachedStations(stations);
      selectedIndex = -1;
      nowEl.textContent = "No station selected.";
      metaEl.textContent = "Use search or Top to load stations.";
      renderStations();
      if (stations.length === 0) {
        setStatus("No stations found for that query.", true);
      } else {
        setStatus(`Loaded ${stations.length} stations (${description}).`);
      }
    } catch (err) {
      console.error(err);
      const cached = loadCachedStations();
      if (Array.isArray(cached) && cached.length) {
        stations = cached;
        selectedIndex = -1;
        nowEl.textContent = "No station selected.";
        metaEl.textContent = "Using cached station list.";
        renderStations();
        setStatus("Network error. Showing cached stations instead.", true);
        return;
      }

      if (Array.isArray(RADIO_FALLBACK_PRESETS) && RADIO_FALLBACK_PRESETS.length) {
        stations = RADIO_FALLBACK_PRESETS;
        selectedIndex = -1;
        nowEl.textContent = "No station selected.";
        metaEl.textContent = "Using built-in presets.";
        renderStations();
        setStatus("Offline presets loaded due to network error.", true);
        return;
      }

      listEl.innerHTML =
        "<div class='radio-empty'>Could not load stations. Please try again.</div>";
      setStatus("Network error while contacting Radio Browser.", true);
    }
  };

  const startPlayback = () => {
    if (selectedIndex < 0 || !audioEl.src) {
      setStatus("Pick a station first.", true);
      return;
    }
    audioEl
      .play()
      .then(() => setStatus("Playing live radio."))
      .catch(() => setStatus("Playback blocked. Try pressing Play again.", true));
  };

  const stopPlayback = () => {
    audioEl.pause();
    audioEl.currentTime = 0;
    setStatus("Stopped.");
  };

  searchBtn.addEventListener("click", () => {
    const q = queryEl.value.trim();
    if (!q) {
      setStatus("Enter a search term like 'jazz', 'news', or a city.", true);
      return;
    }
    const url = `${RADIO_BROWSER_BASE}/stations/search?limit=30&name=${encodeURIComponent(q)}`;
    fetchStations(url, `search for "${q}"`);
  });

  topBtn.addEventListener("click", () => {
    const url = `${RADIO_BROWSER_BASE}/stations/topvote/30`;
    fetchStations(url, "popular stations");
  });

  queryEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      searchBtn.click();
    }
  });

  playBtn?.addEventListener("click", startPlayback);
  stopBtn?.addEventListener("click", stopPlayback);

  audioEl.addEventListener("playing", () => setStatus("Streaming..."));
  audioEl.addEventListener("stalled", () =>
    setStatus("Stream stalled. Trying to recover...", true)
  );
  audioEl.addEventListener("error", () =>
    setStatus("Stream error. Try another station.", true)
  );

  fetchStations(`${RADIO_BROWSER_BASE}/stations/topvote/20`, "popular stations");

  win.reloadRadioWithDefaults = () => {
    const url = lastRequest?.url || `${RADIO_BROWSER_BASE}/stations/topvote/20`;
    const description = lastRequest?.description || "popular stations";
    fetchStations(url, description);
  };
}
