import { BaseApp } from "./base/BaseApp.js";
const TOOL_NAMES = {
  marquee: "Marquee",
  lasso: "Lasso",
  wand: "Magic Wand",
  crop: "Crop",
  move: "Move",
  brush: "Paintbrush",
  pencil: "Pencil",
  line: "Line",
  rect: "Rectangle",
  circle: "Ellipse",
  fill: "Paint Bucket",
  picker: "Eyedropper",
  eraser: "Eraser",
  zoom: "Zoom"
};

function getPhotoshopContent() {
  return `
        <div class="ps-layout ps-classic" role="application" aria-label="Adobe Photoshop 3.0 workspace">
          <div class="ps-menu-bar" aria-label="Photoshop menu bar">
            <span>File</span><span>Edit</span><span>Mode</span><span>Image</span><span>Select</span><span>Filter</span><span>View</span><span>Window</span><span>Help</span>
          </div>
          <div class="ps-options-bar">
            <span class="ps-brand">Adobe Photoshop 3.0</span>
            <span>Tool: <strong class="ps-tool-label">Paintbrush</strong></span>
            <span>Brush: <strong class="ps-size-label">8 px</strong></span>
            <span>Mode: Normal</span>
            <span>Opacity: 100%</span>
          </div>
          <div class="ps-body">
            <aside class="ps-toolbar" aria-label="Tools">
              <button class="ps-tool active" data-tool="marquee" title="Marquee">▧</button>
              <button class="ps-tool" data-tool="move" title="Move">✥</button>
              <button class="ps-tool" data-tool="lasso" title="Lasso">⌁</button>
              <button class="ps-tool" data-tool="wand" title="Magic Wand">✦</button>
              <button class="ps-tool" data-tool="crop" title="Crop">⌗</button>
              <button class="ps-tool" data-tool="picker" title="Eyedropper">⌕</button>
              <button class="ps-tool" data-tool="brush" title="Paintbrush">✎</button>
              <button class="ps-tool" data-tool="pencil" title="Pencil">▮</button>
              <button class="ps-tool" data-tool="eraser" title="Eraser">▱</button>
              <button class="ps-tool" data-tool="fill" title="Paint Bucket">▰</button>
              <button class="ps-tool" data-tool="line" title="Line">╱</button>
              <button class="ps-tool" data-tool="rect" title="Rectangle">□</button>
              <button class="ps-tool" data-tool="circle" title="Ellipse">○</button>
              <button class="ps-tool" data-tool="zoom" title="Zoom">⌕</button>
              <div class="ps-color-wells" aria-label="Foreground and background colors">
                <input type="color" class="ps-color-primary" title="Foreground" value="#000000" />
                <input type="color" class="ps-color-secondary" title="Background" value="#ffffff" />
              </div>
            </aside>
            <main class="ps-canvas-wrap">
              <div class="ps-document-window">
                <div class="ps-document-title">Untitled-1 @ 100% (RGB)</div>
                <canvas class="ps-canvas" width="640" height="420"></canvas>
              </div>
            </main>
            <aside class="ps-panel" aria-label="Palettes">
              <section class="ps-panel-group">
                <div class="ps-palette-title">Navigator / Info</div>
                <div class="ps-info-grid">
                  <span>W:</span><strong>640 px</strong><span>H:</span><strong>420 px</strong>
                  <span>X:</span><strong class="ps-x-label">0</strong><span>Y:</span><strong class="ps-y-label">0</strong>
                </div>
              </section>
              <section class="ps-panel-group">
                <div class="ps-palette-title">Brushes</div>
                <label class="ps-control-row">Size <input type="range" min="1" max="50" value="8" class="ps-size-slider" /></label>
                <div class="ps-brush-preview"><span></span></div>
              </section>
              <section class="ps-panel-group">
                <div class="ps-palette-title">Color / Swatches</div>
                <div class="ps-swatches"></div>
              </section>
              <section class="ps-panel-group">
                <div class="ps-palette-title">Layers / Channels / Paths</div>
                <div class="ps-tabs"><span class="active">Layers</span><span>Channels</span><span>Paths</span></div>
                <div class="ps-layer-row"><span class="ps-eye">◉</span><span>Background</span><span>100%</span></div>
              </section>
              <section class="ps-panel-group">
                <div class="ps-palette-title">Actions</div>
                <div class="ps-filter-buttons">
                  <button class="task-btn" id="ps-new">New</button>
                  <button class="task-btn" id="ps-open">Open…</button>
                  <button class="task-btn" id="ps-export">Save As…</button>
                  <button class="task-btn" data-filter="invert">Invert</button>
                  <button class="task-btn" data-filter="grayscale">Grayscale</button>
                  <button class="task-btn" data-filter="scanlines">Halftone</button>
                </div>
                <input type="file" accept="image/*" class="ps-file-input" style="display:none" />
              </section>
            </aside>
          </div>
          <div class="ps-status">Ready. Paintbrush | Size: 8 px | Foreground: #000000 | Background: #ffffff</div>
        </div>
      `;
}

