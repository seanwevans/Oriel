import { NETNEWS_GROUPS } from "../defaults/netnews.js";
import { normalizeHttpUrl, stripHtmlText } from "../network/config.js";
import { fetchGroupedRssFeeds, formatRssDate } from "../network/rssClient.js";
import { getAppState, updateAppState } from "../state.js";
import { BaseApp } from "./base/BaseApp.js";

export function getNetNewsContent() {
  return `
    <div class="netnews-root">
      <div class="netnews-toolbar">
        <div class="netnews-title">NetNews</div>
        <div class="netnews-actions">
          <button class="task-btn netnews-refresh">Refresh</button>
          <span class="netnews-status">Ready</span>
        </div>
      </div>
      <div class="netnews-layout">
        <div class="netnews-pane netnews-pane-groups">
          <div class="netnews-pane-label">Groups</div>
          <div class="netnews-groups" role="listbox"></div>
        </div>
        <div class="netnews-pane netnews-pane-threads">
          <div class="netnews-pane-label">Threads</div>
          <div class="netnews-threads" role="listbox"></div>
        </div>
        <div class="netnews-pane netnews-pane-article">
          <div class="netnews-article-title">Choose a story to read</div>
          <div class="netnews-article-meta"></div>
          <div class="netnews-article-body"></div>
          <a class="netnews-open-link" href="#" target="_blank" rel="noreferrer noopener" style="display:none;">Open original</a>
        </div>
      </div>
    </div>
  `;
}


export function appendNetNewsEmptyMessage(container, message) {
  const empty = document.createElement("div");
  empty.className = "netnews-empty";
  empty.textContent = message;
  container.appendChild(empty);
}

export function createNetNewsGroupRow(group, isSelected = false) {
  const row = document.createElement("div");
  row.className = "netnews-group" + (isSelected ? " active" : "");
  row.dataset.id = group.id;
  row.setAttribute("role", "option");
  row.tabIndex = 0;

  const title = document.createElement("div");
  title.className = "netnews-group-title";
  title.textContent = group.title;

  const description = document.createElement("div");
  description.className = "netnews-group-desc";
  description.textContent = group.description;

  row.appendChild(title);
  row.appendChild(description);
  return row;
}

export function createNetNewsThreadRow(thread, idx, isSelected = false) {
  const row = document.createElement("div");
  row.className = "netnews-thread" + (isSelected ? " active" : "");
  row.dataset.index = idx.toString();
  row.tabIndex = 0;
  row.setAttribute("role", "option");
  row.setAttribute("aria-selected", isSelected ? "true" : "false");

  const title = document.createElement("div");
  title.className = "netnews-thread-title";
  title.textContent = thread.title || "(Untitled)";

  const meta = document.createElement("div");
  meta.className = "netnews-thread-meta";
  meta.textContent = `${thread.feedTitle || ""} · ${formatRssDate(thread.date)}`;

  row.appendChild(title);
  row.appendChild(meta);
  return row;
}

