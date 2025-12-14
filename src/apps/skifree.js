export function getSkiFreeContent() {
  return `
                <div class="skifree-layout" tabindex="0">
                    <div class="skifree-hud">
                        <div class="skifree-stat">Score: <span class="skifree-score">0</span></div>
                        <div class="skifree-stat">Speed: <span class="skifree-speed">0</span></div>
                        <div class="skifree-status">Ready to ski</div>
                        <button class="task-btn skifree-reset">Restart</button>
                    </div>
                    <canvas class="skifree-canvas" width="320" height="360"></canvas>
                    <div class="skifree-help">Use ← → to steer, ↑ to jump, ↓ to slow down. Avoid trees and rocks!</div>
                </div>
            `;
}

export function initSkiFree(win) {
  const canvas = win.querySelector(".skifree-canvas");
  const layout = win.querySelector(".skifree-layout");
  const scoreEl = win.querySelector(".skifree-score");
  const speedEl = win.querySelector(".skifree-speed");
  const statusEl = win.querySelector(".skifree-status");
  const resetBtn = win.querySelector(".skifree-reset");

  if (!canvas || !layout) return;

  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const pressed = {};
  const obstacles = [];
  const skier = { x: width / 2, y: height - 50, vx: 0, jumpTimer: 0 };
  let monster = null; // Monster Object
  let speed = 2.2;
  let score = 0;
  let playing = true;
  let lastTs = 0;
  let raf = 0;

  layout.focus();

  // Inputs
  const onKeyDown = (e) => {
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
      e.preventDefault();
      pressed[e.key] = true;
    }
  };
  const onKeyUp = (e) => {
    if (pressed[e.key]) pressed[e.key] = false;
  };
  layout.addEventListener("keydown", onKeyDown);
  layout.addEventListener("keyup", onKeyUp);

  const resetCourse = () => {
    obstacles.length = 0;
    monster = null;
    score = 0;
    speed = 2.2;
    skier.x = width / 2;
    skier.vx = 0;
    skier.jumpTimer = 0;
    playing = true;
    statusEl.textContent = "Carving fresh powder";
    scoreEl.textContent = "0";
    lastTs = 0;
    layout.focus();
  };

  const spawnObstacle = () => {
    const type = Math.random() < 0.7 ? "tree" : "rock";
    const x = Math.random() * width;
    const y = -50;
    obstacles.push({ x, y, type });
  };

  const drawEntity = (x, y, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x - 5, y - 10, 10, 20); // Simple box representation
  };

  // MONSTER LOGIC
  const updateMonster = (dt) => {
    if (!monster && score > 2000) {
      // Spawn threshold
      monster = { x: Math.random() < 0.5 ? 0 : width, y: -100, speed: 0 };
      statusEl.textContent = "RUN! IT'S THE MONSTER!";
      statusEl.style.color = "red";
    }

    if (monster) {
      monster.speed = speed + 20; // Always faster than you
      // Chase logic
      const dx = skier.x - monster.x;
      const dy = skier.y - monster.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      monster.x += (dx / dist) * monster.speed * dt;
      monster.y += (dy / dist) * monster.speed * dt;

      // Draw Monster
      ctx.fillStyle = "grey";
      ctx.fillRect(monster.x - 10, monster.y - 20, 20, 40); // Big grey box
      ctx.fillStyle = "red"; // Eyes
      ctx.fillRect(monster.x - 5, monster.y - 15, 3, 3);
      ctx.fillRect(monster.x + 2, monster.y - 15, 3, 3);

      // Eat logic
      if (dist < 20) {
        playing = false;
        statusEl.textContent = "The monster caught you!";
        statusEl.style.color = "#333";
      }
    }
  };

  // Game Loop
  const update = (timestamp) => {
    if (!lastTs) lastTs = timestamp;
    const dt = Math.min((timestamp - lastTs) / 1000, 0.05);
    lastTs = timestamp;
    if (!playing) return;

    ctx.fillStyle = "#e9f5ff";
    ctx.fillRect(0, 0, width, height);

    // Spawn obstacles every frame ~5% chance
    if (Math.random() < 0.05) spawnObstacle();

    // Update obstacles and draw
    obstacles.forEach((o) => {
      o.y += speed * (o.type === "rock" ? 1.3 : 1);
      if (o.y > height + 20) o.y = -Math.random() * 50;
      drawEntity(o.x, o.y, o.type === "tree" ? "#1e8449" : "#7f8c8d");
    });

    // Controls
    if (pressed["ArrowLeft"]) skier.vx = Math.max(skier.vx - 0.5, -5);
    if (pressed["ArrowRight"]) skier.vx = Math.min(skier.vx + 0.5, 5);
    if (pressed["ArrowUp"] && skier.jumpTimer <= 0) skier.jumpTimer = 0.6;
    if (pressed["ArrowDown"]) speed = Math.max(1.8, speed - 0.08);
    else speed = Math.min(4.5, speed + 0.03);

    // Jumping animation
    if (skier.jumpTimer > 0) {
      skier.jumpTimer -= dt;
      drawEntity(skier.x, skier.y - 12, "#f7dc6f");
      statusEl.textContent = "Catching air!";
    } else {
      statusEl.textContent = "Carving fresh powder";
      drawEntity(skier.x, skier.y, "#2980b9");
    }

    // Movement and collision
    skier.x += skier.vx;
    skier.x = Math.max(10, Math.min(width - 10, skier.x));
    skier.vx *= 0.98;
    obstacles.forEach((o) => {
      const dx = o.x - skier.x;
      const dy = o.y - skier.y;
      if (Math.abs(dx) < 10 && Math.abs(dy) < 18 && skier.jumpTimer <= 0) {
        playing = false;
        statusEl.textContent = o.type === "tree" ? "Ouch! Hit a tree." : "Wipeout on a rock!";
        statusEl.style.color = "crimson";
      }
    });

    // Monster Logic
    updateMonster(dt);

    // Score increases over time and speed
    score += Math.floor(speed * 10);
    scoreEl.textContent = score;
    speedEl.textContent = speed.toFixed(1);

    // If monster caught you, end game
    if (!playing && monster) {
      statusEl.textContent = "The snow beast feasts...";
    }

    if (playing || monster) requestAnimationFrame(update);
  };

  const resetGame = () => {
    resetCourse();
    playing = true;
    statusEl.style.color = "#222";
    requestAnimationFrame(update);
  };

  resetBtn.addEventListener("click", resetGame);
  layout.addEventListener("click", () => layout.focus());
  resetGame();

  win.skifreeCleanup = () => {
    layout.removeEventListener("keydown", onKeyDown);
    layout.removeEventListener("keyup", onKeyUp);
    resetBtn.removeEventListener("click", resetGame);
  };
}
