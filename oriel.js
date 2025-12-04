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
  screensaver: `<svg viewBox="0 0 32 32" class="svg-icon"><rect x="4" y="6" width="24" height="18" rx="2" ry="2" fill="#000" stroke="#0ff"/><circle cx="22" cy="10" r="2" fill="#0ff"/><path d="M8 22c2-4 6-6 10-6s6 1 8 3" stroke="#0ff" stroke-width="2" fill="none"/></svg>`,
  write: `<svg viewBox="0 0 32 32" class="svg-icon"><rect x="6" y="4" width="20" height="24" fill="white" stroke="black"/><text x="16" y="22" font-family="serif" font-size="24" text-anchor="middle" font-weight="bold" fill="blue">A</text><path d="M20 6 l6 6 -2 2 -6 -6 z" fill="#ffff00" stroke="black"/></svg>`,
  cardfile: `<svg viewBox="0 0 32 32" class="svg-icon"><rect x="4" y="8" width="24" height="18" fill="white" stroke="black"/><line x1="4" y1="12" x2="28" y2="12" stroke="black"/><rect x="6" y="4" width="8" height="4" fill="white" stroke="black" style="border-bottom:none;"/></svg>`,
  solitaire: `<svg viewBox="0 0 32 32" class="svg-icon"><rect x="4" y="4" width="16" height="20" fill="white" stroke="black" rx="2"/><text x="8" y="16" font-size="14" fill="red">♥</text><rect x="12" y="8" width="16" height="20" fill="#000080" stroke="white" rx="2"/></svg>`,
  clipboard: `<svg viewBox="0 0 32 32" class="svg-icon"><rect x="6" y="6" width="20" height="22" fill="white" stroke="black"/><rect x="10" y="4" width="12" height="4" fill="#c0c0c0" stroke="black"/><line x1="10" y1="12" x2="22" y2="12" stroke="gray"/><line x1="10" y1="16" x2="22" y2="16" stroke="gray"/></svg>`,
  reversi: `<svg viewBox="0 0 32 32" class="svg-icon"><rect x="4" y="4" width="24" height="24" fill="#008000" stroke="black"/><circle cx="16" cy="16" r="8" fill="red"/><circle cx="16" cy="16" r="4" fill="blue"/></svg>`,
  mplayer: `<svg viewBox="0 0 32 32" class="svg-icon"><path d="M4 6h24v20H4z" fill="#fff" stroke="black"/><rect x="6" y="8" width="20" height="12" fill="black"/><path d="M12 24l8 0l-4 4z" fill="#000"/></svg>`,
  simcity: `<svg viewBox='0 0 32 32' class='svg-icon'><rect x='4' y='12' width='24' height='14' fill='#87ceeb' stroke='black'/><rect x='6' y='18' width='6' height='6' fill='#d3d3d3' stroke='black'/><rect x='14' y='14' width='6' height='10' fill='#a0d468' stroke='black'/><rect x='22' y='16' width='4' height='8' fill='#fdd835' stroke='black'/><rect x='4' y='10' width='24' height='2' fill='#8d6e63'/><rect x='2' y='24' width='28' height='4' fill='#6d4c41'/></svg>`,
  skifree: `<svg viewBox="0 0 32 32" class="svg-icon"><rect x="2" y="2" width="28" height="28" rx="2" fill="#e0f7ff" stroke="black"/><path d="M6 26l20-20" stroke="#000080" stroke-width="2"/><path d="M6 22l12-12" stroke="#000080" stroke-width="2"/><circle cx="16" cy="10" r="3" fill="#ff4040" stroke="black"/><rect x="14" y="13" width="4" height="7" fill="#ffffff" stroke="black"/><path d="M14 16l-4 3" stroke="#000" stroke-width="2"/><path d="M18 16l4 3" stroke="#000" stroke-width="2"/><path d="M14 20l-4 6" stroke="#000" stroke-width="2"/><path d="M18 20l4 6" stroke="#000" stroke-width="2"/></svg>`,
  chess: `<svg viewBox="0 0 32 32" class="svg-icon"><rect x="4" y="4" width="24" height="24" rx="2" ry="2" fill="#fff" stroke="black"/><path d="M12 24h8v2h-8z" fill="#808080" stroke="black"/><path d="M13 20h6v4h-6z" fill="#c0c0c0" stroke="black"/><path d="M14 10c0-2 4-2 4 0v2h2v3H12v-3h2z" fill="#000"/><circle cx="16" cy="8" r="2" fill="#000"/></svg>`,
  browser: `<svg viewBox="0 0 32 32" class="svg-icon"><rect x="4" y="6" width="24" height="20" fill="#c0c0c0" stroke="black"/><circle cx="10" cy="12" r="1" fill="red"/><circle cx="14" cy="12" r="1" fill="gold"/><circle cx="18" cy="12" r="1" fill="lime"/><rect x="6" y="14" width="20" height="10" fill="white" stroke="black"/><path d="M8 20h16" stroke="#000080" stroke-width="2"/><path d="M12 18l-2 2l2 2" stroke="#000080" stroke-width="2" fill="none"/><path d="M20 18l2 2l-2 2" stroke="#000080" stroke-width="2" fill="none"/></svg>`,
  folder: `<svg viewBox="0 0 16 16" class="tiny-icon"><path d="M1 2h6l2 2h6v10H1z" fill="#FFFF00" stroke="black" stroke-width="0.5"/></svg>`,
  file_exe: `<svg viewBox="0 0 16 16" class="tiny-icon"><rect x="2" y="1" width="12" height="14" fill="white" stroke="black" stroke-width="0.5"/><rect x="3" y="2" width="10" height="2" fill="#000080"/></svg>`,
  file_txt: `<svg viewBox="0 0 16 16" class="tiny-icon"><rect x="2" y="1" width="12" height="14" fill="white" stroke="black" stroke-width="0.5"/><line x1="4" y1="4" x2="12" y2="4" stroke="black" stroke-width="0.5"/><line x1="4" y1="7" x2="12" y2="7" stroke="black" stroke-width="0.5"/></svg>`,
  readme: `<svg viewBox="0 0 32 32" class="svg-icon"><rect x="6" y="4" width="20" height="24" fill="white" stroke="black"/><path d="M10 8h12M10 12h12M10 16h12M10 20h8" stroke="black" stroke-width="2"/></svg>`,
  help: `<svg viewBox="0 0 32 32" class="svg-icon"><circle cx="16" cy="16" r="12" fill="#FFFF00" stroke="black"/><text x="16" y="22" font-size="20" text-anchor="middle" font-weight="bold" font-family="serif">?</text></svg>`,
  desktop_cp: `<svg viewBox="0 0 32 32" class="svg-icon"><rect x="2" y="4" width="28" height="20" fill="white" stroke="black"/><rect x="4" y="6" width="24" height="16" fill="cyan"/><rect x="10" y="24" width="12" height="4" fill="gray" stroke="black"/></svg>`,
  pdfreader: `<svg viewBox="0 0 32 32" class="svg-icon"><rect x="6" y="4" width="20" height="24" fill="white" stroke="black"/><path d="M20 4v6h6" fill="#ffdddd" stroke="black"/><rect x="10" y="10" width="12" height="2" fill="#c00"/><path d="M12 14c4 6 8 0 10 8" fill="none" stroke="#c00" stroke-width="2"/><circle cx="12" cy="14" r="2" fill="#fff" stroke="#c00"/></svg>`,
  doom: `<svg viewBox="0 0 32 32" class="svg-icon"><rect x="2" y="2" width="28" height="28" fill="#333" stroke="black"/><path d="M6 16l4-4l4 4l4-8l4 8l4-4" stroke="red" stroke-width="2" fill="none"/><rect x="8" y="22" width="16" height="4" fill="#555"/></svg>`,
};

const DEFAULT_PDF_DATA_URI =
  "data:application/pdf;base64,JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PCAvVHlwZSAvQ2F0YWxvZyAvUGFnZXMgMiAwIFIgPj4KZW5kb2JqCjIgMCBvYmoKPDwgL1R5cGUgL1BhZ2VzIC9LaWRzIFszIDAgUl0gL0NvdW50IDEgPj4KZW5kb2JqCjMgMCBvYmoKPDwgL1R5cGUgL1BhZ2UgL1BhcmVudCAyIDAgUiAvUmVzb3VyY2VzIDw8IC9Gb250IDw8IC9GMCA0IDAgUiA+PiA+PiAvTWVkaWFCb3ggWzAgMCA1OTUuMjggODQxLjg5XSA+PgplbmRvYmoKNCAwIG9iago8PCAvVHlwZSAvRm9udCAvU3VidHlwZSAvVHlwZTEgL05hbWUgL0YwIC9CYXNlRm9udCAvSGVsdmV0aWNhID4+CmVuZG9iagogNSAwIG9iago8PCAvTGVuZ3RoIDY2ID4+CnN0cmVhbQpCVAovRjAgMjQgVGYKMTIwIDcwMCBUZAooSGVsbG8gV29ybGQhKSBUagpFVAplbmRzdHJlYW0KZW5kb2JqCnhyZWYKMCA2CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAxNSAwMDAwMCBuIAowMDAwMDAwMDY3IDAwMDAwIG4gCjAwMDAwMDAxNjMgMDAwMDAgbiAKMDAwMDAwMDI2MiAwMDAwMCBuIAowMDAwMDAwMzQ3IDAwMDAwIG4gCnRyYWlsZXIKPDwgL1NpemUgNiAvUm9vdCAxIDAgUiAvSW5mbyA1IDAgUiA+PgpzdGFydHhyZWYKNDY5CiUlRU9G";

const FS_STORAGE_KEY = "oriel-fs-v1";

const DEFAULT_FS = {
  "C:\\": {
    type: "dir",
    children: {
      ORIEL: {
        type: "dir",
        children: {
          SYSTEM: { type: "dir", children: {} },
          "CALC.EXE": { type: "file", app: "calc" },
          "NOTEPAD.EXE": { type: "file", app: "notepad" },
          "DOOM.EXE": { type: "file", app: "doom" },
          "WRITE.EXE": { type: "file", app: "write" },
          "CARDFILE.EXE": { type: "file", app: "cardfile" },
          "WINMINE.EXE": { type: "file", app: "mines" },
          "CHESS.EXE": { type: "file", app: "chess" },
          "SOL.EXE": { type: "file", app: "solitaire" },
          "REVERSI.EXE": { type: "file", app: "reversi" },
          "PBRUSH.EXE": { type: "file", app: "paint" },
          "MPLAYER.EXE": { type: "file", app: "mplayer" },
          "SKIFREE.EXE": { type: "file", app: "skifree" },
          "SIMCITY.EXE": { type: "file", app: "simcity" },
          "WINFILE.EXE": { type: "file", app: "winfile" },
          "TASKMAN.EXE": { type: "file", app: "taskman" },
          "CLIPBRD.EXE": { type: "file", app: "clipbrd" },
          "DATAMGR.EXE": { type: "file", app: "database" },
          "CHARMAP.EXE": { type: "file", app: "charmap" },
          "SOUNDREC.EXE": { type: "file", app: "soundrec" },
          "CLOCK.EXE": { type: "file", app: "clock" },
          "CONTROL.EXE": { type: "file", app: "control" },
          "WEB.EXE": { type: "file", app: "browser" },
          "TINYC.EXE": { type: "file", app: "compiler" },
          "PYTHON.EXE": { type: "file", app: "python" },
          "CONSOLE.EXE": { type: "file", app: "console" }
        }
      },
      DOCUMENTS: {
        type: "dir",
        children: {
          "README.TXT": { type: "file", app: "notepad", content: "Welcome to Oriel 1.0!" },
          "TODO.TXT": { type: "file", app: "notepad", content: "- Buy Milk\n- Install DOOM" },
          "MANUAL.PDF": { type: "file", app: "pdfreader", content: { name: "Manual.pdf", src: DEFAULT_PDF_DATA_URI } }
        }
      }
    }
  }
};

