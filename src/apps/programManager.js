import { PROGRAMS } from "../programs.js";
import { ICONS } from "../icons.js";
import { getInstalledPrograms, getManifestForApp } from "../installer.js";

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
    return `<img src="${manifest.icon}" alt="${manifest.name || type} icon" class="runtime-icon">`;
  }
  const dynamic = getInstalledPrograms().find((app) => app.type === type);
  if (dynamic?.icon && ICONS[dynamic.icon]) return ICONS[dynamic.icon];
  return ICONS[type] || ICONS["help"];
}

export function getProgramDefaults(type) {
  return getAvailablePrograms().find((prog) => prog.type === type) || null;
}

export function getProgramManagerContent(wm) {
  const programs = getAvailablePrograms();
  if (!programs.length)
    return '<div class="prog-man-grid"><div class="prog-label">No applications available.</div></div>';
  const programIcons = programs
    .map((prog) => {
      const iconHtml = getIconForType(prog.type);
      const width = prog.width || 500;
      const height = prog.height || 400;
      return `
                    <div class="prog-icon" onclick="wm.openWindow('${prog.type}', '${prog.title}', ${width}, ${height})">
                        ${iconHtml}
                        <div class="prog-label">${prog.label}</div>
                    </div>`;
    })
    .join("");
  return `
                <div class="prog-man-grid">
                    ${programIcons}
                </div>
            `;
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
      if (contentArea) contentArea.innerHTML = getProgramManagerContent(wm);
    });
}
