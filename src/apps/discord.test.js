import assert from "node:assert/strict";
import { test } from "node:test";

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

const { createDiscordMessageRow } = await import("./discord.js");

test("Discord message author and content render as text, not markup", () => {
  const username = '<img src=x onerror=alert("discord")>Mallory';
  const content = '<script>alert("payload")</script> hi & <b>there</b>';
  const row = createDiscordMessageRow({
    author: { username },
    content,
    timestamp: "2026-05-11T12:00:00.000Z"
  });

  const metaEl = row.querySelector(".discord-msg-meta");
  const bodyEl = row.querySelector(".discord-msg-body");

  assert.ok(metaEl.textContent.startsWith(username));
  assert.equal(bodyEl.textContent, content);
  assert.doesNotMatch(row.innerHTML, /<img\b/i);
  assert.doesNotMatch(row.innerHTML, /<script\b/i);
});

test("Discord messages without content fall back to a placeholder", () => {
  const row = createDiscordMessageRow({ author: {} });

  assert.equal(row.querySelector(".discord-msg-body").textContent, "(no content)");
  assert.match(row.querySelector(".discord-msg-meta").textContent, /^Unknown · /);
});
