import { RSS_PRESETS } from "../defaults.js";
import { getNetworkDefaults } from "../networking.js";

const getRssPlaceholder = () => {
  const { browserHome } = getNetworkDefaults();
  return `${(browserHome || "https://example.com/").replace(/\/$/, "")}/feed.xml`;
};

export function getRssReaderContent() {
  const presetOptions = RSS_PRESETS.map((p) => `<option value="${p.url}">${p.label}</option>`).join(
    ""
  );

  return `
              <div class="rss-layout">
                <div class="rss-toolbar">
                  <label class="rss-label">Feed:</label>
                  <input class="rss-url" type="text" value="${RSS_PRESETS[0].url}" spellcheck="false" placeholder="${getRssPlaceholder()}">
                  <select class="rss-preset" title="Popular feeds">${presetOptions}</select>
                  <button class="task-btn rss-load">Load</button>
                  <span class="rss-status">Ready</span>
                </div>
                <div class="rss-body">
                  <div class="rss-list" aria-label="Feed items"></div>
                  <div class="rss-preview">
                    <div class="rss-preview-title">Choose an item to preview</div>
                    <div class="rss-preview-meta"></div>
                    <div class="rss-preview-text"></div>
                    <a class="rss-preview-link" href="#" target="_blank" rel="noreferrer noopener">Open original</a>
                  </div>
                </div>
              </div>
            `;
}
