import { BaseApp } from "./base/BaseApp.js";

// Process Monitor is a live, graphical view of the simulated kernel's scheduler.
// It polls services.kernel.processes on an interval and renders per-state
// counts, a load sparkline, and a sorted process table. The summarization and
// formatting helpers below are DOM-free so they can be unit tested directly.

export const PROC_STATES = ["RUNNING", "READY", "WAITING"];
const STATE_COLORS = { RUNNING: "lime", READY: "gray", WAITING: "yellow" };
const HISTORY_LENGTH = 60;
const REFRESH_MS = 400;

const getKernel = (services = {}) => services.kernel || null;

/** Count processes by scheduler state and total accumulated CPU time. */
export function summarizeProcesses(processes = []) {
  const counts = { RUNNING: 0, READY: 0, WAITING: 0 };
  let totalCpu = 0;
  for (const proc of processes) {
    if (Object.prototype.hasOwnProperty.call(counts, proc.state)) counts[proc.state] += 1;
    totalCpu += Number(proc.cpuTime) || 0;
  }
  return { total: processes.length, totalCpu, ...counts };
}

/** Fraction of processes that are runnable (RUNNING or READY), 0..1. */
export function schedulerLoad(summary) {
  if (!summary || !summary.total) return 0;
  return (summary.RUNNING + summary.READY) / summary.total;
}

/** Append a value to a bounded history ring, returning a new array. */
export function pushSample(history = [], value, maxLen = HISTORY_LENGTH) {
  const next = history.concat(value);
  return next.length > maxLen ? next.slice(next.length - maxLen) : next;
}

export function formatCpuTime(ms) {
  const seconds = (Number(ms) || 0) / 1000;
  if (seconds >= 100) return `${Math.round(seconds)}s`;
  return `${seconds.toFixed(1)}s`;
}

const shortPid = (pid) => String(pid).replace(/^win-/, "");

/** Render the process table rows, sorted by CPU time descending. */
export function renderProcessTable(tableEl, processes = []) {
  if (!tableEl) return 0;
  tableEl.innerHTML = "";
  const sorted = [...processes].sort((a, b) => (Number(b.cpuTime) || 0) - (Number(a.cpuTime) || 0));
  const maxCpu = sorted.reduce((max, p) => Math.max(max, Number(p.cpuTime) || 0), 0) || 1;

  for (const proc of sorted) {
    const row = document.createElement("div");
    row.className = "procmon-row";

    const pid = document.createElement("span");
    pid.className = "procmon-pid";
    pid.innerText = shortPid(proc.pid);

    const name = document.createElement("span");
    name.className = "procmon-name";
    name.innerText = proc.name ?? "Unknown";

    const state = document.createElement("span");
    state.className = "procmon-state";
    state.innerText = proc.state ?? "";
    state.style.color = STATE_COLORS[proc.state] || "silver";

    const bar = document.createElement("span");
    bar.className = "procmon-bar";
    const fill = document.createElement("span");
    fill.className = "procmon-bar-fill";
    fill.style.width = `${Math.round(((Number(proc.cpuTime) || 0) / maxCpu) * 100)}%`;
    bar.appendChild(fill);

    const cpu = document.createElement("span");
    cpu.className = "procmon-cpu";
    cpu.innerText = formatCpuTime(proc.cpuTime);

    row.appendChild(pid);
    row.appendChild(name);
    row.appendChild(state);
    row.appendChild(bar);
    row.appendChild(cpu);
    tableEl.appendChild(row);
  }
  return sorted.length;
}

