const DEFAULT_COLORS = [
  "#000000",
  "#ffffff",
  "#808080",
  "#c0c0c0",
  "#800000",
  "#ff0000",
  "#808000",
  "#ffff00",
  "#008000",
  "#00ff00",
  "#008080",
  "#00ffff",
  "#000080",
  "#0000ff",
  "#800080",
  "#ff00ff"
];

export function getPixelStudioContent() {
  return `
    <div class="pixel-studio">
      <div class="pixel-studio__toolbar">
        <div class="pixel-toolbar-left">
          <button class="pixel-btn add-frame">+ Frame</button>
          <button class="pixel-btn duplicate-frame">Duplicate</button>
          <button class="pixel-btn delete-frame">Delete</button>
          <label class="pixel-toggle">
            <input type="checkbox" class="onion-toggle" checked /> Onion skin
          </label>
          <button class="pixel-btn playback-btn" data-playing="false">▶ Preview</button>
          <button class="pixel-btn sheet-btn">Build Sprite Sheet</button>
        </div>
        <div class="pixel-toolbar-right">
          <button class="pixel-btn tool-btn active" data-tool="draw">Draw</button>
          <button class="pixel-btn tool-btn" data-tool="erase">Erase</button>
          <span class="pixel-subtitle">Pixel art & animation studio</span>
        </div>
      </div>
      <div class="pixel-studio__body">
        <div class="pixel-panel palette-panel">
          <div class="panel-header">Palette</div>
          <div class="palette-editor">
            <input type="color" class="palette-picker" value="#000000" aria-label="Choose color" />
            <input type="text" class="palette-name" value="Custom palette" aria-label="Palette name" />
            <button class="pixel-btn add-swatch">Add</button>
          </div>
          <div class="palette-swatches" role="list"></div>
          <div class="palette-actions">
            <button class="pixel-btn save-palette">Save palette</button>
            <button class="pixel-btn reset-palette">Reset</button>
          </div>
        </div>
        <div class="pixel-canvas-wrap">
          <canvas class="pixel-canvas" width="384" height="384" aria-label="Pixel canvas"></canvas>
          <div class="canvas-meta">
            <span class="frame-indicator">Frame 1 / 1</span>
            <span class="onion-tip">Onion-skin overlays previous & next frames</span>
          </div>
        </div>
        <div class="pixel-panel frames-panel">
          <div class="panel-header">Frames</div>
          <div class="frames-list" role="listbox" aria-label="Frames timeline"></div>
          <div class="sheet-preview">
            <div class="sheet-meta">Sprite sheet</div>
            <canvas class="sheet-canvas" width="384" height="128" aria-label="Sprite sheet preview"></canvas>
            <button class="pixel-btn download-sheet">Download PNG</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

const createEmptyFrame = (size) => new Array(size * size).fill(null);

function drawFrame(ctx, frame, size, scale, alpha = 1, offsetX = 0, offsetY = 0) {
  if (!frame) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  frame.forEach((color, idx) => {
    if (!color) return;
    const x = (idx % size) * scale + offsetX;
    const y = Math.floor(idx / size) * scale + offsetY;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, scale, scale);
  });
  ctx.restore();
}

function drawGrid(ctx, size, scale) {
  ctx.strokeStyle = "#e0e0e0";
  ctx.lineWidth = 1;
  for (let i = 0; i <= size; i++) {
    const pos = i * scale + 0.5;
    ctx.beginPath();
    ctx.moveTo(pos, 0);
    ctx.lineTo(pos, size * scale);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, pos);
    ctx.lineTo(size * scale, pos);
    ctx.stroke();
  }
}

function renderCanvas(win) {
  const { ctx, size, scale, frames, currentFrame, onionSkin } = win.pixelStudio;
  const canvasSize = size * scale;
  ctx.clearRect(0, 0, canvasSize, canvasSize);
  ctx.fillStyle = "#f8f8f8";
  ctx.fillRect(0, 0, canvasSize, canvasSize);
  ctx.imageSmoothingEnabled = false;

  if (onionSkin && frames.length > 1) {
    const prev = frames[currentFrame - 1];
    const next = frames[currentFrame + 1];
    drawFrame(ctx, prev, size, scale, 0.25);
    drawFrame(ctx, next, size, scale, 0.18);
  }

  drawFrame(ctx, frames[currentFrame], size, scale, 1);
  drawGrid(ctx, size, scale);
}

function renderFramesList(win) {
  const { frames, currentFrame, size, thumbScale } = win.pixelStudio;
  const list = win.querySelector(".frames-list");
  list.innerHTML = "";

  frames.forEach((frame, idx) => {
    const item = document.createElement("button");
    item.className = `frame-thumb${idx === currentFrame ? " active" : ""}`;
    item.dataset.index = idx;
    item.setAttribute("role", "option");
    item.setAttribute("aria-label", `Frame ${idx + 1}`);

    const preview = document.createElement("canvas");
    preview.width = size * thumbScale;
    preview.height = size * thumbScale;
    preview.className = "frame-preview";
    const previewCtx = preview.getContext("2d");
    previewCtx.imageSmoothingEnabled = false;
    previewCtx.fillStyle = "#ffffff";
    previewCtx.fillRect(0, 0, preview.width, preview.height);
    drawFrame(previewCtx, frame, size, thumbScale, 1);
    item.appendChild(preview);

    const label = document.createElement("span");
    label.textContent = `Frame ${idx + 1}`;
    item.appendChild(label);

    item.addEventListener("click", () => {
      win.pixelStudio.currentFrame = idx;
      renderFramesList(win);
      renderCanvas(win);
      updateFrameIndicator(win);
    });
    list.appendChild(item);
  });
}

function renderPalette(win) {
  const { palette, activeColor } = win.pixelStudio;
  const swatches = win.querySelector(".palette-swatches");
  swatches.innerHTML = "";
  palette.forEach((color) => {
    const swatch = document.createElement("button");
    swatch.className = `swatch${color === activeColor ? " active" : ""}`;
    swatch.style.background = color;
    swatch.title = color;
    swatch.setAttribute("role", "listitem");
    swatch.addEventListener("click", () => {
      win.pixelStudio.activeColor = color;
      renderPalette(win);
    });
    swatches.appendChild(swatch);
  });
}

function updateFrameIndicator(win) {
  const indicator = win.querySelector(".frame-indicator");
  indicator.textContent = `Frame ${win.pixelStudio.currentFrame + 1} / ${win.pixelStudio.frames.length}`;
}

function copyFrame(frame) {
  return frame ? [...frame] : null;
}

function rebuildSpriteSheet(win) {
  const { frames, size, sheetScale } = win.pixelStudio;
  const sheetCanvas = win.querySelector(".sheet-canvas");
  if (!sheetCanvas) return;
  const cols = Math.min(frames.length, 8);
  const rows = Math.ceil(frames.length / cols) || 1;
  sheetCanvas.width = cols * size * sheetScale;
  sheetCanvas.height = rows * size * sheetScale;
  const sheetCtx = sheetCanvas.getContext("2d");
  sheetCtx.clearRect(0, 0, sheetCanvas.width, sheetCanvas.height);
  sheetCtx.imageSmoothingEnabled = false;
  frames.forEach((frame, idx) => {
    const col = idx % cols;
    const row = Math.floor(idx / cols);
    const offsetX = col * size * sheetScale;
    const offsetY = row * size * sheetScale;
    drawFrame(sheetCtx, frame, size, sheetScale, 1, offsetX, offsetY);
  });
}

function bindToolbar(win) {
  const toolbarButtons = win.querySelectorAll(".tool-btn");
  toolbarButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      toolbarButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      win.pixelStudio.tool = btn.dataset.tool;
    });
  });
}

function addFrame(win, cloneCurrent = false) {
  const { frames, currentFrame, size } = win.pixelStudio;
  const newFrame = cloneCurrent
    ? copyFrame(frames[currentFrame])
    : createEmptyFrame(size);
  frames.splice(currentFrame + 1, 0, newFrame);
  win.pixelStudio.currentFrame = currentFrame + 1;
  renderFramesList(win);
  renderCanvas(win);
  rebuildSpriteSheet(win);
  updateFrameIndicator(win);
}

function deleteFrame(win) {
  const { frames, currentFrame } = win.pixelStudio;
  if (frames.length === 1) return;
  frames.splice(currentFrame, 1);
  win.pixelStudio.currentFrame = Math.max(0, currentFrame - 1);
  renderFramesList(win);
  renderCanvas(win);
  rebuildSpriteSheet(win);
  updateFrameIndicator(win);
}

function downloadSpriteSheet(win) {
  rebuildSpriteSheet(win);
  const sheetCanvas = win.querySelector(".sheet-canvas");
  const link = document.createElement("a");
  link.download = "sprite-sheet.png";
  link.href = sheetCanvas.toDataURL("image/png");
  link.click();
}

function togglePlayback(win) {
  const btn = win.querySelector(".playback-btn");
  if (btn.dataset.playing === "true") {
    btn.dataset.playing = "false";
    btn.textContent = "▶ Preview";
    clearInterval(win.pixelStudio.playbackTimer);
    win.pixelStudio.playbackTimer = null;
    return;
  }

  btn.dataset.playing = "true";
  btn.textContent = "⏸ Stop";
  let idx = win.pixelStudio.currentFrame;
  win.pixelStudio.playbackTimer = setInterval(() => {
    idx = (idx + 1) % win.pixelStudio.frames.length;
    win.pixelStudio.currentFrame = idx;
    renderFramesList(win);
    renderCanvas(win);
    updateFrameIndicator(win);
  }, 350);
}

function bindFrameControls(win) {
  const addBtn = win.querySelector(".add-frame");
  const dupBtn = win.querySelector(".duplicate-frame");
  const deleteBtn = win.querySelector(".delete-frame");
  const onionToggle = win.querySelector(".onion-toggle");
  const sheetBtn = win.querySelector(".sheet-btn");
  const downloadBtn = win.querySelector(".download-sheet");
  const playbackBtn = win.querySelector(".playback-btn");

  addBtn.addEventListener("click", () => addFrame(win));
  dupBtn.addEventListener("click", () => addFrame(win, true));
  deleteBtn.addEventListener("click", () => deleteFrame(win));
  onionToggle.addEventListener("change", (e) => {
    win.pixelStudio.onionSkin = e.target.checked;
    renderCanvas(win);
  });
  sheetBtn.addEventListener("click", () => rebuildSpriteSheet(win));
  downloadBtn.addEventListener("click", () => downloadSpriteSheet(win));
  playbackBtn.addEventListener("click", () => togglePlayback(win));
}

function bindPalette(win) {
  const addSwatchBtn = win.querySelector(".add-swatch");
  const picker = win.querySelector(".palette-picker");
  const resetBtn = win.querySelector(".reset-palette");
  const saveBtn = win.querySelector(".save-palette");
  const paletteName = win.querySelector(".palette-name");

  addSwatchBtn.addEventListener("click", () => {
    if (!picker.value) return;
    win.pixelStudio.palette.push(picker.value);
    win.pixelStudio.activeColor = picker.value;
    renderPalette(win);
  });

  resetBtn.addEventListener("click", () => {
    win.pixelStudio.palette = [...DEFAULT_COLORS];
    win.pixelStudio.activeColor = DEFAULT_COLORS[0];
    renderPalette(win);
  });

  saveBtn.addEventListener("click", () => {
    const name = paletteName.value.trim() || "Custom palette";
    win.pixelStudio.savedPalette = { name, colors: [...win.pixelStudio.palette] };
    saveBtn.textContent = "Saved";
    setTimeout(() => (saveBtn.textContent = "Save palette"), 900);
  });
}

function bindCanvas(win) {
  const canvas = win.querySelector(".pixel-canvas");
  const { size, scale } = win.pixelStudio;
  const updatePixel = (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / scale);
    const y = Math.floor((e.clientY - rect.top) / scale);
    if (x < 0 || y < 0 || x >= size || y >= size) return;
    const idx = y * size + x;
    const { frames, currentFrame, tool, activeColor } = win.pixelStudio;
    frames[currentFrame][idx] = tool === "erase" ? null : activeColor;
    renderCanvas(win);
    rebuildSpriteSheet(win);
    renderFramesList(win);
  };

  canvas.addEventListener("mousedown", (e) => {
    win.pixelStudio.drawing = true;
    updatePixel(e);
  });
  canvas.addEventListener("mousemove", (e) => {
    if (!win.pixelStudio.drawing) return;
    updatePixel(e);
  });
  window.addEventListener("mouseup", () => {
    win.pixelStudio.drawing = false;
  });
}

export function initPixelStudio(win) {
  const canvas = win.querySelector(".pixel-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const size = 24;
  const scale = Math.floor(canvas.width / size);
  win.pixelStudio = {
    ctx,
    size,
    scale,
    thumbScale: 4,
    sheetScale: 4,
    frames: [createEmptyFrame(size)],
    currentFrame: 0,
    palette: [...DEFAULT_COLORS],
    activeColor: DEFAULT_COLORS[0],
    onionSkin: true,
    tool: "draw",
    drawing: false,
    playbackTimer: null,
    savedPalette: null
  };

  renderPalette(win);
  renderFramesList(win);
  renderCanvas(win);
  rebuildSpriteSheet(win);
  updateFrameIndicator(win);
  bindToolbar(win);
  bindFrameControls(win);
  bindPalette(win);
  bindCanvas(win);
}
