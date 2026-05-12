import { DEFAULT_RSS_SAMPLE, RSS_PRESETS } from "../defaults.js";
import { getNetworkDefaults, normalizeHttpUrl, stripHtmlText, RSS_PROXY_ROOT } from "../network/config.js";
import { parseRssXml, readRssResponseText, formatRssDate } from "../network/rssClient.js";
import { trackedFetch } from "../network/trackedFetch.js";

const getRssPlaceholder = () => {
  const { browserHome } = getNetworkDefaults();
  return `${(browserHome || "https://example.com/").replace(/\/$/, "")}/feed.xml`;
};

export function getRssReaderContent() {
  const presetOptions = RSS_PRESETS.map((p) => `<option value="${p.url}">${p.label}</option>`).join(
    ""
  );

  return `
              <div class="rss-layout">
                <div class="rss-toolbar">
                  <label class="rss-label">Feed:</label>
                  <input class="rss-url" type="text" value="${RSS_PRESETS[0].url}" spellcheck="false" placeholder="${getRssPlaceholder()}">
                  <select class="rss-preset" title="Popular feeds">${presetOptions}</select>
                  <button class="task-btn rss-load">Load</button>
                  <span class="rss-status">Ready</span>
                </div>
                <div class="rss-body">
                  <div class="rss-list" aria-label="Feed items"></div>
                  <div class="rss-preview">
                    <div class="rss-preview-title">Choose an item to preview</div>
                    <div class="rss-preview-meta"></div>
                    <div class="rss-preview-text"></div>
                    <a class="rss-preview-link" href="#" target="_blank" rel="noreferrer noopener">Open original</a>
                  </div>
                </div>
              </div>
            `;
}

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
  let rssLoadToken = 0;
  let rssAbort = null;

  const setStatus = (text, isError = false) => {
    status.textContent = text;
    status.classList.toggle("rss-status-error", isError);
  };

  const renderItems = () => {
    list.innerHTML = "";
    list.setAttribute("role", "listbox");
    if (!items.length) {
      const empty = document.createElement("div");
      empty.className = "rss-empty";
      empty.textContent = "No items in this feed.";
      list.appendChild(empty);
      return;
    }
    items.forEach((item, idx) => {
      const row = document.createElement("div");
      row.className = "rss-item" + (idx === selected ? " active" : "");
      row.dataset.index = idx.toString();
      row.setAttribute("role", "option");
      row.setAttribute("tabindex", "0");
      row.setAttribute("aria-selected", idx === selected ? "true" : "false");

      const title = document.createElement("div");
      title.className = "rss-item-title";
      title.textContent = item.title || "(Untitled)";

      const date = document.createElement("div");
      date.className = "rss-item-date";
      date.textContent = formatRssDate(item.date);

      row.appendChild(title);
      row.appendChild(date);
      list.appendChild(row);
    });
  };

  const showItem = (idx) => {
    const item = items[idx];
    selected = idx;
    renderItems();
    if (!item) return;
    titleEl.textContent = item.title || "(Untitled)";
    metaEl.textContent = `${formatRssDate(item.date)} · ${item.link || "No link"}`;
    textEl.textContent = stripHtmlText(item.summary) || "(No description)";
    const normalizedLink = normalizeHttpUrl(item.link);
    if (normalizedLink && /^https?:\/\//i.test(normalizedLink)) {
      linkEl.setAttribute("href", normalizedLink);
      linkEl.style.display = "inline";
    } else {
      linkEl.removeAttribute("href");
      linkEl.style.display = "none";
    }
  };

  const applyItems = (listItems) => {
    items = listItems;
    selected = items.length ? 0 : -1;
    renderItems();
    if (selected >= 0) showItem(selected);
  };

  const loadFeed = async (rawUrl) => {
    const normalized = normalizeHttpUrl(rawUrl);
    if (!normalized) return;
    const token = ++rssLoadToken;
    if (rssAbort) rssAbort.abort();
    rssAbort = new AbortController();
    const { signal } = rssAbort;
    lastRequestedUrl = normalized;
    setStatus("Loading...");
    try {
      const proxyUrl = `${RSS_PROXY_ROOT}${encodeURIComponent(normalized)}`;
      const res = await trackedFetch(proxyUrl, { signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await readRssResponseText(res);

      const parsed = parseRssXml(text).items;
      if (token !== rssLoadToken) return;
      if (!parsed.length) throw new Error("Empty feed");
      applyItems(parsed);
      setStatus(`Loaded ${parsed.length} items`);
    } catch (err) {
      if (token !== rssLoadToken) return;
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

  list.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " " && e.key !== "Spacebar") return;
    const target = e.target.closest(".rss-item");
    if (!target) return;
    e.preventDefault();
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
