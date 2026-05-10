function formatHexDump(bytes) {
  const offsets = [];
  const hexLines = [];
  const asciiLines = [];

  if (!bytes || !bytes.length)
    return { offsetText: "000000", hexText: "", asciiText: "" };

  for (let i = 0; i < bytes.length; i += 16) {
    offsets.push(i.toString(16).padStart(6, "0"));
    const hexPart = [];
    const asciiPart = [];
    for (let j = 0; j < 16; j++) {
      const idx = i + j;
      if (idx < bytes.length) {
        const b = bytes[idx];
        hexPart.push(b.toString(16).padStart(2, "0").toUpperCase());
        asciiPart.push(b >= 32 && b <= 126 ? String.fromCharCode(b) : ".");
      } else {
        hexPart.push("  ");
        asciiPart.push(" ");
      }
    }
    hexLines.push(hexPart.join(" "));
    asciiLines.push(asciiPart.join(""));
  }

  return {
    offsetText: offsets.join("\n"),
    hexText: hexLines.join("\n"),
    asciiText: asciiLines.join("\n")
  };
}

function parseHexString(str) {
  const cleaned = (str || "").replace(/[^0-9a-fA-F]/g, "");
  if (!cleaned) return new Uint8Array();
  if (cleaned.length % 2 !== 0) return null;
  const bytes = new Uint8Array(cleaned.length / 2);
  for (let i = 0; i < cleaned.length; i += 2) {
    bytes[i / 2] = parseInt(cleaned.substr(i, 2), 16);
  }
  return bytes;
}

export function initHexEditor(win) {
  const hexArea = win.querySelector(".hex-area");
  const asciiArea = win.querySelector(".hex-ascii");
  const offsetArea = win.querySelector(".hex-offsets");
  const status = win.querySelector(".hex-status");
  const summary = win.querySelector(".hex-summary");
  const fileInput = win.querySelector(".hex-file");
  const parseBtn = win.querySelector(".hex-parse");
  const asciiBtn = win.querySelector(".hex-from-ascii");
  const newBtn = win.querySelector(".hex-new");

  const setStatus = (msg, isError = false) => {
    if (!status) return;
    status.textContent = msg;
    status.classList.toggle("error", isError);
  };

  const renderBytes = (bytes, label) => {
    const data = bytes || new Uint8Array();
    const dump = formatHexDump(data);
    if (offsetArea) offsetArea.value = dump.offsetText;
    if (hexArea) hexArea.value = dump.hexText;
    if (asciiArea) asciiArea.value = dump.asciiText;
    if (summary)
      summary.textContent = `${data.length} byte${data.length === 1 ? "" : "s"}`;
    setStatus(label || "Ready");
  };

  const loadSample = () => {
    const sample = new TextEncoder().encode(
      "Hello, Hex Editor!\nUse Parse Hex after editing."
    );
    renderBytes(sample, "Sample buffer loaded.");
  };

  loadSample();

  fileInput?.addEventListener("change", (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const arr = new Uint8Array(ev.target.result);
      renderBytes(arr, `Loaded ${file.name}`);
    };
    reader.readAsArrayBuffer(file);
  });

  parseBtn?.addEventListener("click", () => {
    const bytes = parseHexString(hexArea?.value || "");
    if (bytes === null) {
      setStatus("Hex input contains an incomplete byte.", true);
      return;
    }
    renderBytes(bytes, "Parsed hex input.");
  });

  asciiBtn?.addEventListener("click", () => {
    const txt = asciiArea?.value || "";
    const bytes = new TextEncoder().encode(txt);
    renderBytes(bytes, "Encoded ASCII view.");
  });

  newBtn?.addEventListener("click", () =>
    renderBytes(new Uint8Array(), "New empty buffer.")
  );
}

export function getHexEditorContent() {
    return `<div class="hex-layout">
                <div class="hex-toolbar">
                    <button class="task-btn hex-new">New</button>
                    <label class="task-btn file-btn">Open File<input type="file" class="hex-file" accept="*/*"></label>
                    <button class="task-btn hex-parse">Parse Hex</button>
                    <button class="task-btn hex-from-ascii">From ASCII</button>
                    <div class="hex-status">Ready</div>
                </div>
                <div class="hex-body">
                    <textarea class="hex-offsets" readonly aria-label="Offsets"></textarea>
                    <textarea class="hex-area" spellcheck="false" aria-label="Hex bytes"></textarea>
                    <textarea class="hex-ascii" spellcheck="false" aria-label="ASCII view"></textarea>
                </div>
                <div class="hex-footer">
                    <div class="hex-summary">0 bytes</div>
                    <div class="hex-hint">Edit hex pairs, then click Parse Hex to refresh the ASCII view.</div>
                </div>
            </div>`;

}
