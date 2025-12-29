import { publish, subscribe } from "../eventBus.js";

const CHANNEL_NAME = "oriel-whiteboard";
const STORAGE_KEY = "oriel-whiteboard-state";
const CURSOR_TTL = 4000;

function uid() {
  if (globalThis.crypto?.randomUUID) return crypto.randomUUID();
  return "wb-" + Math.random().toString(16).slice(2, 10);
}

function clamp01(v) {
  if (v < 0) return 0;
  if (v > 1) return 1;
  return v;
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { strokes: [], shapes: [], notes: [] };
    const parsed = JSON.parse(raw);
    return {
      strokes: Array.isArray(parsed.strokes) ? parsed.strokes : [],
      shapes: Array.isArray(parsed.shapes) ? parsed.shapes : [],
      notes: Array.isArray(parsed.notes) ? parsed.notes : []
    };
  } catch (err) {
    console.warn("Failed to parse whiteboard state", err);
    return { strokes: [], shapes: [], notes: [] };
  }
}

function persistState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function getWhiteboardRoot() {
  return `
    <div class="whiteboard-root">
      <div class="whiteboard-toolbar">
        <div class="whiteboard-row">
          <label class="whiteboard-label">Name</label>
          <input class="whiteboard-name" value="Guest" aria-label="Your whiteboard name" />
          <label class="whiteboard-label">Tool</label>
          <div class="whiteboard-tools" role="group" aria-label="Drawing tools">
            <button class="wb-tool active" data-tool="pen">✏️ Pen</button>
            <button class="wb-tool" data-tool="line">/ Line</button>
            <button class="wb-tool" data-tool="rectangle">▭ Rect</button>
            <button class="wb-tool" data-tool="circle">◯ Circle</button>
            <button class="wb-tool" data-tool="note">📝 Note</button>
          </div>
          <label class="whiteboard-label">Color</label>
          <input type="color" class="whiteboard-color" value="#0057ff" aria-label="Stroke color" />
          <label class="whiteboard-label">Size</label>
          <input type="range" class="whiteboard-size" min="2" max="10" value="3" aria-label="Stroke size" />
          <button class="task-btn whiteboard-clear" title="Clear only my local view">Clear</button>
        </div>
        <div class="whiteboard-status" aria-live="polite">Connecting...</div>
      </div>
      <div class="whiteboard-board">
        <div class="whiteboard-layers">
          <canvas class="whiteboard-canvas" aria-label="Collaborative whiteboard"></canvas>
          <div class="whiteboard-notes" aria-live="polite"></div>
          <div class="whiteboard-cursors" aria-hidden="true"></div>
        </div>
      </div>
    </div>
  `;
}

