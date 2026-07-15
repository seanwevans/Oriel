import { BaseApp } from "./base/BaseApp.js";

// Classic falling-block puzzle. The game core below is DOM-free so it can be
// unit tested: the board is a 2D array of ints (0 empty, 1-7 a locked cell's
// color index), and tetrominoes are defined by their cells in a square
// bounding box so rotation is a pure coordinate transform.

export const TETRIS_COLS = 10;
export const TETRIS_ROWS = 20;
export const TETRIS_CELL = 22;

// index, size, base cells [x, y], and canvas color.
export const TETROMINOES = {
  I: { index: 1, size: 4, cells: [[0, 1], [1, 1], [2, 1], [3, 1]], color: "#31c7ef" },
  O: { index: 2, size: 2, cells: [[0, 0], [1, 0], [0, 1], [1, 1]], color: "#f7d308" },
  T: { index: 3, size: 3, cells: [[1, 0], [0, 1], [1, 1], [2, 1]], color: "#ad4d9c" },
  S: { index: 4, size: 3, cells: [[1, 0], [2, 0], [0, 1], [1, 1]], color: "#42b642" },
  Z: { index: 5, size: 3, cells: [[0, 0], [1, 0], [1, 1], [2, 1]], color: "#ef2029" },
  J: { index: 6, size: 3, cells: [[0, 0], [0, 1], [1, 1], [2, 1]], color: "#5a65ad" },
  L: { index: 7, size: 3, cells: [[2, 0], [0, 1], [1, 1], [2, 1]], color: "#ef7921" }
};

export const TETROMINO_TYPES = Object.keys(TETROMINOES);
const COLOR_BY_INDEX = Object.fromEntries(
  Object.values(TETROMINOES).map((t) => [t.index, t.color])
);

/** Rotate cells 90° clockwise within their size×size box. */
export function rotateCells(cells, size) {
  return cells.map(([x, y]) => [size - 1 - y, x]);
}

export function createBoard(cols = TETRIS_COLS, rows = TETRIS_ROWS) {
  return Array.from({ length: rows }, () => new Array(cols).fill(0));
}

/**
 * Can `cells` sit at origin (ox, oy) on the board? Cells above the top edge
 * (gy < 0) are allowed so pieces can spawn/rotate near the ceiling.
 */
export function canPlace(board, cells, ox, oy) {
  const rows = board.length;
  const cols = board[0].length;
  for (const [cx, cy] of cells) {
    const gx = ox + cx;
    const gy = oy + cy;
    if (gx < 0 || gx >= cols || gy >= rows) return false;
    if (gy >= 0 && board[gy][gx] !== 0) return false;
  }
  return true;
}

/** Return a new board with `cells` locked in at (ox, oy) using colorIndex. */
export function mergePiece(board, cells, ox, oy, colorIndex) {
  const next = board.map((row) => row.slice());
  for (const [cx, cy] of cells) {
    const gx = ox + cx;
    const gy = oy + cy;
    if (gy >= 0 && gy < next.length && gx >= 0 && gx < next[0].length) {
      next[gy][gx] = colorIndex;
    }
  }
  return next;
}

/** Remove full rows; return the new board and how many were cleared. */
export function clearLines(board) {
  const cols = board[0].length;
  const kept = board.filter((row) => row.some((cell) => cell === 0));
  const cleared = board.length - kept.length;
  const empty = Array.from({ length: cleared }, () => new Array(cols).fill(0));
  return { board: [...empty, ...kept], cleared };
}

const LINE_SCORES = [0, 100, 300, 500, 800];

export function scoreForLines(cleared, level = 1) {
  return (LINE_SCORES[cleared] || 0) * level;
}

export function levelForLines(totalLines) {
  return Math.floor(totalLines / 10) + 1;
}

