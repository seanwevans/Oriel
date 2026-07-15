import { BaseApp } from "./base/BaseApp.js";

// Sheets is a compact Lotus 1-2-3 / Excel-style spreadsheet. The formula engine
// below is deliberately kept free of any DOM access so it can be unit tested and
// reused: SheetEngine owns the cell data and a small recursive-descent evaluator
// resolves references, ranges, and the common aggregate functions.

export const SHEET_COLS = 8;
export const SHEET_ROWS = 20;

export const ERROR_VALUE = "#ERR!";
export const CIRCULAR_VALUE = "#CIRC!";
export const NUMBER_ERROR = "#NUM!";

class FormulaError extends Error {}
class CircularError extends Error {}

const FUNCTIONS = {
  SUM: (args) => args.reduce((total, n) => total + n, 0),
  PRODUCT: (args) => args.reduce((total, n) => total * n, 1),
  AVERAGE: (args) => (args.length ? args.reduce((total, n) => total + n, 0) / args.length : 0),
  AVG: (args) => FUNCTIONS.AVERAGE(args),
  MIN: (args) => (args.length ? Math.min(...args) : 0),
  MAX: (args) => (args.length ? Math.max(...args) : 0),
  COUNT: (args) => args.length,
  ABS: (args) => Math.abs(args[0] ?? 0),
  ROUND: (args) => {
    const [value = 0, digits = 0] = args;
    const factor = 10 ** digits;
    return Math.round(value * factor) / factor;
  }
};

/** Convert a zero-based column index to its label, e.g. 0 -> "A", 26 -> "AA". */
export function columnLabel(index) {
  let label = "";
  let n = index + 1;
  while (n > 0) {
    const remainder = (n - 1) % 26;
    label = String.fromCharCode(65 + remainder) + label;
    n = Math.floor((n - 1) / 26);
  }
  return label;
}

/** Convert a column label back to its zero-based index, e.g. "A" -> 0. */
export function columnIndex(label) {
  let n = 0;
  for (const ch of label.toUpperCase()) {
    n = n * 26 + (ch.charCodeAt(0) - 64);
  }
  return n - 1;
}

/** Parse a cell reference such as "B3" into { col, row } (zero-based) or null. */
export function parseRef(ref) {
  const match = /^([A-Za-z]+)(\d+)$/.exec(ref);
  if (!match) return null;
  return { col: columnIndex(match[1]), row: parseInt(match[2], 10) - 1 };
}

/** Build a cell name from zero-based coordinates, e.g. (1, 2) -> "B3". */
export function cellName(col, row) {
  return `${columnLabel(col)}${row + 1}`;
}

function expandRange(startRef, endRef) {
  const start = parseRef(startRef);
  const end = parseRef(endRef);
  if (!start || !end) throw new FormulaError();
  const names = [];
  const colFrom = Math.min(start.col, end.col);
  const colTo = Math.max(start.col, end.col);
  const rowFrom = Math.min(start.row, end.row);
  const rowTo = Math.max(start.row, end.row);
  for (let row = rowFrom; row <= rowTo; row++) {
    for (let col = colFrom; col <= colTo; col++) {
      names.push(cellName(col, row));
    }
  }
  return names;
}

function tokenize(src) {
  const tokens = [];
  const pattern = /\s+|(\d+\.?\d*|\.\d+)|([A-Za-z]+\d+)|([A-Za-z]+)|([+\-*/(),:])/g;
  let index = 0;
  while (index < src.length) {
    pattern.lastIndex = index;
    const match = pattern.exec(src);
    if (!match || match.index !== index) throw new FormulaError();
    index = pattern.lastIndex;
    if (match[1] !== undefined) tokens.push({ type: "num", value: parseFloat(match[1]) });
    else if (match[2] !== undefined) tokens.push({ type: "ref", value: match[2].toUpperCase() });
    else if (match[3] !== undefined) tokens.push({ type: "func", value: match[3].toUpperCase() });
    else if (match[4] !== undefined) tokens.push({ type: "op", value: match[4] });
    // Whitespace matches produce no capture groups and are skipped.
  }
  return tokens;
}

/**
 * Evaluate a formula body (without the leading "=").
 *
 * @param {string} src - the formula text.
 * @param {(ref: string) => number} resolve - resolves a cell reference to a
 *   numeric value. Non-numeric or empty cells should resolve to 0.
 * @returns {number}
 */
