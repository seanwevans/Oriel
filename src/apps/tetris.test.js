import assert from "node:assert/strict";
import { test } from "node:test";

import { BaseApp } from "./base/BaseApp.js";
import {
  TETROMINOES,
  TetrisApp,
  canPlace,
  clearLines,
  createBoard,
  getTetrisContent,
  initTetris,
  levelForLines,
  mergePiece,
  rotateCells,
  scoreForLines
} from "./tetris.js";

test("createBoard makes an empty rows×cols grid", () => {
  const board = createBoard(10, 20);
  assert.equal(board.length, 20);
  assert.equal(board[0].length, 10);
  assert.ok(board.every((row) => row.every((cell) => cell === 0)));
});

test("rotateCells turns a horizontal I into a vertical column", () => {
  const rotated = rotateCells(TETROMINOES.I.cells, 4);
  const xs = new Set(rotated.map(([x]) => x));
  assert.equal(xs.size, 1, "all cells share one column after rotation");
});

test("rotateCells leaves the O piece unchanged", () => {
  const set = (cells) => new Set(cells.map(([x, y]) => `${x},${y}`));
  assert.deepEqual(set(rotateCells(TETROMINOES.O.cells, 2)), set(TETROMINOES.O.cells));
});

test("canPlace respects walls, floor, and occupied cells", () => {
  const board = createBoard(4, 4);
  const cell = [[0, 0]];
  assert.equal(canPlace(board, cell, 0, 0), true);
  assert.equal(canPlace(board, cell, -1, 0), false);
  assert.equal(canPlace(board, cell, 4, 0), false);
  assert.equal(canPlace(board, cell, 0, 4), false);
  assert.equal(canPlace(board, [[0, -1]], 0, 0), true, "above the ceiling is allowed");

  board[2][2] = 1;
  assert.equal(canPlace(board, cell, 2, 2), false);
});

test("mergePiece is immutable and writes the color index", () => {
  const board = createBoard(4, 4);
  const next = mergePiece(board, [[0, 0], [1, 0]], 1, 1, 3);
  assert.equal(board[1][1], 0, "original board is untouched");
  assert.equal(next[1][1], 3);
  assert.equal(next[1][2], 3);
});

test("clearLines removes full rows and reports the count", () => {
  const board = createBoard(3, 3);
  board[2] = [1, 1, 1];
  board[1] = [1, 0, 1];
  const { board: next, cleared } = clearLines(board);
  assert.equal(cleared, 1);
  assert.equal(next.length, 3);
  assert.deepEqual(next[0], [0, 0, 0], "a fresh empty row is added on top");
  assert.deepEqual(next[2], [1, 0, 1], "the non-full row falls to the bottom");
});

test("scoring rewards multi-line clears and scales with level", () => {
  assert.equal(scoreForLines(1, 1), 100);
  assert.equal(scoreForLines(4, 1), 800);
  assert.equal(scoreForLines(2, 3), 900);
  assert.equal(scoreForLines(0, 5), 0);
});

test("levelForLines advances every ten lines", () => {
  assert.equal(levelForLines(0), 1);
  assert.equal(levelForLines(9), 1);
  assert.equal(levelForLines(10), 2);
  assert.equal(levelForLines(25), 3);
});

test("Tetris content carries the canvas and no inline handlers", () => {
  const content = getTetrisContent();
  assert.match(content, /data-canvas/);
  assert.doesNotMatch(content, /onclick=/);
});

class FakeElement {
  constructor(dataset = {}) {
    this.dataset = dataset;
    this.textContent = "";
    this.width = 0;
    this.height = 0;
    this._attrs = {};
    this.listeners = [];
  }
  addEventListener(type, fn) { this.listeners.push({ type, fn, active: true }); }
  removeEventListener(type, fn) {
    for (const e of this.listeners) if (e.type === type && e.fn === fn) e.active = false;
  }
  getContext() { return null; }
  setAttribute(name, value) { this._attrs[name] = value; }
  hasAttribute(name) { return name in this._attrs; }
  focus() {}
}

function createTetrisWindow() {
  const canvas = new FakeElement();
  const score = new FakeElement({ score: "" });
  const linesEl = new FakeElement();
  const level = new FakeElement();
  const pause = new FakeElement();
  const neu = new FakeElement();
  const self = new FakeElement();
  const map = {
    "[data-canvas]": canvas,
    "[data-score]": score,
    "[data-lines]": linesEl,
    "[data-level]": level,
    '[data-action="pause"]': pause,
    '[data-action="new"]': neu
  };
  Object.assign(self, {
    elements: [canvas, score, linesEl, level, pause, neu],
    querySelector: (sel) => map[sel] ?? null
  });
  return self;
}

test("initTetris runs a gravity timer and releases it and listeners on dispose", () => {
  const origSet = globalThis.setInterval;
  const origClear = globalThis.clearInterval;
  const cleared = [];
  let nextId = 1;
  globalThis.setInterval = () => nextId++;
  globalThis.clearInterval = (id) => cleared.push(id);

  try {
    const app = new BaseApp();
    const win = createTetrisWindow();
    const api = initTetris(win, null, null, {}, app);

    assert.equal(api.isRunning(), true, "gravity timer starts on new game");
    const registered = [...win.elements, win].flatMap((el) => el.listeners || []);
    assert.ok(registered.length > 0);

    app.dispose();

    assert.ok(cleared.length > 0, "gravity timer cleared on dispose");
    assert.ok(registered.every((e) => !e.active), "listeners removed on dispose");
  } finally {
    globalThis.setInterval = origSet;
    globalThis.clearInterval = origClear;
  }
});

test("TetrisApp exposes the game content through the app class", () => {
  const app = new TetrisApp({ services: {} });
  assert.match(app.getWindowContent(), /tetris-layout/);
});