export function getTetrisContent() {
  return `<div class="tetris-layout">
    <div class="tetris-stage">
      <canvas class="tetris-canvas" data-canvas></canvas>
    </div>
    <div class="tetris-side">
      <div class="tetris-stat">Score<span data-score>0</span></div>
      <div class="tetris-stat">Lines<span data-lines>0</span></div>
      <div class="tetris-stat">Level<span data-level>1</span></div>
      <button class="tetris-btn" data-action="pause" type="button">Pause</button>
      <button class="tetris-btn" data-action="new" type="button">New Game</button>
      <div class="tetris-help">◀ ▶ move · ▲ rotate · ▼ soft drop · Space hard drop</div>
    </div>
  </div>`;
}

export function initTetris(w, _initData, _windowManager, _services, app) {
  if (!w) return null;
  const listen = app?.listen?.bind(app) || ((t, type, fn) => t?.addEventListener?.(type, fn));
  const setIntervalFn = app?.setInterval?.bind(app) || ((fn, ms) => setInterval(fn, ms));
  const clearIntervalFn = app?.clearInterval?.bind(app) || ((id) => clearInterval(id));

  const cols = TETRIS_COLS;
  const rows = TETRIS_ROWS;
  const cell = TETRIS_CELL;

  const canvas = w.querySelector("[data-canvas]");
  if (canvas) {
    canvas.width = cols * cell;
    canvas.height = rows * cell;
  }
  const ctx = canvas?.getContext?.("2d") ?? null;
  const scoreEl = w.querySelector("[data-score]");
  const linesEl = w.querySelector("[data-lines]");
  const levelEl = w.querySelector("[data-level]");
  const pauseBtn = w.querySelector('[data-action="pause"]');

  let board = createBoard(cols, rows);
  let piece = null;
  let score = 0;
  let lines = 0;
  let level = 1;
  let gameOver = false;
  let paused = false;
  let intervalId = null;

  const randomType = () => TETROMINO_TYPES[Math.floor(Math.random() * TETROMINO_TYPES.length)];

  const spawn = () => {
    const type = randomType();
    const def = TETROMINOES[type];
    const p = { type, size: def.size, index: def.index, cells: def.cells, x: Math.floor((cols - def.size) / 2), y: 0 };
    if (!canPlace(board, p.cells, p.x, p.y)) {
      gameOver = true;
      piece = null;
      stopGravity();
      draw();
      return;
    }
    piece = p;
  };

  const drawCell = (gx, gy, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(gx * cell, gy * cell, cell, cell);
    ctx.strokeStyle = "rgba(0,0,0,0.35)";
    ctx.strokeRect(gx * cell + 0.5, gy * cell + 0.5, cell - 1, cell - 1);
  };

  const draw = () => {
    if (!ctx) return;
    ctx.fillStyle = "#0b1021";
    ctx.fillRect(0, 0, cols * cell, rows * cell);
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (board[y][x]) drawCell(x, y, COLOR_BY_INDEX[board[y][x]]);
      }
    }
    if (piece) {
      const color = COLOR_BY_INDEX[piece.index];
      for (const [cx, cy] of piece.cells) {
        const gy = piece.y + cy;
        if (gy >= 0) drawCell(piece.x + cx, gy, color);
      }
    }
    if (gameOver) {
      ctx.fillStyle = "rgba(0,0,0,0.7)";
      ctx.fillRect(0, rows * cell / 2 - 24, cols * cell, 48);
      ctx.fillStyle = "#fff";
      ctx.font = "bold 20px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("GAME OVER", (cols * cell) / 2, (rows * cell) / 2 + 7);
    }
  };

  const updateStats = () => {
    if (scoreEl) scoreEl.textContent = String(score);
    if (linesEl) linesEl.textContent = String(lines);
    if (levelEl) levelEl.textContent = String(level);
  };

  const lockPiece = () => {
    board = mergePiece(board, piece.cells, piece.x, piece.y, piece.index);
    const result = clearLines(board);
    board = result.board;
    if (result.cleared) {
      score += scoreForLines(result.cleared, level);
      lines += result.cleared;
      const newLevel = levelForLines(lines);
      if (newLevel !== level) {
        level = newLevel;
        restartGravity();
      }
      updateStats();
    }
    spawn();
  };

  const step = () => {
    if (!piece || paused || gameOver) return;
    if (canPlace(board, piece.cells, piece.x, piece.y + 1)) {
      piece.y += 1;
    } else {
      lockPiece();
    }
    draw();
  };

  const move = (dx) => {
    if (!piece || paused || gameOver) return;
    if (canPlace(board, piece.cells, piece.x + dx, piece.y)) {
      piece.x += dx;
      draw();
    }
  };

  const rotate = () => {
    if (!piece || paused || gameOver) return;
    const rotated = rotateCells(piece.cells, piece.size);
    for (const kick of [0, -1, 1, -2, 2]) {
      if (canPlace(board, rotated, piece.x + kick, piece.y)) {
        piece.cells = rotated;
        piece.x += kick;
        draw();
        return;
      }
    }
  };

  const softDrop = () => {
    if (!piece || paused || gameOver) return;
    if (canPlace(board, piece.cells, piece.x, piece.y + 1)) {
      piece.y += 1;
      score += 1;
      updateStats();
      draw();
    } else {
      step();
    }
  };

  const hardDrop = () => {
    if (!piece || paused || gameOver) return;
    let dropped = 0;
    while (canPlace(board, piece.cells, piece.x, piece.y + 1)) {
      piece.y += 1;
      dropped += 1;
    }
    score += dropped * 2;
    updateStats();
    lockPiece();
    draw();
  };

  const gravityDelay = () => Math.max(90, 600 - (level - 1) * 55);

  const stopGravity = () => {
    if (intervalId != null) {
      clearIntervalFn(intervalId);
      intervalId = null;
    }
  };

  const restartGravity = () => {
    stopGravity();
    if (!gameOver && !paused) intervalId = setIntervalFn(step, gravityDelay());
  };

  const newGame = () => {
    board = createBoard(cols, rows);
    score = 0;
    lines = 0;
    level = 1;
    gameOver = false;
    paused = false;
    if (pauseBtn) pauseBtn.textContent = "Pause";
    updateStats();
    spawn();
    draw();
    restartGravity();
  };

  const togglePause = () => {
    if (gameOver) return;
    paused = !paused;
    if (pauseBtn) pauseBtn.textContent = paused ? "Resume" : "Pause";
    if (paused) stopGravity();
    else restartGravity();
  };

  listen(w, "keydown", (event) => {
    switch (event.key) {
      case "ArrowLeft": event.preventDefault(); move(-1); break;
      case "ArrowRight": event.preventDefault(); move(1); break;
      case "ArrowUp": case "x": case "X": event.preventDefault(); rotate(); break;
      case "ArrowDown": event.preventDefault(); softDrop(); break;
      case " ": event.preventDefault(); hardDrop(); break;
      case "p": case "P": togglePause(); break;
      default: break;
    }
  });
  listen(pauseBtn, "click", () => { togglePause(); w.focus?.(); });
  listen(w.querySelector('[data-action="new"]'), "click", () => { newGame(); w.focus?.(); });
  listen(canvas, "mousedown", () => w.focus?.());

  if (!w.hasAttribute?.("tabindex")) w.setAttribute?.("tabindex", "0");
  w.focus?.();

  newGame();

  return {
    newGame,
    togglePause,
    step,
    move,
    rotate,
    hardDrop,
    getState: () => ({ score, lines, level, gameOver, paused }),
    isRunning: () => intervalId != null
  };
}

export class TetrisApp extends BaseApp {
  getWindowContent() {
    return getTetrisContent(this.initData, this.services);
  }

  mount() {
    return initTetris(this.windowEl, this.initData, this.services.windowManager, this.services, this);
  }
}
