import { BaseApp } from "./base/BaseApp.js";

// Conway's Game of Life. The simulation core below never touches the DOM so it
// can be unit tested in isolation; cells are a flat Uint8Array of 0/1 where the
// index for column x, row y is y * cols + x. Edges are treated as dead (the
// board does not wrap).

export const LIFE_COLS = 44;
export const LIFE_ROWS = 28;
export const LIFE_CELL = 12;

export const LIFE_PATTERNS = {
  glider: [[1, 0], [2, 1], [0, 2], [1, 2], [2, 2]],
  blinker: [[0, 1], [1, 1], [2, 1]],
  toad: [[1, 0], [2, 0], [3, 0], [0, 1], [1, 1], [2, 1]],
  beacon: [[0, 0], [1, 0], [0, 1], [3, 2], [2, 3], [3, 3]],
  lwss: [[1, 0], [4, 0], [0, 1], [0, 2], [4, 2], [0, 3], [1, 3], [2, 3], [3, 3]]
};

export function countLiveNeighbors(cells, cols, rows, x, y) {
  let count = 0;
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
      count += cells[ny * cols + nx];
    }
  }
  return count;
}

/** Advance one generation using the standard B3/S23 rules. */
export function stepLife(cells, cols, rows) {
  const next = new Uint8Array(cols * rows);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const index = y * cols + x;
      const neighbors = countLiveNeighbors(cells, cols, rows, x, y);
      const alive = cells[index]
        ? neighbors === 2 || neighbors === 3
        : neighbors === 3;
      next[index] = alive ? 1 : 0;
    }
  }
  return next;
}

export function randomGrid(cols, rows, density = 0.28, rand = Math.random) {
  const cells = new Uint8Array(cols * rows);
  for (let i = 0; i < cells.length; i++) {
    cells[i] = rand() < density ? 1 : 0;
  }
  return cells;
}

export function countPopulation(cells) {
  let total = 0;
  for (let i = 0; i < cells.length; i++) total += cells[i];
  return total;
}

/** Stamp a named pattern into the grid with its top-left at (originX, originY). */
export function insertPattern(cells, cols, rows, pattern, originX, originY) {
  const points = Array.isArray(pattern) ? pattern : LIFE_PATTERNS[pattern];
  if (!points) return cells;
  for (const [dx, dy] of points) {
    const x = originX + dx;
    const y = originY + dy;
    if (x < 0 || y < 0 || x >= cols || y >= rows) continue;
    cells[y * cols + x] = 1;
  }
  return cells;
}

export function getGameOfLifeContent() {
  const options = Object.keys(LIFE_PATTERNS)
    .map((name) => `<option value="${name}">${name}</option>`)
    .join("");
  return `<div class="life-layout">
    <div class="life-toolbar">
      <button class="life-btn" data-action="toggle" type="button">Start</button>
      <button class="life-btn" data-action="step" type="button">Step</button>
      <button class="life-btn" data-action="random" type="button">Random</button>
      <button class="life-btn" data-action="clear" type="button">Clear</button>
      <select class="life-select" data-pattern aria-label="Pattern">${options}</select>
      <label class="life-speed">Speed
        <input type="range" data-speed min="1" max="30" value="12" />
      </label>
    </div>
    <div class="life-stage">
      <canvas class="life-canvas" data-canvas></canvas>
    </div>
    <div class="life-status">Generation <span data-gen>0</span> &middot; Population <span data-pop>0</span></div>
  </div>`;
}

