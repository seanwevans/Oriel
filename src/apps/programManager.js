import { PROGRAMS } from "../programs.js";
import { ICONS } from "../icons.js";
import { getInstalledPrograms, getManifestForApp } from "../installer.js";
import { getWindowBodyContainer } from "../windowContent.js";
import { publish } from "../eventBus.js";
import { getAppState, updateAppState } from "../state.js";

const ALLOWED_ICON_PROTOCOLS = new Set(["https:", "data:"]);
const PROGRAM_RENAMES_STATE_KEY = "program-manager-renames";
const PROGRAM_VIEW_STATE_KEY = "program-manager-view";
const PROGRAM_MANAGER_VIEWS = new Set(["icons", "details"]);
const MAX_APP_NAME_LENGTH = 64;


function escapeAttributeValue(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function isSafeIconUrl(rawUrl) {
  if (typeof rawUrl !== "string") return false;
  const trimmed = rawUrl.trim();
  if (!trimmed) return false;

  try {
    const baseUrl = globalThis.window?.location?.origin || "https://example.invalid";
    const parsed = new URL(trimmed, baseUrl);
    if (!ALLOWED_ICON_PROTOCOLS.has(parsed.protocol)) return false;
    if (parsed.protocol === "data:") {
      return /^data:image\/[a-zA-Z0-9.+-]+;base64,[a-zA-Z0-9+/=\s]+$/.test(trimmed);
    }
    return true;
  } catch {
    return false;
  }
}


function getProgramManagerView() {
  const stored = getAppState(PROGRAM_VIEW_STATE_KEY);
  return PROGRAM_MANAGER_VIEWS.has(stored?.view) ? stored.view : "icons";
}

function setProgramManagerView(view, wm) {
  if (!PROGRAM_MANAGER_VIEWS.has(view) || view === getProgramManagerView()) return;
  updateAppState(PROGRAM_VIEW_STATE_KEY, { view });
  refreshProgramManagerContent(wm);
}

function getProgramRenames() {
  const stored = getAppState(PROGRAM_RENAMES_STATE_KEY);
  return stored?.labels && typeof stored.labels === "object" ? stored.labels : {};
}

function getProgramRename(type) {
  const renamed = getProgramRenames()[type];
  return typeof renamed === "string" && renamed.trim() ? renamed : null;
}

function getDefaultProgramLabel(prog) {
  return prog?.label || prog?.title || prog?.type || "Application";
}

function getDefaultProgramTitle(prog) {
  return prog?.title || prog?.label || prog?.type || "Application";
}

export function getProgramDisplayLabel(prog) {
  return getProgramRename(prog?.type) || getDefaultProgramLabel(prog);
}

export function getProgramDisplayTitle(prog) {
  return getProgramRename(prog?.type) || getDefaultProgramTitle(prog);
}

export function renameProgram(type, nextName) {
  if (!type) return null;
  const renames = { ...getProgramRenames() };
  const trimmedName = typeof nextName === "string" ? nextName.trim() : "";

  if (trimmedName) {
    renames[type] = trimmedName.slice(0, MAX_APP_NAME_LENGTH);
  } else {
    delete renames[type];
  }

  updateAppState(PROGRAM_RENAMES_STATE_KEY, { labels: renames });
  publish("apps:change");
  return renames[type] || null;
}

function promptForProgramRename(prog) {
  const currentName = getProgramDisplayLabel(prog);
  const nextName = window.prompt(
    `Rename ${currentName}. Leave blank to restore the default name.`,
    currentName
  );
  if (nextName === null) return;
  renameProgram(prog.type, nextName);
}

function getProgramIconMenu() {
  let menu = document.getElementById("program-icon-context-menu");
  if (menu) return menu;

  menu = document.createElement("div");
  menu.id = "program-icon-context-menu";
  menu.className = "program-icon-context-menu";
  menu.setAttribute("role", "menu");
  menu.innerHTML = `<div class="context-menu-item" data-action="rename" role="menuitem" tabindex="0">Rename</div>`;
  document.body.appendChild(menu);

  const hideMenu = () => {
    menu.style.display = "none";
    menu.activeProgram = null;
  };

  window.addEventListener("click", (event) => {
    if (!menu.contains(event.target)) hideMenu();
  });
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") hideMenu();
  });
  window.addEventListener("resize", hideMenu);

  menu.addEventListener("click", (event) => {
    const item = event.target.closest(".context-menu-item");
    if (!item || item.dataset.action !== "rename") return;
    const prog = menu.activeProgram;
    hideMenu();
    if (prog) promptForProgramRename(prog);
  });

  menu.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const item = event.target.closest(".context-menu-item");
    if (!item) return;
    event.preventDefault();
    item.click();
  });

  return menu;
}