function loadFileSystem() {
  const stored = localStorage.getItem(FS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : DEFAULT_FS;
}

function saveFileSystem() {
  localStorage.setItem(FS_STORAGE_KEY, JSON.stringify(MOCK_FS));
}

const MOCK_FS = loadFileSystem();

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
    saveFileSystem(); // Save changes
    input.value = "";
    rFT(win);
    rFL(win);
  }
}

const BROWSER_HOME = "https://example.com/";
const browserSessions = {};
const BROWSER_PROXY_PREFIX = "https://r.jina.ai/";

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
    if (type === "chess") content = this.getChessContent();
    if (type === "paint") content = this.getPaintContent();
    if (type === "mplayer") content = this.getMediaPlayerContent();
    if (type === "simcity") content = this.getSimCityContent();
    if (type === "skifree") content = this.getSkiFreeContent();
    if (type === "database") content = this.getDatabaseContent();
    if (type === "soundrec") content = this.getSoundRecContent();
    if (type === "charmap") content = this.getCharMapContent();
    if (type === "winfile") content = this.getWinFileContent();
    if (type === "clock") content = this.getClockContent();
    if (type === "control") content = this.getControlPanelContent();
    if (type === "clipbrd") content = this.getClipboardContent();
    if (type === "readme") content = this.getReadmeContent();
    if (type === "pdfreader") content = this.getPdfReaderContent(initData);
    if (type === "browser") content = this.getBrowserContent();    
    if (type === "doom") content = this.getDoomContent();
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
    if (type === "simcity") initSimCity(winEl);
    if (type === "skifree") initSkiFree(winEl);
    if (type === "database") initDatabase(winEl);
    if (type === "soundrec") initSoundRecorder(winEl);
    if (type === "charmap") initCharMap(winEl);
    if (type === "winfile") initFileManager(winEl);
    if (type === "clock") initClock(winEl);
    if (type === "control") initControlPanel(winEl);
    if (type === "chess") initChess(winEl);
    if (type === "console") initConsole(winEl);
    if (type === "write") initWrite(winEl);
    if (type === "cardfile") initCardfile(winEl);
    if (type === "taskman") initTaskMan(winEl);
    if (type === "pdfreader") initPdfReader(winEl, initData);
    if (type === "browser") initBrowser(winEl);
    if (type === "doom") initDoom(winEl);
    // Refresh logic
    refreshAllTaskManagers();
  }
  closeWindow(id) {
    const index = this.windows.findIndex((w) => w.id === id);
    if (index > -1) {
      const closingWin = this.windows[index];
      if (typeof closingWin.el.chessCleanup === "function")
        closingWin.el.chessCleanup();
      if (typeof closingWin.el.skifreeCleanup === "function")
        closingWin.el.skifreeCleanup();
      if (closingWin.el.doomCI) {
        closingWin.el.doomCI.exit();
        closingWin.el.doomCI = null;
      }
      closingWin.el.remove();
      // Remove minimized icon if exists
      const minIcon = document.getElementById("min-" + id);
      if (minIcon) minIcon.remove();
      this.windows.splice(index, 1);
      delete browserSessions[id];
      // Kill Process
      kernel.unregisterProcess(id);
      refreshAllTaskManagers();
    }
  }
  minimizeWindow(id) {
    const win = this.windows.find((w) => w.id === id);
    if (!win) return;
    if (win.minimized) return;
    win.el.style.display = "none";
    win.minimized = true;
    // Create Icon at bottom
    const existing = document.getElementById("min-" + id);
    if (existing) existing.remove();
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
                    <div class="prog-icon" onclick="wm.openWindow('chess', 'Chess', 640, 520)">
                        ${ICONS.chess}
                        <div class="prog-label">Chess</div>
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
                    <div class="prog-icon" onclick="wm.openWindow('simcity', 'Micropolis', 560, 520)">
                        ${ICONS.simcity}
                        <div class="prog-label">Micropolis</div>
                    </div>
                    <div class="prog-icon" onclick="wm.openWindow('skifree', 'SkiFree', 520, 520)">
                        ${ICONS.skifree}
                        <div class="prog-label">SkiFree</div>
                    </div>
                    <div class="prog-icon" onclick="wm.openWindow('soundrec', 'Sound Recorder', 300, 160)">
                        ${ICONS.soundrec}
                        <div class="prog-label">Sound Rec</div>
                    </div>
                    <div class="prog-icon" onclick="wm.openWindow('clock', 'Clock', 250, 250)">
                        ${ICONS.clock}
                        <div class="prog-label">Clock</div>
                    </div>
                    <div class="prog-icon" onclick="wm.openWindow('charmap', 'Character Map', 460, 380)">
                        ${ICONS.charmap}
                        <div class="prog-label">Char Map</div>
                    </div>
                    <div class="prog-icon" onclick="wm.openWindow('control', 'Control Panel', 400, 300)">
                        ${ICONS.control}
                        <div class="prog-label">Control</div>
                    </div>
                    <div class="prog-icon" onclick="wm.openWindow('pdfreader', 'PDF Reader', 720, 540)">
                        ${ICONS.pdfreader}
                        <div class="prog-label">PDF Reader</div>
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
                    <div class="prog-icon" onclick="wm.openWindow('browser', 'Web Browser', 640, 480)">
                        ${ICONS.browser}
                        <div class="prog-label">Browser</div>
                    </div>
                    <div class="prog-icon" onclick="wm.openWindow('readme', 'Read Me', 350, 400)">
                        ${ICONS.readme}
                        <div class="prog-label">Read Me</div>
                    </div>
                    <div class="prog-icon" onclick="wm.openWindow('doom', 'DOOM', 640, 400)">
                        ${ICONS.doom}
                    <div class="prog-label">DOOM</div>
            </div>
                </div>
            `;
  }
  getSimCityContent() {
    return `
                <div class="simcity-layout">
                    <div class="simcity-toolbar">
                        <div class="simcity-stats">
                            <span>Funds: $<span class="simcity-funds">5000</span></span>
                            <span>Population: <span class="simcity-pop">0</span></span>
                            <span>Happiness: <span class="simcity-happiness">50</span>%</span>
                        </div>
                        <div class="simcity-tools">
                            <button data-tool="road">Road ($20)</button>
                            <button data-tool="house">House ($100)</button>
                            <button data-tool="power">Power ($200)</button>
                            <button data-tool="park">Park ($50)</button>
                            <button data-tool="bulldoze">Bulldoze</button>
                        </div>
                    </div>
                    <div class="simcity-map"></div>
                    <div class="simcity-log">Welcome to Micropolis! Place roads, homes, and power to grow your town.</div>
                </div>
            `;
  }
  getSkiFreeContent() {
    return `
                <div class="skifree-layout" tabindex="0">
                    <div class="skifree-hud">
                        <div class="skifree-stat">Score: <span class="skifree-score">0</span></div>
                        <div class="skifree-stat">Speed: <span class="skifree-speed">0</span></div>
                        <div class="skifree-status">Ready to ski</div>
                        <button class="task-btn skifree-reset">Restart</button>
                    </div>
                    <canvas class="skifree-canvas" width="320" height="360"></canvas>
                    <div class="skifree-help">Use ← → to steer, ↑ to jump, ↓ to slow down. Avoid trees and rocks!</div>
                </div>
            `;
  }
  getBrowserContent() {
    return `<div class="browser-layout">
              <div class="browser-toolbar">
                <button class="browser-btn" data-action="back" title="Back">◀</button>
                <button class="browser-btn" data-action="forward" title="Forward">▶</button>
                <button class="browser-btn" data-action="refresh" title="Refresh">⟳</button>
                <button class="browser-btn" data-action="home" title="Home">⌂</button>
                <input class="browser-url" type="text" placeholder="https://example.com" spellcheck="false">
                <button class="browser-btn go-btn" data-action="go">Go</button>
              </div>
              <div class="browser-view">
                <iframe class="browser-frame" src="about:blank" sandbox="allow-scripts allow-forms allow-pointer-lock allow-popups"></iframe>
                <div class="browser-status">Enter a URL to begin browsing.</div>
              </div>
            </div>`;
  }
  getDoomContent() {
    return `
      <div style="width:100%;height:100%;background:black;display:flex;justify-content:center;align-items:center;">
        <canvas id="doom-container" style="width:640px;height:400px;background:#111;"></canvas>
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
  getChessContent() {
    return `<div class="chess-layout"><div class="chess-board" aria-label="Chessboard"></div><div class="chess-sidebar"><div class="chess-status">Loading chess engine...</div><div class="chess-controls"><button class="task-btn chess-new">New Game</button><button class="task-btn chess-copy">Copy FEN</button><button class="task-btn chess-paste">Paste FEN</button><button class="task-btn chess-load">Load FEN</button><input type="text" id="chess-fen" class="chess-fen" spellcheck="false" title="Current FEN"></div><div class="chess-moves" aria-label="Move list"></div></div></div>`;
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
    return `<div class="write-layout"><div class="write-toolbar"><select class="write-select write-font" title="Font Family"><option value="Times New Roman">Times New Roman</option><option value="Arial">Arial</option><option value="Courier New">Courier New</option><option value="Georgia">Georgia</option><option value="Verdana">Verdana</option></select><select class="write-select write-size" title="Font Size"><option value="2">10</option><option value="3">12</option><option value="4" selected>14</option><option value="5">18</option><option value="6">24</option><option value="7">32</option></select><button class="fmt-btn" data-cmd="bold" title="Bold">B</button><button class="fmt-btn" data-cmd="italic" title="Italic">I</button><button class="fmt-btn" data-cmd="underline" title="Underline">U</button></div><div class="write-editor" contenteditable="true" spellcheck="false">${
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
    return `<div class="char-map-layout">
              <div class="char-map-toolbar">
                <div class="char-preview" aria-live="polite">A</div>
                <div class="char-meta">
                  <div class="char-code" id="char-code-label">U+0041 · Dec 65</div>
                  <div class="char-font-row">
                    <label for="char-font-select">Font:</label>
                    <select class="char-font" id="char-font-select">
                      <option value="'Times New Roman', serif">Times New Roman</option>
                      <option value="'Arial', sans-serif">Arial</option>
                      <option value="'Courier New', monospace">Courier New</option>
                      <option value="'Segoe UI Symbol', 'Noto Sans Symbols', sans-serif">Symbols</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="char-grid" id="char-grid"></div>
              <div class="char-controls">
                <label>Characters to copy:</label>
                <div class="copy-row">
                  <input type="text" class="char-input" id="char-copy-input" readonly>
                  <button class="task-btn" onclick="copyCharMap(this)" style="width:60px">Copy</button>
                </div>
                <button class="task-btn" onclick="document.getElementById('char-copy-input').value = ''">Clear</button>
              </div>
            </div>`;
  }
  getClockContent() {
    return `<div class="clock-layout" title="Double click to toggle mode"><canvas class="clock-canvas" width="200" height="200"></canvas><div class="clock-digital" style="display:none">12:00</div></div>`;
  }
  getControlPanelContent() {
    return `<div class="control-layout" id="cp-main"><div class="control-icon" onclick="openCPColor(this)">${ICONS.cp_color}<div class="control-label">Color</div></div><div class="control-icon" onclick="openCPDesktop(this)">${ICONS.desktop_cp}<div class="control-label">Desktop</div></div><div class="control-icon" onclick="openCPScreensaver(this)">${ICONS.screensaver}<div class="control-label">Screensaver</div></div><div class="control-icon" onclick="openCPFonts(this)"><svg viewBox="0 0 32 32" class="svg-icon"><rect x="4" y="8" width="24" height="16" fill="none" stroke="black"/><text x="16" y="20" font-family="serif" font-size="10" text-anchor="middle">ABC</text></svg><div class="control-label">Fonts</div></div><div class="control-icon"><svg viewBox="0 0 32 32" class="svg-icon"><rect x="10" y="6" width="12" height="20" fill="none" stroke="black"/><circle cx="16" cy="12" r="2" fill="black"/></svg><div class="control-label">Mouse</div></div><div class="control-icon"><svg viewBox="0 0 32 32" class="svg-icon"><rect x="2" y="10" width="28" height="12" fill="none" stroke="black"/></svg><div class="control-label">Keyboard</div></div></div>`;
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
    return `<div class="console" onclick="document.querySelector('.window.active .console-input')?.focus()"><div>Egg Oriel 1.0</div><br><div class="console-output"></div><div class="console-line"><span>C:\\></span><input type="text" class="console-input" onkeydown="handleConsoleKey(event)" autocomplete="off"></div></div>`;
  }
  getMinesContent() {
    return `<div style="background:#c0c0c0; height:100%; display:flex; flex-direction:column; align-items:center;"><div class="mines-bar" style="width:200px"><div class="mines-lcd" id="mines-count">010</div><div class="mines-face" id="mines-face" onclick="resetMines()">:)</div><div class="mines-lcd" id="mines-timer">000</div></div><div class="mines-grid" id="mines-grid"></div></div>`;
  }
  getReadmeContent() {
    return `<div style="padding:15px; font-family:'Times New Roman', serif;"><h2>Welcome to Web 3.1</h2><p>Features: Solitaire, Reversi, Media Player, Clock, etc.</p></div>`;
  }
  getPdfReaderContent(initData) {
    const src = initData?.src || DEFAULT_PDF_DATA_URI;
    const name = initData?.name || "Sample.pdf";
    return `<div class="pdf-reader">
                <div class="pdf-toolbar">
                    <label class="task-btn file-btn">Open File<input type="file" accept="application/pdf" class="pdf-file-input"></label>
                    <input type="text" class="pdf-url-input" placeholder="Paste PDF URL and click Load" value="">
                    <button class="task-btn pdf-load-btn">Load</button>
                    <div class="pdf-status">Loaded ${name}</div>
                </div>
                <div class="pdf-viewer">
                    <iframe class="pdf-frame" src="${src}" title="PDF Viewer"></iframe>
                </div>
            </div>`;
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
    return `<div class="db-layout"><div class="db-form"><div class="db-input-group"><label>Name</label><input type="text" class="db-input" id="db-name"></div><div class="db-input-group"><label>Phone</label><input type="text" class="db-input" id="db-phone"></div><div class="db-input-group"><label>Email</label><input type="text" class="db-input" id="db-email"></div><button class="task-btn" onclick="addDbRecord(this)">Add Record</button><button class="task-btn" onclick="exportDbToCsv(this)">Save CSV</button></div><div class="db-grid-container"><table class="db-table"><thead><tr><th>Name</th><th>Phone</th><th>Email</th><th style="width:50px">Action</th></tr></thead><tbody id="db-tbody"></tbody></table></div></div>`;
  }
}

const wm = new WindowManager();

let saverActive = false;
let idleTime = 0;
const saverCanvas = document.getElementById("saver-canvas");
const sCtx = saverCanvas.getContext("2d");
const screensaverDiv = document.getElementById("screensaver");
let screensaverType = "starfield";
let screensaverTimeout = 60;

let stars = [];
const numStars = 500;
let sInterval = null;

let pipes = [];

const pipeDirections = [
  { x: 1, y: 0 },
  { x: -1, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: -1 }
];

const PIPE_COLORS = ["#4bc0ff", "#ff6b6b", "#50fa7b", "#f1fa8c"];

function initScreensaver() {
  saverCanvas.width = window.innerWidth;
  saverCanvas.height = window.innerHeight;
  setupStarfield();
  // Global Listeners
  document.body.addEventListener("mousemove", resetTimer);
  document.body.addEventListener("keydown", resetTimer);
  document.body.addEventListener("mousedown", resetTimer);
  // Timer Check
  setInterval(() => {
    idleTime++;
    if (idleTime > screensaverTimeout && !saverActive) startScreensaver();
  }, 1000);
}

function resetTimer() {
  idleTime = 0;
  if (saverActive) stopScreensaver();
}

function startScreensaver(forceType) {
  const saver = forceType || screensaverType;
  saverActive = true;
  screensaverDiv.style.display = "block";
  saverCanvas.width = window.innerWidth;
  saverCanvas.height = window.innerHeight;
  clearInterval(sInterval);
  if (saver === "pipes") {
    setupPipes();
    sInterval = setInterval(drawPipes, 50);
  } else {
    setupStarfield();
    sInterval = setInterval(drawStars, 30);
  }
}

function stopScreensaver() {
  saverActive = false;
  screensaverDiv.style.display = "none";
  clearInterval(sInterval);
}

function setupStarfield() {
  stars = [];
  for (let i = 0; i < numStars; i++) {
    stars.push({
      x: Math.random() * saverCanvas.width,
      y: Math.random() * saverCanvas.height,
      z: Math.random() * saverCanvas.width
    });
  }
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

function setupPipes() {
  pipes = [];
  sCtx.fillStyle = "black";
  sCtx.fillRect(0, 0, saverCanvas.width, saverCanvas.height);
  for (let i = 0; i < 4; i++) {
    pipes.push({
      x: Math.random() * saverCanvas.width,
      y: Math.random() * saverCanvas.height,
      dir: pipeDirections[Math.floor(Math.random() * pipeDirections.length)],
      color: PIPE_COLORS[i % PIPE_COLORS.length],
      stepSize: 14,
      turnCounter: 0
    });
  }
}

function chooseNewPipeDirection(pipe) {
  const options = pipeDirections.filter(
    (d) => !(d.x === -pipe.dir.x && d.y === -pipe.dir.y)
  );
  pipe.dir = options[Math.floor(Math.random() * options.length)];
  pipe.turnCounter = 0;
}

function adjustColor(col, amt) {
  const hex = col.replace("#", "");
  const num = parseInt(hex, 16);
  let r = (num >> 16) + amt;
  let g = ((num >> 8) & 0xff) + amt;
  let b = (num & 0xff) + amt;
  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));
  return `rgb(${r}, ${g}, ${b})`;
}

function drawPipes() {
  sCtx.fillStyle = "rgba(0,0,0,0.08)";
  sCtx.fillRect(0, 0, saverCanvas.width, saverCanvas.height);

  pipes.forEach((pipe) => {
    pipe.turnCounter++;
    const dangerMargin = 30;
    let nextX = pipe.x + pipe.dir.x * pipe.stepSize;
    let nextY = pipe.y + pipe.dir.y * pipe.stepSize;

    if (
      nextX < dangerMargin ||
      nextX > saverCanvas.width - dangerMargin ||
      nextY < dangerMargin ||
      nextY > saverCanvas.height - dangerMargin ||
      Math.random() < 0.1 * (pipe.turnCounter / 6)
    ) {
      chooseNewPipeDirection(pipe);
      nextX = pipe.x + pipe.dir.x * pipe.stepSize;
      nextY = pipe.y + pipe.dir.y * pipe.stepSize;
    }

    const highlight = adjustColor(pipe.color, 80);
    const shadow = adjustColor(pipe.color, -80);
    const grad = sCtx.createLinearGradient(pipe.x, pipe.y, nextX, nextY);
    grad.addColorStop(0, highlight);
    grad.addColorStop(0.5, pipe.color);
    grad.addColorStop(1, shadow);

    sCtx.lineWidth = 12;
    sCtx.lineCap = "round";
    sCtx.strokeStyle = grad;
    sCtx.beginPath();
    sCtx.moveTo(pipe.x, pipe.y);
    sCtx.lineTo(nextX, nextY);
    sCtx.stroke();

    sCtx.fillStyle = highlight;
    sCtx.beginPath();
    sCtx.arc(nextX, nextY, 4, 0, Math.PI * 2);
    sCtx.fill();

    pipe.x = nextX;
    pipe.y = nextY;
  });
}

function openCPDesktop(el, containerOverride) {
  let targetContainer = containerOverride;
  if (!targetContainer && el?.classList?.contains("cp-view-area")) {
    targetContainer = el;
  }
  if (!targetContainer && el?.closest) {
    const area = el.closest(".cp-view-area");
    if (area) targetContainer = area;
  }
  const w = el?.closest ? el.closest(".window") : null;
  const body =
    targetContainer ||
    (w ? w.querySelector(".window-body") : null) ||
    (el instanceof HTMLElement ? el : null);
  if (!body) return;
  if (w) {
    w
      .querySelectorAll(".cp-tab-btn, .cp-menu-item")
      .forEach((btn) =>
        btn.classList.toggle("active", btn.dataset.view === "desktop")
      );
  }
  body.innerHTML = `
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
                        <button class="task-btn" onclick="wm.closeWindow('${w ? w.dataset.id : ""}')">Close</button>
                    </div>
                </div>
            </div>
        `;
}

function openCPScreensaver(target, containerOverride) {
  let targetContainer = containerOverride;
  if (!targetContainer && target?.classList?.contains("cp-view-area")) {
    targetContainer = target;
  }
  if (!targetContainer && target?.closest) {
    const area = target.closest(".cp-view-area");
    if (area) targetContainer = area;
  }
  const w = target?.closest ? target.closest(".window") : null;
  const body =
    targetContainer ||
    (w ? w.querySelector(".window-body") : null) ||
    (target instanceof HTMLElement ? target : null);
  if (!body) return;

  if (w) {
    w
      .querySelectorAll(".cp-tab-btn, .cp-menu-item")
      .forEach((btn) =>
        btn.classList.toggle("active", btn.dataset.view === "screensaver")
      );
  }

  const saverOptionsData = [
    { value: "starfield", label: "Starfield", desc: "Classic warp-speed stars." },
    { value: "pipes", label: "3D Pipes", desc: "Colorful shaded pipes crawl in 3D." }
  ];
  const saverOptions = saverOptionsData
    .map(
      (opt) =>
        `<option value="${opt.value}" ${
          opt.value === screensaverType ? "selected" : ""
        }>${opt.label}</option>`
    )
    .join("");

  body.innerHTML = `<div class="cp-settings-layout">
        <div class="cp-section">
            <label style="display:block;font-size:12px;margin-bottom:6px;">Screensaver</label>
            <select id="cp-saver-select" style="width:100%;margin-bottom:8px;">${saverOptions}</select>
            <div class="cp-font-preview" id="cp-saver-desc"></div>
            <div class="cp-saver-row">
                <label for="cp-saver-delay">Idle time (seconds):</label>
                <input type="number" id="cp-saver-delay" min="5" max="600" value="${screensaverTimeout}" style="width:80px;">
            </div>
            <div class="cp-saver-actions">
                <button class="task-btn" onclick="previewScreensaver()">Preview</button>
                <button class="task-btn" onclick="applyScreensaver()">Apply</button>
            </div>
            <div class="cp-saver-note" id="cp-saver-status">Current saver: ${screensaverType}</div>
        </div>
    </div>`;

  const descBox = body.querySelector("#cp-saver-desc");
  const select = body.querySelector("#cp-saver-select");
  const updateDesc = () => {
    const selected = saverOptionsData.find((s) => s.value === select?.value);
    if (descBox && selected) descBox.textContent = selected.desc;
  };
  updateDesc();
  select?.addEventListener("change", updateDesc);
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

function applyScreensaver() {
  const select = document.getElementById("cp-saver-select");
  const delay = document.getElementById("cp-saver-delay");
  const status = document.getElementById("cp-saver-status");
  if (select?.value) screensaverType = select.value;
  const parsedDelay = parseInt(delay?.value || "", 10);
  if (!isNaN(parsedDelay)) {
    screensaverTimeout = Math.min(600, Math.max(5, parsedDelay));
    if (delay) delay.value = screensaverTimeout;
  }
  idleTime = 0;
  if (status)
    status.textContent = `Current saver: ${screensaverType} (starts after ${screensaverTimeout}s idle)`;
}

function previewScreensaver() {
  const select = document.getElementById("cp-saver-select");
  const chosen = select?.value || screensaverType;
  screensaverType = chosen;
  idleTime = 0;
  startScreensaver(chosen);
}

function initBrowser(win) {
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

  browserSessions[sessionId] = {
    history: [],
    index: -1
  };

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
      // Fallback for malformed URLs; r.jina.ai will still try to fetch it.
      return `${BROWSER_PROXY_PREFIX}https://${url.replace(/^\/+/, "")}`;
    }
  };

  const updateNavState = () => {
    const session = browserSessions[sessionId];
    if (!session) return;
    const hasBack = session.index > 0;
    const hasForward = session.index < session.history.length - 1;
    if (backBtn) backBtn.disabled = !hasBack;
    if (fwdBtn) fwdBtn.disabled = !hasForward;
  };

  const loadUrl = (rawUrl, pushHistory = true) => {
    const url = normalizeUrl(rawUrl);
    const session = browserSessions[sessionId];
    if (!url || !session) return;
    if (pushHistory) {
      session.history = session.history.slice(0, session.index + 1);
      session.history.push(url);
      session.index = session.history.length - 1;
    }
    const proxied = buildProxiedUrl(url);
    urlInput.value = url;
    frame.src = proxied;
    setStatus(`Loading ${url} (via text proxy)...`);
    updateNavState();
  };

  if (backBtn)
    backBtn.onclick = () => {
      const session = browserSessions[sessionId];
      if (!session || session.index <= 0) return;
      session.index -= 1;
      const target = session.history[session.index];
      urlInput.value = target;
      frame.src = buildProxiedUrl(target);
      setStatus(`Loading ${target} (via text proxy)...`);
      updateNavState();
    };

  if (fwdBtn)
    fwdBtn.onclick = () => {
      const session = browserSessions[sessionId];
      if (!session || session.index >= session.history.length - 1) return;
      session.index += 1;
      const target = session.history[session.index];
      urlInput.value = target;
      frame.src = buildProxiedUrl(target);
      setStatus(`Loading ${target} (via text proxy)...`);
      updateNavState();
    };

  if (refreshBtn)
    refreshBtn.onclick = () => {
      const session = browserSessions[sessionId];
      if (!session || session.index < 0) return;
      const target = session.history[session.index];
      frame.src = buildProxiedUrl(target);
      setStatus(`Refreshing ${target} (via text proxy)...`);
    };

  if (homeBtn) homeBtn.onclick = () => loadUrl(BROWSER_HOME);
  if (goBtn) goBtn.onclick = () => loadUrl(urlInput.value);

  urlInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") loadUrl(urlInput.value);
  });

  frame.addEventListener("load", () => {
    const session = browserSessions[sessionId];
    if (!session) return;
    const currentUrl = session.history[session.index] || "";
    setStatus(currentUrl ? `Loaded ${currentUrl}` : "Ready");
  });

  loadUrl(BROWSER_HOME);
}

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

