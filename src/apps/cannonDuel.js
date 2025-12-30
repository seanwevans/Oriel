export function getCannonDuelContent() {
  return `
    <div class="cannonduel-root" tabindex="0">
      <div class="cannonduel-hud">
        <div class="cannonduel-panel">
          <div class="cannonduel-title">Cannon Duel</div>
          <div class="cannonduel-status">Press Space or Enter to fire!</div>
        </div>
        <div class="cannonduel-bars">
          <div class="cannonduel-bar">
            <span>Player 1</span>
            <div class="cannonduel-health">
              <div class="cannonduel-health-fill p1" style="width: 100%"></div>
            </div>
          </div>
          <div class="cannonduel-bar">
            <span>Player 2</span>
            <div class="cannonduel-health">
              <div class="cannonduel-health-fill p2" style="width: 100%"></div>
            </div>
          </div>
        </div>
        <div class="cannonduel-controls">
          <div>Angle: <span class="cannonduel-angle">60</span>°</div>
          <div>Power: <span class="cannonduel-power">50</span></div>
          <button class="task-btn cannonduel-reset">New Terrain</button>
        </div>
      </div>
      <canvas class="cannonduel-canvas" width="720" height="420"></canvas>
      <div class="cannonduel-help">
        P1: A/D change angle, W/S change power, Space to fire. P2: ←/→ change angle, ↑/↓ change power, Enter to fire. Make craters to sink your foe!
      </div>
    </div>
  `;
}