export function evaluateFormula(src, resolve) {
  const tokens = tokenize(src);
  if (!tokens.length) return 0;

  let pos = 0;
  const peek = () => tokens[pos];
  const advance = () => tokens[pos++];
  const expect = (value) => {
    const token = advance();
    if (!token || token.value !== value) throw new FormulaError();
  };

  function parseExpression() {
    let left = parseTerm();
    while (peek() && peek().type === "op" && (peek().value === "+" || peek().value === "-")) {
      const op = advance().value;
      const right = parseTerm();
      left = op === "+" ? left + right : left - right;
    }
    return left;
  }

  function parseTerm() {
    let left = parseFactor();
    while (peek() && peek().type === "op" && (peek().value === "*" || peek().value === "/")) {
      const op = advance().value;
      const right = parseFactor();
      left = op === "*" ? left * right : left / right;
    }
    return left;
  }

  function parseFactor() {
    const token = peek();
    if (!token) throw new FormulaError();
    if (token.type === "op" && token.value === "-") {
      advance();
      return -parseFactor();
    }
    if (token.type === "op" && token.value === "+") {
      advance();
      return parseFactor();
    }
    if (token.type === "op" && token.value === "(") {
      advance();
      const value = parseExpression();
      expect(")");
      return value;
    }
    if (token.type === "num") {
      advance();
      return token.value;
    }
    if (token.type === "func") {
      advance();
      expect("(");
      const args = parseArgs();
      expect(")");
      const fn = FUNCTIONS[token.value];
      if (!fn) throw new FormulaError();
      return fn(args);
    }
    if (token.type === "ref") {
      advance();
      return resolve(token.value);
    }
    throw new FormulaError();
  }

  function parseArgs() {
    const args = [];
    if (peek() && peek().type === "op" && peek().value === ")") return args;
    for (;;) {
      const token = peek();
      const following = tokens[pos + 1];
      if (token && token.type === "ref" && following && following.type === "op" && following.value === ":") {
        const start = advance().value;
        advance(); // consume ":"
        const endToken = advance();
        if (!endToken || endToken.type !== "ref") throw new FormulaError();
        for (const name of expandRange(start, endToken.value)) args.push(resolve(name));
      } else {
        args.push(parseExpression());
      }
      if (peek() && peek().type === "op" && peek().value === ",") {
        advance();
        continue;
      }
      break;
    }
    return args;
  }

  const result = parseExpression();
  if (pos !== tokens.length) throw new FormulaError();
  return result;
}

function formatNumber(value) {
  const rounded = Math.round(value * 1e10) / 1e10;
  return Object.is(rounded, -0) ? "0" : String(rounded);
}

/**
 * Holds raw cell contents and computes display values. A cell is a formula when
 * its raw text starts with "="; otherwise the raw text is shown verbatim and
 * treated as its numeric value when referenced (0 when not a number).
 */
export class SheetEngine {
  constructor({ cols = SHEET_COLS, rows = SHEET_ROWS } = {}) {
    this.cols = cols;
    this.rows = rows;
    this.cells = new Map();
  }

  setCell(name, raw) {
    if (raw == null || raw === "") this.cells.delete(name);
    else this.cells.set(name, String(raw));
  }

  getRaw(name) {
    return this.cells.get(name) ?? "";
  }

  numericValue(name, visiting = new Set()) {
    const raw = this.getRaw(name);
    if (raw === "") return 0;
    if (!raw.startsWith("=")) {
      const n = Number(raw);
      return Number.isFinite(n) ? n : 0;
    }
    if (visiting.has(name)) throw new CircularError();
    visiting.add(name);
    try {
      return evaluateFormula(raw.slice(1), (ref) => this.numericValue(ref, visiting));
    } finally {
      visiting.delete(name);
    }
  }

  displayValue(name) {
    const raw = this.getRaw(name);
    if (raw === "") return "";
    if (!raw.startsWith("=")) return raw;
    try {
      const value = this.numericValue(name);
      return Number.isFinite(value) ? formatNumber(value) : NUMBER_ERROR;
    } catch (err) {
      return err instanceof CircularError ? CIRCULAR_VALUE : ERROR_VALUE;
    }
  }
}

function buildGridMarkup(cols, rows) {
  let html = `<div class="sheets-grid" data-grid style="grid-template-columns:44px repeat(${cols}, 76px);">`;
  html += `<div class="sheets-corner"></div>`;
  for (let c = 0; c < cols; c++) {
    html += `<div class="sheets-col-head">${columnLabel(c)}</div>`;
  }
  for (let r = 0; r < rows; r++) {
    html += `<div class="sheets-row-head">${r + 1}</div>`;
    for (let c = 0; c < cols; c++) {
      html += `<div class="sheets-cell" data-cell="${cellName(c, r)}" data-col="${c}" data-row="${r}"></div>`;
    }
  }
  html += `</div>`;
  return html;
}