function initReversi(w) {
  const board = w.querySelector("#reversi-board");
  const status = w.querySelector(".reversi-status");
  let grid = Array(8)
    .fill()
    .map(() => Array(8).fill(0));
  let turn = 1;
  grid[3][3] = 2;
  grid[3][4] = 1;
  grid[4][3] = 1;
  grid[4][4] = 2;

  const render = () => {
    board.innerHTML = "";
    grid.forEach((row, ri) => {
      row.forEach((cell, ci) => {
        const cellDiv = document.createElement("div");
        cellDiv.className = "reversi-cell";
        if (cell !== 0) {
          const piece = document.createElement("div");
          piece.className = "reversi-piece " + (cell === 1 ? "red" : "blue");
          cellDiv.appendChild(piece);
        }
        cellDiv.onclick = () => {
          if (turn === 1) makeMove(ri, ci, 1);
        };
        board.appendChild(cellDiv);
      });
    });
    status.innerText =
      turn === 1 ? "Your Turn (Red)" : "Computer Thinking...";
  };

  const isValid = (r, c, color) => {
    if (grid[r][c] !== 0) return false;
    const opp = color === 1 ? 2 : 1;
    const dirs = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1]
    ];

    for (let d of dirs) {
      let nr = r + d[0];
      let nc = c + d[1];
      let found = 0;
      while (nr >= 0 && nr < 8 && nc >= 0 && nc < 8 && grid[nr][nc] === opp) {
        nr += d[0];
        nc += d[1];
        found++;
      }
      if (
        found > 0 &&
        nr >= 0 &&
        nr < 8 &&
        nc >= 0 &&
        nc < 8 &&
        grid[nr][nc] === color
      )
        return true;
    }
    return false;
  };

  const makeMove = (r, c, color) => {
    if (!isValid(r, c, color)) return;
    grid[r][c] = color;
    const opp = color === 1 ? 2 : 1;
    const dirs = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1]
    ];
    dirs.forEach((d) => {
      let nr = r + d[0];
      let nc = c + d[1];
      const path = [];
      while (nr >= 0 && nr < 8 && nc >= 0 && nc < 8 && grid[nr][nc] === opp) {
        path.push([nr, nc]);
        nr += d[0];
        nc += d[1];
      }
      if (
        path.length > 0 &&
        nr >= 0 &&
        nr < 8 &&
        nc >= 0 &&
        nc < 8 &&
        grid[nr][nc] === color
      ) {
        path.forEach(([pr, pc]) => (grid[pr][pc] = color));
      }
    });
    turn = color === 1 ? 2 : 1;
    render();
    if (turn === 2) setTimeout(cpuMove, 500);
  };

  const cpuMove = () => {
    let best = null;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (isValid(r, c, 2)) {
          best = { r, c };
        }
      }
    }
    if (best) makeMove(best.r, best.c, 2);
    else {
      turn = 1;
      render();
    }
  };

  render();
}

