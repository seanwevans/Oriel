import assert from "node:assert/strict";
import { test } from "node:test";

class FakeElement {
  constructor(tagName = "div") {
    this.tagName = tagName.toUpperCase();
    this.children = [];
    this.parentElement = null;
    this._textContent = "";
    this.value = "";
    this.className = "";
  }

  appendChild(child) {
    child.parentElement = this;
    this.children.push(child);
    return child;
  }

  set innerHTML(value) {
    this.children = [];
    this._innerHTML = value;
  }

  get innerHTML() {
    return this._innerHTML || "";
  }

  set textContent(value) {
    this._textContent = String(value ?? "");
    this.children = [];
  }

  get textContent() {
    return this._textContent;
  }

  querySelector(selector) {
    if (!selector.startsWith("#")) return null;
    const id = selector.slice(1);
    const visit = (element) => {
      if (element.id === id) return element;
      for (const child of element.children) {
        const match = visit(child);
        if (match) return match;
      }
      return null;
    };
    return visit(this);
  }
}

function withFakeDom(fn) {
  const originalDocument = globalThis.document;
  const originalLocalStorage = globalThis.localStorage;

  globalThis.document = {
    createElement(tagName) {
      return new FakeElement(tagName);
    }
  };
  globalThis.localStorage = {
    values: new Map(),
    getItem(key) {
      return this.values.get(key) ?? null;
    },
    setItem(key, value) {
      this.values.set(key, value);
    }
  };

  try {
    return fn();
  } finally {
    globalThis.document = originalDocument;
    globalThis.localStorage = originalLocalStorage;
  }
}

const { initCardfile } = await import("./cardfile.js");

function createCardfileWindow() {
  const windowElement = new FakeElement("div");
  windowElement.className = "window";

  for (const id of [
    "card-index-list",
    "card-header-display",
    "card-content-edit",
    "card-add",
    "card-del"
  ]) {
    const el = new FakeElement("div");
    el.id = id;
    windowElement.appendChild(el);
  }

  return windowElement;
}

test("cardfile falls back to the welcome card when saved cards are corrupt", () => {
  withFakeDom(() => {
    localStorage.setItem("w31-cards", "{definitely not json");
    const windowElement = createCardfileWindow();

    initCardfile(windowElement);

    assert.equal(windowElement.cards.length, 1);
    assert.equal(windowElement.cards[0].header, "Welcome");
  });
});

test("cardfile ignores saved cards that are not an array", () => {
  withFakeDom(() => {
    localStorage.setItem("w31-cards", JSON.stringify({ header: "not-an-array" }));
    const windowElement = createCardfileWindow();

    initCardfile(windowElement);

    assert.equal(windowElement.cards.length, 1);
    assert.equal(windowElement.cards[0].header, "Welcome");
  });
});

test("cardfile normalizes malformed saved card entries", () => {
  withFakeDom(() => {
    localStorage.setItem(
      "w31-cards",
      JSON.stringify([null, "junk", { id: 5 }, { id: 6, header: "Kept", content: "ok" }])
    );
    const windowElement = createCardfileWindow();

    initCardfile(windowElement);

    assert.equal(windowElement.cards.length, 2);
    const headers = windowElement.cards.map((card) => card.header);
    assert.ok(headers.includes(""));
    assert.ok(headers.includes("Kept"));
  });
});
