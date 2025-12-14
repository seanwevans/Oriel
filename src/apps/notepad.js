export function initNotepad(win, initData = {}) {
  const saveBtn = win.querySelector(".notepad-save");
  const status = win.querySelector(".notepad-status");
  const textarea = win.querySelector(".notepad-area");
  const handle = initData?.nativeFileHandle;

  if (!saveBtn) return;

  const setStatus = (msg, isError = false) => {
    if (!status) return;
    status.textContent = msg;
    status.classList.toggle("error", isError);
    if (msg) setTimeout(() => (status.textContent = ""), 2000);
  };

  if (!handle) {
    saveBtn.disabled = true;
    saveBtn.title = "Open a mounted file to enable saving.";
    return;
  }

  saveBtn.addEventListener("click", async () => {
    try {
      const writable = await handle.createWritable();
      await writable.write(textarea?.value || "");
      await writable.close();
      setStatus("Saved");
    } catch (err) {
      setStatus(`Save failed: ${err.message}`, true);
    }
  });
}
