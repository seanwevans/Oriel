import assert from "node:assert/strict";
import { test } from "node:test";

import { BaseApp } from "./base/BaseApp.js";
import {
  ColorPickerApp,
  clamp,
  getColorPickerContent,
  hexToRgb,
  hslToRgb,
  initColorPicker,
  rgbToHex,
  rgbToHsl
} from "./colorPicker.js";

test("clamp bounds a value", () => {
  assert.equal(clamp(5, 0, 10), 5);
  assert.equal(clamp(-1, 0, 10), 0);
  assert.equal(clamp(11, 0, 10), 10);
});

test("hexToRgb parses 3- and 6-digit hex and rejects junk", () => {
  assert.deepEqual(hexToRgb("#ffffff"), { r: 255, g: 255, b: 255 });
  assert.deepEqual(hexToRgb("000000"), { r: 0, g: 0, b: 0 });
  assert.deepEqual(hexToRgb("#f00"), { r: 255, g: 0, b: 0 });
  assert.deepEqual(hexToRgb("#0a0b0c"), { r: 10, g: 11, b: 12 });
  assert.equal(hexToRgb("#12345"), null);
  assert.equal(hexToRgb("nope"), null);
  assert.equal(hexToRgb(42), null);
});

test("rgbToHex pads and clamps channels", () => {
  assert.equal(rgbToHex({ r: 0, g: 128, b: 255 }), "#0080ff");
  assert.equal(rgbToHex({ r: -5, g: 300, b: 10 }), "#00ff0a");
});

test("rgbToHsl computes known conversions", () => {
  assert.deepEqual(rgbToHsl({ r: 255, g: 0, b: 0 }), { h: 0, s: 100, l: 50 });
  assert.deepEqual(rgbToHsl({ r: 0, g: 255, b: 0 }), { h: 120, s: 100, l: 50 });
  assert.deepEqual(rgbToHsl({ r: 0, g: 0, b: 255 }), { h: 240, s: 100, l: 50 });
  assert.deepEqual(rgbToHsl({ r: 255, g: 255, b: 255 }), { h: 0, s: 0, l: 100 });
});

test("hslToRgb inverts rgbToHsl for saturated colors", () => {
  assert.deepEqual(hslToRgb({ h: 0, s: 100, l: 50 }), { r: 255, g: 0, b: 0 });
  assert.deepEqual(hslToRgb({ h: 120, s: 100, l: 50 }), { r: 0, g: 255, b: 0 });
  assert.deepEqual(hslToRgb({ h: 240, s: 100, l: 50 }), { r: 0, g: 0, b: 255 });
});

test("rgb -> hsl -> rgb round-trips within rounding tolerance", () => {
  for (const rgb of [
    { r: 128, g: 64, b: 200 },
    { r: 12, g: 240, b: 33 },
    { r: 200, g: 200, b: 40 }
  ]) {
    const back = hslToRgb(rgbToHsl(rgb));
    assert.ok(Math.abs(back.r - rgb.r) <= 3, `r within tolerance for ${JSON.stringify(rgb)}`);
    assert.ok(Math.abs(back.g - rgb.g) <= 3, `g within tolerance for ${JSON.stringify(rgb)}`);
    assert.ok(Math.abs(back.b - rgb.b) <= 3, `b within tolerance for ${JSON.stringify(rgb)}`);
  }
});

test("Color Picker content has controls and no inline handlers", () => {
  const content = getColorPickerContent();
  assert.match(content, /data-preview/);
  assert.match(content, /data-rgb="r"/);
  assert.match(content, /data-hsl="h"/);
  assert.doesNotMatch(content, /onclick=/);
});

class FakeElement {
  constructor(dataset = {}) {
    this.dataset = dataset;
    this.value = "";
    this.textContent = "";
    this.innerHTML = "";
    this.title = "";
    this.type = "";
    this.className = "";
    this.style = {};
    this.children = [];
    this.listeners = [];
  }
  appendChild(child) { this.children.push(child); return child; }
  addEventListener(type, fn) { this.listeners.push({ type, fn, active: true }); }
  removeEventListener(type, fn) {
    for (const e of this.listeners) if (e.type === type && e.fn === fn) e.active = false;
  }
}

global.document = { createElement: () => new FakeElement() };

function createPickerWindow() {
  const map = {};
  const make = (sel, dataset) => (map[sel] = new FakeElement(dataset));
  make("[data-preview]");
  make("[data-hex]");
  make("[data-status]");
  make("[data-palette]");
  make('[data-action="copy"]');
  make('[data-action="save"]');
  for (const ch of ["r", "g", "b"]) {
    make(`[data-rgb="${ch}"]`, { rgb: ch });
    make(`[data-rgbval="${ch}"]`, { rgbval: ch });
  }
  for (const ch of ["h", "s", "l"]) {
    make(`[data-hsl="${ch}"]`, { hsl: ch });
    make(`[data-hslval="${ch}"]`, { hslval: ch });
  }
  return {
    map,
    elements: Object.values(map),
    querySelector: (sel) => map[sel] ?? null
  };
}

test("initColorPicker seeds swatches and releases listeners on dispose", () => {
  const app = new BaseApp();
  const win = createPickerWindow();

  const api = initColorPicker(win, null, null, {}, app);

  assert.equal(win.map["[data-hex]"].value, "#000080", "hex reflects the initial color");
  assert.ok(win.map["[data-palette]"].children.length > 0, "palette seeded with swatches");
  assert.deepEqual(api.getColor(), { r: 0, g: 0, b: 128 });

  const registered = win.elements.flatMap((el) => el.listeners);
  assert.ok(registered.length > 0);

  app.dispose();
  assert.ok(registered.every((e) => !e.active), "listeners removed on dispose");
});

test("ColorPickerApp exposes the content through the app class", () => {
  const app = new ColorPickerApp({ services: {} });
  assert.match(app.getWindowContent(), /cp-layout/);
});
