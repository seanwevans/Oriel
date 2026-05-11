import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";

import { fileSystemReady, MOCK_FS, replaceFileSystem } from "../filesystem.js";
import { rFL, rFT } from "./fileManager.js";

class FakeClassList {
  constructor(element) {
    this.element = element;
  }

  remove(className) {
    this.element.className = this.element.className
      .split(/\s+/)
      .filter((name) => name && name !== className)
      .join(" ");
  }
}

class FakeElement {
  constructor(tagName = "div") {
    this.tagName = tagName.toLowerCase();
    this.children = [];
    this.parentNode = null;
    this.style = {};
    this.className = "";
    this._textContent = "";
    this._trustedHtml = "";
    this.classList = new FakeClassList(this);
  }

  appendChild(child) {
    child.parentNode = this;
    this.children.push(child);
    return child;
  }

  set innerHTML(value) {
    this.children = [];
    this._textContent = "";
    this._trustedHtml = String(value);

    if (this._trustedHtml.includes("<svg")) {
      this.appendChild(new FakeElement("svg"));
    }

    const imageMatches = this._trustedHtml.match(/<img\b/gi) || [];
    for (const _match of imageMatches) {
      this.appendChild(new FakeElement("img"));
    }
  }

  get innerHTML() {
    return [
      this._trustedHtml,
      escapeHtml(this._textContent),
      ...this.children.map((child) => child.outerHTML)
    ].join("");
  }

  set innerText(value) {
    this.textContent = value;
  }

  get innerText() {
    return this.textContent;
  }

  set textContent(value) {
    this.children = [];
    this._trustedHtml = "";
    this._textContent = String(value);
  }

  get textContent() {
    return this._textContent + this.children.map((child) => child.textContent).join("");
  }

  get outerHTML() {
    return `<${this.tagName}>${this.innerHTML}</${this.tagName}>`;
  }

  querySelectorAll(selector) {
    const matches = [];
    const visit = (element) => {
      for (const child of element.children) {
        if (matchesSelector(child, selector)) matches.push(child);
        visit(child);
      }
    };
    visit(this);
    return matches;
  }
}

function matchesSelector(element, selector) {
  if (selector.startsWith(".")) {
    return element.className.split(/\s+/).includes(selector.slice(1));
  }

  return element.tagName === selector.toLowerCase();
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function createWindowStub() {
  const elements = {
    "#file-tree-root": new FakeElement("div"),
    ".winfile-tree .winfile-pane-header": new FakeElement("div"),
    "#file-list-view": new FakeElement("div"),
    "#file-list-header": new FakeElement("div")
  };

  return {
    ...elements,
    querySelector(selector) {
      return elements[selector] || null;
    },
    querySelectorAll(selector) {
      return Object.values(elements).flatMap((element) => element.querySelectorAll(selector));
    }
  };
}

let originalDocument;
let originalFileSystem;

beforeEach(async () => {
  await fileSystemReady;
  originalDocument = globalThis.document;
  originalFileSystem = structuredClone(MOCK_FS);
  globalThis.document = {
    createElement(tagName) {
      return new FakeElement(tagName);
    }
  };
});

afterEach(async () => {
  globalThis.document = originalDocument;
  await replaceFileSystem(originalFileSystem, { persist: false });
});

test("rFT and rFL render imported entry names as text instead of HTML", async () => {
  const folderName = '<img src=x onerror=alert(1)> "docs"';
  const fileName = 'QUOTE "NAME" <img src=x onerror=alert(1)>.TXT';
  const importedFs = {
    "C\\": {
      type: "dir",
      children: {
        [folderName]: { type: "dir", children: {} },
        [fileName]: { type: "file", app: "notepad", content: "safe content" }
      }
    }
  };

  await replaceFileSystem(importedFs, { persist: false });

  const win = createWindowStub();
  win.cP = "C\\";
  win.cD = MOCK_FS["C\\"];
  win.currentDirObj = win.cD;

  await rFT(win);
  await rFL(win);

  const treeRoot = win.querySelector("#file-tree-root");
  const listView = win.querySelector("#file-list-view");

  assert.equal(treeRoot.querySelectorAll("img").length, 0);
  assert.equal(listView.querySelectorAll("img").length, 0);
  assert.ok(
    treeRoot.querySelectorAll("span").some((span) => span.textContent === folderName),
    "folder names should be assigned via textContent"
  );
  assert.ok(
    listView.querySelectorAll("span").some((span) => span.textContent === folderName),
    "folder list labels should be assigned via textContent"
  );
  assert.ok(
    listView.querySelectorAll("span").some((span) => span.textContent === fileName),
    "file list labels should be assigned via textContent"
  );
});

test("rFT builds child paths from trailing drive separators", async () => {
  const importedFs = {
    "D\\": {
      type: "dir",
      children: {
        CHILD: { type: "dir", children: {} }
      }
    }
  };

  await replaceFileSystem(importedFs, { persist: false });

  const win = createWindowStub();
  win.cP = "D\\";
  win.cD = MOCK_FS["D\\"];
  win.currentDirObj = win.cD;

  await rFT(win);

  const childTreeItem = win
    .querySelector("#file-tree-root")
    .querySelectorAll(".tree-item")
    .find((item) => item.querySelectorAll("span").some((span) => span.textContent === "CHILD"));

  assert.ok(childTreeItem, "child directory should render in the tree");

  await childTreeItem.onclick({ stopPropagation() {} });

  assert.equal(win.cP, "D\\CHILD");
});