function initMediaPlayer(w) {
  const canvas = w.querySelector("#mplayer-canvas");
  const ctx = canvas.getContext("2d");
  let interval = null;
  let x = 50;
  let y = 50;
  let dx = 2;
  let dy = 2;

  const animate = () => {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#0F0";
    ctx.font = "20px Arial";
    ctx.fillText("DVD", x, y);
    x += dx;
    y += dy;
    if (x < 0 || x > canvas.width - 40) dx = -dx;
    if (y < 20 || y > canvas.height) dy = -dy;
  };

  w.toggleMedia = (btn, action) => {
    if (action === "play") {
      if (!interval) interval = setInterval(animate, 30);
    } else if (action === "pause") {
      clearInterval(interval);
      interval = null;
    } else {
      clearInterval(interval);
      interval = null;
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      x = 50;
      y = 50;
    }
  };
  window.toggleMedia = w.toggleMedia;
}

function initSolitaire(w) {
  const SUITS = ["h", "d", "c", "s"];
  const RANKS = [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K"
  ];
  let stock = [];
  let waste = [];
  let f = { h: [], d: [], c: [], s: [] };
  let t = [[], [], [], [], [], [], []];
  let sel = null;

  const createDeck = () => {
    const deck = [];
    SUITS.forEach((suit) =>
      RANKS.forEach((rank, i) =>
        deck.push({
          s: suit,
          r: rank,
          v: i + 1,
          u: false,
          c: suit === "h" || suit === "d" ? "red" : "black"
        })
      )
    );
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  };

  const deal = () => {
    stock = createDeck();
    t = [[], [], [], [], [], [], []];
    for (let i = 0; i < 7; i++) {
      for (let j = i; j < 7; j++) {
        const card = stock.pop();
        if (i === j) card.u = true;
        t[j].push(card);
      }
    }
    render();
  };

  const elS = w.querySelector("#sol-stock");
  const elW = w.querySelector("#sol-waste");
  const elT = w.querySelector("#sol-tableau");
  const elF = {
    h: w.querySelector("#sol-f-h"),
    d: w.querySelector("#sol-f-d"),
    c: w.querySelector("#sol-f-c"),
    s: w.querySelector("#sol-f-s")
  };

  const renderCard = (card, cb) => {
    const d = document.createElement("div");
    d.className = "card " + (card.u ? card.c : "back");
    if (sel && sel.card === card) d.classList.add("selected");
    if (card.u) {
      d.innerHTML = `<div style="text-align:left">${card.r}</div><div class="card-center">${{
        h: "♥",
        d: "♦",
        c: "♣",
        s: "♠"
      }[card.s]}</div><div style="text-align:right">${card.r}</div>`;
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
        renderCard(
          { u: false },
          () => {
            if (stock.length > 0) {
              const card = stock.pop();
              card.u = true;
              waste.push(card);
              sel = null;
              render();
            }
          }
        )
      );
    else
      elS.onclick = () => {
        while (waste.length > 0) {
          const card = waste.pop();
          card.u = false;
          stock.push(card);
        }
        sel = null;
        render();
      };

    elW.innerHTML = "";
    if (waste.length > 0) {
      const top = waste[waste.length - 1];
      elW.appendChild(renderCard(top, () => selectCard(top, "waste")));
    }

    SUITS.forEach((suit) => {
      elF[suit].innerHTML = "";
      if (f[suit].length > 0) {
        const top = f[suit][f[suit].length - 1];
        const d = renderCard(top, () => tryFoundation(suit));
        d.style.position = "static";
        elF[suit].appendChild(d);
      } else {
        elF[suit].innerHTML = `<div style="text-align:center;color:#006000;margin-top:35px;font-size:24px;">${{
          h: "♥",
          d: "♦",
          c: "♣",
          s: "♠"
        }[suit]}</div>`;
        elF[suit].onclick = () => tryFoundation(suit);
      }
    });

    elT.innerHTML = "";
    t.forEach((col, ci) => {
      const cd = document.createElement("div");
      cd.className = "sol-col";
      cd.onclick = () => tryTableau(ci);
      col.forEach((card, i) => {
        const d = renderCard(card, () => {
          if (card.u) selectCard(card, "tableau", ci, i);
          else if (i === col.length - 1) {
            card.u = true;
            render();
          }
        });
        d.style.top = i * 25 + "px";
        cd.appendChild(d);
      });
      elT.appendChild(cd);
    });
  };

  const selectCard = (card, loc, col, idx) => {
    if (sel && sel.card === card) sel = null;
    else sel = { card, loc, col, idx };
    render();
  };

  const tryTableau = (toCol) => {
    if (!sel) return;
    const dest = t[toCol];
    const movingCard = sel.card;
    let valid = false;
    if (dest.length === 0) {
      if (movingCard.r === "K") valid = true;
    } else {
      const top = dest[dest.length - 1];
      if (top.c !== movingCard.c && top.v === movingCard.v + 1) valid = true;
    }
    if (valid) {
      let moving = [];
      const fromCol = sel.col;
      if (sel.loc === "waste") moving.push(waste.pop());
      else moving = t[sel.col].splice(sel.idx);
      t[toCol].push(...moving);
      if (sel.loc === "tableau") {
        const origin = t[fromCol];
        if (origin.length > 0) {
          const topCard = origin[origin.length - 1];
          if (!topCard.u) topCard.u = true;
        }
      }
      sel = null;
      render();
    }
  };

  const tryFoundation = (suit) => {
    if (!sel) return;
    const movingCard = sel.card;
    const pile = f[suit];
    if (movingCard.s === suit && movingCard.v === pile.length + 1) {
      let canMove = false;
      if (sel.loc === "waste") canMove = true;
      if (sel.loc === "tableau" && sel.idx === t[sel.col].length - 1) canMove = true;
      if (canMove) {
        if (sel.loc === "waste") waste.pop();
        else {
          t[sel.col].pop();
          const origin = t[sel.col];
          if (origin.length > 0) {
            const topCard = origin[origin.length - 1];
            if (!topCard.u) topCard.u = true;
          }
        }
        pile.push(movingCard);
        sel = null;
        render();
      }
    }
  };

  deal();
}

function initWrite(w) {
  const editor = w.querySelector(".write-editor");
  w.querySelectorAll(".fmt-btn").forEach((btn) => {
    btn.onclick = () => {
      document.execCommand(btn.dataset.cmd, false, null);
      editor.focus();
    };
  });

  const fontSelect = w.querySelector(".write-font");
  const sizeSelect = w.querySelector(".write-size");

  if (fontSelect) {
    fontSelect.onchange = () => {
      document.execCommand("fontName", false, fontSelect.value);
      editor.focus();
    };
  }

  if (sizeSelect) {
    sizeSelect.onchange = () => {
      document.execCommand("fontSize", false, sizeSelect.value);
      editor.focus();
    };
  }
}