function initPhotoshop(w, _initData = null, _windowManager = null, _services = {}, app = null) {
  const listen = app?.listen?.bind(app) || ((target, type, listener) => target?.addEventListener?.(type, listener));
  const canvas = w.querySelector(".ps-canvas");
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const swatchContainer = w.querySelector(".ps-swatches");
  const palette = [
    "#000000", "#808080", "#c0c0c0", "#ffffff", "#800000",
    "#ff0000", "#808000", "#ffff00", "#008000", "#00ff00",
    "#008080", "#00ffff", "#000080", "#0000ff", "#800080",
    "#ff00ff", "#7f3f00", "#ff7f00", "#bfbf7f", "#007fff"
  ];
  palette.forEach((c) => {
    const sw = document.createElement("button");
    sw.type = "button";
    sw.className = "ps-swatch";
    sw.title = c;
    sw.style.background = c;
    listen(sw, "click", () => {
      w.querySelector(".ps-color-primary").value = c;
      w.ps.primary = c;
      updatePsStatus(w);
    });
    swatchContainer.appendChild(sw);
  });

  w.ps = {
    canvas,
    ctx,
    tool: "brush",
    primary: w.querySelector(".ps-color-primary").value,
    secondary: w.querySelector(".ps-color-secondary").value,
    size: parseInt(w.querySelector(".ps-size-slider").value, 10),
    drawing: false,
    startX: 0,
    startY: 0
  };

  w.querySelectorAll(".ps-tool").forEach((btn) => {
    listen(btn, "click", () => setPsTool(btn, btn.dataset.tool));
  });
  setPsTool(w.querySelector('.ps-tool[data-tool="brush"]'), "brush");

  const sizeSlider = w.querySelector(".ps-size-slider");
  listen(sizeSlider, "input", (e) => {
    w.ps.size = parseInt(e.target.value, 10) || 1;
    updatePsStatus(w);
  });

  listen(w.querySelector(".ps-color-primary"), "input", (e) => {
    w.ps.primary = e.target.value;
    updatePsStatus(w);
  });
  listen(w.querySelector(".ps-color-secondary"), "input", (e) => {
    w.ps.secondary = e.target.value;
    updatePsStatus(w);
  });

  listen(w.querySelector("#ps-new"), "click", () => psNewDocument(w.querySelector("#ps-new")));
  listen(w.querySelector("#ps-open"), "click", () => psTriggerOpen(w.querySelector("#ps-open")));
  listen(w.querySelector("#ps-export"), "click", () => psExport(w.querySelector("#ps-export")));
  w.querySelectorAll("[data-filter]").forEach((btn) => {
    listen(btn, "click", () => psApplyFilter(btn, btn.dataset.filter));
  });

  const fileInput = w.querySelector(".ps-file-input");
  listen(fileInput, "change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
        const wScaled = img.width * scale;
        const hScaled = img.height * scale;
        const x = (canvas.width - wScaled) / 2;
        const y = (canvas.height - hScaled) / 2;
        ctx.drawImage(img, x, y, wScaled, hScaled);
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });

  const getPos = (evt) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return { x: (evt.clientX - rect.left) * scaleX, y: (evt.clientY - rect.top) * scaleY };
  };

  const stopDrawing = () => {
    if (w.ps) w.ps.drawing = false;
  };

  listen(canvas, "mousedown", (e) => {
    const { x, y } = getPos(e);
    if (["fill", "marquee", "lasso", "wand", "crop", "move", "zoom"].includes(w.ps.tool)) {
      if (w.ps.tool === "fill") {
        ctx.fillStyle = w.ps.primary;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      return;
    }
    if (w.ps.tool === "picker") {
      const pixel = ctx.getImageData(x, y, 1, 1).data;
      const picked = `#${[pixel[0], pixel[1], pixel[2]]
        .map((v) => v.toString(16).padStart(2, "0"))
        .join("")}`;
      w.ps.primary = picked;
      w.querySelector(".ps-color-primary").value = picked;
      updatePsStatus(w);
      return;
    }
    w.ps.drawing = true;
    w.ps.startX = x;
    w.ps.startY = y;
    if (["brush", "pencil", "eraser"].includes(w.ps.tool)) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  });

  listen(canvas, "mousemove", (e) => {
    const { x, y } = getPos(e);
    w.querySelector(".ps-x-label").textContent = Math.round(x);
    w.querySelector(".ps-y-label").textContent = Math.round(y);
    if (!w.ps.drawing) return;
    if (["brush", "pencil", "eraser"].includes(w.ps.tool)) {
      ctx.lineWidth = w.ps.tool === "pencil" ? 1 : w.ps.size;
      ctx.lineCap = w.ps.tool === "pencil" ? "square" : "round";
      ctx.strokeStyle = w.ps.tool === "eraser" ? w.ps.secondary : w.ps.primary;
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  });

  listen(canvas, "mouseup", (e) => {
    if (!w.ps.drawing) return;
    const { x, y } = getPos(e);
    ctx.strokeStyle = w.ps.primary;
    ctx.lineWidth = Math.max(1, Math.floor(w.ps.size / 2));
    if (w.ps.tool === "rect") {
      ctx.strokeRect(w.ps.startX + 0.5, w.ps.startY + 0.5, x - w.ps.startX, y - w.ps.startY);
    } else if (w.ps.tool === "circle") {
      ctx.beginPath();
      ctx.ellipse(
        (w.ps.startX + x) / 2,
        (w.ps.startY + y) / 2,
        Math.abs(x - w.ps.startX) / 2,
        Math.abs(y - w.ps.startY) / 2,
        0,
        0,
        Math.PI * 2
      );
      ctx.stroke();
    } else if (w.ps.tool === "line") {
      ctx.beginPath();
      ctx.moveTo(w.ps.startX, w.ps.startY);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
    stopDrawing();
  });

  listen(canvas, "mouseleave", stopDrawing);
  listen(window, "mouseup", stopDrawing);

  updatePsStatus(w);
}

function updatePsStatus(w) {
  const toolLabel = w.querySelector(".ps-tool-label");
  const sizeLabel = w.querySelector(".ps-size-label");
  const status = w.querySelector(".ps-status");
  const preview = w.querySelector(".ps-brush-preview span");
  const toolName = TOOL_NAMES[w.ps.tool] || w.ps.tool;
  if (toolLabel) toolLabel.textContent = toolName;
  if (sizeLabel) sizeLabel.textContent = `${w.ps.size} px`;
  if (status) {
    status.textContent = `Ready. ${toolName} | Size: ${w.ps.size} px | Foreground: ${w.ps.primary} | Background: ${w.ps.secondary}`;
  }
  if (preview) {
    const size = Math.max(2, Math.min(30, w.ps.size));
    preview.style.width = `${size}px`;
    preview.style.height = `${size}px`;
    preview.style.background = w.ps.primary;
  }
}

function setPsTool(btn, tool) {
  const w = btn.closest(".window");
  w.ps.tool = tool;
  w.querySelectorAll(".ps-tool").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  updatePsStatus(w);
}

function psApplyFilter(btn, type) {
  const w = btn.closest(".window");
  const { ctx, canvas } = w.ps;
  const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = img.data;
  for (let i = 0; i < data.length; i += 4) {
    let [r, g, b, a] = [data[i], data[i + 1], data[i + 2], data[i + 3]];
    if (type === "grayscale") {
      const avg = (r + g + b) / 3;
      r = g = b = avg;
    } else if (type === "invert") {
      r = 255 - r;
      g = 255 - g;
      b = 255 - b;
    } else if (type === "scanlines") {
      const y = Math.floor(i / 4 / canvas.width);
      if (y % 4 < 2) {
        r *= 0.72;
        g *= 0.72;
        b *= 0.72;
      }
    } else if (type === "contrast") {
      const factor = 1.2;
      r = Math.min(255, (r - 128) * factor + 128);
      g = Math.min(255, (g - 128) * factor + 128);
      b = Math.min(255, (b - 128) * factor + 128);
    } else if (type === "bright") {
      r = Math.min(255, r + 18);
      g = Math.min(255, g + 18);
      b = Math.min(255, b + 18);
    } else if (type === "sharpen") {
      const boost = (v) => Math.min(255, v * 1.08 + 10);
      r = boost(r);
      g = boost(g);
      b = boost(b);
    } else if (type === "fade") {
      r = r * 0.9 + 12;
      g = g * 0.9 + 8;
      b = b * 0.8 + 18;
    }
    data[i] = r;
    data[i + 1] = g;
    data[i + 2] = b;
    data[i + 3] = a;
  }
  ctx.putImageData(img, 0, 0);
}

function psFillCanvas(btn) {
  const w = btn.closest(".window");
  const { ctx, canvas, primary } = w.ps;
  ctx.fillStyle = primary;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function psTriggerOpen(btn) {
  const w = btn.closest(".window");
  w.querySelector(".ps-file-input").click();
}

function psNewDocument(btn) {
  const w = btn.closest(".window");
  const { ctx, canvas } = w.ps;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function psExport(btn) {
  const w = btn.closest(".window");
  const { canvas } = w.ps;
  const url = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.href = url;
  link.download = "oriel-photoshop-3.png";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export {
  initPhotoshop,
  setPsTool,
  psApplyFilter,
  psFillCanvas,
  psTriggerOpen,
  psNewDocument,
  psExport,
  getPhotoshopContent
};

export class PhotoshopApp extends BaseApp {
  getWindowContent() {
    return getPhotoshopContent(this.initData, this.services);
  }

  mount() {
    return initPhotoshop(this.windowEl, this.initData, this.services.windowManager, this.services, this);
  }
}
