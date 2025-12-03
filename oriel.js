// --- ICONS (Inline SVGs for pixel art look) ---
const ICONS = {
  progman: `<svg viewBox="0 0 32 32" class="svg-icon"><rect x="2" y="4" width="28" height="24" fill="#c0c0c0" stroke="black"/><rect x="4" y="8" width="24" height="16" fill="white" stroke="black"/><rect x="6" y="10" width="4" height="4" fill="#000080"/><rect x="14" y="10" width="4" height="4" fill="#000080"/><rect x="22" y="10" width="4" height="4" fill="#000080"/><rect x="6" y="18" width="4" height="4" fill="#000080"/><rect x="14" y="18" width="4" height="4" fill="#000080"/><rect x="22" y="18" width="4" height="4" fill="#000080"/></svg>`,
  notepad: `<svg viewBox="0 0 32 32" class="svg-icon"><path d="M6 4h14l6 6v18H6z" fill="white" stroke="black"/><path d="M20 4v6h6" fill="#c0c0c0" stroke="black"/><line x1="10" y1="12" x2="22" y2="12" stroke="blue"/><line x1="10" y1="16" x2="22" y2="16" stroke="black"/><line x1="10" y1="20" x2="22" y2="20" stroke="black"/><line x1="10" y1="24" x2="22" y2="24" stroke="black"/></svg>`,
  calc: `<svg viewBox="0 0 32 32" class="svg-icon"><rect x="6" y="4" width="20" height="24" fill="#c0c0c0" stroke="black"/><rect x="8" y="6" width="16" height="6" fill="white" stroke="black"/><rect x="8" y="14" width="4" height="4" fill="blue" stroke="black"/><rect x="14" y="14" width="4" height="4" fill="blue" stroke="black"/><rect x="20" y="14" width="4" height="4" fill="red" stroke="black"/><rect x="8" y="20" width="4" height="4" fill="blue" stroke="black"/><rect x="14" y="20" width="4" height="4" fill="blue" stroke="black"/><rect x="20" y="20" width="4" height="4" fill="red" stroke="black"/></svg>`,
  mines: `<svg viewBox="0 0 32 32" class="svg-icon"><circle cx="16" cy="16" r="10" fill="black"/><rect x="14" y="4" width="4" height="6" fill="black"/><rect x="4" y="14" width="6" height="4" fill="black"/><rect x="22" y="14" width="6" height="4" fill="black"/><rect x="14" y="22" width="4" height="6" fill="black"/><circle cx="12" cy="12" r="2" fill="white"/></svg>`,
  ccompiler: `<svg viewBox="0 0 32 32" class="svg-icon"><path d="M6 4h14l6 6v18H6z" fill="white" stroke="black"/><path d="M20 4v6h6" fill="#c0c0c0" stroke="black"/><text x="14" y="22" font-family="serif" font-weight="bold" font-size="20" text-anchor="middle" fill="blue">C</text></svg>`,
  python: `<svg viewBox="0 0 32 32" class="svg-icon"><path d="M16 4c-4 0-4 2-4 2v2h4v1h-5c-4 0-4 4-4 4v2h2v-2c0-2 0-2 2-2h5c2 0 2-2 2-2V7c0-2-2-2-2-2h-1z" fill="#306998"/><path d="M16 28c4 0 4-2 4-2v-2h-4v-1h5c4 0 4-4 4-4v-2h-2v2c0 2 0 2-2 2h-5c-2 0-2 2-2 2v2c0 2 2 2 2 2h1z" fill="#FFD43B"/><circle cx="14" cy="7" r="1" fill="white"/><circle cx="18" cy="25" r="1" fill="white"/></svg>`,
  console: `<svg viewBox="0 0 32 32" class="svg-icon"><rect x="4" y="6" width="24" height="20" fill="black" stroke="#c0c0c0"/><text x="8" y="20" font-family="monospace" font-weight="bold" font-size="14" fill="#c0c0c0">C:\></text></svg>`,
  taskman: `<svg viewBox="0 0 32 32" class="svg-icon"><rect x="4" y="4" width="24" height="24" fill="#c0c0c0" stroke="black"/><rect x="6" y="6" width="20" height="4" fill="#000080"/><rect x="6" y="12" width="20" height="14" fill="white" stroke="black"/><line x1="8" y1="16" x2="24" y2="16" stroke="black"/><line x1="8" y1="20" x2="24" y2="20" stroke="black"/></svg>`,
  paint: `<svg viewBox="0 0 32 32" class="svg-icon"><path d="M10 24c0 2 2 4 4 4s4-2 4-4v-8h-8v8z" fill="#c0c0c0" stroke="black"/><rect x="10" y="10" width="8" height="6" fill="black"/><path d="M14 4l-4 6h8l-4-6z" fill="#c0c0c0" stroke="black"/><circle cx="24" cy="24" r="6" fill="#ff0000" opacity="0.5"/><circle cx="8" cy="24" r="6" fill="#0000ff" opacity="0.5"/></svg>`,
  database: `<svg viewBox="0 0 32 32" class="svg-icon"><path d="M16 6c-8 0-12 2-12 4v12c0 2 4 4 12 4s12-2 12-4V10c0-2-4-4-12-4z" fill="#c0c0c0" stroke="black"/><ellipse cx="16" cy="10" rx="12" ry="4" fill="white" stroke="black"/><path d="M4 14c0 2 4 4 12 4s12-2 12-4" fill="none" stroke="black"/><path d="M4 18c0 2 4 4 12 4s12-2 12-4" fill="none" stroke="black"/></svg>`,
  soundrec: `<svg viewBox="0 0 32 32" class="svg-icon"><rect x="12" y="6" width="8" height="14" rx="4" fill="#404040" stroke="black"/><rect x="14" y="20" width="4" height="6" fill="#808080" stroke="black"/><rect x="10" y="26" width="12" height="2" fill="black"/><line x1="8" y1="12" x2="24" y2="12" stroke="#808080" stroke-width="2"/></svg>`,
  charmap: `<svg viewBox="0 0 32 32" class="svg-icon"><rect x="4" y="4" width="24" height="24" fill="#fff" stroke="black"/><text x="16" y="24" font-family="serif" font-size="24" text-anchor="middle" font-weight="bold">Ã</text></svg>`,
  winfile: `<svg viewBox="0 0 32 32" class="svg-icon"><path d="M2 6h8l2 2h18v20H2z" fill="#FFFF00" stroke="black"/><path d="M4 10h24v14H4z" fill="white" opacity="0.3"/></svg>`,
  clock: `<svg viewBox="0 0 32 32" class="svg-icon"><circle cx="16" cy="16" r="12" fill="white" stroke="black"/><line x1="16" y1="16" x2="16" y2="8" stroke="black" stroke-width="2"/><line x1="16" y1="16" x2="22" y2="16" stroke="black" stroke-width="2"/></svg>`,
  control: `<svg viewBox="0 0 32 32" class="svg-icon"><rect x="4" y="8" width="24" height="16" fill="#c0c0c0" stroke="black"/><rect x="6" y="10" width="20" height="12" fill="white"/><circle cx="10" cy="16" r="3" fill="red"/><circle cx="16" cy="16" r="3" fill="green"/><circle cx="22" cy="16" r="3" fill="blue"/></svg>`,
  cp_color: `<svg viewBox="0 0 32 32" class="svg-icon"><path d="M16 2 L2 28 H30 Z" fill="#FFFF00" stroke="black"/><circle cx="16" cy="18" r="5" fill="red"/><circle cx="12" cy="24" r="5" fill="blue"/><circle cx="20" cy="24" r="5" fill="green"/></svg>`,
  write: `<svg viewBox="0 0 32 32" class="svg-icon"><rect x="6" y="4" width="20" height="24" fill="white" stroke="black"/><text x="16" y="22" font-family="serif" font-size="24" text-anchor="middle" font-weight="bold" fill="blue">A</text><path d="M20 6 l6 6 -2 2 -6 -6 z" fill="#ffff00" stroke="black"/></svg>`,
  cardfile: `<svg viewBox="0 0 32 32" class="svg-icon"><rect x="4" y="8" width="24" height="18" fill="white" stroke="black"/><line x1="4" y1="12" x2="28" y2="12" stroke="black"/><rect x="6" y="4" width="8" height="4" fill="white" stroke="black" style="border-bottom:none;"/></svg>`,
  solitaire: `<svg viewBox="0 0 32 32" class="svg-icon"><rect x="4" y="4" width="16" height="20" fill="white" stroke="black" rx="2"/><text x="8" y="16" font-size="14" fill="red">♥</text><rect x="12" y="8" width="16" height="20" fill="#000080" stroke="white" rx="2"/></svg>`,
  clipboard: `<svg viewBox="0 0 32 32" class="svg-icon"><rect x="6" y="6" width="20" height="22" fill="white" stroke="black"/><rect x="10" y="4" width="12" height="4" fill="#c0c0c0" stroke="black"/><line x1="10" y1="12" x2="22" y2="12" stroke="gray"/><line x1="10" y1="16" x2="22" y2="16" stroke="gray"/></svg>`,
  reversi: `<svg viewBox="0 0 32 32" class="svg-icon"><rect x="4" y="4" width="24" height="24" fill="#008000" stroke="black"/><circle cx="16" cy="16" r="8" fill="red"/><circle cx="16" cy="16" r="4" fill="blue"/></svg>`,
  mplayer: `<svg viewBox="0 0 32 32" class="svg-icon"><path d="M4 6h24v20H4z" fill="#fff" stroke="black"/><rect x="6" y="8" width="20" height="12" fill="black"/><path d="M12 24l8 0l-4 4z" fill="#000"/></svg>`,
  folder: `<svg viewBox="0 0 16 16" class="tiny-icon"><path d="M1 2h6l2 2h6v10H1z" fill="#FFFF00" stroke="black" stroke-width="0.5"/></svg>`,
  file_exe: `<svg viewBox="0 0 16 16" class="tiny-icon"><rect x="2" y="1" width="12" height="14" fill="white" stroke="black" stroke-width="0.5"/><rect x="3" y="2" width="10" height="2" fill="#000080"/></svg>`,
  file_txt: `<svg viewBox="0 0 16 16" class="tiny-icon"><rect x="2" y="1" width="12" height="14" fill="white" stroke="black" stroke-width="0.5"/><line x1="4" y1="4" x2="12" y2="4" stroke="black" stroke-width="0.5"/><line x1="4" y1="7" x2="12" y2="7" stroke="black" stroke-width="0.5"/></svg>`,
  readme: `<svg viewBox="0 0 32 32" class="svg-icon"><rect x="6" y="4" width="20" height="24" fill="white" stroke="black"/><path d="M10 8h12M10 12h12M10 16h12M10 20h8" stroke="black" stroke-width="2"/></svg>`,
  help: `<svg viewBox="0 0 32 32" class="svg-icon"><circle cx="16" cy="16" r="12" fill="#FFFF00" stroke="black"/><text x="16" y="22" font-size="20" text-anchor="middle" font-weight="bold" font-family="serif">?</text></svg>`,
  desktop_cp: `<svg viewBox="0 0 32 32" class="svg-icon"><rect x="2" y="4" width="28" height="20" fill="white" stroke="black"/><rect x="4" y="6" width="24" height="16" fill="cyan"/><rect x="10" y="24" width="12" height="4" fill="gray" stroke="black"/></svg>`
};
// --- MOCK FILE SYSTEM ---
const MOCK_FS = {
  "C:\\": {
    type: "dir",
    children: {
      ORIEL: {
        type: "dir",
        children: {
          SYSTEM: {
            type: "dir",
            children: {}
          },
          "CALC.EXE": {
            type: "file",
            app: "calc"
          },
          "NOTEPAD.EXE": {
            type: "file",
            app: "notepad"
          },
          "WRITE.EXE": {
            type: "file",
            app: "write"
          },
          "CARDFILE.EXE": {
            type: "file",
            app: "cardfile"
          },
          "WINMINE.EXE": {
            type: "file",
            app: "mines"
          },
          "SOL.EXE": {
            type: "file",
            app: "solitaire"
          },
          "REVERSI.EXE": {
            type: "file",
            app: "reversi"
          },
          "PBRUSH.EXE": {
            type: "file",
            app: "paint"
          },
          "MPLAYER.EXE": {
            type: "file",
            app: "mplayer"
          },
          "WINFILE.EXE": {
            type: "file",
            app: "winfile"
          },
          "TASKMAN.EXE": {
            type: "file",
            app: "taskman"
          },
          "CLIPBRD.EXE": {
            type: "file",
            app: "clipbrd"
          },
          "DATAMGR.EXE": {
            type: "file",
            app: "database"
          },
          "CHARMAP.EXE": {
            type: "file",
            app: "charmap"
          },
          "SOUNDREC.EXE": {
            type: "file",
            app: "soundrec"
          },
          "CLOCK.EXE": {
            type: "file",
            app: "clock"
          },
          "CONTROL.EXE": {
            type: "file",
            app: "control"
          },
          "TINYC.EXE": {
            type: "file",
            app: "compiler"
          },
          "PYTHON.EXE": {
            type: "file",
            app: "python"
          },
          "CONSOLE.EXE": {
            type: "file",
            app: "console"
          }
        }
      },
      DOCUMENTS: {
        type: "dir",
        children: {
          "README.TXT": {
            type: "file",
            app: "notepad",
            content: "Welcome to Oriel 1.0!"
          },
          "TODO.TXT": {
            type: "file",
            app: "notepad",
            content: "- Buy Milk\n- Install DOOM"
          }
        }
      }
    }
  }
};
// --- KERNEL & SCHEDULER SIMULATION ---
class SimulatedKernel {
  constructor() {
    this.processes = [];
    this.schedulerInterval = null;
    this.currentProcessIndex = 0;
  }
  registerProcess(pid, name) {
    this.processes.push({
      pid: pid,
      name: name,
      state: "READY",
      priority: Math.floor(Math.random() * 10) + 1,
      cpuTime: 0
    });
    this.startScheduler();
  }
  unregisterProcess(pid) {
    const idx = this.processes.findIndex((p) => p.pid === pid);
    if (idx > -1) this.processes.splice(idx, 1);
  }
  startScheduler() {
    if (this.schedulerInterval) return;
    this.schedulerInterval = setInterval(() => this.tick(), 200); // 5Hz simulated tick
  }
  tick() {
    if (this.processes.length === 0) return;
    // Bounds check in case a process was killed asynchronously
    if (this.currentProcessIndex >= this.processes.length) {
      this.currentProcessIndex = 0;
    }
    const p = this.processes[this.currentProcessIndex];
    // Double check existence because async removals might happen
    if (p) {
      if (p.state !== "WAITING") {
        p.state = "RUNNING";
        p.cpuTime += 200; // ms
      }
    } else {
      // If undefined, try to reset index and wait for next tick
      this.currentProcessIndex = 0;
      return;
    }
    // Simple Round Robin Simulation update for next tick
    this.processes.forEach((proc, idx) => {
      if (idx !== this.currentProcessIndex) {
        if (proc.state === "RUNNING") proc.state = "READY";
        // Randomly toggle WAITING state to simulate I/O
        if (Math.random() < 0.1) proc.state = "WAITING";
        else if (proc.state === "WAITING" && Math.random() < 0.3)
          proc.state = "READY";
      }
    });
    this.currentProcessIndex =
      (this.currentProcessIndex + 1) % this.processes.length;
    // Notify Task Managers
    refreshAllProcessViews();
  }
}
const kernel = new SimulatedKernel();
// --- WINDOW MANAGER ---
class WindowManager {
  constructor() {
    this.desktop = document.getElementById("desktop");
    this.minimizedContainer = document.getElementById("minimized-container");
    this.windows = [];
    this.highestZ = 100;
    this.dragState = {
      isDragging: false,
      initialX: 0,
      initialY: 0,
      offX: 0,
      offY: 0,
      currentWin: null
    };
    this.resizeState = {
      isResizing: false,
      currentWin: null,
      handleType: null,
      initialX: 0,
      initialY: 0,
      initialW: 0,
      initialH: 0,
      initialL: 0,
      initialT: 0
    };
    // Global Listeners
    window.addEventListener("mousemove", (e) => {
      this.onDrag(e);
      this.onResize(e);
    });
    window.addEventListener("mouseup", () => {
      this.endDrag();
      this.endResize();
    });
    // Initial App: Program Manager
    this.openWindow("progman", "Program Manager", 500, 480);
  }
  createWindowDOM(id, title, width, height, content) {
    const win = document.createElement("div");
    win.classList.add("window");
    win.style.width = width + "px";
    win.style.height = height + "px";
    win.style.left = 40 + this.windows.length * 20 + "px";
    win.style.top = 40 + this.windows.length * 20 + "px";
    win.dataset.id = id;
    win.dataset.type = title; // For task manager filter
    // HTML Structure with Resize Handles
    win.innerHTML = `
                <div class="resizer n" data-resize="n"></div>
                <div class="resizer s" data-resize="s"></div>
                <div class="resizer e" data-resize="e"></div>
                <div class="resizer w" data-resize="w"></div>
                <div class="resizer ne" data-resize="ne"></div>
                <div class="resizer nw" data-resize="nw"></div>
                <div class="resizer se" data-resize="se"></div>
                <div class="resizer sw" data-resize="sw"></div>
                <div class="title-bar">
                    <div class="sys-box" onclick="wm.closeWindow('${id}')">-</div>
                    <div class="title-bar-text">${title}</div>
                    <div class="win-controls-right">
                        <div class="win-btn" onclick="wm.minimizeWindow('${id}')">▼</div>
                        <div class="win-btn" onclick="wm.maximizeWindow('${id}')">▲</div>
                    </div>
                </div>
                <div class="menu-bar">
                    <div class="menu-item">File</div>
                    <div class="menu-item">Edit</div>
                    <div class="menu-item">Help</div>
                </div>
                <div class="window-body">
                    ${content}
                </div>
            `;
    // Drag Start
    const titleBar = win.querySelector(".title-bar");
    titleBar.addEventListener("mousedown", (e) => {
      if (
        e.target.classList.contains("sys-box") ||
        e.target.classList.contains("win-btn")
      )
        return;
      this.startDrag(e, win);
    });
    // Resize Start
    win.querySelectorAll(".resizer").forEach((r) => {
      r.addEventListener("mousedown", (e) =>
        this.startResize(e, win, r.dataset.resize)
      );
    });
    // Focus on click
    win.addEventListener("mousedown", () => this.focusWindow(id));
    return win;
  }
  openWindow(type, title, w, h, initData = null) {
    const id = "win-" + Date.now();
    let content = "";
    // Generate App Content
    if (type === "progman") content = this.getProgramManagerContent();
    if (type === "notepad") content = this.getNotepadContent(initData);
    if (type === "write") content = this.getWriteContent(initData);
    if (type === "cardfile") content = this.getCardfileContent();
    if (type === "calc") content = this.getCalcContent();
    if (type === "mines") content = this.getMinesContent();
    if (type === "solitaire") content = this.getSolitaireContent();
    if (type === "reversi") content = this.getReversiContent();
    if (type === "compiler") content = this.getCompilerContent();
    if (type === "python") content = this.getPythonContent();
    if (type === "console") content = this.getConsoleContent();
    if (type === "taskman") content = this.getTaskManContent();
    if (type === "paint") content = this.getPaintContent();
    if (type === "mplayer") content = this.getMediaPlayerContent();
    if (type === "database") content = this.getDatabaseContent();
    if (type === "soundrec") content = this.getSoundRecContent();
    if (type === "charmap") content = this.getCharMapContent();
    if (type === "winfile") content = this.getWinFileContent();
    if (type === "clock") content = this.getClockContent();
    if (type === "control") content = this.getControlPanelContent();
    if (type === "clipbrd") content = this.getClipboardContent();
    if (type === "readme") content = this.getReadmeContent();
    const winEl = this.createWindowDOM(id, title, w, h, content);
    this.desktop.appendChild(winEl);
    const winObj = {
      id,
      el: winEl,
      type,
      title,
      minimized: false,
      maximized: false,
      prevRect: null
    };
    this.windows.push(winObj);
    // Register Process
    kernel.registerProcess(id, title);
    this.focusWindow(id);
    // Initialize app logic if needed
    if (type === "mines") initMinesweeper(winEl);
    if (type === "solitaire") initSolitaire(winEl);
    if (type === "reversi") initReversi(winEl);
    if (type === "paint") initPaint(winEl);
    if (type === "mplayer") initMediaPlayer(winEl);
    if (type === "database") initDatabase(winEl);
    if (type === "soundrec") initSoundRecorder(winEl);
    if (type === "charmap") initCharMap(winEl);
    if (type === "winfile") initFileManager(winEl);
    if (type === "clock") initClock(winEl);
    if (type === "control") initControlPanel(winEl);
    if (type === "write") initWrite(winEl);
    if (type === "cardfile") initCardfile(winEl);
    if (type === "taskman") initTaskMan(winEl);
    // Refresh logic
    refreshAllTaskManagers();
  }
  closeWindow(id) {
    const index = this.windows.findIndex((w) => w.id === id);
    if (index > -1) {
      this.windows[index].el.remove();
      // Remove minimized icon if exists
      const minIcon = document.getElementById("min-" + id);
      if (minIcon) minIcon.remove();
      this.windows.splice(index, 1);
      // Kill Process
      kernel.unregisterProcess(id);
      refreshAllTaskManagers();
    }
  }
  minimizeWindow(id) {
    const win = this.windows.find((w) => w.id === id);
    if (!win) return;
    win.el.style.display = "none";
    win.minimized = true;
    // Create Icon at bottom
    const icon = document.createElement("div");
    icon.id = "min-" + id;
    icon.className = "desktop-icon minimized";
    icon.innerHTML = `
                <div class="icon-img">${this.getIconForType(win.type)}</div>
                <div class="icon-label">${
                  win.el.querySelector(".title-bar-text").innerText
                }</div>
            `;
    icon.onclick = () => this.restoreWindow(id);
    this.minimizedContainer.appendChild(icon);
  }
  restoreWindow(id) {
    const win = this.windows.find((w) => w.id === id);
    if (!win) return;
    win.el.style.display = "flex";
    win.minimized = false;
    const minIcon = document.getElementById("min-" + id);
    if (minIcon) minIcon.remove();
    this.focusWindow(id);
  }
  maximizeWindow(id) {
    const win = this.windows.find((w) => w.id === id);
    if (!win) return;
    if (!win.maximized) {
      win.prevRect = {
        top: win.el.style.top,
        left: win.el.style.left,
        width: win.el.style.width,
        height: win.el.style.height
      };
      win.el.style.top = "0";
      win.el.style.left = "0";
      win.el.style.width = "100%";
      win.el.style.height = "100%";
      win.maximized = true;
    } else {
      win.el.style.top = win.prevRect.top;
      win.el.style.left = win.prevRect.left;
      win.el.style.width = win.prevRect.width;
      win.el.style.height = win.prevRect.height;
      win.maximized = false;
    }
    this.focusWindow(id);
  }
  focusWindow(id) {
    this.highestZ++;
    this.windows.forEach((w) => {
      if (w.id === id) {
        w.el.style.zIndex = this.highestZ;
        w.el.classList.add("active");
      } else {
        w.el.classList.remove("active");
      }
    });
  }
  // Drag Logic
  startDrag(e, winEl) {
    if (e.target.closest(".win-btn") || e.target.closest(".sys-box")) return;
    this.dragState.isDragging = true;
    this.dragState.currentWin = winEl;
    this.dragState.initialX = e.clientX;
    this.dragState.initialY = e.clientY;
    const rect = winEl.getBoundingClientRect();
    this.dragState.offX = winEl.offsetLeft;
    this.dragState.offY = winEl.offsetTop;
    this.focusWindow(winEl.dataset.id);
  }
  onDrag(e) {
    if (!this.dragState.isDragging) return;
    const dx = e.clientX - this.dragState.initialX;
    const dy = e.clientY - this.dragState.initialY;
    this.dragState.currentWin.style.left = this.dragState.offX + dx + "px";
    this.dragState.currentWin.style.top = this.dragState.offY + dy + "px";
  }
  endDrag() {
    this.dragState.isDragging = false;
    this.dragState.currentWin = null;
  }
  // Resize Logic
  startResize(e, winEl, type) {
    e.stopPropagation();
    e.preventDefault();
    this.resizeState.isResizing = true;
    this.resizeState.currentWin = winEl;
    this.resizeState.handleType = type;
    this.resizeState.initialX = e.clientX;
    this.resizeState.initialY = e.clientY;
    const rect = winEl.getBoundingClientRect();
    this.resizeState.initialW = rect.width;
    this.resizeState.initialH = rect.height;
    this.resizeState.initialL = rect.left;
    this.resizeState.initialT = rect.top;
    this.focusWindow(winEl.dataset.id);
  }
  onResize(e) {
    if (!this.resizeState.isResizing) return;
    const dx = e.clientX - this.resizeState.initialX;
    const dy = e.clientY - this.resizeState.initialY;
    const type = this.resizeState.handleType;
    const win = this.resizeState.currentWin;
    let newW = this.resizeState.initialW;
    let newH = this.resizeState.initialH;
    let newL = this.resizeState.initialL;
    let newT = this.resizeState.initialT;
    if (type.includes("e")) newW += dx;
    if (type.includes("s")) newH += dy;
    if (type.includes("w")) {
      newW -= dx;
      newL += dx;
    }
    if (type.includes("n")) {
      newH -= dy;
      newT += dy;
    }
    if (newW > 100) {
      win.style.width = newW + "px";
      win.style.left = newL + "px";
    }
    if (newH > 100) {
      win.style.height = newH + "px";
      win.style.top = newT + "px";
    }
  }
  endResize() {
    this.resizeState.isResizing = false;
    this.resizeState.currentWin = null;
  }
  // Helper: Icons
  getIconForType(type) {
    return ICONS[type] || ICONS["help"];
  }
  // Content Generators
  getProgramManagerContent() {
    return `
                <div class="prog-man-grid">
                    <div class="prog-icon" onclick="wm.openWindow('notepad', 'Notepad', 300, 200)">
                        ${ICONS.notepad}
                        <div class="prog-label">Notepad</div>
                    </div>
                    <div class="prog-icon" onclick="wm.openWindow('write', 'Write', 500, 400)">
                        ${ICONS.write}
                        <div class="prog-label">Write</div>
                    </div>
                    <div class="prog-icon" onclick="wm.openWindow('winfile', 'File Manager', 500, 350)">
                        ${ICONS.winfile}
                        <div class="prog-label">File Mgr</div>
                    </div>
                    <div class="prog-icon" onclick="wm.openWindow('cardfile', 'Cardfile', 350, 400)">
                        ${ICONS.cardfile}
                        <div class="prog-label">Cardfile</div>
                    </div>
                    <div class="prog-icon" onclick="wm.openWindow('calc', 'Calculator', 220, 250)">
                        ${ICONS.calc}
                        <div class="prog-label">Calculator</div>
                    </div>
                    <div class="prog-icon" onclick="wm.openWindow('mines', 'Minesweeper', 240, 320)">
                        ${ICONS.mines}
                        <div class="prog-label">Minesweeper</div>
                    </div>
                    <div class="prog-icon" onclick="wm.openWindow('solitaire', 'Solitaire', 600, 450)">
                        ${ICONS.solitaire}
                        <div class="prog-label">Solitaire</div>
                    </div>
                    <div class="prog-icon" onclick="wm.openWindow('reversi', 'Reversi', 300, 340)">
                        ${ICONS.reversi}
                        <div class="prog-label">Reversi</div>
                    </div>
                    <div class="prog-icon" onclick="wm.openWindow('paint', 'Paintbrush', 500, 400)">
                        ${ICONS.paint}
                        <div class="prog-label">Paintbrush</div>
                    </div>
                    <div class="prog-icon" onclick="wm.openWindow('mplayer', 'Media Player', 350, 250)">
                        ${ICONS.mplayer}
                        <div class="prog-label">Media Player</div>
                    </div>
                    <div class="prog-icon" onclick="wm.openWindow('soundrec', 'Sound Recorder', 300, 160)">
                        ${ICONS.soundrec}
                        <div class="prog-label">Sound Rec</div>
                    </div>
                    <div class="prog-icon" onclick="wm.openWindow('clock', 'Clock', 250, 250)">
                        ${ICONS.clock}
                        <div class="prog-label">Clock</div>
                    </div>
                    <div class="prog-icon" onclick="wm.openWindow('control', 'Control Panel', 400, 300)">
                        ${ICONS.control}
                        <div class="prog-label">Control</div>
                    </div>
                    <div class="prog-icon" onclick="wm.openWindow('clipbrd', 'Clipboard', 300, 250)">
                        ${ICONS.clipboard}
                        <div class="prog-label">Clipboard</div>
                    </div>
                    <div class="prog-icon" onclick="wm.openWindow('taskman', 'Task List', 320, 350)">
                        ${ICONS.taskman}
                        <div class="prog-label">Task List</div>
                    </div>
                    <div class="prog-icon" onclick="wm.openWindow('database', 'Data Manager', 500, 400)">
                        ${ICONS.database}
                        <div class="prog-label">Data Mgr</div>
                    </div>
                    <div class="prog-icon" onclick="wm.openWindow('compiler', 'Tiny C', 450, 350)">
                        ${ICONS.ccompiler}
                        <div class="prog-label">Tiny C</div>
                    </div>
                    <div class="prog-icon" onclick="wm.openWindow('python', 'Tiny Python', 450, 350)">
                        ${ICONS.python}
                        <div class="prog-label">Python</div>
                    </div>
                    <div class="prog-icon" onclick="wm.openWindow('console', 'Console', 500, 350)">
                        ${ICONS.console}
                        <div class="prog-label">Console</div>
                    </div>
                    <div class="prog-icon" onclick="wm.openWindow('readme', 'Read Me', 350, 400)">
                        ${ICONS.readme}
                        <div class="prog-label">Read Me</div>
                    </div>
                </div>
            `;
  }
  getTaskManContent() {
    return `
                <div class="task-mgr-layout">
                    <div class="task-list" id="task-list">
                        <!-- Populated by JS -->
                    </div>
                    <div class="task-btns">
                        <button class="task-btn" onclick="switchTask(event)">Switch To</button>
                        <button class="task-btn" onclick="endTask(event)">End Task</button>
                        <button class="task-btn" onclick="wm.closeWindow(this.closest('.window').dataset.id)">Cancel</button>
                    </div>
                    <div style="font-weight:bold; border-bottom:1px solid gray; margin-bottom:2px;">System Monitor:</div>
                    <div class="task-queue-view" id="task-queue-view">
                        <!-- Queue Data -->
                    </div>
                </div>
            `;
  }
  // ... [Previous Content Methods] ...
  getReversiContent() {
    return `<div class="reversi-layout"><div class="reversi-status">Your Turn (Red)</div><div class="reversi-board" id="reversi-board"></div></div>`;
  }
  getMediaPlayerContent() {
    return `<div class="mplayer-layout"><div class="mplayer-screen"><canvas id="mplayer-canvas" width="300" height="150" style="width:100%;height:100%"></canvas></div><div class="mplayer-controls"><div class="mplayer-btn" onclick="toggleMedia(this, 'play')">▶</div><div class="mplayer-btn" onclick="toggleMedia(this, 'pause')">||</div><div class="mplayer-btn" onclick="toggleMedia(this, 'stop')">■</div></div></div>`;
  }
  getSolitaireContent() {
    return `<div class="sol-layout"><div class="sol-top"><div class="sol-deck-area"><div class="card-ph" id="sol-stock"></div><div class="card-ph" id="sol-waste"></div></div><div class="sol-foundations"><div class="card-ph" data-suit="h" id="sol-f-h"></div><div class="card-ph" data-suit="d" id="sol-f-d"></div><div class="card-ph" data-suit="c" id="sol-f-c"></div><div class="card-ph" data-suit="s" id="sol-f-s"></div></div></div><div class="sol-tableau" id="sol-tableau"></div></div>`;
  }
  getClipboardContent() {
    return `<textarea class="clip-area" readonly placeholder="(Clipboard is empty)"></textarea>`;
  }
  getWriteContent(txt) {
    return `<div class="write-layout"><div class="write-toolbar"><button class="fmt-btn" data-cmd="bold" title="Bold">B</button><button class="fmt-btn" data-cmd="italic" title="Italic">I</button><button class="fmt-btn" data-cmd="underline" title="Underline">U</button></div><div class="write-editor" contenteditable="true" spellcheck="false">${
      txt || "Welcome to Oriel Write."
    }</div></div>`;
  }
  getCardfileContent() {
    return `<div class="cardfile-layout"><div class="cardfile-menu"><button class="task-btn" id="card-add-btn">Add</button><button class="task-btn" id="card-del-btn">Delete</button></div><div class="card-container"><div class="card-index-list" id="card-index-list"></div><div class="card-body-view"><div class="card-header-bar" id="card-header-display"></div><textarea class="card-content-area" id="card-content-edit"></textarea></div></div></div>`;
  }
  getWinFileContent() {
    return `<div class="winfile-layout"><div class="drive-bar"><div class="drive-icon active">a:</div><div class="drive-icon active">c:</div><div class="drive-icon active">d:</div><div style="flex-grow:1; text-align:right; font-size:12px;display:flex;align-items:center;justify-content:flex-end;gap:5px;"><input type="text" id="new-folder-name" style="width:80px;height:18px;font-size:11px;" placeholder="Folder Name"><button class="task-btn" onclick="createFolder(this)" style="height:20px;font-size:11px;padding:0 4px;">New Dir</button><span>C:\\</span></div></div><div class="winfile-main"><div class="winfile-pane winfile-tree"><div class="winfile-pane-header">C:\\</div><div id="file-tree-root"></div></div><div class="winfile-pane winfile-list"><div class="winfile-pane-header" id="file-list-header">C:\\*.*</div><div class="file-list-view" id="file-list-view"></div></div></div><div class="status-bar" style="border-top:1px solid gray; padding:2px; font-size:12px;">Selected 1 file(s) (0 bytes)</div></div>`;
  }
  getSoundRecContent() {
    return `<div class="sound-rec-layout"><div class="sound-vis"><canvas class="sound-wave-canvas" width="246" height="56"></canvas></div><div class="sound-controls"><div class="media-btn" id="btn-rec" title="Record"><div class="symbol-rec"></div></div><div class="media-btn" id="btn-stop" title="Stop"><div class="symbol-stop"></div></div><div class="media-btn" id="btn-play" title="Play"><div class="symbol-play"></div></div></div><div style="margin-top:5px; font-size:12px;" id="sound-status">Ready</div></div>`;
  }
  getCharMapContent() {
    return `<div class="char-map-layout"><div class="char-grid" id="char-grid"></div><div class="char-controls"><label>Characters to copy:</label><div class="copy-row"><input type="text" class="char-input" id="char-copy-input" readonly><button class="task-btn" onclick="copyCharMap(this)" style="width:60px">Copy</button></div><button class="task-btn" onclick="document.getElementById('char-copy-input').value = ''">Clear</button></div></div>`;
  }
  getClockContent() {
    return `<div class="clock-layout" title="Double click to toggle mode"><canvas class="clock-canvas" width="200" height="200"></canvas><div class="clock-digital" style="display:none">12:00</div></div>`;
  }
  getControlPanelContent() {
    return `<div class="control-layout" id="cp-main"><div class="control-icon" onclick="openCPColor(this)">${ICONS.cp_color}<div class="control-label">Color</div></div><div class="control-icon" onclick="openCPDesktop(this)">${ICONS.desktop_cp}<div class="control-label">Desktop</div></div><div class="control-icon"><svg viewBox="0 0 32 32" class="svg-icon"><rect x="4" y="8" width="24" height="16" fill="none" stroke="black"/><text x="16" y="20" font-family="serif" font-size="10" text-anchor="middle">ABC</text></svg><div class="control-label">Fonts</div></div><div class="control-icon"><svg viewBox="0 0 32 32" class="svg-icon"><rect x="10" y="6" width="12" height="20" fill="none" stroke="black"/><circle cx="16" cy="12" r="2" fill="black"/></svg><div class="control-label">Mouse</div></div><div class="control-icon"><svg viewBox="0 0 32 32" class="svg-icon"><rect x="2" y="10" width="28" height="12" fill="none" stroke="black"/></svg><div class="control-label">Keyboard</div></div></div>`;
  }
  getNotepadContent(txt) {
    return `<textarea class="notepad-area" spellcheck="false">${
      txt || "Welcome to Oriel 1.0!"
    }</textarea>`;
  }
  getCompilerContent() {
    return `<div class="compiler-layout"><div class="compiler-toolbar"><button class="compiler-btn" onclick="runCompiler(event)">RUN</button></div><textarea class="compiler-editor" spellcheck="false">#include <stdio.h>\n\nint main() {\n    printf("Hello from C!");\n    return 0;\n}</textarea><div class="compiler-output" id="compiler-out"></div></div>`;
  }
  getPythonContent() {
    return `<div class="compiler-layout"><div class="compiler-toolbar"><button class="compiler-btn" onclick="runPython(event)">RUN</button></div><textarea class="compiler-editor" spellcheck="false">print("Hello Python!")\nfor i in range(3):\n    print(i)</textarea><div class="compiler-output" id="python-out"></div></div>`;
  }
  getConsoleContent() {
    return `<div class="console" onclick="document.querySelector('.window.active .console-input')?.focus()"><div>Egg Oriel 1.0</div><br><div class="console-output"></div><div class="console-line"><span>C:\\WINDOWS></span><input type="text" class="console-input" onkeydown="handleConsoleKey(event)" autocomplete="off" autofocus></div></div>`;
  }
  getMinesContent() {
    return `<div style="background:#c0c0c0; height:100%; display:flex; flex-direction:column; align-items:center;"><div class="mines-bar" style="width:200px"><div class="mines-lcd">010</div><div class="mines-face" id="mines-face" onclick="resetMines()">:)</div><div class="mines-lcd">000</div></div><div class="mines-grid" id="mines-grid"></div></div>`;
  }
  getReadmeContent() {
    return `<div style="padding:15px; font-family:'Times New Roman', serif;"><h2>Welcome to Web 3.1</h2><p>Features: Solitaire, Reversi, Media Player, Clock, etc.</p></div>`;
  }
  getCalcContent() {
    return `<div class="calc-grid"><div class="calc-display" id="calc-disp" data-val="0">0</div><div class="calc-btn" onclick="calcInput(event, 'C')">C</div><div class="calc-btn" onclick="calcInput(event, '/')">/</div><div class="calc-btn" onclick="calcInput(event, '*')">*</div><div class="calc-btn" onclick="calcInput(event, '-')">-</div><div class="calc-btn" onclick="calcInput(event, '7')">7</div><div class="calc-btn" onclick="calcInput(event, '8')">8</div><div class="calc-btn" onclick="calcInput(event, '9')">9</div><div class="calc-btn op" onclick="calcInput(event, '+')">+</div><div class="calc-btn" onclick="calcInput(event, '4')">4</div><div class="calc-btn" onclick="calcInput(event, '5')">5</div><div class="calc-btn" onclick="calcInput(event, '6')">6</div><div class="calc-btn op" style="grid-row:span 2" onclick="calcInput(event, '=')">=</div><div class="calc-btn" onclick="calcInput(event, '1')">1</div><div class="calc-btn" onclick="calcInput(event, '2')">2</div><div class="calc-btn" onclick="calcInput(event, '3')">3</div><div class="calc-btn" style="grid-column: span 2" onclick="calcInput(event, '0')">0</div><div class="calc-btn" onclick="calcInput(event, '.')">.</div></div>`;
  }
  getTaskManContent() {
    return `<div class="task-mgr-layout"><div class="task-list" id="task-list"></div><div class="task-btns"><button class="task-btn" onclick="switchTask(event)">Switch To</button><button class="task-btn" onclick="endTask(event)">End Task</button><button class="task-btn" onclick="wm.closeWindow(this.closest('.window').dataset.id)">Cancel</button></div><div style="font-weight:bold; border-bottom:1px solid gray; margin-bottom:2px;">System Monitor:</div><div class="task-queue-view" id="task-queue-view"></div></div>`;
  }
  getPaintContent() {
    return `<div class="paint-layout"><div class="paint-main"><div class="paint-tools"><div class="tool-btn active" data-tool="brush" onclick="selectPaintTool(this, 'brush')">✎</div><div class="tool-btn" data-tool="eraser" onclick="selectPaintTool(this, 'eraser')">E</div><div class="tool-btn" style="color:red; font-size:12px;" onclick="clearPaint(this)">CLR</div></div><div class="paint-canvas-container"><canvas class="paint-canvas" width="600" height="400"></canvas></div></div><div class="paint-palette" id="paint-palette"></div></div>`;
  }
  getDatabaseContent() {
    return `<div class="db-layout"><div class="db-form"><div class="db-input-group"><label>Name</label><input type="text" class="db-input" id="db-name"></div><div class="db-input-group"><label>Phone</label><input type="text" class="db-input" id="db-phone"></div><div class="db-input-group"><label>Email</label><input type="text" class="db-input" id="db-email"></div><button class="task-btn" onclick="addDbRecord(this)">Add Record</button></div><div class="db-grid-container"><table class="db-table"><thead><tr><th>Name</th><th>Phone</th><th>Email</th><th style="width:50px">Action</th></tr></thead><tbody id="db-tbody"></tbody></table></div></div>`;
  }
}
const wm = new WindowManager();
// --- SCREENSAVER LOGIC ---
let saverActive = false;
let idleTime = 0;
const saverCanvas = document.getElementById("saver-canvas");
const sCtx = saverCanvas.getContext("2d");
const screensaverDiv = document.getElementById("screensaver");
// Starfield vars
let stars = [];
const numStars = 100;
let sInterval = null;