export function initWhiteboard(win) {
  const canvas = win.querySelector(".whiteboard-canvas");
  const board = win.querySelector(".whiteboard-board");
  const notesLayer = win.querySelector(".whiteboard-notes");
  const cursorLayer = win.querySelector(".whiteboard-cursors");
  const nameInput = win.querySelector(".whiteboard-name");
  const colorInput = win.querySelector(".whiteboard-color");
  const sizeInput = win.querySelector(".whiteboard-size");
  const toolButtons = Array.from(win.querySelectorAll(".wb-tool"));
  const statusLabel = win.querySelector(".whiteboard-status");
  const clearBtn = win.querySelector(".whiteboard-clear");

  if (!canvas || !board || !notesLayer || !cursorLayer) return;

  const ctx = canvas.getContext("2d");
  const clientId = uid();
  const cursors = new Map();
  let selectedTool = "pen";
  let drawing = false;
  let currentStroke = null;
  let activeShape = null;
  let pendingNotePlacement = false;
  let cleanupChannel = null;

  const state = loadState();

  function setStatus(message) {
    if (!statusLabel) return;
    statusLabel.textContent = message;
  }

  function resizeCanvas() {
    const rect = board.getBoundingClientRect();
    canvas.width = Math.max(600, Math.floor(rect.width));
    canvas.height = Math.max(400, Math.floor(rect.height));
    redraw();
  }

  function toAbsolute(point) {
    return {
      x: point.x * canvas.width,
      y: point.y * canvas.height
    };
  }

  function toRelative(x, y) {
    const rect = board.getBoundingClientRect();
    return {
      x: clamp01((x - rect.left) / rect.width),
      y: clamp01((y - rect.top) / rect.height)
    };
  }

  function redraw() {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.lineCap = "round";
    state.strokes.forEach((stroke) => {
      if (!stroke?.points?.length) return;
      ctx.strokeStyle = stroke.color || "#000";
      ctx.lineWidth = stroke.size || 2;
      ctx.beginPath();
      stroke.points.forEach((pt, idx) => {
        const { x, y } = toAbsolute(pt);
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    });

    state.shapes.forEach((shape) => {
      if (!shape?.start || !shape?.end) return;
      const start = toAbsolute(shape.start);
      const end = toAbsolute(shape.end);
      ctx.strokeStyle = shape.color || "#000";
      ctx.lineWidth = shape.size || 2;
      ctx.beginPath();
      if (shape.type === "line") {
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
      } else if (shape.type === "rectangle") {
        ctx.strokeRect(
          Math.min(start.x, end.x),
          Math.min(start.y, end.y),
          Math.abs(end.x - start.x),
          Math.abs(end.y - start.y)
        );
      } else if (shape.type === "circle") {
        const radius = Math.hypot(end.x - start.x, end.y - start.y);
        ctx.arc(start.x, start.y, radius, 0, Math.PI * 2);
      }
      ctx.stroke();
    });

    if (activeShape) {
      const start = toAbsolute(activeShape.start);
      const end = toAbsolute(activeShape.end);
      ctx.save();
      ctx.setLineDash([6, 4]);
      ctx.strokeStyle = activeShape.color;
      ctx.lineWidth = activeShape.size;
      ctx.beginPath();
      if (activeShape.type === "line") {
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
      } else if (activeShape.type === "rectangle") {
        ctx.strokeRect(
          Math.min(start.x, end.x),
          Math.min(start.y, end.y),
          Math.abs(end.x - start.x),
          Math.abs(end.y - start.y)
        );
      } else if (activeShape.type === "circle") {
        const radius = Math.hypot(end.x - start.x, end.y - start.y);
        ctx.arc(start.x, start.y, radius, 0, Math.PI * 2);
      }
      ctx.stroke();
      ctx.restore();
    }
  }

  function renderNotes() {
    notesLayer.innerHTML = "";
    state.notes.forEach((note) => {
      const noteEl = document.createElement("div");
      noteEl.className = "whiteboard-note";
      noteEl.dataset.id = note.id;
      noteEl.style.background = note.color || "#fff3b0";
      const header = document.createElement("div");
      header.className = "whiteboard-note-header";
      header.textContent = note.author || "Note";
      const textarea = document.createElement("textarea");
      textarea.className = "whiteboard-note-body";
      textarea.value = note.text || "";
      const { x, y } = toAbsolute(note);
      noteEl.style.left = `${x}px`;
      noteEl.style.top = `${y}px`;

      let dragging = false;
      let offset = { x: 0, y: 0 };

      header.addEventListener("pointerdown", (e) => {
        dragging = true;
        const rect = noteEl.getBoundingClientRect();
        offset = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        noteEl.setPointerCapture(e.pointerId);
      });

      header.addEventListener("pointerup", (e) => {
        dragging = false;
        noteEl.releasePointerCapture(e.pointerId);
      });

      header.addEventListener("pointermove", (e) => {
        if (!dragging) return;
        const pos = toRelative(e.clientX - offset.x + header.clientWidth / 2, e.clientY - offset.y + header.clientHeight / 2);
        note.x = pos.x;
        note.y = pos.y;
        persistState(state);
        emit({ type: "note:update", note });
        renderNotes();
      });

      textarea.addEventListener("input", () => {
        note.text = textarea.value;
        persistState(state);
        emit({ type: "note:update", note });
      });

      notesLayer.appendChild(noteEl);
      noteEl.appendChild(header);
      noteEl.appendChild(textarea);
    });
  }

  function emit(payload) {
    channel?.postMessage(payload);
    publish("whiteboard:message", payload);
  }

  function handleMessage(message) {
    if (!message || message.from === clientId) return;
    if (message.type === "cursor") {
      updateCursor(message);
      return;
    }
    if (message.type === "state-request") {
      emit({ type: "state", state, from: clientId });
      return;
    }
    if (message.type === "state") {
      mergeState(message.state);
      redraw();
      renderNotes();
      updateStatus();
      return;
    }
    if (message.type === "stroke") {
      if (state.strokes.some((s) => s.id === message.stroke.id)) return;
      state.strokes.push(message.stroke);
      persistState(state);
      redraw();
      return;
    }
    if (message.type === "shape") {
      if (state.shapes.some((s) => s.id === message.shape.id)) return;
      state.shapes.push(message.shape);
      persistState(state);
      redraw();
      return;
    }
    if (message.type === "note:update") {
      applyNote(message.note);
      renderNotes();
      persistState(state);
      return;
    }
  }

  const channel = "BroadcastChannel" in window ? new BroadcastChannel(CHANNEL_NAME) : null;
  if (channel) {
    const handler = (event) => handleMessage(event.data);
    channel.addEventListener("message", handler);
    cleanupChannel = () => channel.removeEventListener("message", handler);
  }
  const unsubscribe = subscribe("whiteboard:message", handleMessage);

  function mergeState(remoteState) {
    if (!remoteState) return;
    const seenStrokes = new Set(state.strokes.map((s) => s.id));
    const seenShapes = new Set(state.shapes.map((s) => s.id));
    const seenNotes = new Set(state.notes.map((n) => n.id));

    remoteState.strokes?.forEach((s) => {
      if (!seenStrokes.has(s.id)) state.strokes.push(s);
    });
    remoteState.shapes?.forEach((s) => {
      if (!seenShapes.has(s.id)) state.shapes.push(s);
    });
    remoteState.notes?.forEach((n) => {
      if (!seenNotes.has(n.id)) state.notes.push(n);
    });
    persistState(state);
  }

  function applyNote(note) {
    if (!note?.id) return;
    const idx = state.notes.findIndex((n) => n.id === note.id);
    if (idx === -1) state.notes.push(note);
    else state.notes[idx] = note;
  }

  function updateCursor(payload) {
    if (!payload?.position) return;
    const { id, position, color, name } = payload;
    if (!id || id === clientId) return;

    let cursor = cursors.get(id);
    if (!cursor) {
      cursor = document.createElement("div");
      cursor.className = "whiteboard-cursor";
      cursor.innerHTML = `<span class="cursor-dot"></span><span class="cursor-label"></span>`;
      cursorLayer.appendChild(cursor);
      cursors.set(id, cursor);
    }
    const abs = toAbsolute(position);
    cursor.style.left = `${abs.x}px`;
    cursor.style.top = `${abs.y}px`;
    const dot = cursor.querySelector(".cursor-dot");
    const label = cursor.querySelector(".cursor-label");
    if (dot) dot.style.background = color || "#000";
    if (label) label.textContent = name || "Guest";
    cursor.dataset.lastSeen = Date.now();
  }

  function broadcastCursor(pos) {
    emit({
      type: "cursor",
      from: clientId,
      id: clientId,
      position: pos,
      color: colorInput.value,
      name: nameInput.value || "Guest"
    });
  }

  function updateStatus() {
    const peerCount = new Set(
      Array.from(cursors.keys()).concat([clientId])
    ).size;
    setStatus(`Connected peers: ${peerCount}`);
  }

  function cleanupCursors() {
    const now = Date.now();
    Array.from(cursors.entries()).forEach(([id, el]) => {
      const lastSeen = Number(el.dataset.lastSeen || 0);
      if (now - lastSeen > CURSOR_TTL) {
        cursors.delete(id);
        el.remove();
      }
    });
    updateStatus();
  }

  function finalizeStroke() {
    if (currentStroke && currentStroke.points.length > 1) {
      state.strokes.push(currentStroke);
      persistState(state);
      emit({ type: "stroke", stroke: currentStroke, from: clientId });
    }
    currentStroke = null;
  }

  function finalizeShape() {
    if (activeShape && activeShape.start && activeShape.end) {
      state.shapes.push(activeShape);
      persistState(state);
      emit({ type: "shape", shape: activeShape, from: clientId });
    }
    activeShape = null;
    redraw();
  }

  function handlePointerDown(e) {
    if (pendingNotePlacement) {
      const pos = toRelative(e.clientX, e.clientY);
      const note = {
        id: uid(),
        x: pos.x,
        y: pos.y,
        text: "",
        color: "#fff7c2",
        author: nameInput.value || "Guest"
      };
      state.notes.push(note);
      persistState(state);
      emit({ type: "note:update", note, from: clientId });
      renderNotes();
      pendingNotePlacement = false;
      selectTool("pen");
      return;
    }

    const pos = toRelative(e.clientX, e.clientY);
    if (selectedTool === "pen") {
      drawing = true;
      currentStroke = {
        id: uid(),
        points: [pos],
        color: colorInput.value,
        size: Number(sizeInput.value) || 2,
        author: nameInput.value || "Guest"
      };
    } else if (["line", "rectangle", "circle"].includes(selectedTool)) {
      drawing = true;
      activeShape = {
        id: uid(),
        type: selectedTool,
        start: pos,
        end: pos,
        color: colorInput.value,
        size: Number(sizeInput.value) || 2,
        author: nameInput.value || "Guest"
      };
    }
  }

  function handlePointerMove(e) {
    const pos = toRelative(e.clientX, e.clientY);
    broadcastCursor(pos);
    if (!drawing) return;
    if (selectedTool === "pen" && currentStroke) {
      currentStroke.points.push(pos);
      redraw();
      ctx.save();
      ctx.strokeStyle = currentStroke.color;
      ctx.lineWidth = currentStroke.size;
      ctx.beginPath();
      currentStroke.points.forEach((pt, idx) => {
        const { x, y } = toAbsolute(pt);
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
      ctx.restore();
    } else if (activeShape) {
      activeShape.end = pos;
      redraw();
    }
  }

  function handlePointerUp() {
    if (!drawing) return;
    drawing = false;
    if (selectedTool === "pen") finalizeStroke();
    else finalizeShape();
  }

  function selectTool(tool) {
    selectedTool = tool;
    toolButtons.forEach((btn) =>
      btn.classList.toggle("active", btn.dataset.tool === tool)
    );
    pendingNotePlacement = tool === "note";
  }

  toolButtons.forEach((btn) => {
    btn.addEventListener("click", () => selectTool(btn.dataset.tool));
  });

  clearBtn?.addEventListener("click", () => {
    state.strokes = [];
    state.shapes = [];
    persistState(state);
    redraw();
  });

  canvas.addEventListener("pointerdown", handlePointerDown);
  canvas.addEventListener("pointermove", handlePointerMove);
  canvas.addEventListener("pointerup", handlePointerUp);
  canvas.addEventListener("pointerleave", () => {
    if (drawing) handlePointerUp();
  });

  board.addEventListener("pointermove", handlePointerMove);
  board.addEventListener("pointerdown", (e) => {
    if (e.target === notesLayer && pendingNotePlacement) handlePointerDown(e);
  });

  window.addEventListener("resize", resizeCanvas);

  const cursorInterval = setInterval(cleanupCursors, 1500);

  resizeCanvas();
  redraw();
  renderNotes();
  updateStatus();

  emit({ type: "state-request", from: clientId });

  win.whiteboardCleanup = () => {
    cleanupChannel?.();
    unsubscribe();
    clearInterval(cursorInterval);
    window.removeEventListener("resize", resizeCanvas);
    canvas.removeEventListener("pointerdown", handlePointerDown);
    canvas.removeEventListener("pointermove", handlePointerMove);
    canvas.removeEventListener("pointerup", handlePointerUp);
    board.removeEventListener("pointermove", handlePointerMove);
  };
}
