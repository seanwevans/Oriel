import assert from "node:assert/strict";
import { test } from "node:test";

import { clearCharMap, getCharMapContent } from "./charmap.js";

class FakeElement {
  constructor({ className = "", id = "", value = "" } = {}) {
    this.className = className;
    this.id = id;
    this.value = value;
    this.children = [];
    this.parentElement = null;
  }

  appendChild(child) {
    child.parentElement = this;
    this.children.push(child);
    return child;
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
    if (selector === "#char-copy-input" && this.id === "char-copy-input") {
      return this;
    }

    for (const child of this.children) {
      const match = child.querySelector(selector);
      if (match) return match;
    }

    return null;
  }
}

function createCharMapWindow(value) {
  const windowElement = new FakeElement({ className: "window" });
  const input = windowElement.appendChild(
    new FakeElement({ id: "char-copy-input", value })
  );
  const button = windowElement.appendChild(new FakeElement());

  return { button, input, windowElement };
}

test("Character Map Clear button is wired to the scoped helper", () => {
  const content = getCharMapContent();

  assert.match(content, /onclick="clearCharMap\(this\)"/);
  assert.doesNotMatch(content, /document\.getElementById\('char-copy-input'\)\.value = ''/);
});

test("clearCharMap clears only the Character Map window containing the clicked button", () => {
  const first = createCharMapWindow("ABC");
  const second = createCharMapWindow("XYZ");

  clearCharMap(second.button);

  assert.equal(first.input.value, "ABC");
  assert.equal(second.input.value, "");
});
