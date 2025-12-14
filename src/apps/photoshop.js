function initPhotoshop(w) {
  const canvas = w.querySelector(".ps-canvas");
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#fdfdfd";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const swatchContainer = w.querySelector(".ps-swatches");
  const palette = [
    "#000000",
    "#ffffff",
    "#1d7be3",
    "#f7c948",
    "#e55381",
    "#7dd87d",
    "#8b5cf6",
    "#ff7f11",
    "#6dd3e7",
    "#2c3e50"
  ];
  palette.forEach((c) => {
    const sw = document.createElement("div");
    sw.className = "ps-swatch";
    sw.style.background = c;
    sw.onclick = () => {
      w.querySelector(".ps-color-primary").value = c;
      w.ps.primary = c;
      updatePsStatus(w);
    };
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

  const sizeSlider = w.querySelector(".ps-size-slider");
  sizeSlider.addEventListener("input", (e) => {
    w.ps.size = parseInt(e.target.value, 10) || 1;
    updatePsStatus(w);
  });

  w.querySelector(".ps-color-primary").addEventListener("input", (e) => {
    w.ps.primary = e.target.value;
  });
  w.querySelector(".ps-color-secondary").addEventListener("input", (e) => {
    w.ps.secondary = e.target.value;
  });

  const fileInput = w.querySelector(".ps-file-input");
  fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#fdfdfd";
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
    return { x: evt.clientX - rect.left, y: evt.clientY - rect.top };
  };

  const stopDrawing = () => {
    if (w.ps) w.ps.drawing = false;
  };

  canvas.addEventListener("mousedown", (e) => {
    const { x, y } = getPos(e);
    if (w.ps.tool === "fill") {
      ctx.fillStyle = w.ps.primary;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
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
    if (w.ps.tool === "brush" || w.ps.tool === "eraser") {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  });

  canvas.addEventListener("mousemove", (e) => {
    if (!w.ps.drawing) return;
    const { x, y } = getPos(e);
    if (w.ps.tool === "brush" || w.ps.tool === "eraser") {
      ctx.lineWidth = w.ps.size;
      ctx.lineCap = "round";
      ctx.strokeStyle = w.ps.tool === "eraser" ? w.ps.secondary : w.ps.primary;
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  });

  canvas.addEventListener("mouseup", (e) => {
    if (!w.ps.drawing) return;
    const { x, y } = getPos(e);
    if (w.ps.tool === "rect") {
      const width = x - w.ps.startX;
      const height = y - w.ps.startY;
      ctx.fillStyle = `${w.ps.primary}cc`;
      ctx.strokeStyle = w.ps.primary;
      ctx.lineWidth = Math.max(1, Math.floor(w.ps.size / 2));
      ctx.fillRect(w.ps.startX, w.ps.startY, width, height);
      ctx.strokeRect(w.ps.startX + 0.5, w.ps.startY + 0.5, width, height);
    }
    stopDrawing();
  });

  canvas.addEventListener("mouseleave", stopDrawing);
  window.addEventListener("mouseup", stopDrawing);

  updatePsStatus(w);
}

function updatePsStatus(w) {
  const toolLabel = w.querySelector(".ps-tool-label");
  const sizeLabel = w.querySelector(".ps-size-label");
  if (toolLabel) toolLabel.textContent = w.ps.tool[0].toUpperCase() + w.ps.tool.slice(1);
  if (sizeLabel) sizeLabel.textContent = `${w.ps.size}px`;
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
  ctx.fillStyle = "#fdfdfd";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function psExport(btn) {
  const w = btn.closest(".window");
  const { canvas } = w.ps;
  const url = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.href = url;
  link.download = "oriel-photoshop.png";
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
  psExport
};
