const SANDSPIEL_URL = "https://sandspiel.club/";

export function getSandspielRoot() {
  return `
    <div class="sandspiel-embed">
      <div class="sandspiel-header">
        <div class="sandspiel-status" aria-live="polite">Loading Sandspiel…</div>
        <div class="sandspiel-actions">
          <button class="task-btn sandspiel-reload" type="button">Reload</button>
          <a
            class="task-btn sandspiel-open"
            href="${SANDSPIEL_URL}"
            target="_blank"
            rel="noopener noreferrer"
          >Open in new tab</a>
        </div>
      </div>
      <iframe
        class="sandspiel-iframe"
        title="Sandspiel sandbox"
        allowfullscreen
        sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-forms"
      ></iframe>
    </div>
  `;
}

export function initSandspiel(win) {
  const iframe = win.querySelector(".sandspiel-iframe");
  const status = win.querySelector(".sandspiel-status");
  const reloadBtn = win.querySelector(".sandspiel-reload");

  if (!iframe) return;

  const setStatus = (text) => {
    if (status) status.textContent = text;
  };

  const loadGame = () => {
    setStatus("Loading Sandspiel…");
    iframe.src = SANDSPIEL_URL;
  };

  iframe.addEventListener("load", () => {
    setStatus("Sandspiel loaded. Create and drop elements to play.");
  });

  iframe.addEventListener("error", () => {
    setStatus("Failed to load Sandspiel. Try reloading or open in a new tab.");
  });

  reloadBtn?.addEventListener("click", () => {
    iframe.src = "";
    loadGame();
  });

  const iframeSrcAttr = iframe.getAttribute("src");

  if (!iframeSrcAttr) {
    loadGame();
  }
}
