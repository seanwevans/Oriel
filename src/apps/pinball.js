const WALL_THICKNESS = 12;
const GRAVITY = 0.25;
const FRICTION = 0.995;

export function getPinballContent() {
  return `
    <div class="pinball" tabindex="0">
      <div class="pinball-hud">
        <div class="pinball-stat">Score: <span class="pinball-score">0</span></div>
        <div class="pinball-stat">Balls: <span class="pinball-balls">3</span></div>
        <div class="pinball-status">Hold Space to launch</div>
        <button class="task-btn pinball-reset">New Game</button>
      </div>
      <canvas class="pinball-canvas" width="420" height="560"></canvas>
      <div class="pinball-help">Left/Right to flip. Hold Space to charge the plunger and release to send the ball.</div>
    </div>
  `;
}

export function initPinball(win) {
  const canvas = win.querySelector(".pinball-canvas");
  const layout = win.querySelector(".pinball");
  const scoreEl = win.querySelector(".pinball-score");
  const ballsEl = win.querySelector(".pinball-balls");
  const statusEl = win.querySelector(".pinball-status");
  const resetBtn = win.querySelector(".pinball-reset");

  if (!canvas || !layout) return;

  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;

  const bumpers = [
    { x: width * 0.35, y: 170, r: 16, score: 120 },
    { x: width * 0.65, y: 170, r: 16, score: 120 },
    { x: width * 0.5, y: 240, r: 22, score: 200 },
    { x: width * 0.35, y: 320, r: 14, score: 80 },
    { x: width * 0.65, y: 320, r: 14, score: 80 }
  ];

  const lanes = [
    { x: width * 0.2, y: 110, w: 40, score: 150 },
    { x: width * 0.5, y: 90, w: 40, score: 200 },
    { x: width * 0.8, y: 110, w: 40, score: 150 }
  ];

  const flippers = [
    { x: width * 0.32, y: height - 70, length: 62, rest: -0.2, active: -0.9, key: "ArrowLeft", pressed: false },
    { x: width * 0.68, y: height - 70, length: 62, rest: Math.PI + 0.2, active: Math.PI + 0.9, key: "ArrowRight", pressed: false }
  ];

  let raf = 0;
  let lastTime = 0;
  let score = 0;
  let balls = 3;
  let plungerCharge = 0;
  let charging = false;
  let gameOver = false;

  const ball = {
    x: width / 2,
    y: height - 50,
    vx: 0,
    vy: 0,
    r: 9,
    ready: true
  };

  const resetBall = (keepBalls = false) => {
    ball.x = width * 0.78;
    ball.y = height - 60;
    ball.vx = 0;
    ball.vy = 0;
    ball.ready = true;
    plungerCharge = 0;
    charging = false;
    if (!keepBalls) balls = Math.max(1, balls);
    updateHud();
    setStatus("Hold Space to launch");
  };

  const setStatus = (text) => {
    if (statusEl) statusEl.textContent = text;
  };

  const updateHud = () => {
    if (scoreEl) scoreEl.textContent = score.toString();
    if (ballsEl) ballsEl.textContent = balls.toString();
  };

  const newGame = () => {
    score = 0;
    balls = 3;
    gameOver = false;
    resetBall();
    updateHud();
    requestNextFrame();
  };

  const launchBall = () => {
    if (!ball.ready || gameOver) return;
    const force = 7 + Math.min(plungerCharge * 0.04, 6);
    ball.vy = -force;
    ball.vx = (Math.random() - 0.5) * 2.5;
    ball.ready = false;
    setStatus("Keep the ball alive!");
  };

  const loseBall = () => {
    if (gameOver) return;
    balls -= 1;
    updateHud();
    if (balls <= 0) {
      gameOver = true;
      setStatus("Game over - click New Game");
    } else {
      setStatus("Ball lost - press Space");
      resetBall(true);
    }
  };

  const drawWalls = () => {
    ctx.fillStyle = "#121820";
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "#1f3044";
    ctx.fillRect(WALL_THICKNESS, WALL_THICKNESS, width - WALL_THICKNESS * 2, height - WALL_THICKNESS * 2);

    ctx.fillStyle = "#0b0f17";
    ctx.fillRect(width - WALL_THICKNESS * 2, WALL_THICKNESS * 5, WALL_THICKNESS * 2, height - WALL_THICKNESS * 5);
  };

  const drawLaneGuides = () => {
    ctx.fillStyle = "rgba(255,255,255,0.05)";
    lanes.forEach((lane) => {
      ctx.beginPath();
      ctx.rect(lane.x - lane.w / 2, lane.y - 14, lane.w, 36);
      ctx.fill();
    });
  };

  const drawBumpers = () => {
    bumpers.forEach((b) => {
      const gradient = ctx.createRadialGradient(b.x - 4, b.y - 6, 4, b.x, b.y, b.r + 6);
      gradient.addColorStop(0, "#ffe066");
      gradient.addColorStop(1, "#d35400");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#3b2f1f";
      ctx.lineWidth = 3;
      ctx.stroke();
    });
  };

  const drawFlippers = () => {
    ctx.lineWidth = 10;
    ctx.lineCap = "round";
    flippers.forEach((f) => {
      const angle = f.pressed ? f.active : f.rest;
      const endX = f.x + Math.cos(angle) * f.length;
      const endY = f.y + Math.sin(angle) * f.length;
      ctx.strokeStyle = f.key === "ArrowLeft" ? "#ff3b30" : "#30a7ff";
      ctx.beginPath();
      ctx.moveTo(f.x, f.y);
      ctx.lineTo(endX, endY);
      ctx.stroke();
      ctx.fillStyle = "#111";
      ctx.beginPath();
      ctx.arc(f.x, f.y, 10, 0, Math.PI * 2);
      ctx.fill();
    });
  };

  const drawPlunger = () => {
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(width - WALL_THICKNESS * 2, height - 140, WALL_THICKNESS * 2 - 2, 120);

    if (ball.ready) {
      ctx.fillStyle = "#8b5cf6";
      ctx.fillRect(width - WALL_THICKNESS * 2 + 2, height - 40 - plungerCharge, WALL_THICKNESS * 2 - 6, plungerCharge + 16);
    }
  };

  const drawBall = () => {
    const g = ctx.createRadialGradient(ball.x - 4, ball.y - 4, 2, ball.x, ball.y, ball.r + 4);
    g.addColorStop(0, "#ffffff");
    g.addColorStop(1, "#c0d0ff");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#0a0a0a";
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const applyWallCollisions = () => {
    if (ball.x - ball.r < WALL_THICKNESS) {
      ball.x = WALL_THICKNESS + ball.r;
      ball.vx *= -0.92;
    } else if (ball.x + ball.r > width - WALL_THICKNESS) {
      ball.x = width - WALL_THICKNESS - ball.r;
      ball.vx *= -0.92;
    }

    if (ball.y - ball.r < WALL_THICKNESS) {
      ball.y = WALL_THICKNESS + ball.r;
      ball.vy *= -0.94;
    }

    const drainWidth = 110;
    if (ball.y - ball.r > height - WALL_THICKNESS * 2) {
      if (Math.abs(ball.x - width / 2) > drainWidth / 2) {
        ball.y = height - WALL_THICKNESS * 2 - ball.r;
        ball.vy *= -0.9;
      } else {
        loseBall();
        resetBall(true);
      }
    }
  };

  const checkBumperHits = () => {
    bumpers.forEach((b) => {
      const dx = ball.x - b.x;
      const dy = ball.y - b.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < ball.r + b.r) {
        const overlap = ball.r + b.r - dist;
        const nx = dx / (dist || 1);
        const ny = dy / (dist || 1);
        ball.x += nx * overlap;
        ball.y += ny * overlap;
        ball.vx = ball.vx * 0.6 + nx * 6;
        ball.vy = ball.vy * 0.6 + ny * 6;
        score += b.score;
        updateHud();
        setStatus("Bumper hit!");
      }
    });
  };

  const checkLaneHits = () => {
    lanes.forEach((lane) => {
      if (
        ball.x > lane.x - lane.w / 2 &&
        ball.x < lane.x + lane.w / 2 &&
        ball.y > lane.y - 18 &&
        ball.y < lane.y + 18 &&
        Math.abs(ball.vy) < 6
      ) {
        score += lane.score;
        ball.vy = -Math.abs(ball.vy) - 5;
        setStatus("Lane bonus!");
        updateHud();
      }
    });
  };

  const checkFlipperHits = () => {
    flippers.forEach((f) => {
      const angle = f.pressed ? f.active : f.rest;
      const dx = ball.x - f.x;
      const dy = ball.y - f.y;
      const proj = dx * Math.cos(angle) + dy * Math.sin(angle);
      const perp = -dx * Math.sin(angle) + dy * Math.cos(angle);
      if (proj > -8 && proj < f.length + 8 && Math.abs(perp) < ball.r + 6) {
        ball.x += Math.cos(angle) * (ball.r + 8 - perp) * 0.01;
        ball.y += Math.sin(angle) * (ball.r + 8 - perp) * 0.01;
        const power = f.pressed ? 8 : 4;
        ball.vx = ball.vx * 0.4 + Math.cos(angle) * power;
        ball.vy = ball.vy * 0.4 + Math.sin(angle) * power;
        setStatus("Flip!");
      }
    });
  };

  const updateBall = (dt) => {
    if (ball.ready) {
      ball.y = Math.min(height - 40, ball.y + 0.6);
      if (charging) {
        plungerCharge = Math.min(120, plungerCharge + dt * 0.1);
        setStatus("Release to launch");
      } else {
        plungerCharge = Math.max(0, plungerCharge - dt * 0.08);
      }
      return;
    }

    ball.vy += GRAVITY;
    ball.vx *= FRICTION;
    ball.vy *= FRICTION;
    ball.x += ball.vx * dt * 0.06;
    ball.y += ball.vy * dt * 0.06;

    applyWallCollisions();
    checkBumperHits();
    checkLaneHits();
    checkFlipperHits();
  };

  const drawPlayfield = () => {
    drawWalls();
    drawLaneGuides();
    drawBumpers();
    drawFlippers();
    drawPlunger();
    drawBall();
  };

  const update = (timestamp) => {
    const dt = timestamp - lastTime || 16;
    lastTime = timestamp;

    updateBall(dt);
    drawPlayfield();

    if (!gameOver) requestNextFrame();
  };

  const requestNextFrame = () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(update);
  };

  const onKeyDown = (e) => {
    if (["ArrowLeft", "ArrowRight", " "].includes(e.key)) e.preventDefault();
    flippers.forEach((f) => {
      if (f.key === e.key) f.pressed = true;
    });
    if ((e.key === " " || e.key === "Enter") && ball.ready) {
      charging = true;
    }
  };

  const onKeyUp = (e) => {
    flippers.forEach((f) => {
      if (f.key === e.key) f.pressed = false;
    });
    if ((e.key === " " || e.key === "Enter") && ball.ready) {
      charging = false;
      launchBall();
    }
  };

  resetBtn?.addEventListener("click", newGame);
  layout.addEventListener("keydown", onKeyDown);
  layout.addEventListener("keyup", onKeyUp);
  layout.addEventListener("click", () => layout.focus());
  layout.focus();

  newGame();

  win.pinballCleanup = () => {
    cancelAnimationFrame(raf);
    layout.removeEventListener("keydown", onKeyDown);
    layout.removeEventListener("keyup", onKeyUp);
    resetBtn?.removeEventListener("click", newGame);
  };
}