function initScreensaver() {
  saverCanvas.width = window.innerWidth;
  saverCanvas.height = window.innerHeight;
  // Populate stars
  for (let i = 0; i < numStars; i++) {
    stars.push({
      x: Math.random() * saverCanvas.width,
      y: Math.random() * saverCanvas.height,
      z: Math.random() * saverCanvas.width
    });
  }
  // Global Listeners
  document.body.addEventListener("mousemove", resetTimer);
  document.body.addEventListener("keydown", resetTimer);
  document.body.addEventListener("mousedown", resetTimer);
  // Timer Check
  setInterval(() => {
    idleTime++;
    if (idleTime > 60 && !saverActive) startScreensaver(); // 60s trigger
  }, 1000);
}

function resetTimer() {
  idleTime = 0;
  if (saverActive) stopScreensaver();
}

function startScreensaver() {
  saverActive = true;
  screensaverDiv.style.display = "block";
  sInterval = setInterval(drawStars, 30);
}

function stopScreensaver() {
  saverActive = false;
  screensaverDiv.style.display = "none";
  clearInterval(sInterval);
}

function drawStars() {
  sCtx.fillStyle = "black";
  sCtx.fillRect(0, 0, saverCanvas.width, saverCanvas.height);
  sCtx.fillStyle = "white";
  for (let i = 0; i < numStars; i++) {
    let s = stars[i];
    s.z -= 10;
    if (s.z <= 0) {
      s.x = Math.random() * saverCanvas.width;
      s.y = Math.random() * saverCanvas.height;
      s.z = saverCanvas.width;
    }
    let k = 128.0 / s.z;
    let px = (s.x - saverCanvas.width / 2) * k + saverCanvas.width / 2;
    let py = (s.y - saverCanvas.height / 2) * k + saverCanvas.height / 2;
    if (
      px >= 0 &&
      px <= saverCanvas.width &&
      py >= 0 &&
      py <= saverCanvas.height
    ) {
      let size = (1 - s.z / saverCanvas.width) * 3;
      sCtx.fillRect(px, py, size, size);
    }
  }
}
// --- CONTROL PANEL: DESKTOP ---
function openCPDesktop(el) {
  const w = el.closest(".window");
  w.querySelector(".window-body").innerHTML = `
            <div class="cp-settings-layout">
                <div class="cp-section">
                    <div style="font-weight:bold;margin-bottom:5px;">Desktop Wallpaper</div>
                    <label style="display:block;font-size:12px;">Image URL:</label>
                    <input type="text" id="bg-url" style="width:100%;margin-bottom:10px;">
                    
                    <label style="display:block;font-size:12px;">Display:</label>
                    <select id="bg-mode" style="width:100%;margin-bottom:10px;">
                        <option value="tile">Tile</option>
                        <option value="center">Center</option>
                        <option value="cover">Stretch (Cover)</option>
                    </select>

                    <div style="text-align:right;">
                        <button class="task-btn" onclick="setWallpaper()">Apply</button>
                        <button class="task-btn" onclick="wm.closeWindow('${w.dataset.id}')">Close</button>
                    </div>
                </div>
            </div>
        `;
}

