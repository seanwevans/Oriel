import { BaseApp } from "./base/BaseApp.js";
const MINES_ROWS = 9;
const MINES_COLS = 9;
const MINES_COUNT = 10;

function updateMinesLCD(el, val) {
  if (!el) return;
  el.textContent = String(Math.max(0, Math.min(999, val))).padStart(3, "0");
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

export function initMinesweeper(w) {
  if (!w) return null;

  const grid = w.querySelector(".mines-grid");
  const counterEl = w.querySelector(".mines-count");
  const timerEl = w.querySelector(".mines-timer");
  const faceEl = w.querySelector(".mines-face");

  // Game state is scoped to this window so multiple Minesweeper instances
  // can run side by side without sharing boards, flags, or timers.
  let mines = [];
  let state = "ready";
  let timerId = null;
  let startTime = null;
  let flags = 0;

  function startTimer() {
    startTime = Date.now();
    timerId = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      updateMinesLCD(timerEl, elapsed);
    }, 1000);
  }

  function stopTimer() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
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

  function toggleFlag(e, i) {
    e.preventDefault();
    if (state === "lost" || state === "won") return;

    const cell = mines[i];
    if (cell.r) return;

    cell.f = !cell.f;
    flags += cell.f ? 1 : -1;

    updateMinesLCD(counterEl, MINES_COUNT - flags);

    const el = grid.children[i];
    if (cell.f) {
      el.classList.add("flagged");
      el.textContent = "⚑";
    } else {
      el.classList.remove("flagged");
      el.textContent = "";
    }
  }

  function clickCell(i) {
    if (state === "lost" || state === "won") return;
    const cell = mines[i];
    if (cell.r || cell.f) return;

    if (!startTime) startTimer();

    revealCell(i);

    if (cell.m) {
      state = "lost";
      if (faceEl) faceEl.textContent = "X(";
      revealAllMines(i);
      stopTimer();
      return;
    }

    checkWin();
  }

  function revealCell(i) {
    const cell = mines[i];
    if (cell.r) return;

    const el = grid.children[i];
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
      if (!mines[n].r && !mines[n].m) revealCell(n);
    });
  }

  function revealAllMines(triggeredIndex) {
    mines.forEach((cell, idx) => {
      const el = grid.children[idx];
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

  function checkWin() {
    const revealedSafe = mines.filter((c) => c.r && !c.m).length;
    if (revealedSafe !== MINES_ROWS * MINES_COLS - MINES_COUNT) return;

    state = "won";
    if (faceEl) faceEl.textContent = "B)";
    stopTimer();

    // Auto-flag remaining mines
    mines.forEach((cell, idx) => {
      if (cell.m && !cell.f) {
        grid.children[idx].textContent = "⚑";
        grid.children[idx].classList.add("flagged");
      }
    });
  }

  function reset() {
    stopTimer();
    startTime = null;
    state = "ready";
    flags = 0;

    updateMinesLCD(counterEl, MINES_COUNT);
    updateMinesLCD(timerEl, 0);
    if (faceEl) faceEl.textContent = ":)";

    if (grid) grid.innerHTML = "";
    mines = Array.from({ length: MINES_ROWS * MINES_COLS }, () => ({
      m: false,
      r: false,
      f: false,
      n: 0
    }));

    placeMines();
    calculateAdjacency();

    if (!grid) return;
    for (let i = 0; i < mines.length; i++) {
      const c = document.createElement("div");
      c.className = "mine-cell";
      c.addEventListener("click", () => clickCell(i));
      c.addEventListener("contextmenu", (e) => toggleFlag(e, i));
      grid.appendChild(c);
    }
  }

  faceEl?.addEventListener("click", reset);
  reset();

  return {
    reset,
    dispose() {
      stopTimer();
    }
  };
}

export function getMinesContent() {
    return `<div style="background:#c0c0c0; height:100%; display:flex; flex-direction:column; align-items:center;"><div class="mines-bar" style="width:200px"><div class="mines-lcd mines-count">010</div><div class="mines-face" data-action="reset-mines">:)</div><div class="mines-lcd mines-timer">000</div></div><div class="mines-grid"></div></div>`;

}

export class MinesweeperApp extends BaseApp {
  getWindowContent() {
    return getMinesContent(this.initData, this.services);
  }

  mount() {
    return initMinesweeper(this.windowEl, this.initData, this.services.windowManager, this.services, this);
  }
}
