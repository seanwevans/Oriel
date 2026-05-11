import assert from "node:assert/strict";
import { test } from "node:test";

import { runCompiler } from "./console.js";

class FakeElement {
  constructor(tagName) {
    this.tagName = tagName.toUpperCase();
    this.children = [];
    this.parentElement = null;
    this.className = "";
    this.id = "";
    this.value = "";
    this._textContent = "";
    this._innerHTML = "";
  }

  appendChild(child) {
    child.parentElement = this;
    this.children.push(child);
    return child;
  }

  set innerHTML(value) {
    this.children = [];
    this._innerHTML = String(value ?? "");

    const tagPattern = /<\s*([a-z][\w-]*)\b[^>]*>/gi;
    let match;
    while ((match = tagPattern.exec(this._innerHTML)) !== null) {
      this.appendChild(new FakeElement(match[1]));
    }
  }

  get innerHTML() {
    return this._innerHTML;
  }

  set textContent(value) {
    this._textContent = String(value ?? "");
    this.children = [];
  }

  get textContent() {
    return this._textContent;
  }

  closest(selector) {
    let current = this;
    while (current) {
      if (matchesSelector(current, selector)) return current;
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
      if (matchesSelector(element, selector)) matches.push(element);
      for (const child of element.children) visit(child);
    };

    visit(this);
    return matches;
  }
}

function matchesSelector(element, selector) {
  if (selector.startsWith("#")) return element.id === selector.slice(1);
  if (selector.startsWith(".")) {
    return element.className.split(/\s+/).includes(selector.slice(1));
  }
  return element.tagName.toLowerCase() === selector.toLowerCase();
}

function createCompilerWindow() {
  const windowElement = new FakeElement("div");
  windowElement.className = "window";

  const editor = new FakeElement("textarea");
  editor.className = "compiler-editor";
  editor.value = "int main() { return 0; }";

  const output = new FakeElement("div");
  output.id = "compiler-out";

  const button = new FakeElement("button");

  windowElement.appendChild(editor);
  windowElement.appendChild(output);
  windowElement.appendChild(button);

  return { button, output };
}

async function withFakeDomAndFetch(fn) {
  const originalDocument = globalThis.document;
  const originalFetch = globalThis.fetch;

  globalThis.document = {
    createElement(tagName) {
      return new FakeElement(tagName);
    },
    querySelector() {
      return null;
    }
  };

  globalThis.fetch = async () => ({
    ok: true,
    async json() {
      return {
        stdout: [{ text: '<img src=x onerror="globalThis.pwned=true">' }],
        stderr: [],
        execResult: {
          code: 0,
          stdout: [{ text: "safe program output" }],
          stderr: []
        }
      };
    }
  });

  try {
    return await fn();
  } finally {
    globalThis.document = originalDocument;
    globalThis.fetch = originalFetch;
    delete globalThis.pwned;
  }
}

test("compiler output renders HTML-like compiler text inside the pre", async () => {
  await withFakeDomAndFetch(async () => {
    const { button, output } = createCompilerWindow();

    await runCompiler({ target: button });

    const pre = output.querySelector("pre");
    assert.ok(pre);
    assert.equal(output.querySelector("img"), null);
    assert.equal(globalThis.pwned, undefined);
    assert.match(pre.textContent, /Compiler output:/);
    assert.match(pre.textContent, /<img src=x onerror="globalThis\.pwned=true">/);
  });
});
