export function initReset(w) {
  const btn = w.querySelector(".reset-now-btn");
  const status = w.querySelector(".reset-status");

  const setStatus = (msg) => {
    if (status) status.textContent = msg;
  };

  if (!btn) return;

  btn.onclick = () => {
    const confirmed = window.confirm(
      "This will clear all saved Oriel data and reload the desktop. Continue?"
    );
    if (!confirmed) {
      setStatus("Reset cancelled.");
      return;
    }

    const keysToClear = [
      "oriel-desktop-state",
      "oriel-fs-v1",
      "oriel-volume",
      "oriel-network-defaults",
      "oriel-radio-cache-v1",
      "w31-cards",
      "w31-db"
    ];

    keysToClear.forEach((key) => localStorage.removeItem(key));
    setStatus("Saved data cleared. Reloading to apply defaults…");

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
                </ul>
                <button class="task-btn reset-now-btn" style="width:180px;">Reset and Reload</button>
                <div class="reset-status" aria-live="polite">No changes yet.</div>
            </div>`;

}
