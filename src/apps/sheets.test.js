import assert from "node:assert/strict";
import { test } from "node:test";

import { BaseApp } from "./base/BaseApp.js";
import {
  SheetEngine,
  SheetsApp,
  cellName,
  columnIndex,
  columnLabel,
  evaluateFormula,
  getSheetsContent,
  initSheets,
  parseRef,
  CIRCULAR_VALUE,
  ERROR_VALUE
} from "./sheets.js";

test("column labels and indices round-trip", () => {
  assert.equal(columnLabel(0), "A");
  assert.equal(columnLabel(7), "H");
  assert.equal(columnLabel(26), "AA");
  assert.equal(columnIndex("A"), 0);
  assert.equal(columnIndex("H"), 7);
  assert.equal(columnIndex("AA"), 26);
  assert.equal(cellName(1, 2), "B3");
});

test("parseRef reads coordinates and rejects junk", () => {
  assert.deepEqual(parseRef("B3"), { col: 1, row: 2 });
  assert.equal(parseRef("3B"), null);
  assert.equal(parseRef(""), null);
});

test("evaluateFormula honours arithmetic precedence and parentheses", () => {
  const noRefs = () => 0;
  assert.equal(evaluateFormula("1+2*3", noRefs), 7);
  assert.equal(evaluateFormula("(1+2)*3", noRefs), 9);
  assert.equal(evaluateFormula("-4 + 2", noRefs), -2);
  assert.equal(evaluateFormula("10/4", noRefs), 2.5);
});

test("evaluateFormula resolves references and range functions", () => {
  const values = { A1: 3, A2: 5, A3: 2, B1: 4 };
  const resolve = (ref) => values[ref] ?? 0;
  assert.equal(evaluateFormula("A1*B1", resolve), 12);
  assert.equal(evaluateFormula("SUM(A1:A3)", resolve), 10);
  assert.equal(evaluateFormula("AVERAGE(A1:A3)", resolve), 10 / 3);
  assert.equal(evaluateFormula("MAX(A1:A3)", resolve), 5);
  assert.equal(evaluateFormula("MIN(A1:A3)", resolve), 2);
  assert.equal(evaluateFormula("COUNT(A1:A3)", resolve), 3);
  assert.equal(evaluateFormula("SUM(A1:A2, B1)", resolve), 12);
});

test("SheetEngine computes formulas across dependent cells", () => {
  const engine = new SheetEngine();
  engine.setCell("A1", "3");
  engine.setCell("A2", "4");
  engine.setCell("A3", "=A1*A2");
  engine.setCell("A4", "=SUM(A1:A3)");
  assert.equal(engine.displayValue("A3"), "12");
  assert.equal(engine.displayValue("A4"), "19");
});

test("SheetEngine shows raw text for non-numeric cells but treats them as zero", () => {
  const engine = new SheetEngine();
  engine.setCell("A1", "Total");
  engine.setCell("A2", "=A1+5");
  assert.equal(engine.displayValue("A1"), "Total");
  assert.equal(engine.displayValue("A2"), "5");
});

test("SheetEngine reports circular references without infinite recursion", () => {
  const engine = new SheetEngine();
  engine.setCell("A1", "=A2");
  engine.setCell("A2", "=A1");
  assert.equal(engine.displayValue("A1"), CIRCULAR_VALUE);
});

test("SheetEngine reports malformed formulas as errors", () => {
  const engine = new SheetEngine();
  engine.setCell("A1", "=1+");
  engine.setCell("A2", "=NOPE(A1)");
  assert.equal(engine.displayValue("A1"), ERROR_VALUE);
  assert.equal(engine.displayValue("A2"), ERROR_VALUE);
});

test("clearing a cell removes it from the sheet", () => {
  const engine = new SheetEngine();
  engine.setCell("A1", "9");
  engine.setCell("A1", "");
  assert.equal(engine.getRaw("A1"), "");
  assert.equal(engine.displayValue("A1"), "");
});

test("Sheets content is side-effect free markup without inline handlers", () => {
  const content = getSheetsContent();
  assert.match(content, /data-grid/);
  assert.match(content, /data-formula/);
  assert.match(content, /data-cell="A1"/);
  assert.doesNotMatch(content, /onclick=/);
  assert.doesNotMatch(content, /onkeydown=/);
});

// A minimal fake DOM good enough to exercise initSheets' wiring and prove that
// every listener registered through app.listen is released on dispose().
class FakeElement {
  constructor(dataset = {}) {
    this.dataset = dataset;
    this.classList = { add() {}, remove() {}, contains: () => false };
    this.textContent = "";
    this.value = "";
    this._attrs = {};
    this.listeners = [];
  }
  addEventListener(type, fn) {
    this.listeners.push({ type, fn, active: true });
  }
  removeEventListener(type, fn) {
    for (const entry of this.listeners) {
      if (entry.type === type && entry.fn === fn) entry.active = false;
    }
  }
  setAttribute(name, value) { this._attrs[name] = value; }
  hasAttribute(name) { return name in this._attrs; }
  focus() {}
  select() {}
  closest() { return null; }
}

function createSheetsWindow() {
  const grid = new FakeElement();
  const formula = new FakeElement();
  const ref = new FakeElement();
  const status = new FakeElement();
  const clear = new FakeElement();
  const cells = [
    new FakeElement({ cell: "A1", col: "0", row: "0" }),
    new FakeElement({ cell: "B1", col: "1", row: "0" })
  ];
  const map = {
    "[data-grid]": grid,
    "[data-formula]": formula,
    "[data-ref]": ref,
    "[data-status]": status,
    '[data-action="clear"]': clear
  };
  return {
    grid,
    formula,
    elements: [grid, formula, ref, status, clear, ...cells],
    querySelector: (sel) => map[sel] ?? null,
    querySelectorAll: () => cells
  };
}

test("initSheets wires listeners through the app lifecycle and releases them on dispose", () => {
  const app = new BaseApp();
  const win = createSheetsWindow();

  initSheets(win, null, null, {}, app);

  const registered = win.elements.flatMap((el) => el.listeners);
  assert.ok(registered.length > 0, "expected initSheets to register listeners");
  assert.ok(registered.every((entry) => entry.active), "listeners should start active");

  app.dispose();

  assert.ok(
    registered.every((entry) => !entry.active),
    "every registered listener should be removed on dispose"
  );
});

test("SheetsApp exposes the spreadsheet content through the app class", () => {
  const app = new SheetsApp({ services: {} });
  assert.match(app.getWindowContent(), /sheets-layout/);
});
