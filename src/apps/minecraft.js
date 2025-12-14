const WORLD_WIDTH = 18;
const WORLD_HEIGHT = 12;
const EMPTY = "air";

const BLOCK_TYPES = [
  { id: "grass", name: "Grass", color: "#6fa74f", accent: "#4d7a37" },
  { id: "dirt", name: "Dirt", color: "#9b7653", accent: "#7b5c3d" },
  { id: "stone", name: "Stone", color: "#9e9e9e", accent: "#6f6f6f" },
  { id: "sand", name: "Sand", color: "#e9d8a6", accent: "#d5c28b" },
  { id: "water", name: "Water", color: "#4c8fdc", accent: "#2f68a8" },
  { id: "planks", name: "Planks", color: "#b88c5b", accent: "#8a6941" },
  { id: "brick", name: "Brick", color: "#b0574c", accent: "#7d3d35" }
];

const BLOCK_LOOKUP = Object.fromEntries(BLOCK_TYPES.map((b) => [b.id, b]));

function paintCell(el, type) {
  el.dataset.block = type;
  const block = BLOCK_LOOKUP[type];
  if (!block) {
    el.style.background = "linear-gradient(#bfe3ff, #e8f3ff)";
    el.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.6)";
    return;
  }
  const gradient = `linear-gradient(135deg, ${block.color}, ${block.accent})`;
  el.style.background = gradient;
  el.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(0,0,0,0.25)";
}

export function initMinecraft(win) {
  const grid = win.querySelector(".minecraft-grid");
  const palette = win.querySelector(".minecraft-block");
  const status = win.querySelector(".minecraft-status");
  const fillBtn = win.querySelector(".minecraft-fill");
  const clearBtn = win.querySelector(".minecraft-clear");

  if (!grid || !palette) return;

  grid.style.setProperty("--cols", WORLD_WIDTH);
  grid.style.setProperty("--rows", WORLD_HEIGHT);
  grid.addEventListener("contextmenu", (e) => e.preventDefault());

  BLOCK_TYPES.forEach((block) => {
    const opt = document.createElement("option");
    opt.value = block.id;
    opt.textContent = block.name;
    palette.appendChild(opt);
  });
  palette.value = "grass";

  const world = Array.from({ length: WORLD_HEIGHT }, () => Array(WORLD_WIDTH).fill(EMPTY));
  const cells = [];
  let dragging = false;
  let dragMode = "place";

  function updateStatus(message) {
    if (status) status.textContent = message;
  }

  function setBlock(x, y, type, showStatus = true) {
    if (x < 0 || y < 0 || x >= WORLD_WIDTH || y >= WORLD_HEIGHT) return;
    world[y][x] = type;
    paintCell(cells[y][x], type);
    if (showStatus) updateStatus(type === EMPTY ? "Removed block." : `Placed ${BLOCK_LOOKUP[type]?.name || type}.`);
  }

  function generateTerrain() {
    const waterRow = Math.floor(WORLD_HEIGHT * 0.7);
    for (let y = 0; y < WORLD_HEIGHT; y++) {
      for (let x = 0; x < WORLD_WIDTH; x++) {
        const height = Math.floor(WORLD_HEIGHT * 0.45 + Math.sin(x / 2) * 1.5 + Math.random() * 2);
        const surfaceRow = Math.min(Math.max(height, 2), WORLD_HEIGHT - 1);
        if (y < surfaceRow) {
          setBlock(x, y, y >= waterRow ? "water" : EMPTY, false);
        } else {
          const depth = y - surfaceRow;
          if (depth === 0) setBlock(x, y, Math.random() > 0.8 ? "sand" : "grass", false);
          else if (depth < 3) setBlock(x, y, "dirt", false);
          else setBlock(x, y, "stone", false);
        }
      }
    }
    updateStatus("Generated a fresh landscape. Try building on it!");
  }

  function clearWorld() {
    for (let y = 0; y < WORLD_HEIGHT; y++) {
      for (let x = 0; x < WORLD_WIDTH; x++) {
        setBlock(x, y, EMPTY, false);
      }
    }
    updateStatus("Cleared the playfield.");
  }

  for (let y = 0; y < WORLD_HEIGHT; y++) {
    const row = [];
    for (let x = 0; x < WORLD_WIDTH; x++) {
      const cell = document.createElement("div");
      cell.className = "minecraft-cell";
      cell.dataset.x = String(x);
      cell.dataset.y = String(y);
      paintCell(cell, EMPTY);

      cell.onmousedown = (e) => {
        e.preventDefault();
        dragging = true;
        dragMode = e.button === 2 ? "erase" : "place";
        if (dragMode === "erase") setBlock(x, y, EMPTY);
        else setBlock(x, y, palette.value);
      };

      cell.onmouseenter = (e) => {
        if (!dragging || e.buttons === 0) return;
        if (dragMode === "erase") setBlock(x, y, EMPTY);
        else setBlock(x, y, palette.value);
      };

      row.push(cell);
      grid.appendChild(cell);
    }
    cells.push(row);
  }

  win.addEventListener("mouseup", () => {
    dragging = false;
  });

  palette.addEventListener("change", () => {
    updateStatus(`Selected ${BLOCK_LOOKUP[palette.value]?.name || palette.value}.`);
  });

  if (fillBtn) fillBtn.onclick = generateTerrain;
  if (clearBtn) clearBtn.onclick = clearWorld;

  generateTerrain();
}
