import { BaseApp } from "./base/BaseApp.js";
import { subscribeToNetworkEvents } from "../network/trackedFetch.js";

function formatTime(ts) {
  try {
    return new Date(ts).toLocaleTimeString();
  } catch (err) {
    return "--:--:--";
  }
}

function statusClass(status) {
  if (status === "pending") return "pending";
  if (status === "error" || status === "NETWORK_ERROR") return "error";
  if (typeof status === "number" && status >= 400) return "error";
  if (typeof status === "number") return "ok";
  return "info";
}

function describeStatus(event) {
  if (event.status === "pending") return "Pending";
  if (event.status === "error") return event.error || "Error";
  if (typeof event.status === "number") return `${event.status}${event.ok === false ? " (error)" : ""}`;
  return String(event.status || "");
}

function renderRow(event) {
  const row = document.createElement("div");
  row.className = `packetlab-row status-${statusClass(event.status)}`;
  const payload = event.bodyPreview ? event.bodyPreview : "(no body)";
  const infoLine = [event.contentType || "", event.phase || ""].filter(Boolean).join(" · ");
  row.innerHTML = `
    <div class="packetlab-row-top">
      <div class="packetlab-badge">${event.method || ""}</div>
      <div class="packetlab-url" title="${event.url || ""}">${event.url || "Unknown"}</div>
      <div class="packetlab-status">${describeStatus(event)}</div>
      <div class="packetlab-time">${formatTime(event.timestamp)}</div>
    </div>
    <div class="packetlab-row-meta">${infoLine || ""}</div>
    <div class="packetlab-payload">${payload || ""}</div>
  `;
  return row;
}

export function initPacketLab(win) {
  const list = win.querySelector(".packetlab-list");
  const filterInput = win.querySelector(".packetlab-filter");
  const statusSelect = win.querySelector(".packetlab-status-filter");
  const pauseBtn = win.querySelector(".packetlab-pause");
  const clearBtn = win.querySelector(".packetlab-clear");
  const countBadge = win.querySelector(".packetlab-count");

  if (!list || !filterInput || !statusSelect || !pauseBtn || !clearBtn || !countBadge) return;

  const state = {
    events: [],
    paused: false,
    filterText: "",
    filterStatus: "all"
  };

  const render = () => {
    list.innerHTML = "";
    const filtered = state.events.filter((evt) => {
      const text = state.filterText.trim().toLowerCase();
      const matchesText = !text
        ? true
        : [evt.url, evt.bodyPreview, evt.contentType, evt.error]
            .filter(Boolean)
            .some((val) => val.toLowerCase().includes(text));
      const matchesStatus =
        state.filterStatus === "all"
          ? true
          : state.filterStatus === "error"
            ? statusClass(evt.status) === "error"
            : state.filterStatus === "success"
              ? statusClass(evt.status) === "ok"
              : statusClass(evt.status) === "pending";
      return matchesText && matchesStatus;
    });

    if (!filtered.length) {
      list.innerHTML = '<div class="packetlab-empty">No matching events yet.</div>';
    } else {
      filtered.slice(-120).forEach((evt) => list.appendChild(renderRow(evt)));
    }

    countBadge.textContent = `${filtered.length} event${filtered.length === 1 ? "" : "s"}`;
  };

  const onNetworkEvent = (evt = {}) => {
    if (state.paused) return;
    state.events.push(evt);
    render();
  };

  const unsubscribe = subscribeToNetworkEvents(onNetworkEvent);
  const disposables = [unsubscribe];
  const listen = (target, type, listener) => {
    target.addEventListener(type, listener);
    disposables.push(() => target.removeEventListener(type, listener));
  };

  listen(filterInput, "input", () => {
    state.filterText = filterInput.value || "";
    render();
  });

  listen(statusSelect, "change", () => {
    state.filterStatus = statusSelect.value || "all";
    render();
  });

  listen(pauseBtn, "click", () => {
    state.paused = !state.paused;
    pauseBtn.textContent = state.paused ? "Resume" : "Pause";
    pauseBtn.classList.toggle("ghost", state.paused);
  });

  listen(clearBtn, "click", () => {
    state.events = [];
    render();
  });

  render();

  return {
    dispose() {
      while (disposables.length) disposables.pop()();
    }
  };
}

export function getPacketLabContent() {
  return `
    <div class="packetlab">
      <div class="packetlab-toolbar">
        <input class="packetlab-filter" type="text" placeholder="Filter by URL or payload" />
        <select class="packetlab-status-filter">
          <option value="all">All</option>
          <option value="success">Success</option>
          <option value="error">Errors</option>
          <option value="pending">Pending</option>
        </select>
        <button class="task-btn packetlab-pause">Pause</button>
        <button class="task-btn ghost packetlab-clear">Clear</button>
        <span class="packetlab-count" aria-live="polite">0 events</span>
      </div>
      <div class="packetlab-list" aria-label="Network activity"></div>
    </div>
  `;
}

export class PacketLabApp extends BaseApp {
  getWindowContent() {
    return getPacketLabContent(this.initData, this.services);
  }

  mount() {
    return initPacketLab(this.windowEl, this.initData, this.services.windowManager, this.services, this);
  }
}