function initCardfile(w) {
  const key = "w31-cards";
  const stored = localStorage.getItem(key);
  w.cards = stored
    ? JSON.parse(stored)
    : [
        {
          id: 1,
          header: "Welcome",
          content: "This is Cardfile."
        }
      ];
  if (w.cards.length === 0)
    w.cards.push({
      id: Date.now(),
      header: "New Card",
      content: ""
    });
  w.activeCardId = w.cards[0].id;

  const listEl = w.querySelector("#card-index-list");
  const headerEl = w.querySelector("#card-header-display");
  const contentEl = w.querySelector("#card-content-edit");

  const render = () => {
    w.cards.sort((a, b) => a.header.localeCompare(b.header));
    listEl.innerHTML = "";
    w.cards.forEach((card) => {
      const d = document.createElement("div");
      d.className = "cardfile-item " + (card.id === w.activeCardId ? "sel" : "");
      d.innerHTML =
        ICONS.cardfile + `<span>${card.header || "(blank)"}</span>`;
      d.onclick = () => {
        w.activeCardId = card.id;
        render();
      };
      listEl.appendChild(d);
    });
    const active = w.cards.find((c) => c.id === w.activeCardId);
    if (active) {
      headerEl.value = active.header;
      contentEl.value = active.content;
    }
    localStorage.setItem(key, JSON.stringify(w.cards));
  };

  headerEl.oninput = () => {
    const active = w.cards.find((c) => c.id === w.activeCardId);
    if (active) {
      active.header = headerEl.value;
      render();
    }
  };
  contentEl.oninput = () => {
    const active = w.cards.find((c) => c.id === w.activeCardId);
    if (active) {
      active.content = contentEl.value;
      localStorage.setItem(key, JSON.stringify(w.cards));
    }
  };

  w.querySelector("#card-add").onclick = () => {
    const nc = { id: Date.now(), header: "New Card", content: "" };
    w.cards.push(nc);
    w.activeCardId = nc.id;
    render();
  };
  w.querySelector("#card-del").onclick = () => {
    if (w.cards.length > 1) {
      w.cards = w.cards.filter((c) => c.id !== w.activeCardId);
      w.activeCardId = w.cards[0].id;
      render();
    }
  };

  render();
}

function initClock(w) {
  const canvas = w.querySelector(".clock-canvas");
  const ctx = canvas.getContext("2d");
  const digital = w.querySelector(".clock-digital");
  const layout = w.querySelector(".clock-layout");
  let analogMode = true;

  const formatTime = (date) => {
    const hh = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");
    const ss = String(date.getSeconds()).padStart(2, "0");
    return `${hh}:${mm}:${ss}`;
  };

  const drawAnalog = (date) => {
    const wH = canvas.width;
    const center = wH / 2;
    ctx.clearRect(0, 0, wH, wH);
    ctx.fillStyle = "#f5f5f5";
    ctx.fillRect(0, 0, wH, wH);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(center, center, center - 10, 0, Math.PI * 2);
    ctx.stroke();
    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI / 6) * i;
      const inner = center - 15;
      const outer = center - 5;
      ctx.beginPath();
      ctx.moveTo(
        center + inner * Math.sin(angle),
        center - inner * Math.cos(angle)
      );
      ctx.lineTo(
        center + outer * Math.sin(angle),
        center - outer * Math.cos(angle)
      );
      ctx.stroke();
    }

    const sec = date.getSeconds();
    const min = date.getMinutes();
    const hr = date.getHours() % 12;

    const drawHand = (value, max, length, width, color) => {
      const angle = (Math.PI * 2 * (value / max)) - Math.PI / 2;
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.lineTo(
        center + length * Math.cos(angle),
        center + length * Math.sin(angle)
      );
      ctx.stroke();
    };

    drawHand(hr + min / 60, 12, center - 55, 4, "#000");
    drawHand(min + sec / 60, 60, center - 35, 3, "#000");
    drawHand(sec, 60, center - 25, 2, "red");
  };

  const render = () => {
    const now = new Date();
    if (analogMode) {
      canvas.style.display = "block";
      digital.style.display = "none";
      drawAnalog(now);
    } else {
      canvas.style.display = "none";
      digital.style.display = "block";
      digital.innerText = formatTime(now);
    }
  };

  layout?.addEventListener("dblclick", () => {
    analogMode = !analogMode;
    render();
  });

  render();
  setInterval(render, 1000);
}

function initControlPanel(w) {
  const menu = w.querySelector(".menu-bar");
  const body = w.querySelector(".window-body");
  if (!menu || !body) return;

  menu.innerHTML = `
    <div class="menu-item cp-menu-item active" data-view="desktop">Desktop</div>
    <div class="menu-item cp-menu-item" data-view="color">Colors</div>
    <div class="menu-item cp-menu-item" data-view="screensaver">Screensaver</div>
    <div class="menu-item cp-menu-item" data-view="fonts">Fonts</div>
    <div class="menu-item cp-menu-item" data-view="home">Home</div>
  `;

  body.innerHTML = `
    <div class="cp-menu-bar">
      <button class="task-btn cp-tab-btn active" data-view="desktop">Desktop</button>
      <button class="task-btn cp-tab-btn" data-view="color">Colors</button>
      <button class="task-btn cp-tab-btn" data-view="screensaver">Screensaver</button>
      <button class="task-btn cp-tab-btn" data-view="fonts">Fonts</button>
      <button class="task-btn cp-tab-btn" data-view="home">Home</button>
    </div>
    <div class="cp-view-area"></div>
  `;

  const viewArea = body.querySelector(".cp-view-area");

  const renderHome = () => {
    viewArea.innerHTML = wm.getControlPanelContent();
  };

  const setActive = (view) => {
    body
      .querySelectorAll(".cp-tab-btn")
      .forEach((btn) => btn.classList.toggle("active", btn.dataset.view === view));
    menu
      .querySelectorAll(".cp-menu-item")
      .forEach((btn) => btn.classList.toggle("active", btn.dataset.view === view));
  };

  const switchView = (view) => {
    setActive(view);
    if (view === "desktop") openCPDesktop(viewArea);
    else if (view === "color") openCPColor(viewArea);
    else if (view === "screensaver") openCPScreensaver(viewArea);
    else if (view === "fonts") openCPFonts(viewArea);
    else renderHome();
  };

  body.querySelectorAll(".cp-tab-btn").forEach((btn) => {
    btn.onclick = () => switchView(btn.dataset.view);
  });

  menu.querySelectorAll(".cp-menu-item").forEach((btn) => {
    btn.onclick = () => switchView(btn.dataset.view);
  });

  switchView("desktop");
}

function openCPFonts(target, containerOverride) {
  let targetContainer = containerOverride;
  if (!targetContainer && target?.classList?.contains("cp-view-area")) {
    targetContainer = target;
  }
  if (!targetContainer && target?.closest) {
    const area = target.closest(".cp-view-area");
    if (area) targetContainer = area;
  }
  const w = target?.closest ? target.closest(".window") : null;
  const body =
    targetContainer ||
    (w ? w.querySelector(".window-body") : null) ||
    (target instanceof HTMLElement ? target : null);
  if (!body) return;

  if (w) {
    w
      .querySelectorAll(".cp-tab-btn, .cp-menu-item")
      .forEach((btn) =>
        btn.classList.toggle("active", btn.dataset.view === "fonts")
      );
  }

  const fontOptions = ["Inter", "Roboto", "Open Sans", "Press Start 2P", "VT323"]
    .map((f) => `<option value="${f}">${f}</option>`)
    .join("");

  body.innerHTML = `<div class="cp-settings-layout"><div class="cp-section"><label style="display:block;font-size:12px;margin-bottom:6px;">Choose a Google Font</label><select id="cp-font-select" style="width:100%;margin-bottom:8px;">${fontOptions}</select><label style="display:block;font-size:12px;margin-bottom:4px;">Or enter a Google Font name</label><input type="text" id="cp-font-custom" placeholder="e.g. Space Grotesk" style="width:100%;margin-bottom:8px;"><div class="cp-font-preview" id="cp-font-preview-text">The quick brown fox jumps over the lazy dog.</div><div style="text-align:right;margin-top:8px;"><button class="task-btn" onclick="applyFontSelection()">Apply</button></div></div></div>`;

  const select = body.querySelector("#cp-font-select");
  const custom = body.querySelector("#cp-font-custom");
  const preview = body.querySelector("#cp-font-preview-text");

  const updatePreview = () => {
    const font = (custom?.value.trim() || select?.value || "Segoe UI").trim();
    const family = `'${font}', sans-serif`;
    if (preview) {
      preview.style.fontFamily = family;
      preview.textContent = `The quick brown fox jumps over the lazy dog. (${font})`;
    }
  };

  select?.addEventListener("change", updatePreview);
  custom?.addEventListener("input", updatePreview);
  updatePreview();
}

function loadGoogleFont(fontName) {
  if (!fontName) return;
  const encodedName = fontName.trim().replace(/\s+/g, "+");
  const href = `https://fonts.googleapis.com/css2?family=${encodedName}:wght@400;700&display=swap`;
  let link = document.getElementById("cp-google-font-link");
  if (!link) {
    link = document.createElement("link");
    link.id = "cp-google-font-link";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }
  link.href = href;
}

function applyFontSelection() {
  const custom = document.getElementById("cp-font-custom");
  const select = document.getElementById("cp-font-select");
  const chosen = (custom?.value.trim() || select?.value || "").trim();
  if (!chosen) return;
  loadGoogleFont(chosen);
  const family = `'${chosen}', sans-serif`;
  document.documentElement.style.setProperty("--font-main", family);
  const preview = document.getElementById("cp-font-preview-text");
  if (preview) {
    preview.style.fontFamily = family;
    preview.textContent = `The quick brown fox jumps over the lazy dog. (${chosen})`;
  }
}

