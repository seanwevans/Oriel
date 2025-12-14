const N64_URL = "https://www.neilb.net/n64wasm/";

export function getN64Root() {
  return `
    <div class="n64-layout" style="display:flex;flex-direction:column;height:100%;background:#000;">
      <div class="n64-toolbar" style="padding:6px;background:#dcdcdc;border-bottom:1px solid #808080;display:flex;gap:10px;align-items:center;">
        <div class="n64-status" style="font-size:12px;flex:1;">N64Wasm - Drag & Drop ROMs supported</div>
        <button class="task-btn" onclick="document.querySelector('.window.active iframe').src = document.querySelector('.window.active iframe').src">Reload</button>
      </div>
      <iframe
        class="n64-iframe"
        src="${N64_URL}"
        style="flex:1;width:100%;border:none;background:#000;"
        allow="autoplay; gamepad; fullscreen; microphone"
        title="Nintendo 64 Emulator"
      ></iframe>
    </div>
  `;
}

export function initN64(win) {
  const iframe = win.querySelector(".n64-iframe");
  const status = win.querySelector(".n64-status");

  if (!iframe) return;

  iframe.addEventListener("load", () => {
    if (status) status.textContent = "Emulator Ready. Click inside to play.";
  });
}