export function getSheetsContent() {
  return `<div class="sheets-layout">
    <div class="sheets-toolbar">
      <span class="sheets-cellref" data-ref>A1</span>
      <input class="sheets-formula" data-formula type="text" spellcheck="false" placeholder="Enter a value or =formula (e.g. =SUM(A1:A3))" />
      <button class="sheets-btn" data-action="clear" type="button">Clear</button>
    </div>
    ${buildGridMarkup(SHEET_COLS, SHEET_ROWS)}
    <div class="sheets-status" data-status>Ready</div>
  </div>`;
}

export function initSheets(w, _initData, _windowManager, _services, app) {
  if (!w) return null;
  const listen = app?.listen?.bind(app) || ((t, type, fn) => t?.addEventListener?.(type, fn));

  const grid = w.querySelector("[data-grid]");
  const formula = w.querySelector("[data-formula]");
  const refLabel = w.querySelector("[data-ref]");
  const status = w.querySelector("[data-status]");

  const engine = new SheetEngine({ cols: SHEET_COLS, rows: SHEET_ROWS });
  const cellEls = new Map();
  for (const el of w.querySelectorAll("[data-cell]")) {
    cellEls.set(el.dataset.cell, el);
  }

  let selected = "A1";

  const recompute = () => {
    for (const [name, el] of cellEls) el.textContent = engine.displayValue(name);
  };

  const setStatus = (message) => {
    if (status) status.textContent = message;
  };

  const select = (name) => {
    if (!cellEls.has(name)) return;
    const previous = cellEls.get(selected);
    previous?.classList?.remove("selected");
    selected = name;
    const el = cellEls.get(name);
    el?.classList?.add("selected");
    if (refLabel) refLabel.textContent = name;
    if (formula) formula.value = engine.getRaw(name);
    const display = engine.displayValue(name);
    setStatus(display === "" ? "Ready" : `${name} = ${display}`);
  };

  const commit = () => {
    if (!formula) return;
    engine.setCell(selected, formula.value.trim());
    recompute();
    const display = engine.displayValue(selected);
    setStatus(display === "" ? "Ready" : `${selected} = ${display}`);
  };

  const move = (dCol, dRow) => {
    const ref = parseRef(selected);
    if (!ref) return;
    const col = Math.max(0, Math.min(SHEET_COLS - 1, ref.col + dCol));
    const row = Math.max(0, Math.min(SHEET_ROWS - 1, ref.row + dRow));
    select(cellName(col, row));
  };

  listen(grid, "click", (event) => {
    const cell = event.target.closest?.("[data-cell]");
    if (cell) select(cell.dataset.cell);
  });

  listen(grid, "dblclick", (event) => {
    const cell = event.target.closest?.("[data-cell]");
    if (cell) {
      select(cell.dataset.cell);
      formula?.focus?.();
      formula?.select?.();
    }
  });

  listen(formula, "keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      commit();
      move(0, 1);
      grid?.focus?.();
    } else if (event.key === "Escape") {
      event.preventDefault();
      formula.value = engine.getRaw(selected);
      grid?.focus?.();
    }
  });

  listen(grid, "keydown", (event) => {
    switch (event.key) {
      case "ArrowUp": event.preventDefault(); move(0, -1); break;
      case "ArrowDown": event.preventDefault(); move(0, 1); break;
      case "ArrowLeft": event.preventDefault(); move(-1, 0); break;
      case "ArrowRight": event.preventDefault(); move(1, 0); break;
      case "Enter": event.preventDefault(); formula?.focus?.(); formula?.select?.(); break;
      default:
        // Start editing when a printable character is typed on a selected cell.
        if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
          if (formula) formula.value = "";
          formula?.focus?.();
        }
    }
  });

  listen(w.querySelector('[data-action="clear"]'), "click", () => {
    for (const name of cellEls.keys()) engine.setCell(name, "");
    recompute();
    select(selected);
    setStatus("Sheet cleared");
  });

  if (grid && !grid.hasAttribute?.("tabindex")) grid.setAttribute?.("tabindex", "0");

  // A tiny worked example so the sheet feels alive on first launch.
  const demo = {
    A1: "Qty", B1: "Price", C1: "Total",
    A2: "3", B2: "4", C2: "=A2*B2",
    A3: "5", B3: "2.5", C3: "=A3*B3",
    C4: "=SUM(C2:C3)"
  };
  for (const [name, value] of Object.entries(demo)) engine.setCell(name, value);

  recompute();
  select("A1");

  return { engine, select, commit };
}

export class SheetsApp extends BaseApp {
  getWindowContent() {
    return getSheetsContent(this.initData, this.services);
  }

  mount() {
    return initSheets(this.windowEl, this.initData, this.services.windowManager, this.services, this);
  }
}
