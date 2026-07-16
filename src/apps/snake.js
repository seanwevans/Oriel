import { BaseApp } from "./base/BaseApp.js";

// Classic Snake. The game core below is DOM-free so it can be unit tested: the
// state is { snake: [{x,y}, …], dir, food, score, alive } and stepSnake returns
// a new state each tick. The head is snake[0]; the board does not wrap.

export const SNAKE_COLS = 20;
export const SNAKE_ROWS = 20;
export const SNAKE_CELL = 18;

const key = (c) => `${c.x},${c.y}`;

/** Pick a random free cell for food, or null when the board is full (a win). */
export function placeFood(snake, cols, rows, rng = Math.random) {
  const occupied = new Set(snake.map(key));
  const free = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (!occupied.has(`${x},${y}`)) free.push({ x, y });
    }
  }
  if (!free.length) return null;
  return free[Math.floor(rng() * free.length)];
}

export function createSnakeState(cols = SNAKE_COLS, rows = SNAKE_ROWS, rng = Math.random) {
  const cx = Math.floor(cols / 2);
  const cy = Math.floor(rows / 2);
  const snake = [
    { x: cx, y: cy },
    { x: cx - 1, y: cy },
    { x: cx - 2, y: cy }
  ];
  return { snake, dir: { x: 1, y: 0 }, food: placeFood(snake, cols, rows, rng), score: 0, alive: true };
}

/** Resolve a requested direction, ignoring 180° reversals. */
export function nextDirection(current, requested) {
  if (!requested) return current;
  if (requested.x === -current.x && requested.y === -current.y) return current;
  return requested;
}

/** Advance one tick. Returns a new state; sets alive:false on collision. */
export function stepSnake(state, cols, rows, rng = Math.random) {
  if (!state.alive) return state;
  const head = state.snake[0];
  const nx = head.x + state.dir.x;
  const ny = head.y + state.dir.y;

  if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) {
    return { ...state, alive: false };
  }

  const eating = state.food && nx === state.food.x && ny === state.food.y;
  // When not eating, the tail vacates its cell this tick, so the head may enter it.
  const body = eating ? state.snake : state.snake.slice(0, -1);
  if (body.some((c) => c.x === nx && c.y === ny)) {
    return { ...state, alive: false };
  }

  const newSnake = [{ x: nx, y: ny }, ...(eating ? state.snake : state.snake.slice(0, -1))];
  if (eating) {
    return {
      ...state,
      snake: newSnake,
      food: placeFood(newSnake, cols, rows, rng),
      score: state.score + 1
    };
  }
  return { ...state, snake: newSnake };
}

export function getSnakeContent() {
  return `<div class="snake-layout">
    <div class="snake-toolbar">
      <span class="snake-score">Score <span data-score>0</span></span>
      <button class="snake-btn" data-action="pause" type="button">Pause</button>
      <button class="snake-btn" data-action="new" type="button">New Game</button>
    </div>
    <div class="snake-stage">
      <canvas class="snake-canvas" data-canvas></canvas>
    </div>
    <div class="snake-status" data-status>Arrow keys or WASD to steer.</div>
  </div>`;
}

export function initSnake(w, _initData, _windowManager, _services, app) {
  if (!w) return null;
  const listen = app?.listen?.bind(app) || ((t, type, fn) => t?.addEventListener?.(type, fn));
  const setIntervalFn = app?.setInterval?.bind(app) || ((fn, ms) => setInterval(fn, ms));
  const clearIntervalFn = app?.clearInterval?.bind(app) || ((id) => clearInterval(id));

  const cols = SNAKE_COLS;
  const rows = SNAKE_ROWS;
  const cell = SNAKE_CELL;

  const canvas = w.querySelector("[data-canvas]");
  if (canvas) {
    canvas.width = cols * cell;
    canvas.height = rows * cell;
  }
  const ctx = canvas?.getContext?.("2d") ?? null;
  const scoreEl = w.querySelector("[data-score]");
  const statusEl = w.querySelector("[data-status]");
  const pauseBtn = w.querySelector('[data-action="pause"]');

  let state = createSnakeState(cols, rows);
  let pendingDir = null;
  let intervalId = null;
  let paused = false;

  const setStatus = (msg) => { if (statusEl) statusEl.textContent = msg; };

  const draw = () => {
    if (!ctx) return;
    ctx.fillStyle = "#0b1021";
    ctx.fillRect(0, 0, cols * cell, rows * cell);
    if (state.food) {
      ctx.fillStyle = "#ef5350";
      ctx.beginPath();
      ctx.arc(state.food.x * cell + cell / 2, state.food.y * cell + cell / 2, cell / 2 - 2, 0, Math.PI * 2);
      ctx.fill();
    }
    state.snake.forEach((seg, i) => {
      ctx.fillStyle = i === 0 ? "#b9ff6a" : "#5bbf3a";
      ctx.fillRect(seg.x * cell + 1, seg.y * cell + 1, cell - 2, cell - 2);
    });
  };

  const render = () => {
    draw();
    if (scoreEl) scoreEl.textContent = String(state.score);
  };

  const stopLoop = () => {
    if (intervalId != null) {
      clearIntervalFn(intervalId);
      intervalId = null;
    }
  };

  const delay = () => Math.max(70, 160 - state.score * 4);

  const startLoop = () => {
    stopLoop();
    if (state.alive && !paused) intervalId = setIntervalFn(tick, delay());
  };

  function tick() {
    if (pendingDir) {
      state = { ...state, dir: nextDirection(state.dir, pendingDir) };
      pendingDir = null;
    }
    const before = state.score;
    state = stepSnake(state, cols, rows);
    if (!state.alive) {
      stopLoop();
      setStatus(`Game over — score ${state.score}. Press New Game.`);
      render();
      return;
    }
    if (state.score !== before) startLoop(); // resync speed as it ramps up
    render();
  }

  const steer = (dir) => {
    if (!state.alive || paused) return;
    pendingDir = nextDirection(state.dir, dir);
  };

  const newGame = () => {
    state = createSnakeState(cols, rows);
    pendingDir = null;
    paused = false;
    if (pauseBtn) pauseBtn.textContent = "Pause";
    setStatus("Arrow keys or WASD to steer.");
    render();
    startLoop();
  };

  const togglePause = () => {
    if (!state.alive) return;
    paused = !paused;
    if (pauseBtn) pauseBtn.textContent = paused ? "Resume" : "Pause";
    if (paused) { stopLoop(); setStatus("Paused."); }
    else { setStatus("Arrow keys or WASD to steer."); startLoop(); }
  };

  listen(w, "keydown", (event) => {
    const map = {
      ArrowUp: { x: 0, y: -1 }, w: { x: 0, y: -1 }, W: { x: 0, y: -1 },
      ArrowDown: { x: 0, y: 1 }, s: { x: 0, y: 1 }, S: { x: 0, y: 1 },
      ArrowLeft: { x: -1, y: 0 }, a: { x: -1, y: 0 }, A: { x: -1, y: 0 },
      ArrowRight: { x: 1, y: 0 }, d: { x: 1, y: 0 }, D: { x: 1, y: 0 }
    };
    if (map[event.key]) { event.preventDefault(); steer(map[event.key]); }
    else if (event.key === "p" || event.key === "P") togglePause();
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
    steer,
    getState: () => state,
    isRunning: () => intervalId != null
  };
}

export class SnakeApp extends BaseApp {
  getWindowContent() {
    return getSnakeContent(this.initData, this.services);
  }

  mount() {
    return initSnake(this.windowEl, this.initData, this.services.windowManager, this.services, this);
  }
}
