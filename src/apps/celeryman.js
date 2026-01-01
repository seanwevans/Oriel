const CELERY_URL = "https://celeryman.alexmeub.com/";

export function getCeleryManContent() {
  return `
    <div class="celeryman">
      <div class="celeryman-toolbar">
        <div>
          <div class="celeryman-title">Celery Man</div>
          <div class="celeryman-subtitle">Paul Rudd's classic bit, brought to the Oriel desktop.</div>
        </div>
        <div class="celeryman-actions">
          <button class="task-btn celeryman-reload">Reload</button>
          <button class="task-btn celeryman-open" title="Open in new tab">Open Site</button>
        </div>
      </div>
      <div class="celeryman-status" data-tone="info">Loading Celery Man experience...</div>
      <div class="celeryman-frame-wrap">
        <iframe
          class="celeryman-frame"
          src="${CELERY_URL}"
          title="Celery Man"
          allow="autoplay; fullscreen; clipboard-write"
          loading="lazy"
        ></iframe>
      </div>
    </div>
  `;
}

export function initCeleryMan(win) {
  const iframe = win.querySelector(".celeryman-frame");
  const reloadBtn = win.querySelector(".celeryman-reload");
  const openBtn = win.querySelector(".celeryman-open");
  const status = win.querySelector(".celeryman-status");

  if (!iframe || !status) return;

  const setStatus = (text, tone = "info") => {
    status.textContent = text;
    status.dataset.tone = tone;
  };

  iframe.addEventListener("load", () => setStatus("Celery Man is ready. Enjoy the show!", "success"));
  iframe.addEventListener("error", () => setStatus("Could not load celeryman.alexmeub.com.", "error"));

  reloadBtn?.addEventListener("click", () => {
    iframe.src = CELERY_URL;
    setStatus("Reloading the stage...", "info");
  });

  openBtn?.addEventListener("click", () => {
    window.open(CELERY_URL, "_blank", "noopener,noreferrer");
  });
}
