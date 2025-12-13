const MINES_ROWS = 9;
const MINES_COLS = 9;
const MINES_COUNT = 10;

let mines = [];
let mineState = "ready";
let mineTimer = null;
let mineStartTime = null;
let mineFlags = 0;

export function initMinesweeper(w) {
  resetMines(w);
}

export function resetMines(w) {
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

  if (g) g.innerHTML = "";
  mines = Array.from({ length: MINES_ROWS * MINES_COLS }, () => ({
    m: false,
    r: false,
    f: false,
    n: 0
  }));

  placeMines();
  calculateAdjacency();

  if (!g) return;
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