function openCPColor(target, containerOverride) {
  let targetContainer = containerOverride;
  if (!targetContainer && target?.classList?.contains("cp-view-area")) {
    targetContainer = target;
  }
  if (!targetContainer && target?.closest) {
    const area = target.closest(".cp-view-area");
    if (area) targetContainer = area;
  }
  const w = target?.closest ? target.closest(".window") : null;
  const body =
    targetContainer ||
    (w ? w.querySelector(".window-body") : null) ||
    (target instanceof HTMLElement ? target : null);
  if (!body) return;
  if (w) {
    w
      .querySelectorAll(".cp-tab-btn, .cp-menu-item")
      .forEach((btn) =>
        btn.classList.toggle("active", btn.dataset.view === "color")
      );
  }
  body.innerHTML = `<div class="cp-settings-layout"><div class="cp-section"><select id="cs-sel" style="width:100%"><option value="d">Default</option><option value="h">Hot Dog</option><option value="p">Plasma</option></select><button class="task-btn" onclick="applyTheme()">Apply</button></div></div>`;
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

let chessLibPromise = null;

function loadChessLibrary() {
  if (!chessLibPromise) {
    chessLibPromise = new Promise((resolve, reject) => {
      if (window.Chess) return resolve(window.Chess);
      const s = document.createElement("script");
      s.src = "./vendor/chess.min.js";
      s.onload = () => resolve(window.Chess);
      s.onerror = (e) => reject(e);
      document.head.appendChild(s);
    });
  }
  return chessLibPromise;
}

function initStockfishEngine(w) {
  if (w.chessWorkerReady) return Promise.resolve(w.chessWorker);
  if (w.chessWorkerInit) return w.chessWorkerInit;
  w.chessWorkerInit = new Promise((resolve, reject) => {
    try {
      const worker = new Worker(
        "https://cdn.jsdelivr.net/npm/stockfish@16.1.1/src/stockfish.js"
      );
      w.chessWorker = worker;
      const onMsg = (event) => {
        const msg = String(event.data || "");
        if (msg.includes("uciok")) worker.postMessage("isready");
        if (msg.includes("readyok")) {
          worker.removeEventListener("message", onMsg);
          w.chessWorkerReady = true;
          resolve(worker);
        }
      };
      worker.addEventListener("message", onMsg);
      worker.onerror = (e) => reject(e);
      worker.postMessage("uci");
      worker.postMessage("setoption name Skill Level value 5");
      worker.postMessage("ucinewgame");
    } catch (err) {
      reject(err);
    }
  });
  return w.chessWorkerInit;
}

function initChess(w) {
  const boardEl = w.querySelector(".chess-board"),
    statusEl = w.querySelector(".chess-status"),
    movesEl = w.querySelector(".chess-moves"),
    fenInput = w.querySelector("#chess-fen"),
    newBtn = w.querySelector(".chess-new"),
    copyBtn = w.querySelector(".chess-copy"),
    pasteBtn = w.querySelector(".chess-paste"),
    loadBtn = w.querySelector(".chess-load");
  const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
  const symbols = {
    p: "♟",
    r: "♜",
    n: "♞",
    b: "♝",
    q: "♛",
    k: "♚"
  };
  let game = null;
  let selected = null;
  let legalTargets = [];
  let userTurn = true;

  const setStatus = (msg) => (statusEl.innerText = msg);

  const renderMoves = () => {
    movesEl.innerHTML = "";
    const hist = game ? game.history({ verbose: true }) : [];
    for (let i = 0; i < hist.length; i += 2) {
      const white = hist[i];
      const black = hist[i + 1];
      const row = document.createElement("div");
      row.className = "chess-move-row";
      row.innerHTML = `<span class="mv-num">${i / 2 + 1}.</span><span class="mv-white">${
        white ? white.san : ""
      }</span><span class="mv-black">${black ? black.san : ""}</span>`;
      movesEl.appendChild(row);
    }
    movesEl.scrollTop = movesEl.scrollHeight;
  };

  const renderBoard = () => {
    if (!game) return;
    boardEl.innerHTML = "";
    const boardState = game.board();
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const square = files[col] + (8 - row);
        const cell = document.createElement("div");
        cell.className =
          "chess-square " + ((row + col) % 2 === 0 ? "light" : "dark");
        if (square === selected) cell.classList.add("selected");
        if (legalTargets.includes(square)) cell.classList.add("hint");
        cell.dataset.square = square;
        const piece = boardState[row][col];
        if (piece) {
          const span = document.createElement("span");
          span.className = "chess-piece";
          span.innerText = symbols[piece.type];
          if (piece.color === "w") span.classList.add("white");
          cell.appendChild(span);
        }
        boardEl.appendChild(cell);
      }
    }
    fenInput.value = game.fen();
  };

  const resetSelection = () => {
    selected = null;
    legalTargets = [];
  };

  const syncState = (fromPlayer) => {
    renderBoard();
    renderMoves();
    if (game.game_over()) {
      const res = game.in_checkmate()
        ? fromPlayer
          ? "Checkmate! You win."
          : "Checkmate! Computer wins."
        : "Game over.";
      setStatus(res);
      userTurn = false;
      return;
    }
    if (fromPlayer) {
      userTurn = false;
      setStatus("Computer thinking...");
      requestEngineMove();
    } else {
      userTurn = true;
      setStatus("Your move (White)");
    }
  };

  const applyEngineMove = (uci) => {
    try {
      const move = game.move({
        from: uci.slice(0, 2),
        to: uci.slice(2, 4),
        promotion: "q"
      });
      if (move) resetSelection();
      syncState(false);
    } catch (e) {
      setStatus("Engine move failed");
      userTurn = true;
    }
  };

  const requestEngineMove = () => {
    initStockfishEngine(w)
      .then((worker) => {
        const listener = (event) => {
          const msg = String(event.data || "");
          if (msg.startsWith("bestmove")) {
            const parts = msg.split(" ");
            const best = parts[1];
            worker.removeEventListener("message", listener);
            applyEngineMove(best);
          }
        };
        worker.addEventListener("message", listener);
        worker.postMessage("position fen " + game.fen());
        worker.postMessage("go movetime 800");
      })
      .catch(() => {
        setStatus("Engine unavailable");
        userTurn = true;
      });
  };

  const selectSquare = (square) => {
    if (!game || !userTurn) return;
    const piece = game.get(square);
    if (selected === square) {
      resetSelection();
      renderBoard();
      return;
    }
    if (selected) {
      const move = game.move({ from: selected, to: square, promotion: "q" });
      if (move) {
        resetSelection();
        syncState(true);
        return;
      }
    }
    if (piece && piece.color === "w") {
      selected = square;
      legalTargets = game
        .moves({ square, verbose: true })
        .map((m) => m.to);
    } else {
      resetSelection();
    }
    renderBoard();
  };

  boardEl.addEventListener("click", (e) => {
    const target = e.target.closest(".chess-square");
    if (target?.dataset.square) selectSquare(target.dataset.square);
  });

  newBtn.onclick = () => {
    if (!game) return;
    game.reset();
    resetSelection();
    initStockfishEngine(w).catch(() => {});
    syncState(false);
  };

  copyBtn.onclick = () => {
    fenInput.select();
    document.execCommand("copy");
  };

  pasteBtn.onclick = async () => {
    if (navigator.clipboard?.readText) {
      try {
        fenInput.value = await navigator.clipboard.readText();
      } catch (e) {
        /* ignore */
      }
    }
  };

  loadBtn.onclick = () => {
    if (!game) return;
    const fen = fenInput.value.trim();
    try {
      const ok = game.load(fen);
      if (ok) {
        resetSelection();
        syncState(false);
        return;
      }
    } catch (e) {}
    alert("Invalid FEN string");
  };

  w.chessCleanup = () => {
    if (w.chessWorker) w.chessWorker.terminate();
  };

  loadChessLibrary()
    .then((ChessClass) => {
      game = new ChessClass();
      resetSelection();
      renderBoard();
      renderMoves();
      setStatus("Your move (White)");
      initStockfishEngine(w).catch(() => setStatus("Engine unavailable"));
    })
    .catch(() => setStatus("Failed to load chess.js"));
}

function initFileManager(w) {
  w.cP = "C:\\";
  w.cD = MOCK_FS["C:\\"];
  w.currentDirObj = w.cD;
  rFT(w);
  rFL(w);
}

function initPdfReader(win, initData) {
  const fileInput = win.querySelector(".pdf-file-input");
  const urlInput = win.querySelector(".pdf-url-input");
  const loadBtn = win.querySelector(".pdf-load-btn");
  const frame = win.querySelector(".pdf-frame");
  const status = win.querySelector(".pdf-status");

  const loadDocument = (src, label) => {
    if (!src) {
      frame.src = "";
      status.textContent = "No document loaded";
      return;
    }
    frame.src = src;
    status.textContent = `Loaded ${label}`;
  };

  const initialSrc = initData?.src || DEFAULT_PDF_DATA_URI;
  loadDocument(initialSrc, initData?.name || "Sample.pdf");

  fileInput?.addEventListener("change", (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => loadDocument(ev.target.result, file.name);
    reader.readAsDataURL(file);
  });

  loadBtn?.addEventListener("click", () => {
    const url = urlInput?.value.trim();
    if (url) loadDocument(url, url);
  });

  urlInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      loadBtn?.click();
    }
  });
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
      w.currentDirObj = o;
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
        if (i.type === "dir") {
          const np = w.cP === "C\\" ? w.cP + k : w.cP + "\\" + k;
          w.cP = np;
          w.cD = i;
          w.currentDirObj = i;
          rFT(w);
          rFL(w);
        } else if (i.app) {
          const size =
            i.app === "skifree" ? { w: 520, h: 520 } : { w: 400, h: 300 };
          wm.openWindow(i.app, i.app.toUpperCase(), size.w, size.h, i.content);
        }
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

let jsDosLoadPromise = null;

function loadJsDos() {
  if (window.Dos) return Promise.resolve();       // already loaded

  if (jsDosLoadPromise) return jsDosLoadPromise;  // already loading

  jsDosLoadPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://js-dos.com/6.22/current/js-dos.js";
    script.onload = () => resolve();
    script.onerror = (e) => reject(e);
    document.head.appendChild(script);
  });

  return jsDosLoadPromise;
}

function initDoom(win) {
  const container = win.querySelector("#doom-container");
  if (!container) return;

  const savedTitle = document.title;
  const restoreTitle = () => { document.title = savedTitle; };
  
  loadJsDos()
    .then(() => {
      return window.Dos(container, {
        style: "none",
        wdosboxUrl: "https://js-dos.com/6.22/current/wdosbox.js"
      }).ready((fs, main) => {
        restoreTitle();
        fs.extract("https://js-dos.com/cdn/upload/DOOM-@evilution.zip").then(() => {
          restoreTitle();
          main(["-c", "cd doom", "-c", "doom"]).then((ci) => {
            win.doomCI = ci;
            restoreTitle();
            setTimeout(restoreTitle, 100);
          });
        });
      });
    })
    .catch((err) => {
      console.error("Failed to load js-dos:", err);
      container.innerHTML =
        '<div style="color:#f44;font-family:var(--font-main);padding:8px;">Failed to load DOOM (js-dos load error).</div>';
    });
}

function initSoundRecorder(w) {
  const canvas = w.querySelector(".sound-wave-canvas");
  const ctx = canvas.getContext("2d");
  const status = w.querySelector("#sound-status");
  
  let mediaRecorder;
  let audioChunks = [];
  let audioBlob = null;
  let audioUrl = null;
  let audioCtx;
  let analyser;
  let dataArray;
  let source;
  let streamRef;
  let animationId;

  // Visualization Loop
  function draw() {
    if (!analyser) return;
    animationId = requestAnimationFrame(draw);
    analyser.getByteTimeDomainData(dataArray);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#0f0"; // Green wave
    ctx.beginPath();
    const sliceWidth = canvas.width / dataArray.length;
    let x = 0;
    for (let i = 0; i < dataArray.length; i++) {
      const v = dataArray[i] / 128.0;
      const y = (v * canvas.height) / 2;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
      x += sliceWidth;
    }
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
  }

  // RECORD
  w.querySelector("#btn-rec").onclick = async () => {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef = stream;
      
      // Setup Visualizer
      analyser = audioCtx.createAnalyser();
      source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.fftSize = 256;
      dataArray = new Uint8Array(analyser.frequencyBinCount);
      draw();

      // Setup Recorder
      mediaRecorder = new MediaRecorder(stream);
      audioChunks = [];
      mediaRecorder.ondataavailable = event => audioChunks.push(event.data);
      mediaRecorder.onstop = () => {
        audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        audioUrl = URL.createObjectURL(audioBlob);
        status.innerText = "Stopped. Ready to play.";
        cancelAnimationFrame(animationId);
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height); // clear canvas
      };

      mediaRecorder.start();
      status.innerText = "Recording...";
      status.style.color = "red";
    } catch (err) {
      status.innerText = "Error: Mic access denied.";
    }
  };

  // STOP
  w.querySelector("#btn-stop").onclick = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
      if (streamRef) streamRef.getTracks().forEach(track => track.stop());
      status.style.color = "black";
    }
  };

  // PLAY
  w.querySelector("#btn-play").onclick = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
      status.innerText = "Playing...";
      audio.onended = () => { status.innerText = "Ready"; };
    }
  };
}

