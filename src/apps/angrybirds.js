const GRAVITY = 820;
const GROUND_HEIGHT = 80;
const MAX_PULL = 120;
const LAUNCH_MULTIPLIER = 5.4;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function circleRectCollision(cx, cy, r, rect) {
  const closestX = clamp(cx, rect.x, rect.x + rect.w);
  const closestY = clamp(cy, rect.y, rect.y + rect.h);
  const dx = cx - closestX;
  const dy = cy - closestY;
  return dx * dx + dy * dy <= r * r;
}

function circleCircleCollision(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const distSq = dx * dx + dy * dy;
  const rad = a.r + b.r;
  return distSq <= rad * rad;
}

function makeLevel(height) {
  const groundY = height - GROUND_HEIGHT;
  const blocks = [
    { type: "block", x: 520, y: groundY - 60, w: 80, h: 120, hp: 140, reward: 60 },
    { type: "block", x: 620, y: groundY - 60, w: 80, h: 120, hp: 140, reward: 60 },
    { type: "beam", x: 520, y: groundY - 140, w: 180, h: 28, hp: 110, reward: 80 },
    { type: "block", x: 570, y: groundY - 220, w: 90, h: 70, hp: 120, reward: 70 }
  ];
  const pigs = [
    { type: "pig", x: 550, y: groundY - 76, r: 16, hp: 90, reward: 250 },
    { type: "pig", x: 610, y: groundY - 180, r: 18, hp: 100, reward: 300 },
    { type: "pig", x: 650, y: groundY - 76, r: 16, hp: 90, reward: 250 }
  ];
  return [...blocks, ...pigs];
}

export function getAngryBirdsContent() {
  return `
    <div class="angrybirds-layout" tabindex="0">
      <div class="angrybirds-hud">
        <div class="angrybirds-stat">Birds: <span class="angrybirds-birds">0</span></div>
        <div class="angrybirds-stat">Score: <span class="angrybirds-score">0</span></div>
        <div class="angrybirds-status">Drag the sling and release to launch.</div>
        <button class="task-btn angrybirds-reset">Reset Level</button>
      </div>
      <canvas class="angrybirds-canvas" width="780" height="460"></canvas>
      <div class="angrybirds-help">Pull back on the slingshot, then release to topple the blocks and hit every pig.</div>
    </div>
  `;
}

