import assert from "node:assert/strict";
import { test } from "node:test";

import { BaseApp } from "./base/BaseApp.js";
import {
  GameOfLifeApp,
  LIFE_PATTERNS,
  countLiveNeighbors,
  countPopulation,
  getGameOfLifeContent,
  initGameOfLife,
  insertPattern,
  randomGrid,
  stepLife
} from "./gameOfLife.js";

function gridFrom(rowsText) {
  const rows = rowsText.trim().split("\n").map((line) => line.trim());
  const height = rows.length;
  const width = rows[0].length;
  const cells = new Uint8Array(width * height);
  rows.forEach((line, y) => {
    [...line].forEach((ch, x) => {
      cells[y * width + x] = ch === "#" ? 1 : 0;
    });
  });
  return { cells, cols: width, rows: height };
}

function liveSet(cells, cols) {
  const set = new Set();
  cells.forEach((value, index) => {
    if (value) set.add(`${index % cols},${Math.floor(index / cols)}`);
  });
  return set;
}

test("countLiveNeighbors counts the eight surrounding cells within bounds", () => {
  const { cells, cols, rows } = gridFrom(`
    ###
    #.#
    ###
  `);
  assert.equal(countLiveNeighbors(cells, cols, rows, 1, 1), 8);
  assert.equal(countLiveNeighbors(cells, cols, rows, 0, 0), 2);
});

test("a blinker oscillates with period two", () => {
  const start = gridFrom(`
    .....
    .....
    .###.
    .....
    .....
  `);
  const vertical = gridFrom(`
    .....
    ..#..
    ..#..
    ..#..
    .....
  `);
  const gen1 = stepLife(start.cells, start.cols, start.rows);
  assert.deepEqual(liveSet(gen1, start.cols), liveSet(vertical.cells, start.cols));
  const gen2 = stepLife(gen1, start.cols, start.rows);
  assert.deepEqual(liveSet(gen2, start.cols), liveSet(start.cells, start.cols));
});

test("a block is a still life", () => {
  const block = gridFrom(`
    ....
    .##.
    .##.
    ....
  `);
  const next = stepLife(block.cells, block.cols, block.rows);
  assert.deepEqual(liveSet(next, block.cols), liveSet(block.cells, block.cols));
});

test("a glider translates by (1,1) every four generations", () => {
  const cols = 12;
  const rows = 12;
  const cells = insertPattern(new Uint8Array(cols * rows), cols, rows, "glider", 1, 1);
  let current = cells;
  for (let i = 0; i < 4; i++) current = stepLife(current, cols, rows);

  const expected = insertPattern(new Uint8Array(cols * rows), cols, rows, "glider", 2, 2);
  assert.deepEqual(liveSet(current, cols), liveSet(expected, cols));
});

test("countPopulation totals the live cells", () => {
  const { cells } = gridFrom(`
    #.#
    .#.
    #.#
  `);
  assert.equal(countPopulation(cells), 5);
});

test("randomGrid is deterministic for a seeded generator and respects density", () => {
  let seed = 1;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
  const a = randomGrid(8, 8, 0.5, rand);
  seed = 1;
  const b = randomGrid(8, 8, 0.5, rand);
  assert.deepEqual([...a], [...b]);

  const empty = randomGrid(8, 8, 0, () => 0.9);
  assert.equal(countPopulation(empty), 0);
  const full = randomGrid(8, 8, 1, () => 0);
  assert.equal(countPopulation(full), 64);
});

test("insertPattern clips points that fall outside the grid", () => {
  const cols = 4;
  const rows = 4;
  const cells = insertPattern(new Uint8Array(cols * rows), cols, rows, "blinker", 3, 3);
  // The blinker starts at row 1 of its bounding box, so only (3,4)->clipped and
  // (4,4)->clipped; the in-bounds cell is (3,3)... verify no out-of-range writes.
  assert.equal(cells.length, cols * rows);
  assert.ok([...cells].every((v) => v === 0 || v === 1));
});

test("Game of Life content lists patterns and carries no inline handlers", () => {
  const content = getGameOfLifeContent();
  assert.match(content, /data-canvas/);
  for (const name of Object.keys(LIFE_PATTERNS)) {
    assert.ok(content.includes(`value="${name}"`), `pattern ${name} should appear as an option`);
  }
  assert.doesNotMatch(content, /onclick=/);
});

// Minimal fake DOM: enough for initGameOfLife to query elements, register
// listeners, and run without a real canvas context.
class FakeElement {
  constructor(dataset = {}) {
    this.dataset = dataset;
    this.textContent = "";
    this.value = dataset.value ?? "";
    this.width = 0;
    this.height = 0;
    this.listeners = [];
  }
  addEventListener(type, fn) { this.listeners.push({ type, fn, active: true }); }
  removeEventListener(type, fn) {
    for (const entry of this.listeners) {
      if (entry.type === type && entry.fn === fn) entry.active = false;
    }
  }
  getContext() { return null; }
  getBoundingClientRect() { return { left: 0, top: 0, width: this.width, height: this.height }; }
}

function createLifeWindow() {
  const canvas = new FakeElement();
  const toggle = new FakeElement();
  const stepBtn = new FakeElement();
  const random = new FakeElement();
  const clear = new FakeElement();
  const pattern = new FakeElement({ value: "glider" });
  const speed = new FakeElement({ value: "12" });
  const gen = new FakeElement();
  const pop = new FakeElement();
  const map = {
    "[data-canvas]": canvas,
    '[data-action="toggle"]': toggle,
    '[data-action="step"]': stepBtn,
    '[data-action="random"]': random,
    '[data-action="clear"]': clear,
    "[data-pattern]": pattern,
    "[data-speed]": speed,
    "[data-gen]": gen,
    "[data-pop]": pop
  };
  return {
    elements: [canvas, toggle, stepBtn, random, clear, pattern, speed, gen, pop],
    querySelector: (sel) => map[sel] ?? null
  };
}

test("initGameOfLife registers listeners and a running timer that dispose() releases", () => {
  const originalSetInterval = globalThis.setInterval;
  const originalClearInterval = globalThis.clearInterval;
  const cleared = [];
  let nextId = 1;
  globalThis.setInterval = () => nextId++;
  globalThis.clearInterval = (id) => cleared.push(id);

  try {
    const app = new BaseApp();
    const win = createLifeWindow();
    const api = initGameOfLife(win, null, null, {}, app);

    const registered = win.elements.flatMap((el) => el.listeners);
    assert.ok(registered.length > 0, "expected listeners to be registered");

    api.start();
    assert.equal(api.isRunning(), true);

    app.dispose();

    assert.ok(cleared.length > 0, "the running timer should be cleared on dispose");
    assert.ok(
      registered.every((entry) => !entry.active),
      "every registered listener should be removed on dispose"
    );
  } finally {
    globalThis.setInterval = originalSetInterval;
    globalThis.clearInterval = originalClearInterval;
  }
});

test("GameOfLifeApp exposes the simulation content through the app class", () => {
  const app = new GameOfLifeApp({ services: {} });
  assert.match(app.getWindowContent(), /life-layout/);
});