function showProgramIconMenu(prog, x, y) {
  const menu = getProgramIconMenu();
  menu.activeProgram = prog;
  menu.style.display = "block";
  menu.style.left = `${x}px`;
  menu.style.top = `${y}px`;

  const rect = menu.getBoundingClientRect();
  const adjustedLeft = Math.min(x, window.innerWidth - rect.width - 4);
  const adjustedTop = Math.min(y, window.innerHeight - rect.height - 4);
  menu.style.left = `${Math.max(0, adjustedLeft)}px`;
  menu.style.top = `${Math.max(0, adjustedTop)}px`;
  menu.querySelector(".context-menu-item")?.focus();
}

function createIconElementFromMarkup(markup) {
  const template = document.createElement("template");
  template.innerHTML = markup.trim();
  const icon = template.content.firstElementChild;
  return icon || document.createTextNode("?");
}

export function createRuntimeIconElement(manifest, type) {
  const img = document.createElement("img");
  img.src = manifest.icon;
  img.alt = `${manifest.name || type} icon`;
  img.className = "runtime-icon";
  return img;
}

function createRuntimeIconMarkup(manifest, type) {
  const src = escapeAttributeValue(manifest.icon);
  const alt = escapeAttributeValue(`${manifest.name || type} icon`);
  return `<img src="${src}" alt="${alt}" class="runtime-icon">`;
}

export function createIconElementForType(type, fallbackIconKey = null) {
  const manifest = getManifestForApp(type);

  if (manifest?.icon) {
    if (ICONS[manifest.icon]) return createIconElementFromMarkup(ICONS[manifest.icon]);
    if (isSafeIconUrl(manifest.icon)) return createRuntimeIconElement(manifest, type);
  }

  const dynamic = getInstalledPrograms().find((app) => app.type === type);
  if (dynamic?.icon && ICONS[dynamic.icon]) {
    return createIconElementFromMarkup(ICONS[dynamic.icon]);
  }

  if (fallbackIconKey && ICONS[fallbackIconKey]) {
    return createIconElementFromMarkup(ICONS[fallbackIconKey]);
  }

  const prog = getAvailablePrograms().find((app) => app.type === type);
  if (prog?.icon && ICONS[prog.icon]) {
    return createIconElementFromMarkup(ICONS[prog.icon]);
  }

  return createIconElementFromMarkup(ICONS[type] || ICONS.help);
}

function createIconElementForProgram(prog) {
  return createIconElementForType(prog?.type, prog?.icon);
}

export function getAvailablePrograms() {
  const merged = new Map();
  PROGRAMS.forEach((prog) => merged.set(prog.type, prog));
  getInstalledPrograms().forEach((prog) => {
    if (!merged.has(prog.type)) merged.set(prog.type, prog);
  });
  return Array.from(merged.values());
}

export function getIconForType(type) {
  const manifest = getManifestForApp(type);
  if (manifest?.icon) {
    if (ICONS[manifest.icon]) return ICONS[manifest.icon];
    if (isSafeIconUrl(manifest.icon)) return createRuntimeIconMarkup(manifest, type);
  }
  const dynamic = getInstalledPrograms().find((app) => app.type === type);
  if (dynamic?.icon && ICONS[dynamic.icon]) return ICONS[dynamic.icon];
  const prog = getAvailablePrograms().find((app) => app.type === type);
  if (prog?.icon && ICONS[prog.icon]) return ICONS[prog.icon];
  return ICONS[type] || ICONS["help"];
}

export function getProgramDefaults(type) {
  return getAvailablePrograms().find((prog) => prog.type === type) || null;
}

function getProgramDetails(prog) {
  const width = prog.width || 500;
  const height = prog.height || 400;
  const permissions = Array.isArray(prog.permissions) && prog.permissions.length
    ? `Permissions: ${prog.permissions.join(", ")}`
    : "Built-in application";

  return {
    title: getProgramDisplayTitle(prog),
    type: prog.type || "unknown",
    windowSize: `${width} × ${height}`,
    permissions
  };
}

function attachProgramLaunchHandlers(element, prog, wm) {
  const openProgram = () => {
    const width = prog.width || 500;
    const height = prog.height || 400;
    wm.openWindow(prog.type, getProgramDisplayTitle(prog), width, height);
  };

  element.addEventListener("click", openProgram);
  element.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openProgram();
    }
    if (event.key === "F2") {
      event.preventDefault();
      promptForProgramRename(prog);
    }
  });
  element.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    event.stopPropagation();
    showProgramIconMenu(prog, event.clientX, event.clientY);
  });
}

