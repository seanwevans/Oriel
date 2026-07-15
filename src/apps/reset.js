import { BaseApp } from "./base/BaseApp.js";
import { uninstallAllApps } from "../installer.js";

export function initReset(w) {
  const btn = w.querySelector(".reset-now-btn");
  const status = w.querySelector(".reset-status");

  const setStatus = (msg) => {
    if (status) status.textContent = msg;
  };

  if (!btn) return;

  btn.onclick = async () => {
    const confirmed = window.confirm(
      "This will clear all saved Oriel data, uninstall every non-native app, and reload the desktop. Continue?"
    );
    if (!confirmed) {
      setStatus("Reset cancelled.");
      return;
    }

    btn.disabled = true;

    const keysToClear = [
      "oriel-desktop-state",
      "oriel-fs-v1",
      "oriel-volume",
      "oriel-network-defaults",
      "oriel-radio-cache-v1",
      "oriel-app-registry",
      "w31-cards",
      "w31-db"
    ];

    keysToClear.forEach((key) => localStorage.removeItem(key));

    try {
      const { ids } = await uninstallAllApps();
      setStatus(
        `Uninstalled ${ids.length} installed app${ids.length === 1 ? "" : "s"}. Reloading to apply defaults…`
      );
    } catch (err) {
      console.warn("Failed to uninstall apps during reset", err);
      setStatus("Saved data cleared. Reloading to apply defaults…");
    }

    setTimeout(() => window.location.reload(), 300);
  };
}

export function getResetContent() {
    return `<div class="reset-layout" style="padding:16px; display:flex; flex-direction:column; gap:12px;">
                <div class="reset-warning" style="background:#fff3cd; border:1px solid #e0c25c; padding:10px;">
                    <strong>Reset Oriel</strong>
                    <div>This will clear all saved desktop windows, wallpaper, volume, network defaults, and file or app data.</div>
                </div>
                <ul style="margin:0 0 4px 20px; padding:0; line-height:1.4;">
                    <li>Desktop layout & wallpaper</li>
                    <li>File system changes</li>
                    <li>Sound levels & network presets</li>
                    <li>App data such as Cardfile or Data Manager</li>
                    <li>Installed (non-native) apps, such as pens</li>
                </ul>
                <button class="task-btn reset-now-btn" style="width:180px;">Reset and Reload</button>
                <div class="reset-status" aria-live="polite">No changes yet.</div>
            </div>`;

}

export class ResetApp extends BaseApp {
  getWindowContent() {
    return getResetContent(this.initData, this.services);
  }

  mount() {
    return initReset(this.windowEl, this.initData, this.services.windowManager, this.services, this);
  }
}
