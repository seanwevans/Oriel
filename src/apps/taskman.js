let selT = {};

const getKernel = () => window.kernel;

function refreshTaskList(listEl, winId, manager) {
  const wmRef = manager || window.wm;
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

function refreshProcessView(viewEl) {
  const kernelRef = getKernel();
  if (!viewEl || !kernelRef) return;
  viewEl.innerHTML = '<div class="queue-header">PID  | PRI | STATE   | CPU TIME</div>';
  kernelRef.processes.forEach((p) => {
    const row = document.createElement("div");
    row.className = "queue-row";
    let cpuBar = "";
    const ticks = Math.min(20, Math.floor(p.cpuTime / 1000));
    for (let i = 0; i < ticks; i++) cpuBar += "|";
    // Format ID from "win-123..."
    const shortId = p.pid.split("-")[1].substring(9);
    row.innerText = `${shortId} | ${p.priority
      .toString()
      .padEnd(3)} | ${p.state.padEnd(7)} | ${cpuBar}`;
    if (p.state === "RUNNING") row.style.color = "lime";
    else if (p.state === "WAITING") row.style.color = "yellow";
    else row.style.color = "gray";
    viewEl.appendChild(row);
  });
}

export function initTaskMan(win, manager) {
  refreshTaskList(win.querySelector("#task-list"), win.dataset.id, manager);
  refreshProcessView(win.querySelector("#task-queue-view"));
}

export function refreshAllTaskManagers(manager) {
  const wmRef = manager || window.wm;
  if (!wmRef) return;
  document.querySelectorAll(".window").forEach((w) => {
    if (w.dataset.type === "Task List") {
      const list = w.querySelector("#task-list");
      if (list) refreshTaskList(list, w.dataset.id, wmRef);
    }
  });
}

export function refreshAllProcessViews() {
  document.querySelectorAll(".window").forEach((w) => {
    if (w.dataset.type === "Task List") {
      const view = w.querySelector("#task-queue-view");
      if (view) refreshProcessView(view);
    }
  });
}

export function switchTask(e) {
  const winId = e.target.closest(".window").dataset.id;
  const targetId = selT[winId];
  if (targetId) {
    window.wm?.restoreWindow(targetId);
    window.wm?.focusWindow(targetId);
    window.wm?.closeWindow(winId);
  }
}

export function endTask(e) {
  const winId = e.target.closest(".window").dataset.id;
  const targetId = selT[winId];
  if (targetId) window.wm?.closeWindow(targetId);
}
