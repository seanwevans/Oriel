import { BaseApp } from "./base/BaseApp.js";
export function initVm(win) {
  const iframe = win.querySelector(".vm-frame");
  const bootBtn = win.querySelector(".vm-boot");
  const resetBtn = win.querySelector(".vm-reset");
  const status = win.querySelector(".vm-status");

  if (!iframe || !bootBtn || !resetBtn || !status) return;

  const vmUrl = `${window.location.origin}${window.location.pathname}${window.location.search}`;

  const setStatus = (text) => {
    status.textContent = text;
  };

  const resetVm = () => {
    iframe.src = "about:blank";
    bootBtn.disabled = false;
    resetBtn.disabled = true;
    setStatus("VM is powered off. Click Boot to start Oriel inside Oriel.");
  };

  const bootVm = () => {
    iframe.src = vmUrl;
    bootBtn.disabled = true;
    resetBtn.disabled = false;
    setStatus("Booting virtual Oriel...");
  };

  bootBtn.addEventListener("click", bootVm);
  resetBtn.addEventListener("click", resetVm);

  iframe.addEventListener("load", () => {
    if (iframe.src === "about:blank") return;
    setStatus("VM ready. Yes, that's Oriel running inside Oriel.");
  });

  resetVm();
}

export function getVmContent() {
    return `<div class="vm-layout">
                <div class="vm-toolbar">
                    <div class="vm-actions">
                        <button class="task-btn vm-boot">Boot VM</button>
                        <button class="task-btn vm-reset" disabled>Power Off</button>
                    </div>
                    <div class="vm-status" aria-live="polite">VM is powered off. Click Boot to start Oriel inside Oriel.</div>
                </div>
                <div class="vm-note">Runs a fresh copy of Oriel in an isolated iframe. Try opening apps inside the VM for true desktop-ception.</div>
                <div class="vm-view">
                    <iframe class="vm-frame" title="Oriel Virtual Machine" src="about:blank"></iframe>
                </div>
            </div>`;

}

export class VmApp extends BaseApp {
  getWindowContent() {
    return getVmContent(this.initData, this.services);
  }

  mount() {
    return initVm(this.windowEl, this.initData, this.services.windowManager, this.services, this);
  }
}
