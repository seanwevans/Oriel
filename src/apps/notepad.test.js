import assert from "node:assert/strict";
import { test } from "node:test";

import { NotepadApp } from "./notepad.js";

class FakeClassList {
  constructor() {
    this.classes = new Set();
  }

  add(...classes) {
    classes.forEach((className) => this.classes.add(className));
  }

  toggle(className, force) {
    if (force === true) {
      this.classes.add(className);
      return true;
    }
    if (force === false) {
      this.classes.delete(className);
      return false;
    }
    if (this.classes.has(className)) {
      this.classes.delete(className);
      return false;
    }
    this.classes.add(className);
    return true;
  }

  contains(className) {
    return this.classes.has(className);
  }
}

class FakeElement {
  constructor(tagName) {
    this.tagName = tagName.toUpperCase();
    this.children = [];
    this.parentNode = null;
    this.classList = new FakeClassList();
    this.listeners = new Map();
    this.textContent = "";
    this.value = "";
    this.spellcheck = true;
    this.disabled = false;
    this.title = "";
  }

  appendChild(child) {
    child.parentNode = this;
    this.children.push(child);
    return child;
  }

  addEventListener(type, listener) {
    if (!this.listeners.has(type)) this.listeners.set(type, []);
    this.listeners.get(type).push(listener);
  }

  removeEventListener(type, listener) {
    const listeners = this.listeners.get(type) || [];
    this.listeners.set(
      type,
      listeners.filter((candidate) => candidate !== listener)
    );
  }

  dispatchEvent(event) {
    event.target ??= this;
    for (const listener of this.listeners.get(event.type) || []) listener(event);
  }

  matches(selector) {
    if (selector.startsWith(".")) return this.classList.contains(selector.slice(1));
    return this.tagName.toLowerCase() === selector.toLowerCase();
  }

  querySelector(selector) {
    const visit = (element) => {
      for (const child of element.children) {
        if (child.matches(selector)) return child;
        const match = visit(child);
        if (match) return match;
      }
      return null;
    };
    return visit(this);
  }
}

test("NotepadApp dispose releases save listener and pending status timer", async () => {
  const originalDocument = globalThis.document;
  const originalSetTimeout = globalThis.setTimeout;
  const originalClearTimeout = globalThis.clearTimeout;
  const clearedTimers = [];
  let nextTimerId = 1;
  const writes = [];

  globalThis.document = {
    createElement(tagName) {
      return new FakeElement(tagName);
    }
  };
  globalThis.setTimeout = () => nextTimerId++;
  globalThis.clearTimeout = (timerId) => clearedTimers.push(timerId);

  try {
    const app = new NotepadApp({
      initData: {
        text: "draft",
        nativeFileHandle: {
          async createWritable() {
            return {
              async write(value) {
                writes.push(value);
              },
              async close() {}
            };
          }
        }
      }
    });
    const content = app.getWindowContent();
    app.setWindowElement(content);
    app.mount();

    const saveButton = content.querySelector(".notepad-save");
    const textarea = content.querySelector(".notepad-area");
    textarea.value = "saved once";
    saveButton.dispatchEvent({ type: "click" });
    await Promise.resolve();
    await Promise.resolve();

    app.dispose();
    textarea.value = "saved twice";
    saveButton.dispatchEvent({ type: "click" });
    await Promise.resolve();

    assert.deepEqual(writes, ["saved once"]);
    assert.deepEqual(clearedTimers, [1]);
    assert.equal(saveButton.listeners.get("click")?.length, 0);
  } finally {
    globalThis.document = originalDocument;
    globalThis.setTimeout = originalSetTimeout;
    globalThis.clearTimeout = originalClearTimeout;
  }
});
