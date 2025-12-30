import { ICONS } from "../icons.js";
import { DEFAULT_WALLPAPER } from "../defaults.js";
import { loadDesktopState, persistDesktopState } from "../state.js";
import { applyWallpaperSettings, getWallpaperSettings } from "../wallpaper.js";
import {
  getLastNonZeroVolume,
  getSystemVolume,
  playVolumeTest,
  setSystemVolume
} from "../audio.js";
import {
  getNetworkDefaults,
  resetNetworkDefaults,
  updateNetworkDefaults
} from "../networking.js";
import { publish } from "../eventBus.js";

const DEFAULT_THEME = {
  winTeal: "#008080",
  winGray: "#C0C0C0",
  winBlue: "#000080"
};

const THEME_PRESETS = {
  d: DEFAULT_THEME,
  h: { winTeal: "#ff0000", winGray: "#ffff00", winBlue: "#ff0000" },
  p: { winTeal: "#400040", winGray: "#c0c0c0", winBlue: "#000080" }
};

function normalizeHexColor(value, fallback) {
  const trimmed = (value || "").trim();
  if (!trimmed) return fallback;
  if (/^#[0-9a-fA-F]{6}$/.test(trimmed)) return trimmed;
  if (/^#[0-9a-fA-F]{3}$/.test(trimmed)) {
    const [r, g, b] = trimmed.slice(1).split("");
    return `#${r}${r}${g}${g}${b}${b}`;
  }
  const rgbMatch = trimmed.match(/rgba?\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (rgbMatch) {
    const [r, g, b] = rgbMatch.slice(1, 4).map((n) => parseInt(n, 10));
    const toHex = (n) => n.toString(16).padStart(2, "0");
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }
  return fallback;
}

function setThemeVariables(theme) {
  if (!theme) return;
  const root = document.documentElement.style;
  root.setProperty("--win-teal", normalizeHexColor(theme.winTeal, DEFAULT_THEME.winTeal));
  root.setProperty("--win-gray", normalizeHexColor(theme.winGray, DEFAULT_THEME.winGray));
  root.setProperty("--win-blue", normalizeHexColor(theme.winBlue, DEFAULT_THEME.winBlue));
}

function getCurrentThemeCustom() {
  const computed = getComputedStyle(document.documentElement);
  return {
    winTeal: normalizeHexColor(computed.getPropertyValue("--win-teal"), DEFAULT_THEME.winTeal),
    winGray: normalizeHexColor(computed.getPropertyValue("--win-gray"), DEFAULT_THEME.winGray),
    winBlue: normalizeHexColor(computed.getPropertyValue("--win-blue"), DEFAULT_THEME.winBlue)
  };
}

function persistThemeCustom(theme) {
  const currentState = loadDesktopState();
  persistDesktopState({ ...currentState, themeCustom: theme });
}

function applyThemePreset(presetKey, container) {
  const theme = THEME_PRESETS[presetKey] || DEFAULT_THEME;
  setThemeVariables(theme);
  updateThemeInputs(theme, container);
  persistThemeCustom(theme);
  publish("theme:change", { theme: presetKey, values: theme });
}

function getThemeFromInputs(container) {
  const root = container || document;
  const theme = {
    winGray: root.querySelector("#cs-win-gray")?.value || DEFAULT_THEME.winGray,
    winBlue: root.querySelector("#cs-win-blue")?.value || DEFAULT_THEME.winBlue,
    winTeal: root.querySelector("#cs-win-teal")?.value || DEFAULT_THEME.winTeal
  };
  return {
    winGray: normalizeHexColor(theme.winGray, DEFAULT_THEME.winGray),
    winBlue: normalizeHexColor(theme.winBlue, DEFAULT_THEME.winBlue),
    winTeal: normalizeHexColor(theme.winTeal, DEFAULT_THEME.winTeal)
  };
}

function updateThemeInputs(theme, container) {
  const root = container || document;
  const mapping = [
    ["#cs-win-gray", theme.winGray, DEFAULT_THEME.winGray],
    ["#cs-win-blue", theme.winBlue, DEFAULT_THEME.winBlue],
    ["#cs-win-teal", theme.winTeal, DEFAULT_THEME.winTeal]
  ];
  mapping.forEach(([selector, value, fallback]) => {
    const el = root.querySelector(selector);
    if (el) el.value = normalizeHexColor(value, fallback);
  });
}

function applyTheme(targetPreset) {
  const select = document.getElementById("cs-sel");
  const preset = targetPreset || select?.value || "d";
  applyThemePreset(preset, document);
}

function handleThemeInputChange(container) {
  const theme = getThemeFromInputs(container);
  setThemeVariables(theme);
  persistThemeCustom(theme);
  publish("theme:change", { theme: "custom", values: theme });
}

function setWallpaper() {
  const url = document.getElementById("bg-url")?.value || "";
  const mode = document.getElementById("bg-mode")?.value || "cover";
  applyWallpaperSettings(url, mode, true);
}

function captureScreensaverForm(context) {
  const select = document.getElementById("cp-saver-select");
  const delay = document.getElementById("cp-saver-delay");
  const status = document.getElementById("cp-saver-status");
  const passInput = document.getElementById("cp-saver-passphrase");
  const requireToggle = document.getElementById("cp-saver-require");
  if (select?.value) context?.screensaver?.setType?.(select.value);
  const parsedDelay = parseInt(delay?.value || "", 10);
  if (!isNaN(parsedDelay)) {
    const clamped = Math.min(600, Math.max(5, parsedDelay));
    context?.screensaver?.setTimeout?.(clamped);
    if (delay) delay.value = clamped;
  }
  const lock = passInput?.value || "";
  context?.screensaver?.setLockPassphrase?.(lock);
  const hasPass = lock.trim().length > 0;
  const shouldRequire = !!requireToggle?.checked && hasPass;
  context?.screensaver?.setRequirePassphrase?.(shouldRequire);
  if (requireToggle && !hasPass) requireToggle.checked = false;
  return { status, hasPass };
}

function applyScreensaver(context) {
  const { status, hasPass } = captureScreensaverForm(context);
  context?.screensaver?.setIdleTime?.(0);
  const type = context?.screensaver?.getType?.();
  const timeout = context?.screensaver?.getTimeout?.();
  const requirePass = context?.screensaver?.getRequirePassphrase?.();
  if (status && type && typeof timeout === "number")
    status.textContent = `Current saver: ${type} (starts after ${timeout}s idle${
      requirePass && hasPass ? ", locked" : ""
    })`;
}

function previewScreensaver(context) {
  const select = document.getElementById("cp-saver-select");
  captureScreensaverForm(context);
  const chosen = select?.value || context?.screensaver?.getType?.();
  context?.screensaver?.setType?.(chosen);
  context?.screensaver?.setIdleTime?.(0);
  context?.screensaver?.start?.(chosen);
}

function openCPDesktop(context, el, containerOverride) {
  let targetContainer = containerOverride;
  if (!targetContainer && el?.classList?.contains("cp-view-area")) {
    targetContainer = el;
  }
  if (!targetContainer && el?.closest) {
    const area = el.closest(".cp-view-area");
    if (area) targetContainer = area;
  }
  const w = el?.closest ? el.closest(".window") : null;
  const body =
    targetContainer || (w ? w.querySelector(".window-body") : null) || (el instanceof HTMLElement ? el : null);
  if (!body) return;

  if (w) {
    w
      .querySelectorAll(".cp-tab-btn, .cp-menu-item")
      .forEach((btn) => btn.classList.toggle("active", btn.dataset.view === "desktop"));
  }

  body.innerHTML = `<div class="cp-settings-layout">
        <div class="cp-section">
            <div style="font-weight:bold;margin-bottom:6px;">Wallpaper</div>
            <label style="display:block;font-size:12px;margin-bottom:4px;">Image URL</label>
            <input type="text" id="bg-url" style="width:100%; margin-bottom:8px;" value="${
              getWallpaperSettings().url || DEFAULT_WALLPAPER
            }">
            <label style="display:block;font-size:12px;margin-bottom:4px;">Mode</label>
            <select id="bg-mode" style="width:100%; margin-bottom:8px;">
                <option value="cover">Cover</option>
                <option value="contain">Contain</option>
                <option value="fill">Fill</option>
            </select>
            <div style="display:flex; gap:6px; justify-content:flex-end;">
                <button class="task-btn" onclick="applyWallpaperSettings('${DEFAULT_WALLPAPER}', 'cover', true)">Reset</button>
                <button class="task-btn" onclick="setWallpaper()">Apply</button>
            </div>
        </div>
        <div class="cp-section">
            <div style="font-weight:bold;margin-bottom:6px;">Wallpaper Tips</div>
            <ul style="margin:0 0 0 16px; padding:0; font-size:12px; line-height:1.4;">
                <li>Use <strong>cover</strong> to fill the screen without stretching.</li>
                <li><strong>Contain</strong> keeps the full image visible.</li>
                <li>Try a <em>data:image/png;base64,...</em> URL for offline wallpapers.</li>
            </ul>
        </div>
    </div>`;

  const mode = body.querySelector("#bg-mode");
  const current = getWallpaperSettings().mode || "cover";
  if (mode) mode.value = current;
}

function openCPScreensaver(context, target, containerOverride) {
  let targetContainer = containerOverride;
  if (!targetContainer && target?.classList?.contains("cp-view-area")) {
    targetContainer = target;
  }
  if (!targetContainer && target?.closest) {
    const area = target.closest(".cp-view-area");
    if (area) targetContainer = area;
  }
  const w = target?.closest ? target.closest(".window") : null;
  const body =
    targetContainer || (w ? w.querySelector(".window-body") : null) || (target instanceof HTMLElement ? target : null);
  if (!body) return;

  if (w) {
    w
      .querySelectorAll(".cp-tab-btn, .cp-menu-item")
      .forEach((btn) => btn.classList.toggle("active", btn.dataset.view === "screensaver"));
  }

  const saverType = context?.screensaver?.getType?.() || "starfield";
  const saverDelay = context?.screensaver?.getTimeout?.() ?? 60;
  const saverPass = context?.screensaver?.getLockPassphrase?.() || "";
  const saverRequire = !!context?.screensaver?.getRequirePassphrase?.();

  const saverOptionsData = [
    { value: "starfield", label: "Starfield", desc: "Classic Warp 3D star tunnel" },
    { value: "matrix", label: "Matrix", desc: "Neon digital rain" },
    { value: "pipes", label: "3D Pipes", desc: "Colorful pipes fill the screen" },
    { value: "dvd", label: "DVD Logo", desc: "Bounce the DVD logo forever" },
    { value: "maze", label: "3D Maze", desc: "Ray-marched maze explorer" },
    { value: "fish", label: "Fish", desc: "Tropical fish swim by" },
    { value: "fireflies", label: "Fireflies", desc: "Soft glowing fireflies" },
    { value: "tunnel", label: "Wave Tunnel", desc: "Retro vector tunnel" },
    { value: "bubbles", label: "Bubbles", desc: "Calming bubbles float up" },
    { value: "wave", label: "Waveform", desc: "Audio-reactive spectrum" },
    { value: "castaway", label: "Castaway", desc: "Island life with a lone survivor" },
    { value: "bsod", label: "BSOD", desc: "Windows 95 Blue Screen of Death" },
    { value: "toast", label: "Flying Toasters", desc: "Surreal toaster parade" }
  ];

  const saverOptions = saverOptionsData
    .map(
      (opt) =>
        `<option value="${opt.value}" ${opt.value === saverType ? "selected" : ""}>${opt.label}</option>`
    )
    .join("");

  body.innerHTML = `<div class="cp-settings-layout">
        <div class="cp-section">
            <div style="font-weight:bold;margin-bottom:6px;">Screensaver</div>
            <label style="display:block;font-size:12px;">Choose a screensaver</label>
            <select id="cp-saver-select" style="width:100%; margin-bottom:8px;">${saverOptions}</select>
            <div class="cp-saver-desc" id="cp-saver-desc"></div>
            <div style="display:flex; gap:6px; align-items:center;">
              <label style="font-size:12px;">Start after</label>
              <input type="number" id="cp-saver-delay" min="5" max="600" value="${saverDelay}" style="width:80px;"> seconds
            </div>
            <div class="cp-saver-lock">
              <label style="display:block;font-size:12px;">Lock with passphrase</label>
              <input type="password" id="cp-saver-passphrase" placeholder="Leave blank to disable" value="${saverPass}" style="width:100%;">
              <label style="display:flex; align-items:center; gap:6px; margin-top:6px;">
                <input type="checkbox" id="cp-saver-require" ${saverRequire && saverPass ? "checked" : ""}> Require passphrase on resume
              </label>
            </div>
            <div style="display:flex; gap:6px; justify-content:flex-end; margin-top:8px;">
              <button class="task-btn" onclick="previewScreensaver()">Preview</button>
              <button class="task-btn" onclick="applyScreensaver()">Apply</button>
            </div>
            <div class="cp-saver-note" id="cp-saver-status">Current saver: ${saverType}${
              saverRequire && saverPass ? " (Locked)" : ""
            }</div>
        </div>
        <div class="cp-section">
            <div style="font-weight:bold;margin-bottom:6px;">Tips</div>
            <ul style="margin:0 0 0 16px; padding:0; font-size:12px; line-height:1.4;">
                <li>Move your mouse or press a key to exit the screensaver.</li>
                <li>Locking requires entering the passphrase to return.</li>
                <li>Try the Maze or Matrix savers for nostalgia.</li>
            </ul>
        </div>
    </div>`;

  const descBox = body.querySelector("#cp-saver-desc");
  const select = body.querySelector("#cp-saver-select");
  const updateDesc = () => {
    const selected = saverOptionsData.find((s) => s.value === select?.value);
    if (descBox && selected) descBox.textContent = selected.desc;
  };
  updateDesc();
  select?.addEventListener("change", updateDesc);
}

function openCPSound(target, containerOverride) {
  let targetContainer = containerOverride;
  if (!targetContainer && target?.classList?.contains("cp-view-area")) {
    targetContainer = target;
  }
  if (!targetContainer && target?.closest) {
    const area = target.closest(".cp-view-area");
    if (area) targetContainer = area;
  }
  const w = target?.closest ? target.closest(".window") : null;
  const body =
    targetContainer || (w ? w.querySelector(".window-body") : null) || (target instanceof HTMLElement ? target : null);
  if (!body) return;

  if (w) {
    w
      .querySelectorAll(".cp-tab-btn, .cp-menu-item")
      .forEach((btn) => btn.classList.toggle("active", btn.dataset.view === "sound"));
  }

  const currentVolume = Math.round(getSystemVolume() * 100);

  body.innerHTML = `<div class="cp-settings-layout">
        <div class="cp-section">
            <div style="font-weight:bold;margin-bottom:6px;">System Volume</div>
            <div class="volume-row">
                <input type="range" min="0" max="100" value="${currentVolume}" class="volume-slider" aria-label="System volume">
                <span class="volume-percent">${currentVolume}%</span>
            </div>
            <label class="volume-mute"><input type="checkbox" class="volume-mute-toggle" ${
              currentVolume === 0 ? "checked" : ""
            }>Mute</label>
            <div class="volume-actions">
                <button class="task-btn volume-test-btn">Test Beep</button>
                <button class="task-btn volume-reset-btn">Reset</button>
            </div>
            <div class="volume-note">Adjusts playback volume for all Oriel apps.</div>
        </div>
    </div>`;

  const slider = body.querySelector(".volume-slider");
  const muteToggle = body.querySelector(".volume-mute-toggle");
  const syncUI = (vol) => {
    if (slider) slider.value = Math.round(vol * 100);
    if (muteToggle) muteToggle.checked = vol === 0;
    const pct = body.querySelector(".volume-percent");
    if (pct) pct.textContent = `${Math.round(vol * 100)}%`;
  };

  slider?.addEventListener("input", (e) => {
    const vol = Number(e.target.value) / 100;
    setSystemVolume(vol);
    syncUI(getSystemVolume());
  });

  muteToggle?.addEventListener("change", (e) => {
    if (e.target.checked) {
      setSystemVolume(0);
    } else {
      setSystemVolume(getLastNonZeroVolume() || 0.5);
    }
    syncUI(getSystemVolume());
  });

  body.querySelector(".volume-reset-btn")?.addEventListener("click", () => {
    setSystemVolume(0.7);
    syncUI(getSystemVolume());
  });

  body.querySelector(".volume-test-btn")?.addEventListener("click", () => {
    playVolumeTest();
  });
}

function openCPDefaults(target, containerOverride) {
  let targetContainer = containerOverride;
  if (!targetContainer && target?.classList?.contains("cp-view-area")) {
    targetContainer = target;
  }
  if (!targetContainer && target?.closest) {
    const area = target.closest(".cp-view-area");
    if (area) targetContainer = area;
  }
  const w = target?.closest ? target.closest(".window") : null;
  const body =
    targetContainer || (w ? w.querySelector(".window-body") : null) || (target instanceof HTMLElement ? target : null);
  if (!body) return;

  if (w) {
    w
      .querySelectorAll(".cp-tab-btn, .cp-menu-item")
      .forEach((btn) => btn.classList.toggle("active", btn.dataset.view === "defaults"));
  }

  const wallpaper = getWallpaperSettings();
  const volumePercent = Math.round(getSystemVolume() * 100);
  const network = getNetworkDefaults();

  body.innerHTML = `<div class="cp-settings-layout">
        <div class="cp-section">
            <div style="font-weight:bold;margin-bottom:6px;">Wallpaper defaults</div>
            <label style="display:block;font-size:12px;">Image URL</label>
            <input type="text" id="cp-default-wallpaper-url" style="width:100%;margin-bottom:8px;" value="${
              wallpaper.url || ""
            }">
            <label style="display:block;font-size:12px;">Mode</label>
            <select id="cp-default-wallpaper-mode" style="width:100%;margin-bottom:8px;">
              <option value="cover" ${wallpaper.mode === "cover" ? "selected" : ""}>Cover</option>
              <option value="contain" ${wallpaper.mode === "contain" ? "selected" : ""}>Contain</option>
              <option value="fill" ${wallpaper.mode === "fill" ? "selected" : ""}>Fill</option>
            </select>
            <div style="text-align:right"><button class="task-btn" id="cp-default-wallpaper-save">Save defaults</button></div>
        </div>
        <div class="cp-section">
            <div style="font-weight:bold;margin-bottom:6px;">Volume defaults</div>
            <label style="display:block;font-size:12px;">System volume</label>
            <input type="range" id="cp-default-volume" min="0" max="100" value="${volumePercent}">
            <div style="text-align:right"><button class="task-btn" id="cp-default-volume-save">Save defaults</button></div>
        </div>
        <div class="cp-section">
            <div style="font-weight:bold;margin-bottom:6px;">Network defaults</div>
            <label style="display:block;font-size:12px;">Browser home</label>
            <input type="text" id="cp-net-home" style="width:100%;margin-bottom:6px;" value="${
              network.browserHome || ""
            }">
            <label style="display:block;font-size:12px;">Proxy prefix</label>
            <input type="text" id="cp-net-proxy" style="width:100%;margin-bottom:6px;" value="${
              network.browserProxyPrefix || ""
            }">
            <label style="display:block;font-size:12px;">Radio Browser</label>
            <input type="text" id="cp-net-radio" style="width:100%;margin-bottom:6px;" value="${
              network.radioBrowserBase || ""
            }">
            <label style="display:block;font-size:12px;">Radio Garden Proxy</label>
            <input type="text" id="cp-net-garden" style="width:100%;margin-bottom:6px;" value="${
              network.radioGardenProxy || ""
            }">
            <label style="display:block;font-size:12px;">RSS Proxy Root</label>
            <input type="text" id="cp-net-rss" style="width:100%;margin-bottom:6px;" value="${
              network.rssProxyRoot || ""
            }">
            <div style="display:flex; gap:6px; justify-content:flex-end; margin-top:6px;">
              <button class="task-btn" id="cp-net-reset">Reset to defaults</button>
              <button class="task-btn" id="cp-net-save">Save defaults</button>
            </div>
            <div id="cp-net-status" style="font-size:12px; color:#004085; margin-top:6px;"></div>
        </div>
    </div>`;

  const setWallpaperStatus = (msg) => {
    const status = body.querySelector("#cp-net-status");
    if (status) status.textContent = msg;
  };

  body.querySelector("#cp-default-wallpaper-save")?.addEventListener("click", () => {
    const url = body.querySelector("#cp-default-wallpaper-url")?.value || DEFAULT_WALLPAPER;
    const mode = body.querySelector("#cp-default-wallpaper-mode")?.value || "cover";
    applyWallpaperSettings(url, mode, true);
    setWallpaperStatus("Wallpaper defaults saved.");
  });

  body.querySelector("#cp-default-volume-save")?.addEventListener("click", () => {
    const volInput = body.querySelector("#cp-default-volume");
    const vol = volInput ? Number(volInput.value) / 100 : getSystemVolume();
    setSystemVolume(vol);
    setWallpaperStatus("Volume default saved.");
  });

  const setNetworkStatus = (text) => {
    const status = body.querySelector("#cp-net-status");
    if (status) status.textContent = text;
  };

  body.querySelector("#cp-net-save")?.addEventListener("click", () => {
    const newConfig = {
      browserHome: body.querySelector("#cp-net-home")?.value?.trim() || network.browserHome,
      browserProxyPrefix: body.querySelector("#cp-net-proxy")?.value?.trim() || network.browserProxyPrefix,
      radioBrowserBase: body.querySelector("#cp-net-radio")?.value?.trim() || network.radioBrowserBase,
      radioGardenProxy: body.querySelector("#cp-net-garden")?.value?.trim() || network.radioGardenProxy,
      rssProxyRoot: body.querySelector("#cp-net-rss")?.value?.trim() || network.rssProxyRoot
    };
    updateNetworkDefaults(newConfig);
    setNetworkStatus("Network defaults saved for future sessions.");
  });

  body.querySelector("#cp-net-reset")?.addEventListener("click", () => {
    const resetConfig = resetNetworkDefaults();
    const home = body.querySelector("#cp-net-home");
    const proxy = body.querySelector("#cp-net-proxy");
    const radio = body.querySelector("#cp-net-radio");
    const garden = body.querySelector("#cp-net-garden");
    const rss = body.querySelector("#cp-net-rss");
    if (home) home.value = resetConfig.browserHome || "";
    if (proxy) proxy.value = resetConfig.browserProxyPrefix || "";
    if (radio) radio.value = resetConfig.radioBrowserBase || "";
    if (garden) garden.value = resetConfig.radioGardenProxy || "";
    if (rss) rss.value = resetConfig.rssProxyRoot || "";
    setNetworkStatus("Network defaults reset to built-in values.");
  });
}

function openCPFonts(target, containerOverride) {
  let targetContainer = containerOverride;
  if (!targetContainer && target?.classList?.contains("cp-view-area")) {
    targetContainer = target;
  }
  if (!targetContainer && target?.closest) {
    const area = target.closest(".cp-view-area");
    if (area) targetContainer = area;
  }
  const w = target?.closest ? target.closest(".window") : null;
  const body =
    targetContainer || (w ? w.querySelector(".window-body") : null) || (target instanceof HTMLElement ? target : null);
  if (!body) return;

  if (w) {
    w
      .querySelectorAll(".cp-tab-btn, .cp-menu-item")
      .forEach((btn) => btn.classList.toggle("active", btn.dataset.view === "fonts"));
  }

  const fontOptions = ["Inter", "Roboto", "Open Sans", "Press Start 2P", "VT323"]
    .map((f) => `<option value="${f}">${f}</option>`)
    .join("");

  body.innerHTML = `<div class="cp-settings-layout"><div class="cp-section"><label style="display:block;font-size:12px;margin-bottom:6px;">Choose a Google Font</label><select id="cp-font-select" style="width:100%;margin-bottom:8px;">${fontOptions}</select><label style="display:block;font-size:12px;margin-bottom:4px;">Or enter a Google Font name</label><input type="text" id="cp-font-custom" placeholder="e.g. Space Grotesk" style="width:100%;margin-bottom:8px;"><div class="cp-font-preview" id="cp-font-preview-text">The quick brown fox jumps over the lazy dog.</div><div style="text-align:right;margin-top:8px;"><button class="task-btn" onclick="applyFontSelection()">Apply</button></div></div></div>`;

  const select = body.querySelector("#cp-font-select");
  const custom = body.querySelector("#cp-font-custom");
  const preview = body.querySelector("#cp-font-preview-text");

  const updatePreview = () => {
    const font = (custom?.value.trim() || select?.value || "Segoe UI").trim();
    const family = `'${font}', sans-serif`;
    if (preview) {
      preview.style.fontFamily = family;
      preview.textContent = `The quick brown fox jumps over the lazy dog. (${font})`;
    }
  };

  select?.addEventListener("change", updatePreview);
  custom?.addEventListener("input", updatePreview);
  updatePreview();
}

function loadGoogleFont(fontName) {
  if (!fontName) return;
  const encodedName = fontName.trim().replace(/\s+/g, "+");
  const href = `https://fonts.googleapis.com/css2?family=${encodedName}:wght@400;700&display=swap`;
  let link = document.getElementById("cp-google-font-link");
  if (!link) {
    link = document.createElement("link");
    link.id = "cp-google-font-link";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }
  link.href = href;
}

function applyFontSelection() {
  const custom = document.getElementById("cp-font-custom");
  const select = document.getElementById("cp-font-select");
  const chosen = (custom?.value.trim() || select?.value || "").trim();
  if (!chosen) return;
  loadGoogleFont(chosen);
  const family = `'${chosen}', sans-serif`;
  document.documentElement.style.setProperty("--font-main", family);
  const preview = document.getElementById("cp-font-preview-text");
  if (preview) {
    preview.style.fontFamily = family;
    preview.textContent = `The quick brown fox jumps over the lazy dog. (${chosen})`;
  }
}

function applySavedTheme(theme) {
  if (!theme) return;
  setThemeVariables(theme);
}

function openCPColor(target, containerOverride) {
  let targetContainer = containerOverride;
  if (!targetContainer && target?.classList?.contains("cp-view-area")) {
    targetContainer = target;
  }
  if (!targetContainer && target?.closest) {
    const area = target.closest(".cp-view-area");
    if (area) targetContainer = area;
  }
  const w = target?.closest ? target.closest(".window") : null;
  const body =
    targetContainer || (w ? w.querySelector(".window-body") : null) || (target instanceof HTMLElement ? target : null);
  if (!body) return;
  if (w) {
    w
      .querySelectorAll(".cp-tab-btn, .cp-menu-item")
      .forEach((btn) => btn.classList.toggle("active", btn.dataset.view === "color"));
  }
  const currentTheme = getCurrentThemeCustom();
  body.innerHTML = `<div class="cp-settings-layout">
    <div class="cp-section">
      <label for="cs-sel">Theme Preset</label>
      <div style="display:flex; gap:6px; align-items:center;">
        <select id="cs-sel" style="flex:1;">
          <option value="d">Default</option>
          <option value="h">Hot Dog</option>
          <option value="p">Plasma</option>
        </select>
        <button class="task-btn" id="cs-apply-btn">Apply</button>
      </div>
    </div>
    <div class="cp-section">
      <label for="cs-win-gray">Window Background</label>
      <input type="color" class="cs-color-input" id="cs-win-gray" value="${currentTheme.winGray}">
    </div>
    <div class="cp-section">
      <label for="cs-win-blue">Active Title Bar</label>
      <input type="color" class="cs-color-input" id="cs-win-blue" value="${currentTheme.winBlue}">
    </div>
    <div class="cp-section">
      <label for="cs-win-teal">Desktop Background</label>
      <input type="color" class="cs-color-input" id="cs-win-teal" value="${currentTheme.winTeal}">
    </div>
  </div>`;

  const presetSelect = body.querySelector("#cs-sel");
  if (presetSelect) {
    presetSelect.value = "d";
    presetSelect.addEventListener("change", () => applyTheme());
  }
  const applyBtn = body.querySelector("#cs-apply-btn");
  if (applyBtn) applyBtn.addEventListener("click", () => applyTheme());
  body.querySelectorAll(".cs-color-input").forEach((input) => {
    input.addEventListener("input", () => handleThemeInputChange(body));
  });
}

function initControlPanel(context, w, _initData, windowManager) {
  const menu = w.querySelector(".menu-bar");
  const body = w.querySelector(".window-body");
  if (!menu || !body) return;

  menu.innerHTML = `
    <div class="menu-item cp-menu-item active" data-view="desktop">Desktop</div>
    <div class="menu-item cp-menu-item" data-view="color">Colors</div>
    <div class="menu-item cp-menu-item" data-view="screensaver">Screensaver</div>
    <div class="menu-item cp-menu-item" data-view="sound">Sound</div>
    <div class="menu-item cp-menu-item" data-view="fonts">Fonts</div>
    <div class="menu-item cp-menu-item" data-view="defaults">Defaults</div>
    <div class="menu-item cp-menu-item" data-view="home">Home</div>
  `;

  windowManager?.setupMenuBar?.(w);

  body.innerHTML = `
    <div class="cp-menu-bar">
      <button class="task-btn cp-tab-btn active" data-view="desktop">Desktop</button>
      <button class="task-btn cp-tab-btn" data-view="color">Colors</button>
      <button class="task-btn cp-tab-btn" data-view="screensaver">Screensaver</button>
      <button class="task-btn cp-tab-btn" data-view="sound">Sound</button>
      <button class="task-btn cp-tab-btn" data-view="fonts">Fonts</button>
      <button class="task-btn cp-tab-btn" data-view="defaults">Defaults</button>
      <button class="task-btn cp-tab-btn" data-view="home">Home</button>
    </div>
    <div class="cp-view-area"></div>
  `;

  const viewArea = body.querySelector(".cp-view-area");

  const renderHome = () => {
    if (viewArea) viewArea.innerHTML = windowManager?.getControlPanelContent?.() || "";
  };

  const setActive = (view) => {
    body
      .querySelectorAll(".cp-tab-btn")
      .forEach((btn) => btn.classList.toggle("active", btn.dataset.view === view));
    menu
      .querySelectorAll(".cp-menu-item")
      .forEach((btn) => btn.classList.toggle("active", btn.dataset.view === view));
  };

  const switchView = (view) => {
    setActive(view);
    if (view === "desktop") openCPDesktop(context, viewArea);
    else if (view === "color") openCPColor(viewArea);
    else if (view === "screensaver") openCPScreensaver(context, viewArea);
    else if (view === "sound") openCPSound(viewArea);
    else if (view === "fonts") openCPFonts(viewArea);
    else if (view === "defaults") openCPDefaults(viewArea);
    else renderHome();
  };

  body.querySelectorAll(".cp-tab-btn").forEach((btn) => {
    btn.onclick = () => switchView(btn.dataset.view);
  });

  menu.querySelectorAll(".cp-menu-item").forEach((btn) => {
    btn.onclick = () => switchView(btn.dataset.view);
  });

  switchView("desktop");
}

export {
  applyFontSelection,
  applySavedTheme,
  applyScreensaver,
  applyTheme,
  captureScreensaverForm,
  handleThemeInputChange,
  initControlPanel,
  normalizeHexColor,
  getCurrentThemeCustom,
  openCPColor,
  openCPDefaults,
  openCPDesktop,
  openCPFonts,
  openCPScreensaver,
  openCPSound,
  previewScreensaver,
  setThemeVariables,
  setWallpaper
};
