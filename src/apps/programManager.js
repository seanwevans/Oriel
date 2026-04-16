import { PROGRAMS } from "../programs.js";
import { ICONS } from "../icons.js";
import { getInstalledPrograms, getManifestForApp } from "../installer.js";

const ALLOWED_ICON_PROTOCOLS = new Set(["https:", "data:"]);

function isSafeIconUrl(rawUrl) {
  if (typeof rawUrl !== "string") return false;
  const trimmed = rawUrl.trim();
  if (!trimmed) return false;

  try {
    const parsed = new URL(trimmed, window.location.origin);
    if (!ALLOWED_ICON_PROTOCOLS.has(parsed.protocol)) return false;
    if (parsed.protocol === "data:") {
      return /^data:image\/[a-zA-Z0-9.+-]+;base64,[a-zA-Z0-9+/=\s]+$/.test(trimmed);
    }
    return true;
  } catch {
    return false;
  }
}

function createIconElementFromMarkup(markup) {
  const template = document.createElement("template");
  template.innerHTML = markup.trim();
  const icon = template.content.firstElementChild;
  return icon || document.createTextNode("?");
}

function createIconElementForProgram(prog) {
  const type = prog?.type;
  const manifest = getManifestForApp(type);

  if (manifest?.icon) {
    if (ICONS[manifest.icon]) return createIconElementFromMarkup(ICONS[manifest.icon]);

    if (isSafeIconUrl(manifest.icon)) {
      const img = document.createElement("img");
      img.src = manifest.icon;
      img.alt = `${manifest.name || type} icon`;
      img.className = "runtime-icon";
      return img;
    }
  }

  const dynamic = getInstalledPrograms().find((app) => app.type === type);
  if (dynamic?.icon && ICONS[dynamic.icon]) {
    return createIconElementFromMarkup(ICONS[dynamic.icon]);
  }

  return createIconElementFromMarkup(ICONS[type] || ICONS.help);
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
    if (isSafeIconUrl(manifest.icon)) {
      return `<img src="${manifest.icon}" alt="${manifest.name || type} icon" class="runtime-icon">`;
    }
  }
  const dynamic = getInstalledPrograms().find((app) => app.type === type);
  if (dynamic?.icon && ICONS[dynamic.icon]) return ICONS[dynamic.icon];
  return ICONS[type] || ICONS["help"];
}

export function getProgramDefaults(type) {
  return getAvailablePrograms().find((prog) => prog.type === type) || null;
}

export function getProgramManagerContent(wm) {
  const grid = document.createElement("div");
  grid.className = "prog-man-grid";

  const programs = getAvailablePrograms();
  if (!programs.length) {
    const emptyLabel = document.createElement("div");
    emptyLabel.className = "prog-label";
    emptyLabel.textContent = "No applications available.";
    grid.appendChild(emptyLabel);
    return grid;
  }

  programs.forEach((prog) => {
    const iconButton = document.createElement("div");
    iconButton.className = "prog-icon";
    iconButton.setAttribute("role", "button");
    iconButton.setAttribute("aria-label", `Open ${prog.title || prog.label || prog.type}`);
    iconButton.tabIndex = 0;
    const openProgram = () => {
      const width = prog.width || 500;
      const height = prog.height || 400;
      wm.openWindow(prog.type, prog.title, width, height);
    };
    iconButton.addEventListener("click", openProgram);
    iconButton.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openProgram();
      }
    });

    iconButton.appendChild(createIconElementForProgram(prog));

    const label = document.createElement("div");
    label.className = "prog-label";
    label.textContent = prog.label || "";
    iconButton.appendChild(label);

    grid.appendChild(iconButton);
  });

  return grid;
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
      const contentArea = win.el.querySelector(".window-content");
      if (!contentArea) return;
      contentArea.replaceChildren(getProgramManagerContent(wm));
    });
}
