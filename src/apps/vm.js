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
