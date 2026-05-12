import { BaseApp } from "./base/BaseApp.js";
export function getReadmeContent() {
  return `<div style="padding:15px; font-family:'Times New Roman', serif;">
            <h2>Welcome to Web 3.1</h2>
            <p>Features: Solitaire, Reversi, Media Player, Clock, etc.</p>
          </div>`;
}

export class ReadmeApp extends BaseApp {
  getWindowContent() {
    return getReadmeContent(this.initData, this.services);
  }
}
