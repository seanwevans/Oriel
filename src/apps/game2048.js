import { BaseApp } from "./base/BaseApp.js";

// 2048 sliding puzzle. The board is a 4x4 array of ints (0 = empty). All move
// logic is DOM-free and unit tested: a move is expressed as "slide left" plus a
// pre/post orientation transform, so one slideRowLeft covers all directions.

export const GAME2048_SIZE = 4;
export const GAME2048_WIN = 2048;

export function createBoard(size = GAME2048_SIZE) {
  return Array.from({ length: size }, () => new Array(size).fill(0));
}

const clone = (board) => board.map((row) => row.slice());
const transpose = (board) => board[0].map((_, c) => board.map((row) => row[c]));
const reverseRows = (board) => board.map((row) => [...row].reverse());
const equal = (a, b) => a.every((row, r) => row.every((v, c) => v === b[r][c]));

/** Compress and merge a single row to the left. Returns { row, gained }. */
export function slideRowLeft(row) {
  const nums = row.filter((v) => v !== 0);
  const out = [];
  let gained = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i + 1 < nums.length && nums[i] === nums[i + 1]) {
      const merged = nums[i] * 2;
      out.push(merged);
      gained += merged;
      i++; // consume the merged partner
    } else {
      out.push(nums[i]);
    }
  }
  while (out.length < row.length) out.push(0);
  return { row: out, gained };
}

const ORIENT = {
  left: { pre: (b) => b, post: (b) => b },
  right: { pre: reverseRows, post: reverseRows },
  up: { pre: transpose, post: transpose },
  down: { pre: (b) => reverseRows(transpose(b)), post: (b) => transpose(reverseRows(b)) }
};

/** Apply a move. Returns { board, moved, gained } without mutating input. */
export function move(board, dir) {
  const orient = ORIENT[dir];
  if (!orient) return { board, moved: false, gained: 0 };
  const pre = orient.pre(board);
  let gained = 0;
  const slid = pre.map((row) => {
    const result = slideRowLeft(row);
    gained += result.gained;
    return result.row;
  });
  const next = orient.post(slid);
  return { board: next, moved: !equal(board, next), gained };
}

export function emptyCells(board) {
  const cells = [];
  board.forEach((row, r) => row.forEach((v, c) => { if (v === 0) cells.push({ r, c }); }));
  return cells;
}

/** Place a 2 (90%) or 4 (10%) on a random empty cell. Returns a new board. */
export function addRandomTile(board, rng = Math.random) {
  const cells = emptyCells(board);
  if (!cells.length) return board;
  const { r, c } = cells[Math.floor(rng() * cells.length)];
  const next = clone(board);
  next[r][c] = rng() < 0.9 ? 2 : 4;
  return next;
}

export function hasMoves(board) {
  if (emptyCells(board).length) return true;
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      const v = board[r][c];
      if ((c + 1 < board[r].length && board[r][c + 1] === v) ||
          (r + 1 < board.length && board[r + 1][c] === v)) {
        return true;
      }
    }
  }
  return false;
}

export function hasWon(board, target = GAME2048_WIN) {
  return board.some((row) => row.some((v) => v >= target));
}

export function startBoard(size = GAME2048_SIZE, rng = Math.random) {
  return addRandomTile(addRandomTile(createBoard(size), rng), rng);
}

export function getGame2048Content() {
  let cells = "";
  for (let r = 0; r < GAME2048_SIZE; r++) {
    for (let c = 0; c < GAME2048_SIZE; c++) {
      cells += `<div class="g2048-tile" data-cell="${r}-${c}" data-val="0"></div>`;
    }
  }
  return `<div class="g2048-layout">
    <div class="g2048-toolbar">
      <span class="g2048-score">Score <span data-score>0</span></span>
      <button class="g2048-btn" data-action="new" type="button">New Game</button>
    </div>
    <div class="g2048-board" data-board>${cells}</div>
    <div class="g2048-status" data-status>Use the arrow keys to reach 2048.</div>
  </div>`;
}

export function initGame2048(w, _initData, _windowManager, _services, app) {
  if (!w) return null;
  const listen = app?.listen?.bind(app) || ((t, type, fn) => t?.addEventListener?.(type, fn));

  const scoreEl = w.querySelector("[data-score]");
  const statusEl = w.querySelector("[data-status]");
  const cellEls = new Map();
  for (const el of w.querySelectorAll("[data-cell]")) cellEls.set(el.dataset.cell, el);

  let board = startBoard();
  let score = 0;
  let over = false;
  let won = false;

  const setStatus = (msg) => { if (statusEl) statusEl.textContent = msg; };

  const render = () => {
    for (let r = 0; r < GAME2048_SIZE; r++) {
      for (let c = 0; c < GAME2048_SIZE; c++) {
        const el = cellEls.get(`${r}-${c}`);
        if (!el) continue;
        const v = board[r][c];
        el.textContent = v ? String(v) : "";
        el.dataset.val = String(v > 2048 ? "super" : v);
      }
    }
    if (scoreEl) scoreEl.textContent = String(score);
  };

  const doMove = (dir) => {
    if (over) return;
    const result = move(board, dir);
    if (!result.moved) return;
    board = addRandomTile(result.board);
    score += result.gained;
    render();
    if (!won && hasWon(board)) {
      won = true;
      setStatus("You reached 2048! Keep going or start a new game.");
    } else if (!hasMoves(board)) {
      over = true;
      setStatus(`Game over — score ${score}. Press New Game.`);
    }
  };

  const newGame = () => {
    board = startBoard();
    score = 0;
    over = false;
    won = false;
    setStatus("Use the arrow keys to reach 2048.");
    render();
  };

  listen(w, "keydown", (event) => {
    const dir = { ArrowLeft: "left", ArrowRight: "right", ArrowUp: "up", ArrowDown: "down" }[event.key];
    if (dir) { event.preventDefault(); doMove(dir); }
  });
  listen(w.querySelector('[data-action="new"]'), "click", () => { newGame(); w.focus?.(); });

  if (!w.hasAttribute?.("tabindex")) w.setAttribute?.("tabindex", "0");
  w.focus?.();

  render();

  return { newGame, doMove, getBoard: () => board.map((row) => row.slice()), getScore: () => score };
}

export class Game2048App extends BaseApp {
  getWindowContent() {
    return getGame2048Content(this.initData, this.services);
  }

  mount() {
    return initGame2048(this.windowEl, this.initData, this.services.windowManager, this.services, this);
  }
}
