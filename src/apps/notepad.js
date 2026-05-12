import { BaseApp } from "./base/BaseApp.js";

export class NotepadApp extends BaseApp {
  constructor(args = {}) {
    super(args);
    this.clearStatusTimer = null;
    this.onSaveClick = null;
  }

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

    if (!saveBtn) return this;

    const clearStatusTimer = () => {
      if (!this.clearStatusTimer) return;
      this.clearStatusTimer();
      this.unregisterDisposable(this.clearStatusTimer);
      this.clearStatusTimer = null;
    };

    const setStatus = (msg, isError = false) => {
      if (!status) return;
      clearStatusTimer();
      status.textContent = msg;
      status.classList.toggle("error", isError);
      if (!msg) return;

      const timerId = globalThis.setTimeout(() => {
        status.textContent = "";
        this.unregisterDisposable(this.clearStatusTimer);
        this.clearStatusTimer = null;
      }, 2000);
      this.clearStatusTimer = () => globalThis.clearTimeout(timerId);
      this.registerDisposable(this.clearStatusTimer);
    };

    if (!handle) {
      saveBtn.disabled = true;
      saveBtn.title = "Open a mounted file to enable saving.";
      return this;
    }

    this.onSaveClick = async () => {
      try {
        const writable = await handle.createWritable();
        await writable.write(textarea?.value || "");
        await writable.close();
        setStatus("Saved");
      } catch (err) {
        setStatus(`Save failed: ${err.message}`, true);
      }
    };
    this.listen(saveBtn, "click", this.onSaveClick);
    return this;
  }

  dispose() {
    this.onSaveClick = null;
    super.dispose();
    this.clearStatusTimer = null;
  }
}
