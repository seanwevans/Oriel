import { BaseApp } from "./base/BaseApp.js";

// A live regular-expression tester: type a pattern and flags, see matches
// highlighted in the test string plus a list of captures. The matching core is
// DOM-free and unit tested; matching always iterates globally with a zero-width
// guard so patterns like "a*" can't spin forever.

const FLAG_CHARS = "gimsuy";

export function compileRegex(pattern, flags) {
  try {
    return { ok: true, regex: new RegExp(pattern, flags) };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

/**
 * Find every match of `pattern` in `text`.
 * @returns {{ ok: true, matches: Array<{match,index,groups}> } | { ok:false, error }}
 */
export function findMatches(pattern, flags = "", text = "", limit = 5000) {
  const searchFlags = flags.includes("g") ? flags : `${flags}g`;
  const compiled = compileRegex(pattern, searchFlags);
  if (!compiled.ok) return compiled;

  const { regex } = compiled;
  const matches = [];
  let m;
  let guard = 0;
  while ((m = regex.exec(text)) !== null) {
    matches.push({ match: m[0], index: m.index, groups: m.slice(1) });
    if (m.index === regex.lastIndex) regex.lastIndex += 1; // advance past zero-width matches
    if (++guard >= limit) break;
  }
  return { ok: true, matches };
}

/** Split text into alternating unmatched/matched segments for highlighting. */
export function buildSegments(text, matches) {
  const segments = [];
  let pos = 0;
  for (const m of [...matches].sort((a, b) => a.index - b.index)) {
    if (m.match.length === 0 || m.index < pos) continue;
    if (m.index > pos) segments.push({ text: text.slice(pos, m.index), match: false });
    const end = m.index + m.match.length;
    segments.push({ text: text.slice(m.index, end), match: true });
    pos = end;
  }
  if (pos < text.length) segments.push({ text: text.slice(pos), match: false });
  return segments;
}

export function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

const SAMPLE_PATTERN = "(\\w+)@(\\w+)\\.(\\w+)";
const SAMPLE_TEXT = "Contact ada@oriel.dev or grace@oriel.dev for beta access.";

export function getRegexTesterContent() {
  return `<div class="regex-layout">
    <div class="regex-controls">
      <span class="regex-delim">/</span>
      <input class="regex-pattern" data-pattern type="text" spellcheck="false" placeholder="pattern" />
      <span class="regex-delim">/</span>
      <input class="regex-flags" data-flags type="text" spellcheck="false" placeholder="flags" maxlength="6" />
    </div>
    <div class="regex-status" data-status>Enter a pattern.</div>
    <label class="regex-label">Test string</label>
    <textarea class="regex-input" data-input spellcheck="false"></textarea>
    <div class="regex-preview" data-preview aria-live="polite"></div>
    <div class="regex-matches" data-matches></div>
  </div>`;
}

export function initRegexTester(w, _initData, _windowManager, _services, app) {
  if (!w) return null;
  const listen = app?.listen?.bind(app) || ((t, type, fn) => t?.addEventListener?.(type, fn));

  const patternEl = w.querySelector("[data-pattern]");
  const flagsEl = w.querySelector("[data-flags]");
  const inputEl = w.querySelector("[data-input]");
  const statusEl = w.querySelector("[data-status]");
  const previewEl = w.querySelector("[data-preview]");
  const matchesEl = w.querySelector("[data-matches]");

  const setStatus = (msg, isError = false) => {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.classList.toggle("error", isError);
  };

  const renderPreview = (text, matches) => {
    if (!previewEl) return;
    previewEl.innerHTML = buildSegments(text, matches)
      .map((seg) => (seg.match ? `<mark>${escapeHtml(seg.text)}</mark>` : escapeHtml(seg.text)))
      .join("");
  };

  const renderMatches = (matches) => {
    if (!matchesEl) return;
    if (!matches.length) {
      matchesEl.innerHTML = '<div class="regex-empty">No matches.</div>';
      return;
    }
    matchesEl.innerHTML = matches
      .map((m, i) => {
        const groups = m.groups.length
          ? ` <span class="regex-groups">groups: ${m.groups.map((g) => escapeHtml(g ?? "∅")).join(", ")}</span>`
          : "";
        return `<div class="regex-match"><span class="regex-idx">${i + 1}</span><span class="regex-at">@${m.index}</span><code>${escapeHtml(m.match)}</code>${groups}</div>`;
      })
      .join("");
  };

  const update = () => {
    const pattern = patternEl?.value ?? "";
    const flags = flagsEl?.value ?? "";
    const text = inputEl?.value ?? "";

    if (!pattern) {
      setStatus("Enter a pattern.");
      renderPreview(text, []);
      if (matchesEl) matchesEl.innerHTML = "";
      return;
    }

    const badFlag = [...flags].find((ch) => !FLAG_CHARS.includes(ch));
    if (badFlag) {
      setStatus(`Unknown flag "${badFlag}". Use any of: ${FLAG_CHARS}.`, true);
      return;
    }

    const result = findMatches(pattern, flags, text);
    if (!result.ok) {
      setStatus(`Invalid pattern: ${result.error}`, true);
      return;
    }

    const n = result.matches.length;
    setStatus(`${n} match${n === 1 ? "" : "es"}.`);
    renderPreview(text, result.matches);
    renderMatches(result.matches);
  };

  listen(patternEl, "input", update);
  listen(flagsEl, "input", update);
  listen(inputEl, "input", update);

  if (patternEl) patternEl.value = SAMPLE_PATTERN;
  if (flagsEl) flagsEl.value = "g";
  if (inputEl) inputEl.value = SAMPLE_TEXT;
  update();

  return { update };
}

export class RegexTesterApp extends BaseApp {
  getWindowContent() {
    return getRegexTesterContent(this.initData, this.services);
  }

  mount() {
    return initRegexTester(this.windowEl, this.initData, this.services.windowManager, this.services, this);
  }
}
