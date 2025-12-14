export function initCharMap(w) {
  const g = w.querySelector("#char-grid"),
    ip = w.querySelector("#char-copy-input"),
    preview = w.querySelector(".char-preview"),
    codeLabel = w.querySelector("#char-code-label"),
    fontSelect = w.querySelector("#char-font-select");

  let activeCell = null;

  const applyFont = (fontValue) => {
    g.style.fontFamily = fontValue;
    preview.style.fontFamily = fontValue;
  };

  const setSelection = (cell) => {
    if (!cell) return;
    if (activeCell) activeCell.classList.remove("active");
    activeCell = cell;
    cell.classList.add("active");
    const chr = cell.dataset.char;
    const code = parseInt(cell.dataset.code, 10);
    preview.innerText = chr;
    codeLabel.innerText = `U+${code.toString(16).toUpperCase().padStart(4, "0")} · Dec ${code}`;
  };

  for (let i = 32; i < 256; i++) {
    const c = String.fromCharCode(i);
    const d = document.createElement("div");
    d.className = "char-cell";
    d.innerText = c;
    d.dataset.char = c;
    d.dataset.code = i;
    d.onclick = () => {
      ip.value += c;
      setSelection(d);
    };
    g.appendChild(d);
  }

  fontSelect?.addEventListener("change", (e) => applyFont(e.target.value));
  setSelection(g.querySelector('[data-code="65"]') || g.querySelector(".char-cell"));
  applyFont(fontSelect?.value || "'Times New Roman', serif");
}

export function copyCharMap(b) {
  b.closest(".window").querySelector("#char-copy-input").select();
  document.execCommand("copy");
}
