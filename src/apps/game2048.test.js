import assert from "node:assert/strict";
import { test } from "node:test";

import { BaseApp } from "./base/BaseApp.js";
import {
  Game2048App,
  addRandomTile,
  createBoard,
  emptyCells,
  getGame2048Content,
  hasMoves,
  hasWon,
  initGame2048,
  move,
  slideRowLeft
} from "./game2048.js";

test("slideRowLeft compresses, merges once, and reports points", () => {
  assert.deepEqual(slideRowLeft([2, 2, 0, 0]), { row: [4, 0, 0, 0], gained: 4 });
  assert.deepEqual(slideRowLeft([2, 2, 2, 2]), { row: [4, 4, 0, 0], gained: 8 });
  assert.deepEqual(slideRowLeft([4, 4, 2, 0]), { row: [8, 2, 0, 0], gained: 8 });
  assert.deepEqual(slideRowLeft([0, 0, 0, 2]), { row: [2, 0, 0, 0], gained: 0 });
  assert.deepEqual(slideRowLeft([2, 0, 2, 4]), { row: [4, 4, 0, 0], gained: 4 });
});

test("move slides in every direction without mutating the input", () => {
  const board = [
    [2, 2, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [4, 0, 0, 4]
  ];
  const snapshot = board.map((r) => r.slice());

  const left = move(board, "left");
  assert.deepEqual(left.board[0], [4, 0, 0, 0]);
  assert.deepEqual(left.board[3], [8, 0, 0, 0]);
  assert.equal(left.moved, true);
  assert.equal(left.gained, 12);

  const right = move(board, "right");
  assert.deepEqual(right.board[0], [0, 0, 0, 4]);
  assert.deepEqual(right.board[3], [0, 0, 0, 8]);

  assert.deepEqual(board, snapshot, "original board is unchanged");
});

test("move up and down merge along columns", () => {
  const board = [
    [2, 0, 0, 0],
    [2, 0, 0, 0],
    [4, 0, 0, 0],
    [4, 0, 0, 0]
  ];
  assert.deepEqual(move(board, "up").board.map((r) => r[0]), [4, 8, 0, 0]);
  assert.deepEqual(move(board, "down").board.map((r) => r[0]), [0, 0, 4, 8]);
});

test("move reports moved:false when nothing changes", () => {
  const board = [
    [2, 4, 8, 16],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ];
  assert.equal(move(board, "left").moved, false);
});

test("emptyCells and addRandomTile fill an empty slot", () => {
  const board = createBoard();
  assert.equal(emptyCells(board).length, 16);
  const filled = addRandomTile(board, () => 0); // first empty cell, value 2
  assert.equal(filled[0][0], 2);
  assert.equal(emptyCells(filled).length, 15);
  assert.equal(board[0][0], 0, "input board not mutated");
});

test("hasMoves detects a locked board", () => {
  const open = [
    [2, 4, 2, 4],
    [4, 2, 4, 2],
    [2, 4, 2, 4],
    [4, 2, 4, 0]
  ];
  assert.equal(hasMoves(open), true, "an empty cell means moves remain");

  const locked = [
    [2, 4, 2, 4],
    [4, 2, 4, 2],
    [2, 4, 2, 4],
    [4, 2, 4, 2]
  ];
  assert.equal(hasMoves(locked), false, "no empties and no equal neighbors");
});

test("hasWon triggers at 2048", () => {
  assert.equal(hasWon([[2, 4], [8, 16]]), false);
  assert.equal(hasWon([[2, 4], [8, 2048]]), true);
});

test("2048 content renders 16 tiles and no inline handlers", () => {
  const content = getGame2048Content();
  assert.equal((content.match(/data-cell=/g) || []).length, 16);
  assert.doesNotMatch(content, /onclick=/);
});

class FakeElement {
  constructor(dataset = {}) {
    this.dataset = dataset;
    this.textContent = "";
    this._attrs = {};
    this.listeners = [];
  }
  addEventListener(type, fn) { this.listeners.push({ type, fn, active: true }); }
  removeEventListener(type, fn) {
    for (const e of this.listeners) if (e.type === type && e.fn === fn) e.active = false;
  }
  setAttribute(n, v) { this._attrs[n] = v; }
  hasAttribute(n) { return n in this._attrs; }
  focus() {}
}

function create2048Window() {
  const score = new FakeElement();
  const status = new FakeElement();
  const neu = new FakeElement();
  const cells = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) cells.push(new FakeElement({ cell: `${r}-${c}` }));
  }
  const map = { "[data-score]": score, "[data-status]": status, '[data-action="new"]': neu };
  const self = new FakeElement();
  self.elements = [score, status, neu, ...cells];
  self.querySelector = (sel) => map[sel] ?? null;
  self.querySelectorAll = () => cells;
  return self;
}

test("initGame2048 seeds two tiles and releases listeners on dispose", () => {
  const app = new BaseApp();
  const win = create2048Window();

  const api = initGame2048(win, null, null, {}, app);

  const filled = api.getBoard().flat().filter((v) => v !== 0).length;
  assert.equal(filled, 2, "a new game starts with two tiles");

  const registered = [...win.elements, win].flatMap((el) => el.listeners || []);
  assert.ok(registered.length > 0);

  app.dispose();
  assert.ok(registered.every((e) => !e.active), "listeners removed on dispose");
});

test("Game2048App exposes the game content through the app class", () => {
  const app = new Game2048App({ services: {} });
  assert.match(app.getWindowContent(), /g2048-layout/);
});
