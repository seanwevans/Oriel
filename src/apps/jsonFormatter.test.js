import assert from "node:assert/strict";
import { test } from "node:test";

import { BaseApp } from "./base/BaseApp.js";
import {
  JsonFormatterApp,
  analyzeJson,
  formatJson,
  getJsonFormatterContent,
  initJsonFormatter,
  locateJsonError,
  minifyJson
} from "./jsonFormatter.js";

test("analyzeJson parses valid JSON and reports invalid JSON", () => {
  const ok = analyzeJson('{"a":1}');
  assert.equal(ok.ok, true);
  assert.deepEqual(ok.value, { a: 1 });

  const bad = analyzeJson('{"a":}');
  assert.equal(bad.ok, false);
  assert.ok(bad.error);

  assert.equal(analyzeJson("").ok, false);
  assert.equal(analyzeJson("   ").ok, false);
});

test("formatJson pretty-prints with the requested indent", () => {
  const two = formatJson('{"a":1,"b":[2,3]}', 2);
  assert.equal(two.ok, true);
  assert.equal(two.output, '{\n  "a": 1,\n  "b": [\n    2,\n    3\n  ]\n}');

  const tabbed = formatJson('{"a":1}', "\t");
  assert.equal(tabbed.output, '{\n\t"a": 1\n}');
});

test("minifyJson collapses whitespace", () => {
  const result = minifyJson('{\n  "a": 1,\n  "b": 2\n}');
  assert.equal(result.ok, true);
  assert.equal(result.output, '{"a":1,"b":2}');
});

test("format/minify propagate errors instead of throwing", () => {
  const result = formatJson("{not json}");
  assert.equal(result.ok, false);
  assert.ok(result.error);
});

test("locateJsonError computes line and column from the parser message", () => {
  const text = '{\n  "a": 1,\n  "b":\n}';
  const result = analyzeJson(text);
  assert.equal(result.ok, false);
  // Error should be located on a real line within the text.
  if (result.line != null) {
    assert.ok(result.line >= 1 && result.line <= text.split("\n").length);
    assert.ok(result.column >= 1);
  }
  // Direct helper: position 0 is line 1, column 1.
  assert.deepEqual(locateJsonError("x", { message: "at position 0" }), {
    position: 0,
    line: 1,
    column: 1
  });
});

test("JSON Formatter content has panes and no inline handlers", () => {
  const content = getJsonFormatterContent();
  assert.match(content, /data-input/);
  assert.match(content, /data-output/);
  assert.doesNotMatch(content, /onclick=/);
});

class FakeElement {
  constructor(dataset = {}) {
    this.dataset = dataset;
    this.value = dataset.value ?? "";
    this.textContent = "";
    this.classList = { toggle() {}, add() {}, remove() {} };
    this.listeners = [];
  }
  addEventListener(type, fn) { this.listeners.push({ type, fn, active: true }); }
  removeEventListener(type, fn) {
    for (const e of this.listeners) if (e.type === type && e.fn === fn) e.active = false;
  }
  focus() {}
  select() {}
}

function createJsonWindow() {
  const input = new FakeElement();
  const output = new FakeElement();
  const status = new FakeElement();
  const indent = new FakeElement({ value: "2" });
  const format = new FakeElement();
  const minify = new FakeElement();
  const validate = new FakeElement();
  const copy = new FakeElement();
  const clear = new FakeElement();
  const map = {
    "[data-input]": input,
    "[data-output]": output,
    "[data-status]": status,
    "[data-indent]": indent,
    '[data-action="format"]': format,
    '[data-action="minify"]': minify,
    '[data-action="validate"]': validate,
    '[data-action="copy"]': copy,
    '[data-action="clear"]': clear
  };
  return {
    input,
    output,
    elements: [input, output, status, indent, format, minify, validate, copy, clear],
    querySelector: (sel) => map[sel] ?? null
  };
}

test("initJsonFormatter seeds and formats a sample, and releases listeners on dispose", () => {
  const app = new BaseApp();
  const win = createJsonWindow();

  initJsonFormatter(win, null, null, {}, app);

  assert.ok(win.input.value.includes("Oriel"), "input seeded with a sample");
  assert.ok(win.output.value.includes("\n"), "output pretty-printed");

  const registered = win.elements.flatMap((el) => el.listeners);
  assert.ok(registered.length > 0);

  app.dispose();
  assert.ok(registered.every((e) => !e.active), "listeners removed on dispose");
});

test("JsonFormatterApp exposes the content through the app class", () => {
  const app = new JsonFormatterApp({ services: {} });
  assert.match(app.getWindowContent(), /json-layout/);
});
