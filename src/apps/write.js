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