function initCharMap(w) {
  const g = w.querySelector("#char-grid"),
    ip = w.querySelector("#char-copy-input"),
    preview = w.querySelector(".char-preview"),
    codeLabel = w.querySelector("#char-code-label"),
    fontSelect = w.querySelector("#char-font-select");

  let activeCell = null;

  const applyFont = (fontValue) => {
    g.style.fontFamily = fontValue;
    preview.style.fontFamily = fontValue;
  };

  const setSelection = (cell) => {
    if (!cell) return;
    if (activeCell) activeCell.classList.remove("active");
    activeCell = cell;
    cell.classList.add("active");
    const chr = cell.dataset.char;
    const code = parseInt(cell.dataset.code, 10);
    preview.innerText = chr;
    codeLabel.innerText = `U+${code.toString(16).toUpperCase().padStart(4, "0")} · Dec ${code}`;
  };

  for (let i = 32; i < 256; i++) {
    const c = String.fromCharCode(i);
    const d = document.createElement("div");
    d.className = "char-cell";
    d.innerText = c;
    d.dataset.char = c;
    d.dataset.code = i;
    d.onclick = () => {
      ip.value += c;
      setSelection(d);
    };
    g.appendChild(d);
  }

  fontSelect?.addEventListener("change", (e) => applyFont(e.target.value));
  setSelection(g.querySelector('[data-code="65"]') || g.querySelector(".char-cell"));
  applyFont(fontSelect?.value || "'Times New Roman', serif");
}

function copyCharMap(b) {
  b.closest(".window").querySelector("#char-copy-input").select();
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

function exportDbToCsv(b) {
  const w = b.closest(".window");
  const headers = ["Name", "Phone", "Email"];
  const rows = w.dbData || [];
  const csvLines = [
    headers,
    ...rows.map((r) => [r.name || "", r.phone || "", r.email || ""])
  ].map((line) =>
    line
      .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
      .join(",")
  );

  const blob = new Blob([csvLines.join("\r\n")], {
    type: "text/csv;charset=utf-8;"
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "data_manager_export.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

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

function initConsole(w) {
  w.consoleState = {
    cwd: "C:\\",
    history: [],
    historyIndex: null
  };
  updateConsolePrompt(w);
  const input = w.querySelector(".console-input");
  if (input) input.focus();
}

function getConsoleState(w) {
  if (!w.consoleState) initConsole(w);
  return w.consoleState;
}

function updateConsolePrompt(w) {
  const state = getConsoleState(w);
  const prompt = w.querySelector(".console-line span");
  if (prompt) prompt.textContent = `${state.cwd}>`;
}

function getPathSegments(pathStr) {
  if (!pathStr) return [];
  const cleaned = pathStr.replace(/^[A-Za-z]:/, "").replace(/^\\+/, "");
  return cleaned ? cleaned.split(/\\+/).filter(Boolean) : [];
}

function resolveConsolePath(targetPath, cwd) {
  let baseSegments = getPathSegments(cwd);
  let remaining = targetPath || "";
  const driveMatch = remaining.match(/^([A-Za-z]):/);
  if (driveMatch) {
    if (driveMatch[1].toUpperCase() !== "C") return { path: null, node: null };
    baseSegments = [];
    remaining = remaining.slice(driveMatch[0].length);
  }
  if (remaining.startsWith("\\")) {
    baseSegments = [];
    remaining = remaining.replace(/^\\+/, "");
  }
  const additional = getPathSegments(remaining);
  const segments = [...baseSegments];
  additional.forEach((seg) => {
    if (!seg || seg === ".") return;
    if (seg === "..") segments.pop();
    else segments.push(seg.toUpperCase());
  });
  let node = MOCK_FS["C\\"] || MOCK_FS["C:\\"];
  segments.forEach((seg) => {
    if (!node || !node.children) return;
    const key = Object.keys(node.children).find(
      (k) => k.toUpperCase() === seg
    );
    node = key ? node.children[key] : null;
  });
  const normalizedPath =
    "C:\\" + (segments.length ? segments.join("\\") : "");
  return { path: normalizedPath.replace(/\\\\+/g, "\\"), node };
}

function appendConsoleLine(w, text = "") {
  const output = w.querySelector(".console-output");
  if (!output) return;
  const line = document.createElement("div");
  line.textContent = text;
  output.appendChild(line);
  output.scrollTop = output.scrollHeight;
}

function processConsoleCommand(w, input) {
  const state = getConsoleState(w);
  appendConsoleLine(w, `${state.cwd}>${input}`);
  if (!input.trim()) {
    updateConsolePrompt(w);
    return;
  }
  const [rawCmd, ...rest] = input.trim().split(/\s+/);
  const cmd = rawCmd.toLowerCase();
  const argLine = rest.join(" ");
  const lowerArgs = argLine.trim();
  if (cmd === "cls") {
    const output = w.querySelector(".console-output");
    if (output) output.innerHTML = "";
    return;
  }
  if (cmd === "help") {
    [
      "Egg Oriel Console Commands:",
      "HELP - Show this help text",
      "DIR  - List files and folders",
      "CD   - Change directory",
      "CLS  - Clear the screen",
      "ECHO - Print text"
    ].forEach((line) => appendConsoleLine(w, line));
  } else if (cmd === "dir") {
    const { node } = resolveConsolePath(lowerArgs || state.cwd, state.cwd);
    if (!node || node.type !== "dir") {
      appendConsoleLine(w, "File Not Found");
    } else {
      const entries = Object.keys(node.children || {});
      entries.sort();
      entries.forEach((key) => appendConsoleLine(w, key));
      if (!entries.length) appendConsoleLine(w, "(empty)");
    }
  } else if (cmd === "echo") {
    appendConsoleLine(w, lowerArgs);
  } else if (cmd === "cd") {
    if (!lowerArgs) {
      appendConsoleLine(w, state.cwd);
    } else {
      const { path, node } = resolveConsolePath(lowerArgs, state.cwd);
      if (node && node.type === "dir" && path) {
        state.cwd = path;
        updateConsolePrompt(w);
      } else {
        appendConsoleLine(w, "The system cannot find the path specified.");
      }
    }
  } else {
    appendConsoleLine(
      w,
      `'${rawCmd}' is not recognized as an internal or external command.`
    );
  }
}

function handleConsoleKey(e) {
  const win = e.target.closest(".window");
  if (!win) return;
  const state = getConsoleState(win);
  if (e.key === "Enter") {
    e.preventDefault();
    processConsoleCommand(win, e.target.value);
    if (e.target.value.trim()) {
      state.history.push(e.target.value.trim());
    }
    state.historyIndex = null;
    e.target.value = "";
    setTimeout(() => e.target.focus(), 0);
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    if (!state.history.length) return;
    if (state.historyIndex === null) state.historyIndex = state.history.length - 1;
    else if (state.historyIndex > 0) state.historyIndex--;
    e.target.value = state.history[state.historyIndex] || "";
    e.target.setSelectionRange(e.target.value.length, e.target.value.length);
  } else if (e.key === "ArrowDown") {
    e.preventDefault();
    if (state.historyIndex === null) return;
    if (state.historyIndex < state.history.length - 1) state.historyIndex++;
    else state.historyIndex = null;
    e.target.value =
      state.historyIndex === null ? "" : state.history[state.historyIndex];
    e.target.setSelectionRange(e.target.value.length, e.target.value.length);
  }
}

async function runCompiler(e) {
  const win = e?.target?.closest(".window") || document.querySelector(".window.active");
  const output = win?.querySelector("#compiler-out");
  const editor = win?.querySelector(".compiler-editor");

  if (!output) return;

  const code = editor?.value || "";
  if (!code.trim()) {
    output.innerHTML = `<pre>No source code provided.</pre>`;
    return;
  }

  output.innerHTML = `<pre>Sending code to Compiler Explorer...</pre>`;

  const payload = {
    source: code,
    options: {
      userArguments: "",
      compilerOptions: { executorRequest: true },
      filters: { execute: true },
      executeParameters: { args: [] }
    }
  };

  const lines = [];
  try {
    const res = await fetch("https://godbolt.org/api/compiler/g131/compile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error(`compiler service responded with ${res.status}`);
    }

    const data = await res.json();
    const compilerStdout = (data.stdout || []).map((s) => s.text).join("\n").trim();
    const compilerStderr = (data.stderr || []).map((s) => s.text).join("\n").trim();
    const execStdout = (data.execResult?.stdout || [])
      .map((s) => s.text)
      .join("\n")
      .trim();
    const execStderr = (data.execResult?.stderr || [])
      .map((s) => s.text)
      .join("\n")
      .trim();
    const exitCode = data.execResult?.code ?? data.code;

    lines.push("Compilation via Compiler Explorer (gcc 13.1)");
    if (compilerStdout || compilerStderr) {
      lines.push("Compiler output:");
      if (compilerStdout) lines.push(compilerStdout);
      if (compilerStderr) lines.push(compilerStderr);
    }
    lines.push(`Exit code: ${exitCode}`);
    if (execStderr) {
      lines.push("Stderr:");
      lines.push(execStderr);
    }
    lines.push("Program output:");
    lines.push(execStdout || "(no output)");
  } catch (err) {
    lines.push(`Compilation failed: ${err.message}`);
  }

  output.innerHTML = `<pre>${lines.join("\n")}</pre>`;
}

async function runPython(e) {
  const win = e?.target?.closest(".window") || document.querySelector(".window.active");
  const output = win?.querySelector("#python-out");
  const editor = win?.querySelector(".compiler-editor");

  if (!output) return;

  const code = editor?.value || "";

  if (!code.trim()) {
    output.innerHTML = `<pre>No script provided.</pre>`;
    return;
  }

  const body = {
    source: code,
    options: {
      executeParameters: { args: [], stdin: "" },
      compilerOptions: {},
      filters: { execute: true },
      tools: []
    }
  };

  output.innerHTML = `<pre>Sending code to Compiler Explorer...</pre>`;

  try {
    const response = await fetch("https://godbolt.org/api/compiler/python312/compile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const text = await response.text();
    if (!response.ok) throw new Error(text || response.statusText);

    const pre = document.createElement("pre");
    pre.textContent = text;
    output.innerHTML = "";
    output.appendChild(pre);
  } catch (err) {
    const pre = document.createElement("pre");
    pre.textContent = `Execution failed: ${err.message}`;
    output.innerHTML = "";
    output.appendChild(pre);
  }
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

function initSkiFree(win) {
  const canvas = win.querySelector(".skifree-canvas");
  const layout = win.querySelector(".skifree-layout");
  const scoreEl = win.querySelector(".skifree-score");
  const speedEl = win.querySelector(".skifree-speed");
  const statusEl = win.querySelector(".skifree-status");
  const resetBtn = win.querySelector(".skifree-reset");

  if (!canvas || !layout) return;

  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const pressed = {};
  const obstacles = [];
  const skier = { x: width / 2, y: height - 50, vx: 0, jumpTimer: 0 };
  let monster = null; // Monster Object
  let speed = 2.2;
  let score = 0;
  let playing = true;
  let lastTs = 0;
  let raf = 0;

  layout.focus();

  // Inputs
  const onKeyDown = (e) => {
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
      e.preventDefault();
      pressed[e.key] = true;
    }
  };
  const onKeyUp = (e) => { if (pressed[e.key]) pressed[e.key] = false; };
  layout.addEventListener("keydown", onKeyDown);
  layout.addEventListener("keyup", onKeyUp);

  const resetCourse = () => {
    obstacles.length = 0;
    monster = null;
    score = 0;
    speed = 2.2;
    skier.x = width / 2;
    skier.vx = 0;
    skier.jumpTimer = 0;
    playing = true;
    statusEl.textContent = "Carving fresh powder";
    scoreEl.textContent = "0";
    lastTs = 0;
    layout.focus();
  };

  const spawnObstacle = () => {
    const type = Math.random() < 0.7 ? "tree" : "rock";
    const x = Math.random() * width;
    const y = -50;
    obstacles.push({ x, y, type });
  };

  const drawEntity = (x, y, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x - 5, y - 10, 10, 20); // Simple box representation
  };

  // MONSTER LOGIC
  const updateMonster = (dt) => {
    if (!monster && score > 2000) { // Spawn threshold
      monster = { x: Math.random() < 0.5 ? 0 : width, y: -100, speed: 0 };
      statusEl.textContent = "RUN! IT'S THE MONSTER!";
      statusEl.style.color = "red";
    }

    if (monster) {
      monster.speed = speed + 20; // Always faster than you
      // Chase logic
      const dx = skier.x - monster.x;
      const dy = skier.y - monster.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      
      monster.x += (dx / dist) * monster.speed * dt;
      monster.y += (dy / dist) * monster.speed * dt;

      // Draw Monster
      ctx.fillStyle = "grey";
      ctx.fillRect(monster.x - 10, monster.y - 20, 20, 40); // Big grey box
      ctx.fillStyle = "red"; // Eyes
      ctx.fillRect(monster.x - 5, monster.y - 15, 3, 3);
      ctx.fillRect(monster.x + 2, monster.y - 15, 3, 3);

      // Eat logic
      if (dist < 20) {
        playing = false;
        statusEl.textContent = "CHOMP! Game Over.";
      }
    }
  };

  const drawGame = () => {
    // Clear
    ctx.fillStyle = "#f5fbff";
    ctx.fillRect(0, 0, width, height);
    
    // Draw Skier
    ctx.fillStyle = "red";
    ctx.fillRect(skier.x - 4, skier.y - 10, 8, 20);

    // Draw Obstacles
    obstacles.forEach(o => {
      ctx.fillStyle = o.type === "tree" ? "green" : "grey";
      if(o.type === "tree") {
          ctx.beginPath(); ctx.moveTo(o.x, o.y-10); ctx.lineTo(o.x-5, o.y+5); ctx.lineTo(o.x+5, o.y+5); ctx.fill();
      } else {
          ctx.beginPath(); ctx.arc(o.x, o.y, 5, 0, Math.PI*2); ctx.fill();
      }
    });
  };

  const update = (dt) => {
    if (!playing) return;

    // Skier Physics
    const steer = (pressed["ArrowRight"] ? 1 : 0) - (pressed["ArrowLeft"] ? 1 : 0);
    skier.vx += steer * 150 * dt;
    skier.vx *= 0.9;
    skier.x = Math.max(0, Math.min(width, skier.x + skier.vx * dt));

    // Speed & Score
    const targetSpeed = pressed["ArrowDown"] ? 1.5 : 3.0;
    speed += (targetSpeed - speed) * 0.5 * dt;
    score += speed * dt * 10;
    scoreEl.textContent = Math.floor(score);
    speedEl.textContent = (speed * 10).toFixed(0) + " mph";

    // Obstacles
    if (Math.random() < 0.05) spawnObstacle();
    for (let i = obstacles.length - 1; i >= 0; i--) {
      obstacles[i].y += speed * 50 * dt;
      // Collision
      const dx = obstacles[i].x - skier.x;
      const dy = obstacles[i].y - skier.y;
      if (Math.abs(dx) < 10 && Math.abs(dy) < 10) {
        playing = false;
        statusEl.textContent = "Wiped Out!";
      }
      if (obstacles[i].y > height + 50) obstacles.splice(i, 1);
    }
    
    updateMonster(dt);
  };

  const loop = (ts) => {
    const dt = lastTs ? Math.min((ts - lastTs) / 1000, 0.1) : 0;
    lastTs = ts;
    update(dt);
    drawGame();
    if (playing || monster) raf = requestAnimationFrame(loop); // Keep drawing if monster eats you
  };

  resetBtn.onclick = resetCourse;
  resetCourse();
  raf = requestAnimationFrame(loop);

  win.skifreeCleanup = () => {
    cancelAnimationFrame(raf);
    layout.removeEventListener("keydown", onKeyDown);
    layout.removeEventListener("keyup", onKeyUp);
  };
}

function initSimCity(w) {
  const map = w.querySelector(".simcity-map");
  const fundsEl = w.querySelector(".simcity-funds");
  const popEl = w.querySelector(".simcity-pop");
  const happinessEl = w.querySelector(".simcity-happiness");
  const logEl = w.querySelector(".simcity-log");
  const buttons = Array.from(w.querySelectorAll(".simcity-tools button"));
  const size = 12;
  const costs = { road: 20, house: 100, power: 200, park: 50 };
  const grid = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => "grass")
  );
  let funds = 5000;
  let tool = "road";

  map.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

  function setTool(t) {
    tool = t;
    buttons.forEach((b) => b.classList.toggle("active", b.dataset.tool === t));
  }

  function neighbors(x, y) {
    const res = [];
    [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1]
    ].forEach(([dx, dy]) => {
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && nx < size && ny >= 0 && ny < size) res.push(grid[ny][nx]);
    });
    return res;
  }

  function updateStats() {
    let population = 0;
    let parks = 0;
    let powerPlants = 0;

    grid.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell === "park") parks++;
        if (cell === "power") powerPlants++;
        if (cell === "house") {
          const adj = neighbors(x, y);
          const hasRoad = adj.includes("road");
          const hasPower = adj.includes("power");
          const hasPark = adj.includes("park");
          let growth = 10;
          if (hasRoad) growth += 20;
          if (hasPower) growth += 30;
          if (hasPark) growth += 5;
          population += growth;
        }
      });
    });

    const happiness = Math.max(
      0,
      Math.min(100, 45 + parks * 3 + Math.floor(population / 30) - powerPlants * 2)
    );

    fundsEl.textContent = funds;
    popEl.textContent = population;
    happinessEl.textContent = happiness;
  }

  function setTile(cell, type) {
    const x = Number(cell.dataset.x);
    const y = Number(cell.dataset.y);

    if (type === "bulldoze") {
      if (grid[y][x] !== "grass") {
        grid[y][x] = "grass";
        log(`Cleared (${x + 1}, ${y + 1}).`);
      }
      return updateCell(cell, y, x);
    }

    const cost = costs[type] || 0;
    if (funds < cost) return log("Not enough funds for that project.");
    funds -= cost;
    grid[y][x] = type;
    log(`Placed ${type} at (${x + 1}, ${y + 1}).`);
    updateCell(cell, y, x);
  }

  function updateCell(cell, y, x) {
    const type = grid[y][x];
    cell.dataset.type = type;
    cell.className = `simcity-cell tile-${type}`;
    updateStats();
  }

  function log(msg) {
    const lines = logEl.innerText.split("\n").filter(Boolean);
    lines.unshift(msg);
    logEl.innerText = lines.slice(0, 6).join("\n");
  }

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const cell = document.createElement("div");
      cell.className = "simcity-cell tile-grass";
      cell.dataset.x = x;
      cell.dataset.y = y;
      cell.dataset.type = "grass";
      cell.onclick = () => setTile(cell, tool);
      map.appendChild(cell);
    }
  }

  buttons.forEach((btn) => btn.addEventListener("click", () => setTool(btn.dataset.tool)));
  setTool("road");
  updateStats();
}