export function getProcessMonitorContent() {
  return `<div class="procmon-layout">
    <div class="procmon-tiles">
      <div class="procmon-tile"><span class="procmon-tile-value" data-tile="total">0</span><span class="procmon-tile-label">Processes</span></div>
      <div class="procmon-tile"><span class="procmon-tile-value" data-tile="RUNNING" style="color:lime">0</span><span class="procmon-tile-label">Running</span></div>
      <div class="procmon-tile"><span class="procmon-tile-value" data-tile="READY" style="color:silver">0</span><span class="procmon-tile-label">Ready</span></div>
      <div class="procmon-tile"><span class="procmon-tile-value" data-tile="WAITING" style="color:yellow">0</span><span class="procmon-tile-label">Waiting</span></div>
    </div>
    <div class="procmon-graph-wrap">
      <canvas class="procmon-graph" data-graph></canvas>
      <span class="procmon-graph-label">Scheduler load</span>
    </div>
    <div class="procmon-toolbar">
      <button class="procmon-btn" data-action="pause" type="button">Pause</button>
      <button class="procmon-btn" data-action="refresh" type="button">Refresh</button>
      <span class="procmon-cputime">CPU time: <span data-tile="totalCpu">0.0s</span></span>
    </div>
    <div class="procmon-table-head"><span>PID</span><span>Process</span><span>State</span><span>CPU</span><span></span></div>
    <div class="procmon-table" data-table><div class="procmon-empty">No active processes.</div></div>
  </div>`;
}

export function initProcessMonitor(w, _initData, _windowManager, services = {}, app) {
  if (!w) return null;
  const listen = app?.listen?.bind(app) || ((t, type, fn) => t?.addEventListener?.(type, fn));
  const setIntervalFn = app?.setInterval?.bind(app) || ((fn, ms) => setInterval(fn, ms));
  const clearIntervalFn = app?.clearInterval?.bind(app) || ((id) => clearInterval(id));

  const kernel = getKernel(services);
  const table = w.querySelector("[data-table]");
  const graph = w.querySelector("[data-graph]");
  const pauseBtn = w.querySelector('[data-action="pause"]');
  const tiles = new Map();
  for (const el of w.querySelectorAll("[data-tile]")) tiles.set(el.dataset.tile, el);

  if (graph) {
    graph.width = 320;
    graph.height = 60;
  }
  const ctx = graph?.getContext?.("2d") ?? null;

  let history = [];
  let intervalId = null;

  const drawGraph = () => {
    if (!ctx) return;
    const width = graph.width;
    const height = graph.height;
    ctx.fillStyle = "#05070d";
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = "rgba(0, 255, 128, 0.15)";
    ctx.lineWidth = 1;
    for (let i = 1; i < 4; i++) {
      const y = (height / 4) * i + 0.5;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    if (history.length < 2) return;
    ctx.strokeStyle = "#00ff90";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    history.forEach((value, index) => {
      const x = (index / (HISTORY_LENGTH - 1)) * width;
      const y = height - value * height;
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  };

  const setTile = (key, value) => {
    const el = tiles.get(key);
    if (el) el.textContent = String(value);
  };

  const refresh = () => {
    const processes = kernel?.processes ?? [];
    const summary = summarizeProcesses(processes);
    setTile("total", summary.total);
    setTile("RUNNING", summary.RUNNING);
    setTile("READY", summary.READY);
    setTile("WAITING", summary.WAITING);
    setTile("totalCpu", formatCpuTime(summary.totalCpu));

    history = pushSample(history, schedulerLoad(summary), HISTORY_LENGTH);
    drawGraph();

    if (table) {
      if (processes.length) renderProcessTable(table, processes);
      else table.innerHTML = '<div class="procmon-empty">No active processes.</div>';
    }
  };

  const stop = () => {
    if (intervalId != null) {
      clearIntervalFn(intervalId);
      intervalId = null;
    }
    if (pauseBtn) pauseBtn.textContent = "Resume";
  };

  const start = () => {
    if (intervalId != null) return;
    intervalId = setIntervalFn(refresh, REFRESH_MS);
    if (pauseBtn) pauseBtn.textContent = "Pause";
  };

  listen(pauseBtn, "click", () => {
    if (intervalId != null) stop();
    else start();
  });
  listen(w.querySelector('[data-action="refresh"]'), "click", refresh);

  refresh();
  start();

  return { refresh, start, stop, isRunning: () => intervalId != null };
}

export class ProcessMonitorApp extends BaseApp {
  getWindowContent() {
    return getProcessMonitorContent(this.initData, this.services);
  }

  mount() {
    return initProcessMonitor(this.windowEl, this.initData, this.services.windowManager, this.services, this);
  }
}