function setWallpaper() {
  const url = document.getElementById("bg-url").value;
  const mode = document.getElementById("bg-mode").value;
  const body = document.body;
  if (url) {
    body.style.backgroundImage = `url('${url}')`;
    if (mode === "tile") {
      body.style.backgroundSize = "auto";
      body.style.backgroundRepeat = "repeat";
    } else if (mode === "center") {
      body.style.backgroundSize = "auto";
      body.style.backgroundRepeat = "no-repeat";
      body.style.backgroundPosition = "center";
    } else if (mode === "cover") {
      body.style.backgroundSize = "cover";
      body.style.backgroundRepeat = "no-repeat";
      body.style.backgroundPosition = "center";
    }
  } else {
    body.style.backgroundImage = "none";
  }
}
// --- TASK MANAGER & SCHEDULER LOGIC ---
let selT = {};

function initTaskMan(win) {
  refreshTaskList(win.querySelector("#task-list"), win.dataset.id);
  refreshProcessView(win.querySelector("#task-queue-view"));
}

function refreshAllTaskManagers() {
  document.querySelectorAll(".window").forEach((w) => {
    if (w.dataset.type === "Task List") {
      const list = w.querySelector("#task-list");
      if (list) refreshTaskList(list, w.dataset.id);
    }
  });
}

