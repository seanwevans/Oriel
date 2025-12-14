export function getLineRiderContent() {
  return `
                <div class="linerider-layout">
                    <div class="linerider-toolbar">
                        <div class="linerider-group">
                            <button class="task-btn linerider-mode active" data-mode="draw" title="Draw segments">Draw</button>
                            <button class="task-btn linerider-mode" data-mode="erase" title="Erase segments">Erase</button>
                        </div>
                        <div class="linerider-group">
                            <button class="task-btn linerider-play">Ride</button>
                            <button class="task-btn linerider-reset">Reset Sled</button>
                            <button class="task-btn linerider-clear">Clear Lines</button>
                        </div>
                    </div>
                    <canvas class="linerider-canvas" width="560" height="360"></canvas>
                    <div class="linerider-status">Draw ramps with your mouse, then hit Ride!</div>
                </div>
            `;
}

export function initLineRider(win) {
  const canvas = win.querySelector(".linerider-canvas");
  const statusEl = win.querySelector(".linerider-status");
  const modeButtons = Array.from(win.querySelectorAll(".linerider-mode"));
  const playBtn = win.querySelector(".linerider-play");
  const resetBtn = win.querySelector(".linerider-reset");
  const clearBtn = win.querySelector(".linerider-clear");

  if (!canvas || !statusEl) return;

  const ctx = canvas.getContext("2d");
  const segments = [];
  let mode = "draw";
  let drawing = false;
  let lastPoint = null;
  let sled = null;
  let raf = 0;
  let lastTs = 0;

  const setMode = (m) => {
    mode = m;
    modeButtons.forEach((btn) =>
      btn.classList.toggle("active", btn.dataset.mode === m)
    );
    canvas.style.cursor = m === "draw" ? "crosshair" : "pointer";
  };

  const toCanvas = (evt) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((evt.clientX - rect.left) / rect.width) * canvas.width,
      y: ((evt.clientY - rect.top) / rect.height) * canvas.height
    };
  };

  const resetSled = () => {
    sled = { x: 40, y: 40, vx: 120, vy: 0 };
    statusEl.textContent = "Sled reset. Draw a run and hit Ride.";
    drawScene();
  };

  const stopRide = (message = null) => {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    if (message) statusEl.textContent = message;
  };

  const drawScene = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#f1f6ff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#0b64c0";
    ctx.beginPath();
    segments.forEach((s) => {
      ctx.moveTo(s.x1, s.y1);
      ctx.lineTo(s.x2, s.y2);
    });
    ctx.stroke();

    if (sled) {
      ctx.fillStyle = "#202020";
      ctx.beginPath();
      ctx.arc(sled.x, sled.y, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#ffcc00";
      ctx.beginPath();
      ctx.moveTo(sled.x - 10, sled.y + 8);
      ctx.lineTo(sled.x + 12, sled.y + 8);
      ctx.stroke();
    }
  };

  const eraseSegment = (p) => {
    const maxDist = 8;
    for (let i = 0; i < segments.length; i++) {
      const s = segments[i];
      const dx = s.x2 - s.x1;
      const dy = s.y2 - s.y1;
      const lenSq = dx * dx + dy * dy || 1;
      const t = Math.max(
        0,
        Math.min(1, ((p.x - s.x1) * dx + (p.y - s.y1) * dy) / lenSq)
      );
      const projX = s.x1 + dx * t;
      const projY = s.y1 + dy * t;
      const dist = Math.hypot(p.x - projX, p.y - projY);
      if (dist <= maxDist) {
        segments.splice(i, 1);
        statusEl.textContent = "Erased a segment.";
        drawScene();
        return;
      }
    }
    statusEl.textContent = "No nearby segment to erase.";
  };

  const onPointerDown = (e) => {
    const pos = toCanvas(e);
    if (mode === "draw") {
      drawing = true;
      lastPoint = pos;
    } else {
      eraseSegment(pos);
    }
  };

  const onPointerMove = (e) => {
    if (!drawing || mode !== "draw") return;
    const pos = toCanvas(e);
    segments.push({ x1: lastPoint.x, y1: lastPoint.y, x2: pos.x, y2: pos.y });
    lastPoint = pos;
    drawScene();
  };

  const endDraw = () => {
    drawing = false;
    lastPoint = null;
  };

  const intersectSegment = (p1, p2, s) => {
    const p3 = { x: s.x1, y: s.y1 };
    const p4 = { x: s.x2, y: s.y2 };
    const denom =
      (p1.x - p2.x) * (p3.y - p4.y) - (p1.y - p2.y) * (p3.x - p4.x);
    if (denom === 0) return null;
    const t =
      ((p1.x - p3.x) * (p3.y - p4.y) - (p1.y - p3.y) * (p3.x - p4.x)) /
      denom;
    const u =
      -((p1.x - p2.x) * (p1.y - p3.y) - (p1.y - p2.y) * (p1.x - p3.x)) /
      denom;
    if (t < 0 || t > 1 || u < 0 || u > 1) return null;
    return {
      x: p1.x + t * (p2.x - p1.x),
      y: p1.y + t * (p2.y - p1.y),
      t,
      seg: s
    };
  };

  const findCollision = (p1, p2) => {
    let best = null;
    segments.forEach((s) => {
      const hit = intersectSegment(p1, p2, s);
      if (!hit) return;
      if (!best || hit.t < best.t) best = hit;
    });
    return best;
  };

  const step = (ts) => {
    const dt = lastTs ? Math.min((ts - lastTs) / 1000, 0.05) : 0;
    lastTs = ts;
    if (!sled) resetSled();

    let remaining = dt;
    const maxStep = 0.01;
    while (remaining > 0) {
      const stepDt = Math.min(maxStep, remaining);
      sled.vy += 900 * stepDt;
      const next = { x: sled.x + sled.vx * stepDt, y: sled.y + sled.vy * stepDt };
      const hit = findCollision({ x: sled.x, y: sled.y }, next);
      if (hit) {
        sled.x = hit.x;
        sled.y = hit.y;
        const dx = hit.seg.x2 - hit.seg.x1;
        const dy = hit.seg.y2 - hit.seg.y1;
        const len = Math.hypot(dx, dy) || 1;
        const speed = Math.max(40, Math.hypot(sled.vx, sled.vy) * 0.98);
        const dirX = dx / len;
        const dirY = dy / len;
        sled.vx = dirX * speed;
        sled.vy = dirY * speed + 10 * stepDt;
      } else {
        sled.x = next.x;
        sled.y = next.y;
      }
      remaining -= stepDt;
    }

    drawScene();

    if (sled.y > canvas.height + 80) {
      stopRide("The rider crashed off the course.");
      return;
    }
    if (sled.x < -80 || sled.x > canvas.width + 80) {
      stopRide("The rider left the course.");
      return;
    }
    raf = requestAnimationFrame(step);
  };

  const startRide = () => {
    if (!segments.length) {
      statusEl.textContent = "Draw a track before riding.";
      return;
    }
    if (!sled) resetSled();
    lastTs = 0;
    statusEl.textContent = "Riding...";
    if (!raf) raf = requestAnimationFrame(step);
  };

  modeButtons.forEach((btn) =>
    btn.addEventListener("click", () => setMode(btn.dataset.mode))
  );
  playBtn?.addEventListener("click", startRide);
  resetBtn?.addEventListener("click", () => {
    stopRide();
    resetSled();
  });
  clearBtn?.addEventListener("click", () => {
    stopRide();
    segments.length = 0;
    resetSled();
    statusEl.textContent = "Cleared the canvas.";
  });

  canvas.addEventListener("mousedown", onPointerDown);
  canvas.addEventListener("mousemove", onPointerMove);
  canvas.addEventListener("mouseup", endDraw);
  canvas.addEventListener("mouseleave", endDraw);

  setMode(mode);
  resetSled();

  win.lineRiderCleanup = () => {
    stopRide();
    canvas.removeEventListener("mousedown", onPointerDown);
    canvas.removeEventListener("mousemove", onPointerMove);
    canvas.removeEventListener("mouseup", endDraw);
    canvas.removeEventListener("mouseleave", endDraw);
  };
}