const MINES_ROWS = 9;
const MINES_COLS = 9;
const MINES_COUNT = 10;

let mines = [];
let mineState = "ready";
let mineTimer = null;
let mineStartTime = null;
let mineFlags = 0;

function initMinesweeper(w) {
  resetMines(w);
}

function resetMines(w) {
  const win = w || document.querySelector(".window.active");
  if (!win) return;

  const g = win.querySelector("#mines-grid");
  const counter = win.querySelector("#mines-count");
  const timer = win.querySelector("#mines-timer");
  const face = win.querySelector("#mines-face");

  stopMinesTimer();
  mineStartTime = null;
  mineState = "ready";
  mineFlags = 0;

  updateMinesLCD(counter, MINES_COUNT);
  updateMinesLCD(timer, 0);
  if (face) face.textContent = ":)";

  g.innerHTML = "";
  mines = Array.from({ length: MINES_ROWS * MINES_COLS }, () => ({
    m: false,
    r: false,
    f: false,
    n: 0
  }));

  placeMines();
  calculateAdjacency();

  for (let i = 0; i < mines.length; i++) {
    const c = document.createElement("div");
    c.className = "mine-cell";
    c.onclick = () => clickMine(i, g, win);
    c.oncontextmenu = (e) => toggleMineFlag(e, i, g, win);
    g.appendChild(c);
  }
}

function updateMinesLCD(el, val) {
  if (!el) return;
  el.textContent = String(Math.max(0, Math.min(999, val))).padStart(3, "0");
}

function placeMines() {
  let planted = 0;
  while (planted < MINES_COUNT) {
    const idx = Math.floor(Math.random() * mines.length);
    if (!mines[idx].m) {
      mines[idx].m = true;
      planted++;
    }
  }
}

function calculateAdjacency() {
  for (let i = 0; i < mines.length; i++) {
    mines[i].n = getMineNeighbors(i).filter((n) => mines[n].m).length;
  }
}

function getMineNeighbors(i) {
  const x = i % MINES_COLS;
  const y = Math.floor(i / MINES_COLS);
  const neighbors = [];

  for (let r = -1; r <= 1; r++) {
    for (let c = -1; c <= 1; c++) {
      if (r === 0 && c === 0) continue;
      const nx = x + c;
      const ny = y + r;
      if (nx < 0 || ny < 0 || nx >= MINES_COLS || ny >= MINES_ROWS) continue;
      neighbors.push(ny * MINES_COLS + nx);
    }
  }

  return neighbors;
}

function toggleMineFlag(e, i, g, win) {
  e.preventDefault();
  if (mineState === "lost" || mineState === "won") return;

  const cell = mines[i];
  if (cell.r) return;

  cell.f = !cell.f;
  mineFlags += cell.f ? 1 : -1;

  const counter = win.querySelector("#mines-count");
  updateMinesLCD(counter, MINES_COUNT - mineFlags);

  const el = g.children[i];
  if (cell.f) {
    el.classList.add("flagged");
    el.textContent = "⚑";
  } else {
    el.classList.remove("flagged");
    el.textContent = "";
  }
}

function clickMine(i, g, win) {
  if (mineState === "lost" || mineState === "won") return;
  const cell = mines[i];
  if (cell.r || cell.f) return;

  const timer = win.querySelector("#mines-timer");
  const face = win.querySelector("#mines-face");
  if (!mineStartTime) startMinesTimer(timer);

  revealMineCell(i, g);

  if (cell.m) {
    mineState = "lost";
    if (face) face.textContent = "X(";
    revealAllMines(g, i);
    stopMinesTimer();
    return;
  }

  checkMinesWin(win, g);
}

function revealMineCell(i, g) {
  const cell = mines[i];
  if (cell.r) return;

  const el = g.children[i];
  cell.r = true;
  el.classList.add("revealed");
  el.classList.remove("flagged");
  el.textContent = "";

  if (cell.m) {
    el.classList.add("bomb");
    el.textContent = "*";
    return;
  }

  if (cell.n > 0) {
    el.textContent = cell.n;
    el.classList.add(`c${Math.min(cell.n, 3)}`);
    return;
  }

  getMineNeighbors(i).forEach((n) => {
    if (!mines[n].r && !mines[n].m) revealMineCell(n, g);
  });
}

function revealAllMines(g, triggeredIndex) {
  mines.forEach((cell, idx) => {
    const el = g.children[idx];
    if (cell.m) {
      el.classList.add("revealed", "bomb");
      el.textContent = "*";
      if (idx === triggeredIndex) el.classList.add("blown");
    } else if (cell.f) {
      el.classList.add("revealed");
      el.textContent = "✕";
    }
  });
}

function checkMinesWin(win, g) {
  const revealedSafe = mines.filter((c) => c.r && !c.m).length;
  if (revealedSafe !== MINES_ROWS * MINES_COLS - MINES_COUNT) return;

  mineState = "won";
  const face = win.querySelector("#mines-face");
  if (face) face.textContent = "B)";
  stopMinesTimer();

  // Auto-flag remaining mines
  mines.forEach((cell, idx) => {
    if (cell.m && !cell.f) {
      g.children[idx].textContent = "⚑";
      g.children[idx].classList.add("flagged");
    }
  });
}

function startMinesTimer(timerEl) {
  mineStartTime = Date.now();
  mineTimer = setInterval(() => {
    const elapsed = Math.floor((Date.now() - mineStartTime) / 1000);
    updateMinesLCD(timerEl, elapsed);
  }, 1000);
}

function stopMinesTimer() {
  if (mineTimer) {
    clearInterval(mineTimer);
    mineTimer = null;
  }
}

window.onload = initScreensaver;