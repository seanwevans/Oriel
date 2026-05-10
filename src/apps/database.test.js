import assert from "node:assert/strict";
import { test } from "node:test";

import { initDatabase } from "./database.js";

class FakeElement {
  constructor(tagName) {
    this.tagName = tagName.toUpperCase();
    this.children = [];
    this.parentElement = null;
    this.attributes = {};
    this.eventListeners = {};
    this._textContent = "";
  }

  appendChild(child) {
    child.parentElement = this;
    this.children.push(child);
    return child;
  }

  set innerHTML(value) {
    this.children = [];
    this._innerHTML = value;

    const tagPattern = /<\s*([a-z][\w-]*)\b[^>]*>/gi;
    let match;
    while ((match = tagPattern.exec(value)) !== null) {
      this.appendChild(new FakeElement(match[1]));
    }
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

  addEventListener(type, handler) {
    this.eventListeners[type] ||= [];
    this.eventListeners[type].push(handler);
  }

  click() {
    for (const handler of this.eventListeners.click || []) {
      handler();
    }
  }

  closest(selector) {
    if (selector !== ".window") return null;

    let current = this;
    while (current) {
      if (current.className === "window") return current;
      current = current.parentElement;
    }

    return null;
  }

  querySelector(selector) {
    return this.querySelectorAll(selector)[0] || null;
  }

  querySelectorAll(selector) {
    const matches = [];

    const visit = (element) => {
      if (matchesSelector(element, selector)) {
        matches.push(element);
      }

      for (const child of element.children) {
        visit(child);
      }
    };

    visit(this);
    return matches;
  }
}

function matchesSelector(element, selector) {
  if (selector.startsWith("#")) {
    return element.id === selector.slice(1);
  }

  return element.tagName.toLowerCase() === selector.toLowerCase();
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

function createDatabaseWindow() {
  const windowElement = new FakeElement("div");
  windowElement.className = "window";

  const tbody = new FakeElement("tbody");
  tbody.id = "db-tbody";
  windowElement.appendChild(tbody);

  return { windowElement, tbody };
}

test("database records render HTML-like values as text only", () => {
  withFakeDom(() => {
    const { windowElement, tbody } = createDatabaseWindow();
    const record = {
      name: '<img src=x onerror="alert(1)">',
      phone: '<script>alert("phone")</script>',
      email: '<a href="mailto:test@example.com">test@example.com</a>'
    };
    localStorage.setItem("w31-db", JSON.stringify([record]));

    initDatabase(windowElement);

    assert.equal(tbody.querySelector("img"), null);
    assert.equal(tbody.querySelector("script"), null);
    assert.equal(tbody.querySelector("a"), null);

    const cells = tbody.querySelectorAll("td");
    assert.equal(cells[0].textContent, record.name);
    assert.equal(cells[1].textContent, record.phone);
    assert.equal(cells[2].textContent, record.email);
  });
});

test("database delete buttons use click listeners", () => {
  withFakeDom(() => {
    const { windowElement, tbody } = createDatabaseWindow();
    localStorage.setItem(
      "w31-db",
      JSON.stringify([
        { name: "first", phone: "111", email: "first@example.com" },
        { name: "second", phone: "222", email: "second@example.com" }
      ])
    );

    initDatabase(windowElement);

    const button = tbody.querySelector("button");
    assert.equal(button.attributes.onclick, undefined);
    assert.equal(button.eventListeners.click.length, 1);

    button.click();

    assert.deepEqual(windowElement.dbData, [
      { name: "second", phone: "222", email: "second@example.com" }
    ]);
    assert.equal(tbody.querySelectorAll("tr").length, 1);
  });
});
