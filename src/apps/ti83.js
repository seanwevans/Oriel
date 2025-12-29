const TI83_URL = "https://www.cemetech.net/projects/jstified/";

export function getTi83Root() {
  return `
    <div class="ti83-layout" style="display:flex;flex-direction:column;height:100%;background:#0a0a0a;">
      <div class="ti83-toolbar" style="padding:6px;background:#dcdcdc;border-bottom:1px solid #808080;display:flex;gap:10px;align-items:center;">
        <div class="ti83-status" style="font-size:12px;flex:1;">TI-83/84 emulator (bring your own ROM).</div>
        <button class="task-btn ti83-reload">Reload</button>
        <a class="task-btn" href="${TI83_URL}" target="_blank" rel="noreferrer noopener">Open in new tab</a>
      </div>
      <iframe
        class="ti83-frame"
        src="${TI83_URL}"
        style="flex:1;width:100%;border:none;background:#000;"
        allow="autoplay; gamepad; fullscreen"
        title="TI-83 Emulator"
      ></iframe>
    </div>
  `;
}

export function initTi83(win) {
  const iframe = win.querySelector(".ti83-frame");
  const status = win.querySelector(".ti83-status");
  const reloadBtn = win.querySelector(".ti83-reload");

  if (reloadBtn && iframe) {
    reloadBtn.addEventListener("click", () => {
      iframe.src = TI83_URL;
      if (status) status.textContent = "Reloading emulator...";
    });
  }

  if (iframe) {
    iframe.addEventListener("load", () => {
      if (status)
        status.textContent = "Emulator ready. Load a TI-83/84 ROM via the embedded controls.";
    });
  }
}
