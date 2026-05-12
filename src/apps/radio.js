import { BaseApp } from "./base/BaseApp.js";
import { RADIO_FALLBACK_PRESETS } from "../defaults.js";
import { registerMediaElement } from "../audio.js";
import { RADIO_BROWSER_BASE } from "../network/config.js";
import { trackedFetch } from "../network/trackedFetch.js";

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
      const empty = document.createElement("div");
      empty.className = "radio-empty";
      empty.textContent = "No stations loaded yet.";
      listEl.appendChild(empty);
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

      const title = document.createElement("div");
      title.className = "radio-station-title";
      title.textContent = st.name || "Unnamed Station";

      const metaPrimary = document.createElement("div");
      metaPrimary.className = "radio-meta-line";
      metaPrimary.textContent = `${st.country || ""}${st.language ? ` · ${st.language}` : ""}`;

      const metaSecondary = document.createElement("div");
      metaSecondary.className = "radio-meta-line";
      metaSecondary.textContent = `${st.codec ? `${st.codec.toUpperCase()} · ` : ""}${
        st.bitrate ? `${st.bitrate} kbps` : ""
      }${tags ? ` · ${tags}` : ""}`;

      btn.appendChild(title);
      btn.appendChild(metaPrimary);
      btn.appendChild(metaSecondary);
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
      const res = await trackedFetch(url);
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

export function getRadioContent() {
    return `<div class="radio-layout">
              <div class="radio-toolbar">
                <div class="radio-search">
                  <input type="text" class="radio-query" placeholder="Search stations or genres..." spellcheck="false" />
                  <button class="task-btn radio-search-btn">Search</button>
                  <button class="task-btn radio-top-btn" title="Load popular stations">Top</button>
                </div>
                <div class="radio-status">Find and play live internet radio via the free Radio Browser API.</div>
              </div>
              <div class="radio-body">
                <div class="radio-list" role="listbox" aria-label="Radio stations"></div>
                <div class="radio-player">
                  <div class="radio-now">No station selected.</div>
                  <audio class="radio-audio" controls></audio>
                  <div class="radio-actions">
                    <button class="task-btn radio-play">Play</button>
                    <button class="task-btn radio-stop">Stop</button>
                  </div>
                  <div class="radio-meta">Use search or Top to load stations.</div>
                </div>
              </div>
            </div>`;

}

export class RadioApp extends BaseApp {
  getWindowContent() {
    return getRadioContent(this.initData, this.services);
  }

  mount() {
    return initRadio(this.windowEl, this.initData, this.services.windowManager, this.services, this);
  }
}