export function initCannonDuel(win) {
  const root = win.querySelector(".cannonduel-root");
  const canvas = win.querySelector(".cannonduel-canvas");
  const statusEl = win.querySelector(".cannonduel-status");
  const angleEl = win.querySelector(".cannonduel-angle");
  const powerEl = win.querySelector(".cannonduel-power");
  const resetBtn = win.querySelector(".cannonduel-reset");
  const p1HealthFill = win.querySelector(".cannonduel-health-fill.p1");
  const p2HealthFill = win.querySelector(".cannonduel-health-fill.p2");

  if (!root || !canvas || !statusEl || !angleEl || !powerEl) return;

  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const gravity = 140;

  let lastTs = 0;
  let raf = 0;
  let activePlayer = 0;
  let projectile = null;
  let gameOver = false;

  const terrain = new Array(width).fill(height * 0.7);
  const players = [
    { x: width * 0.18, y: height * 0.3, angle: 60, power: 50, color: "#e4572e", health: 100 },
    { x: width * 0.82, y: height * 0.3, angle: 120, power: 50, color: "#3b7dd8", health: 100 }
  ];

  const clamp = (n, min, max) => Math.min(Math.max(n, min), max);
  const toRad = (deg) => (deg * Math.PI) / 180;

  const surfaceAt = (x) => {
    const i = Math.floor(clamp(x, 0, width - 1));
    return terrain[i];
  };

  const regenTerrain = () => {
    let h = height * 0.65;
    for (let i = 0; i < width; i++) {
      h += (Math.random() - 0.5) * 4;
      h = clamp(h, height * 0.4, height * 0.78);
      terrain[i] = h;
    }
    settleCannons();
    updateHud();
    projectile = null;
    gameOver = false;
    statusEl.textContent = "Crack the hillside to sink your rival!";
  };

  const settleCannons = () => {
    players[0].x = clamp(players[0].x, 30, width * 0.45);
    players[1].x = clamp(players[1].x, width * 0.55, width - 30);
    players.forEach((p) => {
      p.y = surfaceAt(p.x) - 6;
    });
  };

  const drawTerrain = () => {
    ctx.beginPath();
    ctx.moveTo(0, height);
    for (let x = 0; x < width; x++) {
      ctx.lineTo(x, terrain[x]);
    }
    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fillStyle = "#7c5a2a";
    ctx.fill();

    ctx.fillStyle = "#6fa74f";
    ctx.beginPath();
    ctx.moveTo(0, height);
    for (let x = 0; x < width; x++) {
      ctx.lineTo(x, terrain[x] - 6);
    }
    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fill();
  };

  const drawCannon = (p, facingLeft) => {
    const barrelLength = 24;
    const rad = toRad(p.angle);
    const bx = p.x + Math.cos(rad) * barrelLength;
    const by = p.y - Math.sin(rad) * barrelLength;
    ctx.fillStyle = p.color;
    ctx.strokeStyle = "#1a1a1a";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.arc(p.x, p.y, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(bx, by);
    ctx.stroke();

    ctx.fillStyle = "#222";
    ctx.beginPath();
    ctx.moveTo(p.x - 12, p.y + 10);
    ctx.lineTo(p.x + 12, p.y + 10);
    ctx.lineTo(p.x + (facingLeft ? -16 : 16), p.y + 16);
    ctx.lineTo(p.x - (facingLeft ? -16 : 16), p.y + 16);
    ctx.closePath();
    ctx.fill();
  };

  const crater = (cx, cy, radius = 28) => {
    for (let x = Math.floor(cx - radius); x <= Math.ceil(cx + radius); x++) {
      if (x < 0 || x >= width) continue;
      const dist = Math.abs(cx - x);
      const depth = Math.sqrt(Math.max(radius * radius - dist * dist, 0));
      terrain[x] = clamp(Math.max(terrain[x], cy + depth), 0, height - 2);
    }
    settleCannons();
  };

  const applyDamage = (cx, cy, radius = 32) => {
    players.forEach((p) => {
      const dist = Math.hypot(p.x - cx, p.y - cy);
      if (dist < radius) {
        const damage = Math.round((1 - dist / radius) * 35);
        p.health = clamp(p.health - damage, 0, 100);
      }
    });
    updateHud();
    checkVictory();
  };

  const updateHud = () => {
    const p = players[activePlayer];
    angleEl.textContent = Math.round(p.angle);
    powerEl.textContent = Math.round(p.power);
    p1HealthFill.style.width = `${players[0].health}%`;
    p2HealthFill.style.width = `${players[1].health}%`;
    statusEl.textContent = gameOver
      ? statusEl.textContent
      : `Player ${activePlayer + 1}'s turn`;
  };

  const checkVictory = () => {
    if (players[0].health <= 0 || players[1].health <= 0) {
      const winner = players[0].health === players[1].health ? "Nobody" : players[0].health > players[1].health ? "Player 1" : "Player 2";
      statusEl.textContent = `${winner} wins! Press New Terrain to restart.`;
      gameOver = true;
    }
  };

  const fire = () => {
    if (projectile || gameOver) return;
    const shooter = players[activePlayer];
    const speed = shooter.power * 2.2;
    const rad = toRad(shooter.angle);
    projectile = {
      x: shooter.x + Math.cos(rad) * 16,
      y: shooter.y - Math.sin(rad) * 16,
      vx: Math.cos(rad) * speed,
      vy: -Math.sin(rad) * speed,
      owner: activePlayer
    };
    statusEl.textContent = `Player ${activePlayer + 1} fires!`;
  };

  const advanceTurn = () => {
    activePlayer = (activePlayer + 1) % 2;
    updateHud();
  };

  const draw = (ts) => {
    if (!lastTs) lastTs = ts;
    const dt = Math.min((ts - lastTs) / 1000, 0.04);
    lastTs = ts;

    ctx.fillStyle = "#b3d9ff";
    ctx.fillRect(0, 0, width, height);

    drawTerrain();

    players.forEach((p, idx) => drawCannon(p, idx === 1));

    if (projectile) {
      projectile.vy += gravity * dt;
      projectile.x += projectile.vx * dt;
      projectile.y += projectile.vy * dt;

      ctx.fillStyle = "#000";
      ctx.beginPath();
      ctx.arc(projectile.x, projectile.y, 3, 0, Math.PI * 2);
      ctx.fill();

      if (
        projectile.x < 0 ||
        projectile.x > width ||
        projectile.y > height + 30
      ) {
        projectile = null;
        advanceTurn();
      } else {
        const groundY = surfaceAt(projectile.x);
        const hitPlayer = players.find((p) => Math.hypot(p.x - projectile.x, p.y - projectile.y) < 12);

        if (hitPlayer) {
          crater(projectile.x, projectile.y, 26);
          applyDamage(projectile.x, projectile.y, 36);
          projectile = null;
          if (!gameOver) advanceTurn();
        } else if (projectile.y >= groundY) {
          crater(projectile.x, groundY, 30);
          applyDamage(projectile.x, groundY, 42);
          projectile = null;
          if (!gameOver) advanceTurn();
        }
      }
    }

    raf = requestAnimationFrame(draw);
  };

  const clampAngle = (p, delta) => {
    p.angle = clamp(p.angle + delta, 15, 165);
  };

  const clampPower = (p, delta) => {
    p.power = clamp(p.power + delta, 20, 80);
  };

  const handleKey = (e) => {
    const p = players[activePlayer];
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Enter", " ", "Spacebar", "a", "d", "w", "s", "A", "D", "W", "S"].includes(e.key)) {
      e.preventDefault();
    }
    if (activePlayer === 0) {
      if (e.key === "a" || e.key === "A") clampAngle(p, 2);
      if (e.key === "d" || e.key === "D") clampAngle(p, -2);
      if (e.key === "w" || e.key === "W") clampPower(p, 2);
      if (e.key === "s" || e.key === "S") clampPower(p, -2);
      if (e.key === " ") fire();
    } else {
      if (e.key === "ArrowLeft") clampAngle(p, 2);
      if (e.key === "ArrowRight") clampAngle(p, -2);
      if (e.key === "ArrowUp") clampPower(p, 2);
      if (e.key === "ArrowDown") clampPower(p, -2);
      if (e.key === "Enter") fire();
    }
    updateHud();
  };

  const cleanup = () => {
    if (raf) cancelAnimationFrame(raf);
    root.removeEventListener("keydown", handleKey);
    resetBtn?.removeEventListener("click", regenTerrain);
  };

  root.addEventListener("keydown", handleKey);
  resetBtn?.addEventListener("click", regenTerrain);
  root.focus();
  regenTerrain();
  draw(0);

  win.cannonduelCleanup = cleanup;
}
