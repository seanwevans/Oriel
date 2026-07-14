import { BaseApp } from "./base/BaseApp.js";
let selT = {};

const getKernel = (services = {}) => services.kernel || null;

function refreshTaskList(listEl, winId, manager) {
  const wmRef = manager;
  if (!wmRef || !listEl) return;
  listEl.innerHTML = "";
  wmRef.windows.forEach((w) => {
    const item = document.createElement("div");
    item.className = "task-item " + (selT[winId] === w.id ? "selected" : "");
    item.innerText = w.title;
    item.onclick = () => {
      selT[winId] = w.id;
      refreshTaskList(listEl, winId, wmRef);
    };
    listEl.appendChild(item);
  });
}

export function refreshProcessView(viewEl, services = {}) {
  const kernelRef = getKernel(services);
  if (!viewEl || !kernelRef) return;
  viewEl.innerHTML =
    '<div class="queue-header">PID  | PRI | STATE   | CPU TIME | TASK</div>';
  kernelRef.processes.forEach((p) => {
    const row = document.createElement("div");
    row.className = "queue-row";
    const ticks = Math.min(20, Math.floor(p.cpuTime / 1000));
    const cpuBar = "|".repeat(ticks).padEnd(20, " ");
    // Window pids look like "win-7"; show the bare number, and fall back to
    // the full pid for anything the kernel registered under another scheme.
    const shortId = String(p.pid).replace(/^win-/, "").padEnd(4);
    row.innerText = `${shortId} | ${p.priority
      .toString()
      .padEnd(3)} | ${p.state.padEnd(7)} | ${cpuBar} | ${p.name ?? "Unknown"}`;
    if (p.state === "RUNNING") row.style.color = "lime";
    else if (p.state === "WAITING") row.style.color = "yellow";
    else row.style.color = "gray";
    viewEl.appendChild(row);
  });
}

export function initTaskMan(win, _initData, manager, services = {}) {
  const wmRef = services.windowManager || manager;
  refreshTaskList(win.querySelector("#task-list"), win.dataset.id, wmRef);
  refreshProcessView(win.querySelector("#task-queue-view"), services);

  win.querySelector('[data-action="switch-task"]')?.addEventListener("click", () => {
    switchTask(win, wmRef);
  });
  win.querySelector('[data-action="end-task"]')?.addEventListener("click", () => {
    endTask(win, wmRef);
  });
  win.querySelector('[data-action="cancel-taskman"]')?.addEventListener("click", () => {
    wmRef?.closeWindow(win.dataset.id);
  });
}

export function refreshAllTaskManagers(manager) {
  const wmRef = manager;
  if (!wmRef) return;
  document.querySelectorAll(".window").forEach((w) => {
    if (w.dataset.appType === "taskman") {
      const list = w.querySelector("#task-list");
      if (list) refreshTaskList(list, w.dataset.id, wmRef);
    }
  });
}

export function refreshAllProcessViews(services = {}) {
  document.querySelectorAll(".window").forEach((w) => {
    if (w.dataset.appType === "taskman") {
      const view = w.querySelector("#task-queue-view");
      if (view) refreshProcessView(view, services);
    }
  });
}

export function switchTask(win, manager) {
  const winId = win?.dataset.id;
  const targetId = selT[winId];
  if (targetId) {
    manager?.restoreWindow(targetId);
    manager?.focusWindow(targetId);
    manager?.closeWindow(winId);
  }
}

export function endTask(win, manager) {
  const winId = win?.dataset.id;
  const targetId = selT[winId];
  if (targetId) manager?.closeWindow(targetId);
}

export function getTaskManContent() {
  return `<div class="task-mgr-layout"><div class="task-list" id="task-list"></div><div class="task-btns"><button class="task-btn" data-action="switch-task">Switch To</button><button class="task-btn" data-action="end-task">End Task</button><button class="task-btn" data-action="cancel-taskman">Cancel</button></div><div style="font-weight:bold; border-bottom:1px solid gray; margin-bottom:2px;">System Monitor:</div><div class="task-queue-view" id="task-queue-view"></div></div>`;
}

export class TaskManApp extends BaseApp {
  getWindowContent() {
    return getTaskManContent(this.initData, this.services);
  }

  mount() {
    return initTaskMan(this.windowEl, this.initData, this.services.windowManager, this.services, this);
  }
}