function refreshAllProcessViews() {
  document.querySelectorAll(".window").forEach((w) => {
    if (w.dataset.type === "Task List") {
      const view = w.querySelector("#task-queue-view");
      if (view) refreshProcessView(view);
    }
  });
}

function refreshTaskList(listEl, winId) {
  listEl.innerHTML = "";
  wm.windows.forEach((w) => {
    const item = document.createElement("div");
    item.className = "task-item " + (selT[winId] === w.id ? "selected" : "");
    item.innerText = w.title;
    item.onclick = () => {
      selT[winId] = w.id;
      refreshTaskList(listEl, winId);
    };
    listEl.appendChild(item);
  });
}

function refreshProcessView(viewEl) {
  viewEl.innerHTML =
    '<div class="queue-header">PID  | PRI | STATE   | CPU TIME</div>';
  kernel.processes.forEach((p) => {
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

function switchTask(e) {
  const winId = e.target.closest(".window").dataset.id;
  const targetId = selT[winId];
  if (targetId) {
    wm.restoreWindow(targetId);
    wm.focusWindow(targetId);
    wm.closeWindow(winId);
  }
}

function endTask(e) {
  const winId = e.target.closest(".window").dataset.id;
  const targetId = selT[winId];
  if (targetId) wm.closeWindow(targetId);
}
// --- OTHER LOGIC (Preserved) ---
function initReversi(w) {
  /* ... */
}

function initMediaPlayer(w) {
  /* ... */
}

function initSolitaire(w) {
  /* ... */
}

function initWrite(w) {
  /* ... */
}

function initCardfile(w) {
  /* ... */
}

function initClock(w) {
  /* ... */
}

function initControlPanel(w) {}

function openCPColor(e) {
  const w = e.closest(".window");
  w.querySelector(
    ".window-body"
  ).innerHTML = `<div class="cp-settings-layout"><div class="cp-section"><select id="cs-sel" style="width:100%"><option value="d">Default</option><option value="h">Hot Dog</option><option value="p">Plasma</option></select><button class="task-btn" onclick="applyTheme()">Apply</button></div></div>`;
}

function applyTheme() {
  const v = document.getElementById("cs-sel").value,
    r = document.documentElement.style;
  if (v === "h") {
    r.setProperty("--win-teal", "red");
    r.setProperty("--win-gray", "yellow");
  } else if (v === "p") {
    r.setProperty("--win-teal", "#400040");
    r.setProperty("--win-gray", "#C0C0C0");
  } else {
    r.setProperty("--win-teal", "#008080");
    r.setProperty("--win-gray", "#C0C0C0");
  }
}

function initFileManager(w) {
  w.cP = "C:\\";
  w.cD = MOCK_FS["C:\\"];
  rFT(w);
  rFL(w);
}

function rFT(w) {
  const r = w.querySelector("#file-tree-root");
  r.innerHTML = "";
  const b = (c, p, o) => {
    const d = document.createElement("div");
    d.className = "tree-item " + (w.cP === p ? "selected" : "");
    d.innerHTML =
      ICONS.folder + `<span>${p.split("\\").pop() || "C:\\"}</span>`;
    d.onclick = (e) => {
      e.stopPropagation();
      w.cP = p;
      w.cD = o;
      rFT(w);
      rFL(w);
    };
    c.appendChild(d);
    if (o.children) {
      const s = document.createElement("div");
      s.style.paddingLeft = "15px";
      Object.keys(o.children).forEach((k) => {
        if (o.children[k].type === "dir")
          b(s, p === "C:\\" ? p + k : p + "\\" + k, o.children[k]);
      });
      c.appendChild(s);
    }
  };
  b(r, "C:\\", MOCK_FS["C:\\"]);
}

function rFL(w) {
  const v = w.querySelector("#file-list-view");
  w.querySelector("#file-list-header").innerText = w.cP + "*.*";
  v.innerHTML = "";
  if (w.cD && w.cD.children)
    Object.keys(w.cD.children).forEach((k) => {
      const i = w.cD.children[k],
        r = document.createElement("div");
      r.className = "file-item";
      r.innerHTML =
        (i.type === "file"
          ? k.endsWith(".EXE")
            ? ICONS.file_exe
            : ICONS.file_txt
          : ICONS.folder) + `<span>${k}</span>`;
      r.ondblclick = () => {
        if (i.app)
          wm.openWindow(i.app, i.app.toUpperCase(), 400, 300, i.content);
      };
      r.onclick = () => {
        w.querySelectorAll(".file-item").forEach((x) =>
          x.classList.remove("selected")
        );
        r.classList.add("selected");
      };
      v.appendChild(r);
    });
}
// Create Folder Function
function createFolder(btn) {
  const win = btn.closest(".window");
  const input = win.querySelector("#new-folder-name");
  const name = input.value.trim();
  if (name && win.currentDirObj) {
    if (win.currentDirObj.children[name]) {
      alert("Folder already exists!");
      return;
    }
    win.currentDirObj.children[name] = {
      type: "dir",
      children: {}
    };
    input.value = "";
    rFT(win);
    rFL(win);
  }
}

function initSoundRecorder(w) {
  /* shortened */
  const bR = w.querySelector("#btn-rec");
  bR.onclick = () => {
    w.querySelector("#sound-status").innerText = "Recording (Fake)...";
  };
}

function initCharMap(w) {
  const g = w.querySelector("#char-grid"),
    ip = w.querySelector("#char-copy-input");
  for (let i = 32; i < 256; i++) {
    const c = String.fromCharCode(i),
      d = document.createElement("div");
    d.className = "char-cell";
    d.innerText = c;
    d.onclick = () => {
      ip.value += c;
    };
    g.appendChild(d);
  }
}

function copyCharMap(b) {
  b.closest(".window").querySelector("input").select();
  document.execCommand("copy");
}

function initDatabase(w) {
  const d = localStorage.getItem("w31-db");
  w.dbData = d
    ? JSON.parse(d)
    : [
        {
          id: 1,
          name: "Bill",
          phone: "555-0199",
          email: "b@ms.com"
        }
      ];
  renderDbTable(w);
}

function renderDbTable(w) {
  const t = w.querySelector("#db-tbody");
  t.innerHTML = "";
  w.dbData.forEach((r, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${r.name}</td><td>${r.phone}</td><td>${r.email}</td><td><button onclick="deleteDbRecord(this,${i})">X</button></td>`;
    t.appendChild(tr);
  });
}

function addDbRecord(b) {
  const w = b.closest(".window"),
    n = w.querySelector("#db-name"),
    p = w.querySelector("#db-phone"),
    e = w.querySelector("#db-email");
  if (!n.value) return;
  w.dbData.push({
    name: n.value,
    phone: p.value,
    email: e.value
  });
  localStorage.setItem("w31-db", JSON.stringify(w.dbData));
  n.value = "";
  p.value = "";
  e.value = "";
  renderDbTable(w);
}

function deleteDbRecord(b, i) {
  const w = b.closest(".window");
  w.dbData.splice(i, 1);
  localStorage.setItem("w31-db", JSON.stringify(w.dbData));
  renderDbTable(w);
}

function initPaint(w) {
  /* ... */
}

function selectPaintTool(e, t) {
  /* ... */
}

function clearPaint(e) {
  /* ... */
}

function handleConsoleKey(e) {
  if (e.key === "Enter") e.target.value = "";
}

function runCompiler(e) {
  const win = e?.target?.closest(".window") || document.querySelector(".window.active");
  const output = win?.querySelector("#compiler-out");
  const editor = win?.querySelector(".compiler-editor");

  if (!output) return;

  const lines = [];
  try {
    const code = editor?.value || "";
    if (!code.trim()) {
      lines.push("No source code provided.");
    } else {
      lines.push("Compiling Tiny C...");
      if (!/int\s+main\s*\(/.test(code)) {
        throw new Error("error: missing int main() entry point");
      }
      lines.push("Build succeeded.");
      const printfMatch = code.match(/printf\s*\(\s*\"([^\"]*)\"/);
      const programOutput = printfMatch ? printfMatch[1] : "(no output)";
      lines.push("Program output:");
      lines.push(programOutput);
    }
  } catch (err) {
    lines.push(`Compilation failed: ${err.message}`);
  }

  output.innerHTML = `<pre>${lines.join("\n")}</pre>`;
}

function runPython(e) {
  const win = e?.target?.closest(".window") || document.querySelector(".window.active");
  const output = win?.querySelector("#python-out");
  const editor = win?.querySelector(".compiler-editor");

  if (!output) return;

  const lines = [];
  try {
    const code = editor?.value || "";
    if (!code.trim()) {
      lines.push("No script provided.");
    } else {
      lines.push("Running Python 1.0 interpreter...");
      const printRegex = /print\s*\(([^\)]*)\)/g;
      const printed = [];
      let match;
      while ((match = printRegex.exec(code))) {
        const raw = match[1].trim();
        const textMatch = raw.match(/^\s*["'`](.*)["'`]\s*$/);
        printed.push(textMatch ? textMatch[1] : raw);
      }
      lines.push("Program output:");
      lines.push(printed.length ? printed.join("\n") : "(no output)");
    }
  } catch (err) {
    lines.push(`Execution failed: ${err.message}`);
  }

  output.innerHTML = `<pre>${lines.join("\n")}</pre>`;
}

function calcInput(e, v) {
  const d = e.target.closest(".window").querySelector("#calc-disp"),
    val = d.dataset.val;
  if (v === "C") d.dataset.val = "0";
  else if (v === "=") {
    try {
      d.dataset.val = eval(val).toString();
    } catch {
      d.dataset.val = "Err";
    }
  } else d.dataset.val = val === "0" && !"+-*/".includes(v) ? v : val + v;
  d.innerText = d.dataset.val;
}
let mines = [];

function initMinesweeper(w) {
  resetMines(w);
}

function resetMines(w) {
  const g = (w || document.querySelector(".window.active")).querySelector(
    "#mines-grid"
  );
  g.innerHTML = "";
  mines = [];
  for (let i = 0; i < 81; i++) {
    const c = document.createElement("div");
    c.className = "mine-cell";
    c.onclick = () => clickMine(i, g);
    g.appendChild(c);
    mines.push({
      m: Math.random() < 0.15,
      r: false
    });
  }
}

function clickMine(i, g) {
  if (mines[i].r) return;
  mines[i].r = true;
  g.children[i].classList.add("revealed");
  if (mines[i].m) {
    g.children[i].style.background = "red";
    g.children[i].innerText = "*";
  } else {
    let n = 0;
    [-1, 0, 1].forEach((r) =>
      [-1, 0, 1].forEach((c) => {
        if (
          i + r * 9 + c >= 0 &&
          i + r * 9 + c < 81 &&
          Math.abs((i % 9) - ((i + r * 9 + c) % 9)) <= 1 &&
          mines[i + r * 9 + c].m
        )
          n++;
      })
    );
    if (n) {
      g.children[i].innerText = n;
      g.children[i].style.color = ["blue", "green", "red"][n - 1];
    }
  }
}
// -- Restoration of compressed functions --
// Reversi
function initReversi(win) {
  const b = win.querySelector("#reversi-board"),
    s = win.querySelector(".reversi-status");
  let bd = Array(8)
      .fill()
      .map(() => Array(8).fill(0)),
    t = 1;
  bd[3][3] = 2;
  bd[3][4] = 1;
  bd[4][3] = 1;
  bd[4][4] = 2;
  const rn = () => {
    b.innerHTML = "";
    bd.forEach((r, ri) => {
      r.forEach((c, ci) => {
        const d = document.createElement("div");
        d.className = "reversi-cell";
        if (c !== 0) {
          const p = document.createElement("div");
          p.className = "reversi-piece " + (c === 1 ? "red" : "blue");
          d.appendChild(p);
        }
        d.onclick = () => {
          if (t === 1) mv(ri, ci, 1);
        };
        b.appendChild(d);
      });
    });
    s.innerText = t === 1 ? "Your Turn (Red)" : "Computer Thinking...";
  };
  const iv = (r, c, cl) => {
    if (bd[r][c] !== 0) return false;
    const o = cl === 1 ? 2 : 1,
      ds = [
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [0, -1],
        [0, 1],
        [1, -1],
        [1, 0],
        [1, 1]
      ];
    for (let d of ds) {
      let nr = r + d[0],
        nc = c + d[1],
        f = 0;
      while (nr >= 0 && nr < 8 && nc >= 0 && nc < 8 && bd[nr][nc] === o) {
        nr += d[0];
        nc += d[1];
        f++;
      }
      if (f > 0 && nr >= 0 && nr < 8 && nc >= 0 && nc < 8 && bd[nr][nc] === cl)
        return true;
    }
    return false;
  };
  const mv = (r, c, cl) => {
    if (!iv(r, c, cl)) return;
    bd[r][c] = cl;
    const o = cl === 1 ? 2 : 1,
      ds = [
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [0, -1],
        [0, 1],
        [1, -1],
        [1, 0],
        [1, 1]
      ];
    ds.forEach((d) => {
      let nr = r + d[0],
        nc = c + d[1],
        p = [];
      while (nr >= 0 && nr < 8 && nc >= 0 && nc < 8 && bd[nr][nc] === o) {
        p.push([nr, nc]);
        nr += d[0];
        nc += d[1];
      }
      if (
        p.length > 0 &&
        nr >= 0 &&
        nr < 8 &&
        nc >= 0 &&
        nc < 8 &&
        bd[nr][nc] === cl
      ) {
        p.forEach((x) => (bd[x[0]][x[1]] = cl));
      }
    });
    t = o;
    rn();
    if (t === 2) setTimeout(cm, 500);
  };
  const cm = () => {
    let ms = [];
    for (let r = 0; r < 8; r++)
      for (let c = 0; c < 8; c++) if (iv(r, c, 2)) ms.push([r, c]);
    if (ms.length > 0) {
      const m = ms[Math.floor(Math.random() * ms.length)];
      mv(m[0], m[1], 2);
    } else {
      t = 1;
      rn();
    }
  };
  rn();
}
// Solitaire
function initSolitaire(w) {
  /* ... (Assuming Solitaire Logic from previous turn is correctly injected or preserved if file was edited) ... */
}
// Paint
function initPaint(w) {
  const c = w.querySelector("canvas"),
    ctx = c.getContext("2d"),
    p = w.querySelector("#paint-palette");
  w.pS = {
    d: false,
    t: "brush",
    c: "#000",
    lx: 0,
    ly: 0
  };
  ctx.fillStyle = "#FFF";
  ctx.fillRect(0, 0, c.width, c.height);
  const cols = [
    "#000",
    "#FFF",
    "#808080",
    "#C0C0C0",
    "#800000",
    "#F00",
    "#808000",
    "#FF0",
    "#008000",
    "#0F0",
    "#008080",
    "#0FF",
    "#000080",
    "#00F",
    "#800080",
    "#F0F"
  ];
  cols.forEach((x) => {
    const s = document.createElement("div");
    s.className = "color-swatch";
    s.style.background = x;
    s.onclick = () => {
      w.querySelectorAll(".color-swatch").forEach((z) =>
        z.classList.remove("active")
      );
      s.classList.add("active");
      w.pS.c = x;
    };
    p.appendChild(s);
  });
  c.onmousedown = (e) => {
    w.pS.d = true;
    const r = c.getBoundingClientRect();
    w.pS.lx = e.clientX - r.left;
    w.pS.ly = e.clientY - r.top;
  };
  c.onmousemove = (e) => {
    if (!w.pS.d) return;
    const r = c.getBoundingClientRect(),
      x = e.clientX - r.left,
      y = e.clientY - r.top;
    ctx.beginPath();
    ctx.moveTo(w.pS.lx, w.pS.ly);
    ctx.lineTo(x, y);
    ctx.strokeStyle = w.pS.t === "eraser" ? "#FFF" : w.pS.c;
    ctx.lineWidth = w.pS.t === "eraser" ? 10 : 2;
    ctx.stroke();
    w.pS.lx = x;
    w.pS.ly = y;
  };
  window.onmouseup = () => {
    if (w.pS) w.pS.d = false;
  };
}

function selectPaintTool(el, t) {
  const w = el.closest(".window");
  w.querySelectorAll(".tool-btn").forEach((b) => b.classList.remove("active"));
  el.classList.add("active");
  w.pS.t = t;
}

function clearPaint(el) {
  const c = el.closest(".window").querySelector("canvas");
  c.getContext("2d").fillRect(0, 0, c.width, c.height);
}
// Media Player
function initMediaPlayer(win) {
  const cv = win.querySelector("#mplayer-canvas"),
    ctx = cv.getContext("2d");
  let i = null,
    x = 50,
    y = 50,
    dx = 2,
    dy = 2;

  function a() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, cv.width, cv.height);
    ctx.fillStyle = "#0F0";
    ctx.font = "20px Arial";
    ctx.fillText("DVD", x, y);
    x += dx;
    y += dy;
    if (x < 0 || x > cv.width - 40) dx = -dx;
    if (y < 20 || y > cv.height) dy = -dy;
  }
  win.toggleMedia = (b, act) => {
    if (act === "play") {
      if (!i) i = setInterval(a, 30);
    } else if (act === "pause") {
      clearInterval(i);
      i = null;
    } else {
      clearInterval(i);
      i = null;
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, cv.width, cv.height);
      x = 50;
      y = 50;
    }
  };
  window.toggleMedia = win.toggleMedia;
}
// Write
function initWrite(win) {
  win.querySelectorAll(".fmt-btn").forEach((b) => {
    b.onclick = () => {
      document.execCommand(b.dataset.cmd, false, null);
      win.querySelector(".write-editor").focus();
    };
  });
}
// Cardfile
function initCardfile(win) {
  const k = "w31-cards",
    s = localStorage.getItem(k);
  win.cards = s
    ? JSON.parse(s)
    : [
        {
          id: 1,
          header: "Welcome",
          content: "This is Cardfile."
        }
      ];
  if (win.cards.length === 0)
    win.cards.push({
      id: Date.now(),
      header: "New Card",
      content: ""
    });
  win.activeCardId = win.cards[0].id;
  const l = win.querySelector("#card-index-list"),
    h = win.querySelector("#card-header-display"),
    c = win.querySelector("#card-content-edit");
  const r = () => {
    win.cards.sort((a, b) => a.header.localeCompare(b.header));
    l.innerHTML = "";
    let act = win.cards.find((x) => x.id === win.activeCardId) || win.cards[0];
    win.activeCardId = act.id;
    win.cards.forEach((x) => {
      const i = document.createElement("div");
      i.className = "card-index-item " + (x.id === act.id ? "active" : "");
      i.innerText = x.header;
      i.onclick = () => {
        sv();
        win.activeCardId = x.id;
        r();
      };
      l.appendChild(i);
    });
    h.innerText = act.header;
    c.value = act.content;
  };
  const sv = () => {
    const a = win.cards.find((x) => x.id === win.activeCardId);
    if (a) {
      a.content = c.value;
      localStorage.setItem(k, JSON.stringify(win.cards));
    }
  };
  win.querySelector("#card-add-btn").onclick = () => {
    win.cards.push({
      id: Date.now(),
      header: "New Card",
      content: ""
    });
    sv();
    r();
  };
  win.querySelector("#card-del-btn").onclick = () => {
    const i = win.cards.findIndex((x) => x.id === win.activeCardId);
    if (i > -1) {
      win.cards.splice(i, 1);
      if (win.cards.length === 0)
        win.cards.push({
          id: Date.now(),
          header: "Empty",
          content: ""
        });
      sv();
      r();
    }
  };
  h.ondblclick = () => {
    const a = win.cards.find((x) => x.id === win.activeCardId);
    if (a) {
      const i = document.createElement("input");
      i.value = a.header;
      h.innerHTML = "";
      h.appendChild(i);
      i.focus();
      i.onblur = () => {
        a.header = i.value || "Untitled";
        sv();
        r();
      };
      i.onkeydown = (e) => {
        if (e.key === "Enter") i.blur();
      };
    }
  };
  c.oninput = sv;
  r();
}
// Solitaire (Full Logic needed)
function initSolitaire(win) {
  const SUITS = ["h", "d", "c", "s"],
    RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  let stock = [],
    waste = [],
    f = {
      h: [],
      d: [],
      c: [],
      s: []
    },
    t = [[], [], [], [], [], [], []],
    sel = null;
  const cD = () => {
    const d = [];
    SUITS.forEach((s) =>
      RANKS.forEach((r, i) =>
        d.push({
          s: s,
          r: r,
          v: i + 1,
          u: false,
          c: s === "h" || s === "d" ? "red" : "black"
        })
      )
    );
    for (let i = d.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [d[i], d[j]] = [d[j], d[i]];
    }
    return d;
  };
  const deal = () => {
    stock = cD();
    t = [[], [], [], [], [], [], []];
    for (let i = 0; i < 7; i++) {
      for (let j = i; j < 7; j++) {
        const c = stock.pop();
        if (i === j) c.u = true;
        t[j].push(c);
      }
    }
    render();
  };
  const elS = win.querySelector("#sol-stock"),
    elW = win.querySelector("#sol-waste"),
    elT = win.querySelector("#sol-tableau"),
    elF = {
      h: win.querySelector("#sol-f-h"),
      d: win.querySelector("#sol-f-d"),
      c: win.querySelector("#sol-f-c"),
      s: win.querySelector("#sol-f-s")
    };
  const rC = (c, cb) => {
    const d = document.createElement("div");
    d.className = "card " + (c.u ? c.c : "back");
    if (sel && sel.card === c) d.classList.add("selected");
    if (c.u) {
      d.innerHTML = `<div style="text-align:left">${
        c.r
      }</div><div class="card-center">${
        { h: "♥", d: "♦", c: "♣", s: "♠" }[c.s]
      }</div><div style="text-align:right">${c.r}</div>`;
    }
    d.onclick = (e) => {
      e.stopPropagation();
      cb();
    };
    return d;
  };
  const render = () => {
    elS.innerHTML = "";
    if (stock.length > 0)
      elS.appendChild(
        rC(
          {
            u: false
          },
          () => {
            if (stock.length > 0) {
              const c = stock.pop();
              c.u = true;
              waste.push(c);
              sel = null;
              render();
            }
          }
        )
      );
    else
      elS.onclick = () => {
        while (waste.length > 0) {
          const c = waste.pop();
          c.u = false;
          stock.push(c);
        }
        sel = null;
        render();
      };
    elW.innerHTML = "";
    if (waste.length > 0) {
      const top = waste[waste.length - 1];
      elW.appendChild(rC(top, () => sC(top, "waste")));
    }
    SUITS.forEach((s) => {
      elF[s].innerHTML = "";
      if (f[s].length > 0) {
        const top = f[s][f[s].length - 1];
        const d = rC(top, () => tryF(s));
        d.style.position = "static";
        elF[s].appendChild(d);
      } else {
        elF[
          s
        ].innerHTML = `<div style="text-align:center;color:#006000;margin-top:35px;font-size:24px;">${
          { h: "♥", d: "♦", c: "♣", s: "♠" }[s]
        }</div>`;
        elF[s].onclick = () => tryF(s);
      }
    });
    elT.innerHTML = "";
    t.forEach((col, ci) => {
      const cd = document.createElement("div");
      cd.className = "sol-col";
      cd.onclick = () => tryT(ci);
      col.forEach((c, i) => {
        const d = rC(c, () => {
          if (c.u) sC(c, "tableau", ci, i);
          else if (i === col.length - 1) {
            c.u = true;
            render();
          }
        });
        d.style.top = i * 25 + "px";
        cd.appendChild(d);
      });
      elT.appendChild(cd);
    });
  };
  const sC = (c, l, col, idx) => {
    if (sel && sel.card === c) sel = null;
    else
      sel = {
        card: c,
        loc: l,
        col: col,
        idx: idx
      };
    render();
  };
  const tryT = (toCol) => {
    if (!sel) return;
    const dest = t[toCol],
      mc = sel.card;
    let v = false;
    if (dest.length === 0) {
      if (mc.r === "K") v = true;
    } else {
      const top = dest[dest.length - 1];
      if (top.c !== mc.c && top.v === mc.v + 1) v = true;
    }
    if (v) {
      let mov = [];
      if (sel.loc === "waste") mov.push(waste.pop());
      else mov = t[sel.col].splice(sel.idx);
      t[toCol].push(...mov);
      sel = null;
      render();
    }
  };
  const tryF = (s) => {
    if (!sel) return;
    const mc = sel.card,
      p = f[s];
    if (mc.s === s && mc.v === p.length + 1) {
      let cm = false;
      if (sel.loc === "waste") cm = true;
      if (sel.loc === "tableau" && sel.idx === t[sel.col].length - 1) cm = true;
      if (cm) {
        if (sel.loc === "waste") waste.pop();
        else t[sel.col].pop();
        p.push(mc);
        sel = null;
        render();
      }
    }
  };
  deal();
}
// Init Screensaver
window.onload = initScreensaver;
