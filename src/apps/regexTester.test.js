import assert from "node:assert/strict";
import { test } from "node:test";

import { BaseApp } from "./base/BaseApp.js";
import {
  RegexTesterApp,
  buildSegments,
  compileRegex,
  escapeHtml,
  findMatches,
  getRegexTesterContent,
  initRegexTester
} from "./regexTester.js";

test("compileRegex reports invalid patterns instead of throwing", () => {
  assert.equal(compileRegex("a(b", "").ok, false);
  assert.equal(compileRegex("a+", "g").ok, true);
});

test("findMatches returns every match with capture groups", () => {
  const result = findMatches("(\\w+)@(\\w+)", "g", "a@b and c@d");
  assert.equal(result.ok, true);
  assert.equal(result.matches.length, 2);
  assert.deepEqual(result.matches[0], { match: "a@b", index: 0, groups: ["a", "b"] });
  assert.equal(result.matches[1].index, 8);
});

test("findMatches iterates globally even without the g flag", () => {
  const result = findMatches("\\d", "", "a1b2c3");
  assert.equal(result.matches.length, 3);
});

test("findMatches guards against zero-width infinite loops", () => {
  const result = findMatches("a*", "g", "aba");
  assert.equal(result.ok, true);
  // Must terminate and include the non-empty match.
  assert.ok(result.matches.some((m) => m.match === "aa" || m.match === "a"));
});

test("findMatches surfaces invalid patterns", () => {
  const result = findMatches("(", "", "text");
  assert.equal(result.ok, false);
  assert.ok(result.error);
});

test("buildSegments splits text into matched and unmatched runs", () => {
  const matches = [
    { match: "cat", index: 0, groups: [] },
    { match: "cat", index: 8, groups: [] }
  ];
  const segments = buildSegments("cat and cat!", matches);
  assert.deepEqual(segments, [
    { text: "cat", match: true },
    { text: " and ", match: false },
    { text: "cat", match: true },
    { text: "!", match: false }
  ]);
});

test("buildSegments skips zero-width matches", () => {
  const segments = buildSegments("abc", [{ match: "", index: 1, groups: [] }]);
  assert.deepEqual(segments, [{ text: "abc", match: false }]);
});

test("escapeHtml neutralizes markup", () => {
  assert.equal(escapeHtml('<a href="x">&'), "&lt;a href=\"x\"&gt;&amp;");
});

test("Regex Tester content has fields and no inline handlers", () => {
  const content = getRegexTesterContent();
  assert.match(content, /data-pattern/);
  assert.match(content, /data-flags/);
  assert.match(content, /data-input/);
  assert.doesNotMatch(content, /onclick=/);
});

class FakeElement {
  constructor(dataset = {}) {
    this.dataset = dataset;
    this.value = "";
    this.textContent = "";
    this.innerHTML = "";
    this.classList = { toggle() {}, add() {}, remove() {} };
    this.listeners = [];
  }
  addEventListener(type, fn) { this.listeners.push({ type, fn, active: true }); }
  removeEventListener(type, fn) {
    for (const e of this.listeners) if (e.type === type && e.fn === fn) e.active = false;
  }
}

function createRegexWindow() {
  const map = {
    "[data-pattern]": new FakeElement(),
    "[data-flags]": new FakeElement(),
    "[data-input]": new FakeElement(),
    "[data-status]": new FakeElement(),
    "[data-preview]": new FakeElement(),
    "[data-matches]": new FakeElement()
  };
  return {
    map,
    elements: Object.values(map),
    querySelector: (sel) => map[sel] ?? null
  };
}

test("initRegexTester seeds a sample, finds matches, and releases listeners on dispose", () => {
  const app = new BaseApp();
  const win = createRegexWindow();

  initRegexTester(win, null, null, {}, app);

  assert.ok(win.map["[data-pattern]"].value.includes("@"), "pattern seeded");
  // Two emails in the sample text → two matches rendered.
  assert.match(win.map["[data-status]"].textContent, /2 matches/);
  assert.ok(win.map["[data-preview]"].innerHTML.includes("<mark>"), "matches highlighted");

  const registered = win.elements.flatMap((el) => el.listeners);
  assert.ok(registered.length > 0);

  app.dispose();
  assert.ok(registered.every((e) => !e.active), "listeners removed on dispose");
});

test("RegexTesterApp exposes the content through the app class", () => {
  const app = new RegexTesterApp({ services: {} });
  assert.match(app.getWindowContent(), /regex-layout/);
});
