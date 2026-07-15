import { BaseApp } from "./base/BaseApp.js";

// A color picker with RGB/HSL sliders, a hex field, a live preview, and a
// saved-swatch palette. All color math below is DOM-free and unit tested.

export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

/** Parse "#abc" or "#aabbcc" (with or without "#") to { r, g, b } or null. */
export function hexToRgb(hex) {
  if (typeof hex !== "string") return null;
  let value = hex.trim().replace(/^#/, "");
  if (value.length === 3) {
    value = value.split("").map((ch) => ch + ch).join("");
  }
  if (!/^[0-9a-fA-F]{6}$/.test(value)) return null;
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16)
  };
}

export function rgbToHex({ r, g, b }) {
  const toHex = (n) => clamp(Math.round(n), 0, 255).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/** RGB (0-255) to HSL with h in [0,360], s and l in [0,100]. */
export function rgbToHsl({ r, g, b }) {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const delta = max - min;
  let h = 0;
  if (delta !== 0) {
    if (max === rn) h = ((gn - bn) / delta) % 6;
    else if (max === gn) h = (bn - rn) / delta + 2;
    else h = (rn - gn) / delta + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

/** HSL (h 0-360, s/l 0-100) to RGB (0-255). */
export function hslToRgb({ h, s, l }) {
  const hn = ((h % 360) + 360) % 360;
  const sn = clamp(s, 0, 100) / 100;
  const ln = clamp(l, 0, 100) / 100;
  const c = (1 - Math.abs(2 * ln - 1)) * sn;
  const x = c * (1 - Math.abs(((hn / 60) % 2) - 1));
  const m = ln - c / 2;
  let rp = 0;
  let gp = 0;
  let bp = 0;
  if (hn < 60) [rp, gp, bp] = [c, x, 0];
  else if (hn < 120) [rp, gp, bp] = [x, c, 0];
  else if (hn < 180) [rp, gp, bp] = [0, c, x];
  else if (hn < 240) [rp, gp, bp] = [0, x, c];
  else if (hn < 300) [rp, gp, bp] = [x, 0, c];
  else [rp, gp, bp] = [c, 0, x];
  return {
    r: Math.round((rp + m) * 255),
    g: Math.round((gp + m) * 255),
    b: Math.round((bp + m) * 255)
  };
}

const DEFAULT_SWATCHES = ["#000080", "#008080", "#c0c0c0", "#ff0000", "#42b642", "#f7d308"];

export function getColorPickerContent() {
  const rgbRow = (channel, label) => `
    <div class="cp-slider">
      <span class="cp-slider-label">${label}</span>
      <input type="range" data-rgb="${channel}" min="0" max="255" />
      <span class="cp-slider-value" data-rgbval="${channel}">0</span>
    </div>`;
  const hslRow = (channel, label, max) => `
    <div class="cp-slider">
      <span class="cp-slider-label">${label}</span>
      <input type="range" data-hsl="${channel}" min="0" max="${max}" />
      <span class="cp-slider-value" data-hslval="${channel}">0</span>
    </div>`;
  return `<div class="cp-layout">
    <div class="cp-preview" data-preview></div>
    <div class="cp-controls">
      <div class="cp-hexrow">
        <label class="cp-slider-label" for="cp-hex">Hex</label>
        <input class="cp-hex" id="cp-hex" data-hex type="text" spellcheck="false" />
        <button class="cp-btn" data-action="copy" type="button">Copy</button>
      </div>
      <div class="cp-group">
        ${rgbRow("r", "R")}${rgbRow("g", "G")}${rgbRow("b", "B")}
      </div>
      <div class="cp-group">
        ${hslRow("h", "H", 360)}${hslRow("s", "S", 100)}${hslRow("l", "L", 100)}
      </div>
      <div class="cp-palette-row">
        <div class="cp-palette" data-palette></div>
        <button class="cp-btn" data-action="save" type="button">Save</button>
      </div>
      <div class="cp-status" data-status>Ready</div>
    </div>
  </div>`;
}

export function initColorPicker(w, _initData, _windowManager, _services, app) {
  if (!w) return null;
  const listen = app?.listen?.bind(app) || ((t, type, fn) => t?.addEventListener?.(type, fn));

  const preview = w.querySelector("[data-preview]");
  const hexInput = w.querySelector("[data-hex]");
  const status = w.querySelector("[data-status]");
  const paletteEl = w.querySelector("[data-palette]");
  const rgbInputs = { r: w.querySelector('[data-rgb="r"]'), g: w.querySelector('[data-rgb="g"]'), b: w.querySelector('[data-rgb="b"]') };
  const rgbVals = { r: w.querySelector('[data-rgbval="r"]'), g: w.querySelector('[data-rgbval="g"]'), b: w.querySelector('[data-rgbval="b"]') };
  const hslInputs = { h: w.querySelector('[data-hsl="h"]'), s: w.querySelector('[data-hsl="s"]'), l: w.querySelector('[data-hsl="l"]') };
  const hslVals = { h: w.querySelector('[data-hslval="h"]'), s: w.querySelector('[data-hslval="s"]'), l: w.querySelector('[data-hslval="l"]') };

  let color = { r: 0, g: 0, b: 128 };
  let palette = [...DEFAULT_SWATCHES];

  const setStatus = (message) => {
    if (status) status.textContent = message;
  };

  const renderPalette = () => {
    if (!paletteEl) return;
    paletteEl.innerHTML = "";
    for (const hex of palette) {
      const swatch = document.createElement("button");
      swatch.type = "button";
      swatch.className = "cp-swatch";
      swatch.style.background = hex;
      swatch.title = hex;
      swatch.dataset.color = hex;
      paletteEl.appendChild(swatch);
    }
  };

  const render = ({ skipHex = false } = {}) => {
    const hex = rgbToHex(color);
    if (preview) preview.style.background = hex;
    if (hexInput && !skipHex) hexInput.value = hex;
    for (const ch of ["r", "g", "b"]) {
      if (rgbInputs[ch]) rgbInputs[ch].value = String(color[ch]);
      if (rgbVals[ch]) rgbVals[ch].textContent = String(color[ch]);
    }
    const hsl = rgbToHsl(color);
    for (const ch of ["h", "s", "l"]) {
      if (hslInputs[ch]) hslInputs[ch].value = String(hsl[ch]);
      if (hslVals[ch]) hslVals[ch].textContent = String(hsl[ch]);
    }
  };

  for (const ch of ["r", "g", "b"]) {
    listen(rgbInputs[ch], "input", () => {
      color = {
        r: Number(rgbInputs.r?.value) || 0,
        g: Number(rgbInputs.g?.value) || 0,
        b: Number(rgbInputs.b?.value) || 0
      };
      render();
      setStatus(rgbToHex(color));
    });
  }

  for (const ch of ["h", "s", "l"]) {
    listen(hslInputs[ch], "input", () => {
      color = hslToRgb({
        h: Number(hslInputs.h?.value) || 0,
        s: Number(hslInputs.s?.value) || 0,
        l: Number(hslInputs.l?.value) || 0
      });
      render();
      setStatus(rgbToHex(color));
    });
  }

  listen(hexInput, "input", () => {
    const parsed = hexToRgb(hexInput?.value ?? "");
    if (parsed) {
      color = parsed;
      render({ skipHex: true });
      setStatus(rgbToHex(color));
    } else {
      setStatus("Invalid hex");
    }
  });

  listen(w.querySelector('[data-action="copy"]'), "click", () => {
    const hex = rgbToHex(color);
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(hex).then(
        () => setStatus(`Copied ${hex}`),
        () => setStatus("Copy failed")
      );
    } else {
      setStatus(hex);
    }
  });

  listen(w.querySelector('[data-action="save"]'), "click", () => {
    const hex = rgbToHex(color);
    if (!palette.includes(hex)) {
      palette = [hex, ...palette].slice(0, 18);
      renderPalette();
    }
    setStatus(`Saved ${hex}`);
  });

  listen(paletteEl, "click", (event) => {
    const swatch = event.target.closest?.("[data-color]");
    if (!swatch) return;
    const parsed = hexToRgb(swatch.dataset.color);
    if (parsed) {
      color = parsed;
      render();
      setStatus(swatch.dataset.color);
    }
  });

  renderPalette();
  render();
  setStatus(rgbToHex(color));

  return { render, getColor: () => ({ ...color }) };
}

export class ColorPickerApp extends BaseApp {
  getWindowContent() {
    return getColorPickerContent(this.initData, this.services);
  }

  mount() {
    return initColorPicker(this.windowEl, this.initData, this.services.windowManager, this.services, this);
  }
}
