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
