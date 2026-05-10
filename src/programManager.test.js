import assert from "node:assert/strict";
import { test } from "node:test";

import { ICONS } from "./icons.js";
import { getIconForType, getProgramManagerContent } from "./apps/programManager.js";

class FakeElement {
  constructor(tagName) {
    this.tagName = tagName;
    this.children = [];
    this.attributes = new Map();
    this.listeners = new Map();
    this.className = "";
    this.textContent = "";
    this.tabIndex = null;
  }

  appendChild(child) {
    this.children.push(child);
    return child;
  }

  setAttribute(name, value) {
    this.attributes.set(name, value);
  }

  addEventListener(name, listener) {
    this.listeners.set(name, listener);
  }
}

function withFakeDocument(callback) {
  const originalDocument = globalThis.document;
  globalThis.document = {
    createElement(tagName) {
      if (tagName === "template") {
        return {
          content: { firstElementChild: null },
          set innerHTML(value) {
            this.content.firstElementChild = { markup: value };
          }
        };
      }
      return new FakeElement(tagName);
    },
    createTextNode(text) {
      return { text };
    }
  };

  try {
    return callback();
  } finally {
    globalThis.document = originalDocument;
  }
}

function findProgramIcon(grid, labelText) {
  return grid.children.find((iconButton) =>
    iconButton.children.some((child) => child.className === "prog-label" && child.textContent === labelText)
  );
}

test("getIconForType uses program default icon keys before falling back to type keys", () => {
  assert.equal(getIconForType("clipbrd"), ICONS.clipboard);
  assert.equal(getIconForType("compiler"), ICONS.ccompiler);
});

test("program manager renders default icons for programs whose type differs from icon key", () => {
  withFakeDocument(() => {
    const grid = getProgramManagerContent({ openWindow() {} });

    const clipboardIcon = findProgramIcon(grid, "Clipboard");
    const compilerIcon = findProgramIcon(grid, "Tiny C");

    assert.equal(clipboardIcon.children[0].markup, ICONS.clipboard.trim());
    assert.equal(compilerIcon.children[0].markup, ICONS.ccompiler.trim());
  });
});
