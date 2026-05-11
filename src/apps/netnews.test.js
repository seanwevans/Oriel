import assert from "node:assert/strict";
import { test } from "node:test";

const storage = new Map();

global.localStorage = {
  getItem: (key) => (storage.has(key) ? storage.get(key) : null),
  setItem: (key, value) => storage.set(key, String(value)),
  removeItem: (key) => storage.delete(key)
};

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

class FakeElement {
  constructor(tagName) {
    this.tagName = tagName.toLowerCase();
    this.attributes = new Map();
    this.children = [];
    this.dataset = {};
    this._textContent = "";
    this._className = "";
  }

  set className(value) {
    this._className = String(value);
    if (value) this.attributes.set("class", this._className);
  }

  get className() {
    return this._className;
  }

  set textContent(value) {
    this._textContent = String(value);
    this.children = [];
  }

  get textContent() {
    return `${this._textContent}${this.children.map((child) => child.textContent).join("")}`;
  }

  setAttribute(name, value) {
    this.attributes.set(name, String(value));
  }

  getAttribute(name) {
    return this.attributes.get(name) || null;
  }

  appendChild(child) {
    this.children.push(child);
    return child;
  }

  querySelector(selector) {
    if (!selector.startsWith(".")) return null;
    const className = selector.slice(1);
    return this.find((node) => node.className.split(/\s+/).includes(className));
  }

  find(predicate) {
    if (predicate(this)) return this;
    for (const child of this.children) {
      const match = child.find(predicate);
      if (match) return match;
    }
    return null;
  }

  get innerHTML() {
    return `${escapeHtml(this._textContent)}${this.children.map((child) => child.outerHTML).join("")}`;
  }

  get outerHTML() {
    const attrs = Array.from(this.attributes, ([name, value]) => ` ${name}="${escapeHtml(value)}"`).join("");
    return `<${this.tagName}${attrs}>${this.innerHTML}</${this.tagName}>`;
  }
}

global.document = {
  createElement(tagName) {
    return new FakeElement(tagName);
  }
};

const { createNetNewsThreadRow } = await import("./netnews.js");

test("NetNews thread titles render feed markup as text", () => {
  const title = '<img src=x onerror=alert("netnews")>Breaking';
  const row = createNetNewsThreadRow(
    {
      title,
      feedTitle: "Example Feed",
      date: "2026-05-11T12:00:00.000Z"
    },
    0,
    false
  );

  const titleEl = row.querySelector(".netnews-thread-title");

  assert.equal(titleEl.textContent, title);
  assert.doesNotMatch(row.innerHTML, /<img\b/i);
  assert.match(row.innerHTML, /&lt;img src=x onerror=alert\(&quot;netnews&quot;\)&gt;Breaking/);
});