export function initAngryBirds(win) {
  const canvas = win.querySelector(".angrybirds-canvas");
  const hud = win.querySelector(".angrybirds-layout");
  const birdsEl = win.querySelector(".angrybirds-birds");
  const scoreEl = win.querySelector(".angrybirds-score");
  const statusEl = win.querySelector(".angrybirds-status");
  const resetBtn = win.querySelector(".angrybirds-reset");

  if (!canvas || !hud) return;

  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const groundY = height - GROUND_HEIGHT;
  const slingOrigin = { x: 140, y: groundY - 10 };

  let structures = [];
  let birdsRemaining = 4;
  let score = 0;
  let activeBird = null;
  let slingPull = { x: 0, y: 0 };
  let dragging = false;
  let raf = 0;
  let lastTime = 0;
  let restTimer = 0;

  const setStatus = (msg) => {
    if (statusEl) statusEl.textContent = msg;
  };

  const updateHUD = () => {
    if (birdsEl) birdsEl.textContent = String(birdsRemaining);
    if (scoreEl) scoreEl.textContent = String(score);
  };

  const spawnBird = () => {
    if (birdsRemaining <= 0) return;
    activeBird = {
      x: slingOrigin.x,
      y: slingOrigin.y,
      vx: 0,
      vy: 0,
      r: 14,
      launched: false
    };
    birdsRemaining -= 1;
    slingPull = { x: 0, y: 0 };
    restTimer = 0;
    setStatus("Pull back and release to launch.");
    updateHUD();
  };

  const resetLevel = () => {
    structures = makeLevel(height);
    birdsRemaining = 4;
    score = 0;
    activeBird = null;
    slingPull = { x: 0, y: 0 };
    restTimer = 0;
    lastTime = 0;
    setStatus("Drag the sling and release to start.");
    updateHUD();
    spawnBird();
  };

  const applyDamage = (item, force) => {
    item.hp -= force;
    if (item.hp <= 0) {
      score += item.reward;
      structures = structures.filter((s) => s !== item);
      setStatus("Satisfying smash!");
      updateHUD();
    }
  };

  const resolveCollisions = (bird, dt) => {
    const speed = Math.hypot(bird.vx, bird.vy);
    structures.forEach((s) => {
      if (s.type === "pig") {
        if (circleCircleCollision({ x: bird.x, y: bird.y, r: bird.r }, s)) {
          applyDamage(s, speed * 0.8);
          bird.vx *= -0.35;
          bird.vy *= -0.35;
        }
      } else if (circleRectCollision(bird.x, bird.y, bird.r, s)) {
        applyDamage(s, speed * 0.6);
        const normalY = bird.y < s.y ? -1 : 1;
        bird.vx *= -0.4;
        bird.vy = Math.abs(bird.vy) * -0.35 * normalY;
      }
    });

    const pigsLeft = structures.some((s) => s.type === "pig");
    if (!pigsLeft) setStatus("All pigs down! Level clear.");

    if (
      bird.x < -120 ||
      bird.x > width + 120 ||
      bird.y > height + 200
    ) {
      activeBird = null;
      restTimer = 0;
    }

    if (bird.y + bird.r >= groundY) {
      bird.y = groundY - bird.r;
      bird.vy *= -0.35;
      bird.vx *= 0.92;
      if (Math.abs(bird.vy) < 10) bird.vy = 0;
    }

    if (Math.abs(bird.vx) < 10 && Math.abs(bird.vy) < 10 && bird.y + bird.r >= groundY - 2) {
      restTimer += dt;
      if (restTimer > 1.4) {
        activeBird = null;
        restTimer = 0;
      }
    } else {
      restTimer = 0;
    }
  };

  const update = (ts) => {
    if (!lastTime) lastTime = ts;
    const dt = Math.min((ts - lastTime) / 1000, 0.05);
    lastTime = ts;

    if (activeBird) {
      if (activeBird.launched) {
        activeBird.vy += GRAVITY * dt;
        activeBird.x += activeBird.vx * dt;
        activeBird.y += activeBird.vy * dt;
        resolveCollisions(activeBird, dt);
      } else {
        activeBird.x = slingOrigin.x + slingPull.x;
        activeBird.y = slingOrigin.y + slingPull.y;
      }
    } else if (birdsRemaining > 0) {
      spawnBird();
    }

    draw();
    raf = requestAnimationFrame(update);
  };

  const drawStructures = () => {
    structures.forEach((s) => {
      if (s.type === "pig") {
        ctx.fillStyle = "#6fbf3a";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#315d19";
        ctx.fillRect(s.x - s.r / 2, s.y - 3, s.r, 4);
      } else {
        ctx.fillStyle = s.type === "beam" ? "#8ab9ff" : "#c58d5f";
        ctx.fillRect(s.x, s.y, s.w, s.h);
        ctx.strokeStyle = "#2f1f16";
        ctx.strokeRect(s.x, s.y, s.w, s.h);
      }
    });
  };

  const drawSling = () => {
    ctx.strokeStyle = "#4c2a00";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(slingOrigin.x - 14, slingOrigin.y + 4);
    ctx.lineTo(slingOrigin.x + 12, slingOrigin.y + 4);
    ctx.stroke();

    if (activeBird && !activeBird.launched) {
      ctx.strokeStyle = "#9c4b1f";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(slingOrigin.x - 8, slingOrigin.y);
      ctx.lineTo(activeBird.x, activeBird.y);
      ctx.lineTo(slingOrigin.x + 8, slingOrigin.y);
      ctx.stroke();
    }
  };

  const draw = () => {
    ctx.clearRect(0, 0, width, height);
    const sky = ctx.createLinearGradient(0, 0, 0, height);
    sky.addColorStop(0, "#b7e0ff");
    sky.addColorStop(1, "#e5f7ff");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "#7db456";
    ctx.fillRect(0, groundY, width, height - groundY);

    drawStructures();
    drawSling();

    if (activeBird) {
      ctx.fillStyle = "#e63946";
      ctx.beginPath();
      ctx.arc(activeBird.x, activeBird.y, activeBird.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffd166";
      ctx.beginPath();
      ctx.arc(activeBird.x + 4, activeBird.y - 3, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = "rgba(0,0,0,0.12)";
    ctx.beginPath();
    ctx.ellipse(slingOrigin.x + 6, groundY - 6, 40, 10, 0, 0, Math.PI * 2);
    ctx.fill();
  };

  const onPointerDown = (e) => {
    if (!activeBird || activeBird.launched) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * width;
    const y = ((e.clientY - rect.top) / rect.height) * height;
    const dist = Math.hypot(x - slingOrigin.x, y - slingOrigin.y);
    if (dist < 60) {
      dragging = true;
    }
  };

  const onPointerMove = (e) => {
    if (!dragging || !activeBird || activeBird.launched) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * width;
    const y = ((e.clientY - rect.top) / rect.height) * height;
    let dx = x - slingOrigin.x;
    let dy = y - slingOrigin.y;
    const pullMag = Math.hypot(dx, dy);
    if (pullMag > MAX_PULL) {
      const scale = MAX_PULL / pullMag;
      dx *= scale;
      dy *= scale;
    }
    slingPull = { x: dx, y: dy };
  };

  const onPointerUp = () => {
    if (!dragging || !activeBird || activeBird.launched) return;
    dragging = false;
    activeBird.launched = true;
    activeBird.vx = -slingPull.x * LAUNCH_MULTIPLIER;
    activeBird.vy = -slingPull.y * LAUNCH_MULTIPLIER;
    setStatus("Bird away! Aim for the pigs.");
    slingPull = { x: 0, y: 0 };
  };

  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);
  resetBtn?.addEventListener("click", resetLevel);
  hud.addEventListener("keydown", (e) => {
    if (e.key === " " && !dragging && activeBird && !activeBird.launched) {
      e.preventDefault();
      activeBird.vx = -120;
      activeBird.vy = -60;
      activeBird.launched = true;
      setStatus("Quick launch!");
    }
  });

  resetLevel();
  raf = requestAnimationFrame(update);

  const cleanup = () => {
    cancelAnimationFrame(raf);
    canvas.removeEventListener("pointerdown", onPointerDown);
    canvas.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
    resetBtn?.removeEventListener("click", resetLevel);
  };

  return cleanup;
}
