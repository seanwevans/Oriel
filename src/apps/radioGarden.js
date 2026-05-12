import { RADIO_GARDEN_PROXY } from "../network/config.js";
import { trackedFetch } from "../network/trackedFetch.js";

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
  const toValidRadioGardenUrl = (path) => {
    if (!path) return null;
    try {
      const url = new URL(buildLink(path));
      if (url.protocol !== "http:" && url.protocol !== "https:") return null;
      return url.toString();
    } catch (err) {
      return null;
    }
  };

  const renderResults = (stations) => {
    if (!results) return;
    results.innerHTML = "";
    if (!stations.length) {
      const empty = document.createElement("div");
      empty.className = "radio-empty";
      empty.textContent = "No stations found for that search.";
      results.appendChild(empty);
      return;
    }

    stations.forEach((station) => {
      const title = station.page?.title || "Unknown Station";
      const subtitle = station.page?.subtitle || "";
      const url = toValidRadioGardenUrl(station.page?.url || "");

      const card = document.createElement("div");
      card.className = "radio-card";
      card.setAttribute("role", "listitem");

      const main = document.createElement("div");
      main.className = "radio-card-main";

      const titleEl = document.createElement("div");
      titleEl.className = "radio-card-title";
      titleEl.textContent = title;

      const subtitleEl = document.createElement("div");
      subtitleEl.className = "radio-card-sub";
      subtitleEl.textContent = subtitle;

      main.appendChild(titleEl);
      main.appendChild(subtitleEl);

      const actions = document.createElement("div");
      actions.className = "radio-card-actions";

      const openBtn = document.createElement("button");
      openBtn.className = "radio-pill";
      openBtn.textContent = "Open";
      openBtn.dataset.radioLink = url || "";
      openBtn.disabled = !url;

      const copyBtn = document.createElement("button");
      copyBtn.className = "radio-pill ghost";
      copyBtn.textContent = "Copy Link";
      copyBtn.dataset.copyLink = url || "";
      copyBtn.disabled = !url;

      actions.appendChild(openBtn);
      actions.appendChild(copyBtn);

      card.appendChild(main);
      card.appendChild(actions);

      results.appendChild(card);
    });
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
    let showedStatusError = false;
    try {
      const res = await trackedFetch(
        `${RADIO_GARDEN_PROXY}/api/ara/content/search?q=${encodeURIComponent(trimmed)}`
      );
      if (!res.ok) {
        setStatus(`Radio Garden search failed (HTTP ${res.status}).`, true);
        showedStatusError = true;
        throw new Error(`Radio Garden search failed with status ${res.status}`);
      }
      const fallbackRes = res.clone();
      let data;
      try {
        data = await res.json();
      } catch (jsonErr) {
        console.warn("Radio Garden search did not return JSON, falling back to text", jsonErr);
        try {
          const text = await fallbackRes.text();
          data = parseRadioJson(text);
        } catch (parseErr) {
          throw new Error("Unable to parse Radio Garden response.");
        }
      }
      const stations = extractStations(data);
      renderResults(stations);
      setStatus(`Showing ${stations.length} result${stations.length === 1 ? "" : "s"} for "${trimmed}".`);
    } catch (err) {
      console.error(err);
      if (showedStatusError) return;
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


export function getRadioGardenContent() {
    return `<div class="radio-garden">
              <div class="radio-header">
                <div>
                  <div class="radio-title">Radio Garden</div>
                  <div class="radio-subtitle">Search the globe and jump to a live station.</div>
                </div>
                <button class="task-btn radio-open-site">Open radio.garden</button>
              </div>
              <div class="radio-search-row">
                <input class="radio-search-input" type="text" placeholder="Search by city, country, or station name" spellcheck="false">
                <button class="task-btn radio-search-btn">Search</button>
              </div>
              <div class="radio-quick-row">
                <span class="radio-quick-label">Quick picks:</span>
                <div class="radio-quick-list">
                  <button class="radio-chip" data-query="Tokyo">Tokyo</button>
                  <button class="radio-chip" data-query="London">London</button>
                  <button class="radio-chip" data-query="São Paulo">São Paulo</button>
                  <button class="radio-chip" data-query="Sydney">Sydney</button>
                  <button class="radio-chip" data-query="Lagos">Lagos</button>
                </div>
              </div>
              <div class="radio-status">Type a query to load stations via the Radio Garden directory.</div>
              <div class="radio-results" role="list"></div>
            </div>`;

}
