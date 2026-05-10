import { BaseApp } from "./base/BaseApp.js";

export class NotepadApp extends BaseApp {
  getWindowContent() {
    const txt = this.initData;
    const text = typeof txt === "string" ? txt : txt?.text;
    const showToolbar = Boolean(txt?.nativeFileHandle);
    const layout = document.createElement("div");
    layout.classList.add("notepad-layout");

    if (showToolbar) {
      const toolbar = document.createElement("div");
      toolbar.classList.add("notepad-toolbar");

      const saveButton = document.createElement("button");
      saveButton.classList.add("task-btn", "notepad-save");
      saveButton.textContent = "Save";
      toolbar.appendChild(saveButton);

      const status = document.createElement("span");
      status.classList.add("notepad-status");
      toolbar.appendChild(status);

      layout.appendChild(toolbar);
    }

    const textarea = document.createElement("textarea");
    textarea.classList.add("notepad-area");
    textarea.spellcheck = false;
    textarea.value = text ?? "Welcome to Oriel 1.0!";
    layout.appendChild(textarea);

    return layout;
  }

  mount() {
    const saveBtn = this.windowEl.querySelector(".notepad-save");
    const status = this.windowEl.querySelector(".notepad-status");
    const textarea = this.windowEl.querySelector(".notepad-area");
    const handle = this.initData?.nativeFileHandle;

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
}

export function initNotepad(win, initData = {}) {
  const app = new NotepadApp({ windowEl: win, initData });
  app.mount();
  return app;
}

export function getNotepadContent(initData) {
  return new NotepadApp({ initData }).getWindowContent();
}
