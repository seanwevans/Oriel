import assert from "node:assert/strict";
import { afterEach, test } from "node:test";

import { runCompiler } from "./console.js";

class FakeElement {
  constructor(tagName = "div") {
    this.tagName = tagName.toLowerCase();
    this.children = [];
    this.parentElement = null;
    this.id = "";
    this.className = "";
    this.value = "";
    this._textContent = "";
    this._trustedHtml = "";
  }

  appendChild(child) {
    child.parentElement = this;
    this.children.push(child);
    return child;
  }

  replaceChildren(...children) {
    this.children = [];
    this._trustedHtml = "";
    this._textContent = "";
    children.forEach((child) => this.appendChild(child));
  }

  set innerHTML(value) {
    this.children = [];
    this._textContent = "";
    this._trustedHtml = String(value);

    const tagPattern = /<\s*([a-z][\w-]*)\b[^>]*>/gi;
    let match;
    while ((match = tagPattern.exec(this._trustedHtml)) !== null) {
      this.appendChild(new FakeElement(match[1]));
    }
  }

  get innerHTML() {
    return this._trustedHtml;
  }

  set textContent(value) {
    this.children = [];
    this._trustedHtml = "";
    this._textContent = String(value ?? "");
  }

  get textContent() {
    return this._textContent + this.children.map((child) => child.textContent).join("");
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
      element.children.forEach(visit);
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
  return element.tagName === selector.toLowerCase();
}

function createCompilerWindow() {
  const windowElement = new FakeElement("div");
  windowElement.className = "window";

  const editor = new FakeElement("textarea");
  editor.className = "compiler-editor";
  editor.value = "#include <stdio.h>\nint main(){ puts(\"hello\"); }";
  windowElement.appendChild(editor);

  const output = new FakeElement("div");
  output.id = "compiler-out";
  windowElement.appendChild(output);

  const button = new FakeElement("button");
  windowElement.appendChild(button);

  return { button, output, windowElement };
}

const originalDocument = globalThis.document;
const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.document = originalDocument;
  globalThis.fetch = originalFetch;
});

test("runCompiler renders malicious stdout as text instead of HTML", async () => {
  const { button, output } = createCompilerWindow();
  const maliciousStdout = "<img src=x onerror=alert(1)>";

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
        code: 0,
        stdout: [],
        stderr: [],
        execResult: {
          code: 0,
          stdout: [{ text: maliciousStdout }],
          stderr: []
        }
      };
    }
  });

  await runCompiler({ target: button });

  assert.equal(output.querySelector("img"), null);
  assert.equal(output.querySelector("pre")?.textContent.includes(maliciousStdout), true);
});
