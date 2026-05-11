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

export function clearCharMap(button) {
  button.closest(".window").querySelector("#char-copy-input").value = "";
}

export function getCharMapContent() {
    return `<div class="char-map-layout">
              <div class="char-map-toolbar">
                <div class="char-preview" aria-live="polite">A</div>
                <div class="char-meta">
                  <div class="char-code" id="char-code-label">U+0041 · Dec 65</div>
                  <div class="char-font-row">
                    <label for="char-font-select">Font:</label>
                    <select class="char-font" id="char-font-select">
                      <option value="'Times New Roman', serif">Times New Roman</option>
                      <option value="'Arial', sans-serif">Arial</option>
                      <option value="'Courier New', monospace">Courier New</option>
                      <option value="'Segoe UI Symbol', 'Noto Sans Symbols', sans-serif">Symbols</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="char-grid" id="char-grid"></div>
              <div class="char-controls">
                <label>Characters to copy:</label>
                <div class="copy-row">
                  <input type="text" class="char-input" id="char-copy-input" readonly>
                  <button class="task-btn" onclick="copyCharMap(this)" style="width:60px">Copy</button>
                </div>
                <button class="task-btn" onclick="clearCharMap(this)">Clear</button>
              </div>
            </div>`;

}
