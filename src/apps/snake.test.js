import assert from "node:assert/strict";
import { test } from "node:test";

import { BaseApp } from "./base/BaseApp.js";
import {
  SnakeApp,
  createSnakeState,
  getSnakeContent,
  initSnake,
  nextDirection,
  placeFood,
  stepSnake
} from "./snake.js";

test("createSnakeState centers a 3-cell snake heading right with food placed", () => {
  const s = createSnakeState(20, 20, () => 0);
  assert.equal(s.snake.length, 3);
  assert.deepEqual(s.dir, { x: 1, y: 0 });
  assert.equal(s.alive, true);
  assert.ok(s.food && !s.snake.some((c) => c.x === s.food.x && c.y === s.food.y));
});

test("placeFood avoids the snake and returns null when the board is full", () => {
  const snake = [{ x: 0, y: 0 }, { x: 1, y: 0 }];
  const food = placeFood(snake, 2, 1, () => 0);
  assert.equal(food, null, "2x1 board fully occupied → no free cell");

  const food2 = placeFood([{ x: 0, y: 0 }], 2, 1, () => 0);
  assert.deepEqual(food2, { x: 1, y: 0 });
});

test("nextDirection ignores 180° reversals but allows turns", () => {
  assert.deepEqual(nextDirection({ x: 1, y: 0 }, { x: -1, y: 0 }), { x: 1, y: 0 });
  assert.deepEqual(nextDirection({ x: 1, y: 0 }, { x: 0, y: 1 }), { x: 0, y: 1 });
});

test("stepSnake advances the head and pops the tail when not eating", () => {
  const state = { snake: [{ x: 2, y: 2 }, { x: 1, y: 2 }], dir: { x: 1, y: 0 }, food: null, score: 0, alive: true };
  const next = stepSnake(state, 10, 10);
  assert.deepEqual(next.snake, [{ x: 3, y: 2 }, { x: 2, y: 2 }]);
  assert.equal(next.score, 0);
});

test("stepSnake grows and scores when eating, and spawns new food", () => {
  const state = { snake: [{ x: 2, y: 2 }, { x: 1, y: 2 }], dir: { x: 1, y: 0 }, food: { x: 3, y: 2 }, score: 0, alive: true };
  const next = stepSnake(state, 10, 10, () => 0);
  assert.equal(next.snake.length, 3, "snake grows by one");
  assert.equal(next.score, 1);
  assert.ok(next.food && !(next.food.x === 3 && next.food.y === 2));
});

test("stepSnake ends the game on a wall collision", () => {
  const state = { snake: [{ x: 9, y: 0 }], dir: { x: 1, y: 0 }, food: null, score: 0, alive: true };
  assert.equal(stepSnake(state, 10, 10).alive, false);
});

test("stepSnake ends the game on a self collision but allows entering the vacated tail", () => {
  const loop = [{ x: 1, y: 1 }, { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 2, y: 1 }];
  // Heading down into snake[1] (a non-tail body cell) is a collision.
  const collide = stepSnake({ snake: loop, dir: { x: 0, y: 1 }, food: null, score: 0, alive: true }, 10, 10);
  assert.equal(collide.alive, false);
  // Heading right into the tail cell (which moves away) is allowed.
  const ok = stepSnake({ snake: loop, dir: { x: 1, y: 0 }, food: null, score: 0, alive: true }, 10, 10);
  assert.equal(ok.alive, true);
  assert.deepEqual(ok.snake[0], { x: 2, y: 1 });
});

test("Snake content has a canvas and no inline handlers", () => {
  const content = getSnakeContent();
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
  setAttribute(n, v) { this._attrs[n] = v; }
  hasAttribute(n) { return n in this._attrs; }
  focus() {}
}

function createSnakeWindow() {
  const canvas = new FakeElement();
  const score = new FakeElement();
  const status = new FakeElement();
  const pause = new FakeElement();
  const neu = new FakeElement();
  const map = {
    "[data-canvas]": canvas,
    "[data-score]": score,
    "[data-status]": status,
    '[data-action="pause"]': pause,
    '[data-action="new"]': neu
  };
  const self = new FakeElement();
  self.elements = [canvas, score, status, pause, neu];
  self.querySelector = (sel) => map[sel] ?? null;
  return self;
}

test("initSnake runs a loop and releases the timer and listeners on dispose", () => {
  const origSet = globalThis.setInterval;
  const origClear = globalThis.clearInterval;
  const cleared = [];
  let nextId = 1;
  globalThis.setInterval = () => nextId++;
  globalThis.clearInterval = (id) => cleared.push(id);

  try {
    const app = new BaseApp();
    const win = createSnakeWindow();
    const api = initSnake(win, null, null, {}, app);

    assert.equal(api.isRunning(), true);
    const registered = [...win.elements, win].flatMap((el) => el.listeners || []);
    assert.ok(registered.length > 0);

    app.dispose();
    assert.ok(cleared.length > 0, "loop cleared on dispose");
    assert.ok(registered.every((e) => !e.active), "listeners removed on dispose");
  } finally {
    globalThis.setInterval = origSet;
    globalThis.clearInterval = origClear;
  }
});

test("SnakeApp exposes the game content through the app class", () => {
  const app = new SnakeApp({ services: {} });
  assert.match(app.getWindowContent(), /snake-layout/);
});
