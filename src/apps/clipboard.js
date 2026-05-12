import { BaseApp } from "./base/BaseApp.js";
export function getClipboardContent() {
  return `<textarea class="clip-area" readonly placeholder="(Clipboard is empty)"></textarea>`;
}

export class ClipboardApp extends BaseApp {
  getWindowContent() {
    return getClipboardContent(this.initData, this.services);
  }
}