function createProgramIconButton(prog, wm) {
  const iconButton = document.createElement("div");
  iconButton.className = "prog-icon";
  iconButton.setAttribute("role", "button");
  iconButton.setAttribute("aria-label", `Open ${getProgramDisplayTitle(prog)}`);
  iconButton.tabIndex = 0;
  attachProgramLaunchHandlers(iconButton, prog, wm);

  iconButton.appendChild(createIconElementForProgram(prog));

  const label = document.createElement("div");
  label.className = "prog-label";
  label.textContent = getProgramDisplayLabel(prog);
  iconButton.appendChild(label);

  return iconButton;
}

function createProgramDetailRow(prog, wm) {
  const details = getProgramDetails(prog);
  const row = document.createElement("div");
  row.className = "prog-detail-row";
  row.setAttribute("role", "button");
  row.setAttribute("aria-label", `Open ${details.title}`);
  row.tabIndex = 0;
  attachProgramLaunchHandlers(row, prog, wm);

  const iconWrap = document.createElement("div");
  iconWrap.className = "prog-detail-icon";
  iconWrap.appendChild(createIconElementForProgram(prog));
  row.appendChild(iconWrap);

  const main = document.createElement("div");
  main.className = "prog-detail-main";

  const name = document.createElement("div");
  name.className = "prog-detail-name";
  name.textContent = getProgramDisplayLabel(prog);
  main.appendChild(name);

  const meta = document.createElement("div");
  meta.className = "prog-detail-meta";
  meta.textContent = `${details.title} · ${details.type} · ${details.windowSize}`;
  main.appendChild(meta);

  const permissions = document.createElement("div");
  permissions.className = "prog-detail-permissions";
  permissions.textContent = details.permissions;
  main.appendChild(permissions);

  row.appendChild(main);
  return row;
}

function createProgramViewToggle(activeView, wm) {
  const toolbar = document.createElement("div");
  toolbar.className = "prog-man-toolbar";
  toolbar.setAttribute("role", "toolbar");
  toolbar.setAttribute("aria-label", "Program Manager view");

  [
    ["icons", "Default"],
    ["details", "Detailed"]
  ].forEach(([view, label]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = view === activeView ? "prog-view-button active" : "prog-view-button";
    button.setAttribute("aria-pressed", view === activeView ? "true" : "false");
    button.textContent = label;
    button.addEventListener("click", () => setProgramManagerView(view, wm));
    toolbar.appendChild(button);
  });

  return toolbar;
}

export function getProgramManagerContent(wm) {
  const activeView = getProgramManagerView();
  const container = document.createElement("div");
  container.className = "prog-man-container";
  container.appendChild(createProgramViewToggle(activeView, wm));

  const programs = getAvailablePrograms();
  const list = document.createElement("div");
  list.className = activeView === "details" ? "prog-man-list" : "prog-man-grid";

  if (!programs.length) {
    const emptyLabel = document.createElement("div");
    emptyLabel.className = "prog-label";
    emptyLabel.textContent = "No applications available.";
    list.appendChild(emptyLabel);
    container.appendChild(list);
    return container;
  }

  programs.forEach((prog) => {
    list.appendChild(
      activeView === "details" ? createProgramDetailRow(prog, wm) : createProgramIconButton(prog, wm)
    );
  });

  container.appendChild(list);
  return container;
}

export function setupProgramManagerMenu(wm, win) {
  const menu = win.querySelector(".menu-bar");
  if (!menu) return;

  menu.innerHTML = `
                    <div class="menu-item">File</div>
                    <div class="menu-item" data-action="cascade">Cascade Windows</div>
                    <div class="menu-item" data-action="tile">Tile Windows</div>
                    <div class="menu-item">Help</div>
                `;
  wm.setupMenuBar(win);

  menu.querySelector('[data-action="cascade"]')?.addEventListener("click", () =>
    wm.cascadeWindows()
  );
  menu.querySelector('[data-action="tile"]')?.addEventListener("click", () =>
    wm.tileWindows()
  );
}

export function refreshProgramManagerContent(wm) {
  wm.windows
    .filter((win) => win.type === "progman")
    .forEach((win) => {
      const contentArea = getWindowBodyContainer(win.el);
      if (contentArea) contentArea.replaceChildren(getProgramManagerContent(wm));
    });
}
