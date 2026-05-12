import { BaseApp } from "./base/BaseApp.js";
export function initWrite(win) {
  const editor = win.querySelector(".write-editor");
  if (!editor) return;

  const fontSelect = win.querySelector(".write-font");
  const sizeSelect = win.querySelector(".write-size");
  const fmtButtons = win.querySelectorAll(".fmt-btn");

  const applyCommand = (cmd, value = null) => {
    editor.focus();
    document.execCommand(cmd, false, value);
  };

  if (fontSelect) {
    fontSelect.addEventListener("change", () => applyCommand("fontName", fontSelect.value));
  }

  if (sizeSelect) {
    sizeSelect.addEventListener("change", () => applyCommand("fontSize", sizeSelect.value));
  }

  fmtButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const { cmd } = btn.dataset;
      if (cmd) applyCommand(cmd);
    });
  });
}

export function getWriteContent(txt) {
    return `<div class="write-layout"><div class="write-toolbar"><select class="write-select write-font" title="Font Family"><option value="Times New Roman">Times New Roman</option><option value="Arial">Arial</option><option value="Courier New">Courier New</option><option value="Georgia">Georgia</option><option value="Verdana">Verdana</option></select><select class="write-select write-size" title="Font Size"><option value="2">10</option><option value="3">12</option><option value="4" selected>14</option><option value="5">18</option><option value="6">24</option><option value="7">32</option></select><button class="fmt-btn" data-cmd="bold" title="Bold">B</button><button class="fmt-btn" data-cmd="italic" title="Italic">I</button><button class="fmt-btn" data-cmd="underline" title="Underline">U</button></div><div class="write-editor" contenteditable="true" spellcheck="false">${
      txt || "Welcome to Oriel Write."
    }</div></div>`;

}

export class WriteApp extends BaseApp {
  getWindowContent() {
    return getWriteContent(this.initData, this.services);
  }

  mount() {
    return initWrite(this.windowEl, this.initData, this.services.windowManager, this.services, this);
  }
}