export function initNetNews(win) {
  const app = new BaseApp();
  const groupsEl = win.querySelector(".netnews-groups");
  const threadsEl = win.querySelector(".netnews-threads");
  const titleEl = win.querySelector(".netnews-article-title");
  const metaEl = win.querySelector(".netnews-article-meta");
  const bodyEl = win.querySelector(".netnews-article-body");
  const linkEl = win.querySelector(".netnews-open-link");
  const statusEl = win.querySelector(".netnews-status");
  const refreshBtn = win.querySelector(".netnews-refresh");

  if (!groupsEl || !threadsEl || !titleEl || !metaEl || !bodyEl || !linkEl || !statusEl) return;

  const storedState = getAppState("netnews") || {};
  let selectedGroupId = storedState.groupId || NETNEWS_GROUPS?.[0]?.id || null;
  let selectedThread = typeof storedState.articleIndex === "number" ? storedState.articleIndex : 0;
  let threads = [];
  let loadToken = 0;
  let abortController = null;

  const setStatus = (text, isError = false) => {
    statusEl.textContent = text;
    statusEl.classList.toggle("netnews-status-error", isError);
  };

  const persistState = () => {
    updateAppState("netnews", { groupId: selectedGroupId, articleIndex: selectedThread });
  };

  const renderGroups = () => {
    groupsEl.textContent = "";
    if (!NETNEWS_GROUPS.length) {
      appendNetNewsEmptyMessage(groupsEl, "No groups configured.");
      return;
    }
    NETNEWS_GROUPS.forEach((group) => {
      const row = createNetNewsGroupRow(group, group.id === selectedGroupId);
      app.listen(row, "click", () => {
        if (group.id === selectedGroupId) return;
        selectedGroupId = group.id;
        selectedThread = 0;
        persistState();
        renderGroups();
        loadGroup(group.id);
      });
      app.listen(row, "keydown", (e) => {
        if (e.key !== "Enter" && e.key !== " " && e.key !== "Spacebar") return;
        e.preventDefault();
        row.click();
      });
      groupsEl.appendChild(row);
    });
  };

  const renderThreads = () => {
    threadsEl.textContent = "";
    threadsEl.setAttribute("role", "listbox");
    if (!threads.length) {
      appendNetNewsEmptyMessage(threadsEl, "No stories yet.");
      return;
    }
    threads.forEach((thread, idx) => {
      const row = createNetNewsThreadRow(thread, idx, idx === selectedThread);
      app.listen(row, "click", () => selectThread(idx));
      app.listen(row, "keydown", (e) => {
        if (e.key !== "Enter" && e.key !== " " && e.key !== "Spacebar") return;
        e.preventDefault();
        selectThread(idx);
      });
      threadsEl.appendChild(row);
    });
  };

  const showThreadDetails = (thread) => {
    if (!thread) {
      titleEl.textContent = "Choose a story to read";
      metaEl.textContent = "";
      bodyEl.textContent = "";
      linkEl.style.display = "none";
      return;
    }
    titleEl.textContent = thread.title || "(Untitled)";
    const byline = [thread.feedTitle || "", formatRssDate(thread.date)]
      .filter(Boolean)
      .join(" · ");
    metaEl.textContent = byline || "No metadata";
    bodyEl.textContent = stripHtmlText(thread.summary) || "(No description)";
    if (thread.link && normalizeHttpUrl(thread.link)) {
      linkEl.href = normalizeHttpUrl(thread.link);
      linkEl.style.display = "inline";
    } else {
      linkEl.style.display = "none";
    }
  };

  const selectThread = (idx) => {
    selectedThread = idx;
    persistState();
    renderThreads();
    showThreadDetails(threads[idx]);
  };

  const loadGroup = async (groupId) => {
    const group = NETNEWS_GROUPS.find((g) => g.id === groupId);
    if (!group) return;
    const token = ++loadToken;
    if (abortController) abortController.abort();
    abortController = app.trackAbortController(new AbortController());
    const { signal } = abortController;
    setStatus(`Loading ${group.title}...`);
    try {
      const fetched = await fetchGroupedRssFeeds(group.feeds, { signal });
      if (token !== loadToken) return;
      threads = fetched
        .map((item) => ({
          ...item,
          date: item.date || ""
        }))
        .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
      if (selectedThread >= threads.length) selectedThread = 0;
      renderThreads();
      showThreadDetails(threads[selectedThread]);
      setStatus(`Loaded ${threads.length} stories from ${group.feeds.length} feeds.`);
      persistState();
    } catch (err) {
      if (token !== loadToken) return;
      console.error("NetNews load error", err);
      threads = [];
      renderThreads();
      showThreadDetails(null);
      setStatus("Failed to load stories for this group.", true);
    }
  };

  app.listen(refreshBtn, "click", () => loadGroup(selectedGroupId));

  renderGroups();
  loadGroup(selectedGroupId);

  return {
    dispose() {
      abortController?.abort();
      app.dispose();
    }
  };
}
