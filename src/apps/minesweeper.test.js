import assert from "node:assert/strict";
import { test } from "node:test";

class FakeElement {
  constructor(tagName = "div") {
    this.tagName = tagName.toLowerCase();
    this.textContent = "";
    this.children = [];
    this.listeners = new Map();
    this.className = "";
    const classes = new Set();
    this.classList = {
      add: (...names) => names.forEach((n) => classes.add(n)),
      remove: (...names) => names.forEach((n) => classes.delete(n)),
      contains: (n) => classes.has(n)
    };
  }

  set innerHTML(value) {
    if (value === "") this.children = [];
  }

  appendChild(child) {
    this.children.push(child);
    return child;
  }

  addEventListener(type, listener) {
    if (!this.listeners.has(type)) this.listeners.set(type, []);
    this.listeners.get(type).push(listener);
  }

  dispatch(type, event = { preventDefault() {} }) {
    (this.listeners.get(type) || []).forEach((listener) => listener(event));
  }
}

global.document = {
  createElement(tagName) {
    return new FakeElement(tagName);
  }
};

const { getMinesContent, initMinesweeper } = await import("./minesweeper.js");

function createFakeWindow() {
  const elements = new Map([
    ["mines-grid", new FakeElement()],
    ["mines-count", new FakeElement()],
    ["mines-timer", new FakeElement()],
    ["mines-face", new FakeElement()]
  ]);
  return {
    elements,
    querySelector(selector) {
      if (!selector.startsWith(".")) return null;
      return elements.get(selector.slice(1)) || null;
    }
  };
}

// placeMines consumes Math.random; make it deterministic and collision-free
// so cell 0 is never a mine in either window.
function mockRandomSequence(t) {
  let seed = 0;
  t.mock.method(Math, "random", () => {
    seed = (seed + 0.618) % 1;
    return seed;
  });
}

test("Minesweeper markup provides every element the app logic queries", () => {
  const markup = getMinesContent();
  for (const cls of ["mines-grid", "mines-count", "mines-timer", "mines-face"]) {
    assert.ok(markup.includes(cls), `markup is missing .${cls}`);
  }
});

test("each Minesweeper window owns its board and flag counter", (t) => {
  mockRandomSequence(t);

  const winA = createFakeWindow();
  const winB = createFakeWindow();
  const appA = initMinesweeper(winA);
  initMinesweeper(winB);

  assert.equal(winA.elements.get("mines-grid").children.length, 81);
  assert.equal(winB.elements.get("mines-grid").children.length, 81);

  // Flag one cell in window B, then reset window A via its face button.
  winB.elements.get("mines-grid").children[0].dispatch("contextmenu");
  assert.equal(winB.elements.get("mines-count").textContent, "009");

  appA.reset();

  // Window B's flag count must survive window A's reset.
  winB.elements.get("mines-grid").children[1].dispatch("contextmenu");
  assert.equal(winB.elements.get("mines-count").textContent, "008");
});

test("disposing one Minesweeper window does not stop another's timer", (t) => {
  t.mock.timers.enable({ apis: ["setInterval", "Date"] });
  mockRandomSequence(t);

  const winA = createFakeWindow();
  const winB = createFakeWindow();
  const appA = initMinesweeper(winA);
  initMinesweeper(winB);

  // Start both timers by revealing a safe cell in each window.
  winA.elements.get("mines-grid").children[0].dispatch("click");
  winB.elements.get("mines-grid").children[0].dispatch("click");

  appA.dispose();
  t.mock.timers.tick(1000);

  assert.equal(winB.elements.get("mines-timer").textContent, "001");
});
