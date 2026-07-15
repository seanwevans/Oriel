import { BaseApp } from "./base/BaseApp.js";

// A small JSON pretty-printer / minifier / validator. The analysis and
// formatting helpers are DOM-free so they can be unit tested: each returns a
// result object, and errors are located (line/column) from the parser message
// where possible rather than thrown.

/** Locate a JSON syntax error's position within the source text. */
export function locateJsonError(text, err) {
  const match = /position (\d+)/.exec(err?.message || "");
  if (!match) return {};
  const position = Math.min(Number(match[1]), text.length);
  let line = 1;
  let column = 1;
  for (let i = 0; i < position; i++) {
    if (text[i] === "\n") {
      line += 1;
      column = 1;
    } else {
      column += 1;
    }
  }
  return { position, line, column };
}

/** Parse text; return { ok: true, value } or { ok: false, error, line?, column? }. */
export function analyzeJson(text) {
  if (typeof text !== "string" || text.trim() === "") {
    return { ok: false, error: "Nothing to parse." };
  }
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch (err) {
    return { ok: false, error: err.message, ...locateJsonError(text, err) };
  }
}

/** Pretty-print JSON with the given indent (a number of spaces, or "\t"). */
export function formatJson(text, indent = 2) {
  const result = analyzeJson(text);
  if (!result.ok) return result;
  return { ok: true, output: JSON.stringify(result.value, null, indent) };
}

/** Collapse JSON to a single line. */
export function minifyJson(text) {
  const result = analyzeJson(text);
  if (!result.ok) return result;
  return { ok: true, output: JSON.stringify(result.value) };
}

function describeError(result) {
  if (result.line != null) {
    return `Invalid JSON at line ${result.line}, column ${result.column}: ${result.error}`;
  }
  return `Invalid JSON: ${result.error}`;
}

const SAMPLE = `{
  "app": "Oriel",
  "version": 1,
  "widgets": ["clock", "calc", "sheets"],
  "settings": { "theme": "retro", "volume": 0.8 }
}`;

export function getJsonFormatterContent() {
  return `<div class="json-layout">
    <div class="json-toolbar">
      <button class="json-btn" data-action="format" type="button">Format</button>
      <button class="json-btn" data-action="minify" type="button">Minify</button>
      <button class="json-btn" data-action="validate" type="button">Validate</button>
      <label class="json-indent">Indent
        <select data-indent>
          <option value="2">2 spaces</option>
          <option value="4">4 spaces</option>
          <option value="\t">Tab</option>
        </select>
      </label>
      <button class="json-btn" data-action="copy" type="button">Copy</button>
      <button class="json-btn" data-action="clear" type="button">Clear</button>
    </div>
    <div class="json-panes">
      <textarea class="json-input" data-input spellcheck="false" placeholder="Paste JSON here"></textarea>
      <textarea class="json-output" data-output spellcheck="false" readonly placeholder="Formatted output"></textarea>
    </div>
    <div class="json-status" data-status>Ready</div>
  </div>`;
}

export function initJsonFormatter(w, _initData, _windowManager, _services, app) {
  if (!w) return null;
  const listen = app?.listen?.bind(app) || ((t, type, fn) => t?.addEventListener?.(type, fn));

  const input = w.querySelector("[data-input]");
  const output = w.querySelector("[data-output]");
  const status = w.querySelector("[data-status]");
  const indentSelect = w.querySelector("[data-indent]");

  const setStatus = (message, isError = false) => {
    if (!status) return;
    status.textContent = message;
    status.classList.toggle("error", isError);
  };

  const currentIndent = () => {
    const value = indentSelect?.value ?? "2";
    return value === "\t" ? "\t" : Number(value);
  };

  const apply = (result, okMessage) => {
    if (result.ok) {
      if (output) output.value = result.output;
      setStatus(okMessage);
    } else {
      setStatus(describeError(result), true);
    }
  };

  listen(w.querySelector('[data-action="format"]'), "click", () => {
    apply(formatJson(input?.value ?? "", currentIndent()), "Formatted.");
  });
  listen(w.querySelector('[data-action="minify"]'), "click", () => {
    apply(minifyJson(input?.value ?? ""), "Minified.");
  });
  listen(w.querySelector('[data-action="validate"]'), "click", () => {
    const result = analyzeJson(input?.value ?? "");
    if (result.ok) setStatus("Valid JSON.");
    else setStatus(describeError(result), true);
  });
  listen(w.querySelector('[data-action="copy"]'), "click", () => {
    const text = output?.value ?? "";
    if (!text) {
      setStatus("Nothing to copy.", true);
      return;
    }
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(
        () => setStatus("Copied to clipboard."),
        () => setStatus("Copy failed.", true)
      );
    } else if (output) {
      output.focus();
      output.select();
      document.execCommand?.("copy");
      setStatus("Copied to clipboard.");
    }
  });
  listen(w.querySelector('[data-action="clear"]'), "click", () => {
    if (input) input.value = "";
    if (output) output.value = "";
    setStatus("Cleared.");
  });
  listen(indentSelect, "change", () => {
    // Re-format with the new indent if the input is currently valid.
    const result = formatJson(input?.value ?? "", currentIndent());
    if (result.ok) apply(result, "Re-formatted.");
  });

  // Seed a small example and pretty-print it so the pane isn't empty.
  if (input) input.value = SAMPLE;
  apply(formatJson(SAMPLE, currentIndent()), "Formatted sample.");

  return { setStatus };
}

export class JsonFormatterApp extends BaseApp {
  getWindowContent() {
    return getJsonFormatterContent(this.initData, this.services);
  }

  mount() {
    return initJsonFormatter(this.windowEl, this.initData, this.services.windowManager, this.services, this);
  }
}