export function initGameOfLife(w, _initData, _windowManager, _services, app) {
  if (!w) return null;
  const listen = app?.listen?.bind(app) || ((t, type, fn) => t?.addEventListener?.(type, fn));
  const setIntervalFn = app?.setInterval?.bind(app) || ((fn, ms) => setInterval(fn, ms));
  const clearIntervalFn = app?.clearInterval?.bind(app) || ((id) => clearInterval(id));

  const cols = LIFE_COLS;
  const rows = LIFE_ROWS;
  const cell = LIFE_CELL;

  const canvas = w.querySelector("[data-canvas]");
  const toggleBtn = w.querySelector('[data-action="toggle"]');
  const genEl = w.querySelector("[data-gen]");
  const popEl = w.querySelector("[data-pop]");
  const speedEl = w.querySelector("[data-speed]");
  const patternEl = w.querySelector("[data-pattern]");

  if (canvas) {
    canvas.width = cols * cell;
    canvas.height = rows * cell;
  }
  const ctx = canvas?.getContext?.("2d") ?? null;

  let cells = new Uint8Array(cols * rows);
  let generation = 0;
  let intervalId = null;

  const draw = () => {
    if (!ctx) return;
    ctx.fillStyle = "#0b1021";
    ctx.fillRect(0, 0, cols * cell, rows * cell);
    ctx.fillStyle = "#6cff8f";
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (cells[y * cols + x]) {
          ctx.fillRect(x * cell + 1, y * cell + 1, cell - 1, cell - 1);
        }
      }
    }
    ctx.strokeStyle = "rgba(108, 255, 143, 0.08)";
    ctx.lineWidth = 1;
    for (let x = 0; x <= cols; x++) {
      ctx.beginPath();
      ctx.moveTo(x * cell + 0.5, 0);
      ctx.lineTo(x * cell + 0.5, rows * cell);
      ctx.stroke();
    }
    for (let y = 0; y <= rows; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * cell + 0.5);
      ctx.lineTo(cols * cell, y * cell + 0.5);
      ctx.stroke();
    }
  };

  const updateStatus = () => {
    if (genEl) genEl.textContent = String(generation);
    if (popEl) popEl.textContent = String(countPopulation(cells));
  };

  const render = () => {
    draw();
    updateStatus();
  };

  const step = () => {
    cells = stepLife(cells, cols, rows);
    generation += 1;
    render();
  };

  const delayFromSpeed = () => {
    const value = Number(speedEl?.value) || 12;
    return Math.max(30, Math.round(1000 / value));
  };

  const stop = () => {
    if (intervalId != null) {
      clearIntervalFn(intervalId);
      intervalId = null;
    }
    if (toggleBtn) toggleBtn.textContent = "Start";
  };

  const start = () => {
    if (intervalId != null) return;
    intervalId = setIntervalFn(step, delayFromSpeed());
    if (toggleBtn) toggleBtn.textContent = "Stop";
  };

  const toggle = () => {
    if (intervalId != null) stop();
    else start();
  };

  const cellFromEvent = (event) => {
    const rect = canvas.getBoundingClientRect?.() ?? { left: 0, top: 0, width: cols * cell, height: rows * cell };
    const scaleX = (canvas.width || cols * cell) / (rect.width || cols * cell);
    const scaleY = (canvas.height || rows * cell) / (rect.height || rows * cell);
    const px = ((event.clientX ?? 0) - rect.left) * scaleX;
    const py = ((event.clientY ?? 0) - rect.top) * scaleY;
    return { x: Math.floor(px / cell), y: Math.floor(py / cell) };
  };

  let painting = false;
  let paintValue = 1;

  const paintAt = (event) => {
    const { x, y } = cellFromEvent(event);
    if (x < 0 || y < 0 || x >= cols || y >= rows) return;
    cells[y * cols + x] = paintValue;
    render();
  };

  listen(canvas, "mousedown", (event) => {
    painting = true;
    const { x, y } = cellFromEvent(event);
    if (x < 0 || y < 0 || x >= cols || y >= rows) return;
    paintValue = cells[y * cols + x] ? 0 : 1;
    cells[y * cols + x] = paintValue;
    render();
  });
  listen(canvas, "mousemove", (event) => {
    if (painting) paintAt(event);
  });
  listen(globalThis, "mouseup", () => {
    painting = false;
  });

  listen(toggleBtn, "click", toggle);
  listen(w.querySelector('[data-action="step"]'), "click", () => {
    stop();
    step();
  });
  listen(w.querySelector('[data-action="random"]'), "click", () => {
    cells = randomGrid(cols, rows);
    generation = 0;
    render();
  });
  listen(w.querySelector('[data-action="clear"]'), "click", () => {
    stop();
    cells = new Uint8Array(cols * rows);
    generation = 0;
    render();
  });
  listen(patternEl, "change", () => {
    stop();
    cells = new Uint8Array(cols * rows);
    generation = 0;
    const name = patternEl.value;
    const points = LIFE_PATTERNS[name] ?? [];
    let width = 0;
    let height = 0;
    for (const [dx, dy] of points) {
      width = Math.max(width, dx + 1);
      height = Math.max(height, dy + 1);
    }
    insertPattern(cells, cols, rows, name, Math.floor((cols - width) / 2), Math.floor((rows - height) / 2));
    render();
  });
  listen(speedEl, "input", () => {
    if (intervalId != null) {
      stop();
      start();
    }
  });

  // Open on a lively soup with a couple of gliders gunning across it.
  cells = randomGrid(cols, rows, 0.18);
  insertPattern(cells, cols, rows, "glider", 2, 2);
  insertPattern(cells, cols, rows, "lwss", cols - 8, rows - 8);
  render();

  return { start, stop, step, toggle, isRunning: () => intervalId != null };
}

export class GameOfLifeApp extends BaseApp {
  getWindowContent() {
    return getGameOfLifeContent(this.initData, this.services);
  }

  mount() {
    return initGameOfLife(this.windowEl, this.initData, this.services.windowManager, this.services, this);
  }
}
