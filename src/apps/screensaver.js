import { loadThree } from "../threeLoader.js";

let THREE = null;

let saverActive = false;
let idleTime = 0;
const saverCanvas = document.getElementById("saver-canvas");
const sCtx = saverCanvas.getContext("2d");
const screensaverDiv = document.getElementById("screensaver");
const mazeCanvas = document.getElementById("saver-maze-canvas");
const bsodOverlay = document.getElementById("bsod-overlay");
const bsodCodeText = bsodOverlay?.querySelector(".bsod-code");
let screensaverType = "starfield";
let screensaverTimeout = 60;
let lockPassphrase = "";
let requirePassphrase = false;
let unlockPromptVisible = false;
const saverLock = document.getElementById("saver-lock");
const saverPassInput = document.getElementById("saver-pass-input");
const saverLockError = document.getElementById("saver-lock-error");

const screensaverContext = {
  getType: () => screensaverType,
  setType: (value) => {
    screensaverType = value;
  },
  getTimeout: () => screensaverTimeout,
  setTimeout: (value) => {
    screensaverTimeout = value;
  },
  getLockPassphrase: () => lockPassphrase,
  setLockPassphrase: (value) => {
    lockPassphrase = value;
  },
  getRequirePassphrase: () => requirePassphrase,
  setRequirePassphrase: (value) => {
    requirePassphrase = value;
  },
  setIdleTime: (value) => {
    idleTime = value;
  },
  start: (type) => startScreensaver(type)
};

async function ensureThree() {
  if (!THREE) THREE = await loadThree();
  return THREE;
}

let stars = [];
const numStars = 500;
let sInterval = null;

let pipes = [];

const pipeDirections = [
  { x: 1, y: 0 },
  { x: -1, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: -1 }
];

const PIPE_COLORS = ["#4bc0ff", "#ff6b6b", "#50fa7b", "#f1fa8c"];

let matrixDrops = [];
const MATRIX_CHARS = "X01Z=+*".split("");
let matrixFontSize = 16;

let dvdLogo = null;
const DVD_COLORS = ["#ff3864", "#3ae374", "#00b3ff", "#ffc600", "#bd93f9", "#ffffff"];

let fireflies = [];
let bubbles = [];
let waveBands = [];
let wavePhase = 0;
let activeCanvasMode = "2d";

let fishSchool = [];
let tunnelSegments = [];

let mazeRenderer = null;
let mazeScene = null;
let mazeCamera = null;
let mazeFrameId = null;
let mazeClock = null;
let mazePath = [];
let mazeSegmentIndex = 0;
let mazeCurrentAngle = 0;
let mazeTargetAngle = 0;
let mazeLight = null;
let mazeGroup = null;
const MAZE_CELL_SIZE = 10;
let toasters = [];
const TOASTER_COLORS = [
  "#dfe6f3",
  "#f8fbff",
  "#c9d7ef",
  "#cdd8e8"
];

let castawayScene = null;

function isLockEnabled() {
  return requirePassphrase && lockPassphrase.trim().length > 0;
}

function showUnlockPrompt() {
  if (!isLockEnabled()) {
    stopScreensaver();
    return;
  }

  if (unlockPromptVisible) return;
  unlockPromptVisible = true;

  if (saverLock) saverLock.style.display = "flex";
  if (screensaverDiv) screensaverDiv.classList.add("locked");
  if (saverLockError) saverLockError.textContent = "";
  if (saverPassInput) {
    saverPassInput.value = "";
    saverPassInput.focus();
  }
}

function hideUnlockPrompt() {
  unlockPromptVisible = false;
  if (saverLock) saverLock.style.display = "none";
  if (screensaverDiv) screensaverDiv.classList.remove("locked");
  if (saverPassInput) saverPassInput.value = "";
  if (saverLockError) saverLockError.textContent = "";
}

function submitLockPassphrase() {
  if (!isLockEnabled()) {
    stopScreensaver();
    return;
  }

  const attempted = saverPassInput?.value || "";
  if (attempted === lockPassphrase) {
    hideUnlockPrompt();
    stopScreensaver();
  } else if (saverLockError) {
    saverLockError.textContent = "Incorrect passphrase.";
    saverPassInput?.focus();
  }
}

function initScreensaver() {
  resizeScreensaverCanvases();
  setupStarfield();
  // Global Listeners
  document.body.addEventListener("mousemove", resetTimer);
  document.body.addEventListener("keydown", resetTimer);
  document.body.addEventListener("mousedown", resetTimer);
  window.addEventListener("resize", resizeScreensaverCanvases);
  saverPassInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") submitLockPassphrase();
  });
  // Timer Check
  setInterval(() => {
    idleTime++;
    if (idleTime > screensaverTimeout && !saverActive) startScreensaver();
  }, 1000);
}

function resetTimer() {
  idleTime = 0;
  if (!saverActive) return;
  if (unlockPromptVisible) return;
  if (isLockEnabled()) {
    showUnlockPrompt();
  } else {
    stopScreensaver();
  }
}

async function startScreensaver(forceType) {
  const saver = forceType || screensaverType;
  saverActive = true;
  screensaverDiv.style.display = "block";
  activeCanvasMode = saver === "maze" ? "3d" : "2d";
  setScreensaverCanvas(activeCanvasMode);
  resizeScreensaverCanvases();
  clearInterval(sInterval);
  stopMaze();
  hideUnlockPrompt();

  const shouldPrank = !forceType && Math.random() < 0.001;
  if (shouldPrank) {
    showFakeBsod();
    return;
  }

  hideFakeBsod();
  if (saver === "maze") {
    await setupMazeScreensaver();
  } else if (saver === "pipes") {
    setupPipes();
    sInterval = setInterval(drawPipes, 50);
  } else if (saver === "matrix") {
    setupMatrix();
    sInterval = setInterval(drawMatrix, 50);
  } else if (saver === "dvd") {
    setupDvd();
    sInterval = setInterval(drawDvd, 30);
  } else if (saver === "fireflies") {
    setupFireflies();
    sInterval = setInterval(drawFireflies, 30);
  } else if (saver === "bubbles") {
    setupBubbles();
    sInterval = setInterval(drawBubbles, 40);
  } else if (saver === "waves" || saver === "wave") {
    setupNeonWaves();
    sInterval = setInterval(drawNeonWaves, 30);
  } else if (saver === "castaway") {
    setupCastaway();
    sInterval = setInterval(drawCastaway, 40);
  } else if (saver === "fish") {
    setupFish();
    sInterval = setInterval(drawFish, 35);
  } else if (saver === "toasters" || saver === "toast") {
    setupFlyingToasters();
    sInterval = setInterval(drawFlyingToasters, 30);
  } else if (saver === "tunnel") {
    setupTunnel();
    sInterval = setInterval(drawTunnel, 30);
  } else if (saver === "bsod") {
    showFakeBsod();
    sInterval = null;
  } else {
    setScreensaverCanvas("2d");
    setupStarfield();
    sInterval = setInterval(drawStars, 30);
  }
}

function stopScreensaver() {
  saverActive = false;
  screensaverDiv.style.display = "none";
  clearInterval(sInterval);
  hideFakeBsod();
  stopMaze();
  activeCanvasMode = "2d";
  setScreensaverCanvas("2d");
  hideUnlockPrompt();
}

function showFakeBsod() {
  if (!bsodOverlay) return;
  const randomCode = Math.random().toString(16).slice(2, 8).toUpperCase();
  if (bsodCodeText) bsodCodeText.textContent = `STOP CODE: ${randomCode}`;
  bsodOverlay.classList.add("visible");
  if (saverCanvas) saverCanvas.style.display = "none";
  if (mazeCanvas) mazeCanvas.style.display = "none";
}

function hideFakeBsod() {
  if (!bsodOverlay) return;
  bsodOverlay.classList.remove("visible");
  setScreensaverCanvas(activeCanvasMode);
}

function setScreensaverCanvas(mode) {
  if (saverCanvas)
    saverCanvas.style.display = mode === "2d" || mode === undefined ? "block" : "none";
  if (mazeCanvas) mazeCanvas.style.display = mode === "3d" ? "block" : "none";
}

function resizeScreensaverCanvases() {
  if (saverCanvas) {
    saverCanvas.width = window.innerWidth;
    saverCanvas.height = window.innerHeight;
  }
  if (mazeCanvas) {
    mazeCanvas.width = window.innerWidth;
    mazeCanvas.height = window.innerHeight;
  }
  if (mazeRenderer) {
    mazeRenderer.setSize(window.innerWidth, window.innerHeight);
  }
  if (mazeCamera) {
    mazeCamera.aspect = window.innerWidth / window.innerHeight;
    mazeCamera.updateProjectionMatrix();
  }
}

function generateMaze(width, height) {
  const grid = Array.from({ length: height }, (_, y) =>
    Array.from({ length: width }, (_, x) => ({
      x,
      y,
      visited: false,
      walls: { top: true, right: true, bottom: true, left: true }
    }))
  );

  const stack = [];
  const start = grid[0][0];
  start.visited = true;
  stack.push(start);

  const getUnvisitedNeighbors = (cell) => {
    const neighbors = [];
    if (cell.y > 0 && !grid[cell.y - 1][cell.x].visited)
      neighbors.push({ dir: "top", cell: grid[cell.y - 1][cell.x] });
    if (cell.x < width - 1 && !grid[cell.y][cell.x + 1].visited)
      neighbors.push({ dir: "right", cell: grid[cell.y][cell.x + 1] });
    if (cell.y < height - 1 && !grid[cell.y + 1][cell.x].visited)
      neighbors.push({ dir: "bottom", cell: grid[cell.y + 1][cell.x] });
    if (cell.x > 0 && !grid[cell.y][cell.x - 1].visited)
      neighbors.push({ dir: "left", cell: grid[cell.y][cell.x - 1] });
    return neighbors;
  };

  const removeWall = (cell, next, direction) => {
    cell.walls[direction] = false;
    if (direction === "top") next.walls.bottom = false;
    if (direction === "right") next.walls.left = false;
    if (direction === "bottom") next.walls.top = false;
    if (direction === "left") next.walls.right = false;
  };

  while (stack.length) {
    const current = stack[stack.length - 1];
    const neighbors = getUnvisitedNeighbors(current);
    if (neighbors.length === 0) {
      stack.pop();
      continue;
    }
    const { dir, cell: nextCell } =
      neighbors[Math.floor(Math.random() * neighbors.length)];
    removeWall(current, nextCell, dir);
    nextCell.visited = true;
    stack.push(nextCell);
  }

  return grid;
}

function buildMazePath(grid) {
  const height = grid.length;
  const width = grid[0].length;
  const visited = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => false)
  );
  const path = [];
  const stack = [{ x: 0, y: 0 }];
  visited[0][0] = true;
  path.push({ x: 0, y: 0 });

  const getOpenNeighbors = (x, y) => {
    const cell = grid[y][x];
    const options = [];
    if (!cell.walls.top) options.push({ x, y: y - 1 });
    if (!cell.walls.right) options.push({ x: x + 1, y });
    if (!cell.walls.bottom) options.push({ x, y: y + 1 });
    if (!cell.walls.left) options.push({ x: x - 1, y });
    return options.filter(
      (pos) => pos.x >= 0 && pos.x < width && pos.y >= 0 && pos.y < height
    );
  };

  while (stack.length) {
    const current = stack[stack.length - 1];
    const neighbors = getOpenNeighbors(current.x, current.y).filter(
      (n) => !visited[n.y][n.x]
    );
    if (neighbors.length) {
      const next = neighbors[Math.floor(Math.random() * neighbors.length)];
      visited[next.y][next.x] = true;
      stack.push(next);
      path.push(next);
    } else {
      stack.pop();
      if (stack.length) path.push(stack[stack.length - 1]);
    }
  }

  return path;
}

function disposeMazeScene() {
  if (!mazeScene) return;
  mazeScene.traverse((obj) => {
    if (obj.geometry) obj.geometry.dispose();
    if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose?.());
    else obj.material?.dispose?.();
  });
  mazeScene.clear();
}

function buildMazeWorld() {
  if (!mazeScene || !mazeCamera) return;
  disposeMazeScene();
  mazeGroup = new THREE.Group();

  const width = 12 + Math.floor(Math.random() * 5);
  const height = 10 + Math.floor(Math.random() * 5);
  const grid = generateMaze(width, height);
  const rawPath = buildMazePath(grid);
  mazePath = rawPath.map((p) => ({
    x: p.x * MAZE_CELL_SIZE - (width * MAZE_CELL_SIZE) / 2 + MAZE_CELL_SIZE / 2,
    z:
      p.y * MAZE_CELL_SIZE - (height * MAZE_CELL_SIZE) / 2 + MAZE_CELL_SIZE / 2
  }));
  mazeSegmentIndex = 0;
  mazeTargetAngle = 0;
  mazeCurrentAngle = 0;

  const start = mazePath[0] || { x: 0, z: 0 };
  mazeCamera.position.set(start.x, 1.6, start.z);

  const fogDensity = 0.03 + Math.random() * 0.01;
  mazeScene.fog = new THREE.FogExp2(0x02060f, fogDensity);

  const floorGeo = new THREE.PlaneGeometry(
    width * MAZE_CELL_SIZE,
    height * MAZE_CELL_SIZE
  );
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0x0b1426,
    metalness: 0.25,
    roughness: 0.78,
    emissive: 0x0a365a
  });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  mazeGroup.add(floor);

  const ceilingMat = new THREE.MeshStandardMaterial({
    color: 0x0d0f1a,
    roughness: 0.45,
    metalness: 0.15,
    emissive: 0x081426
  });
  const ceiling = new THREE.Mesh(floorGeo, ceilingMat);
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = 6;
  mazeGroup.add(ceiling);

  const wallMaterial = new THREE.MeshStandardMaterial({
    color: 0x70f3ff,
    emissive: 0x0c2f49,
    metalness: 0.48,
    roughness: 0.32
  });

  const wallHeight = 6;
  const wallThickness = 0.65;
  const horizWall = new THREE.BoxGeometry(
    MAZE_CELL_SIZE,
    wallHeight,
    wallThickness
  );
  const vertWall = new THREE.BoxGeometry(
    wallThickness,
    wallHeight,
    MAZE_CELL_SIZE
  );

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const cell = grid[y][x];
      const baseX =
        x * MAZE_CELL_SIZE - (width * MAZE_CELL_SIZE) / 2 + MAZE_CELL_SIZE / 2;
      const baseZ =
        y * MAZE_CELL_SIZE - (height * MAZE_CELL_SIZE) / 2 + MAZE_CELL_SIZE / 2;

      if (cell.walls.top) {
        const wall = new THREE.Mesh(horizWall, wallMaterial);
        wall.position.set(baseX, wallHeight / 2, baseZ - MAZE_CELL_SIZE / 2);
        mazeGroup.add(wall);
      }
      if (cell.walls.left) {
        const wall = new THREE.Mesh(vertWall, wallMaterial);
        wall.position.set(baseX - MAZE_CELL_SIZE / 2, wallHeight / 2, baseZ);
        mazeGroup.add(wall);
      }
      if (x === width - 1 && cell.walls.right) {
        const wall = new THREE.Mesh(vertWall, wallMaterial);
        wall.position.set(baseX + MAZE_CELL_SIZE / 2, wallHeight / 2, baseZ);
        mazeGroup.add(wall);
      }
      if (y === height - 1 && cell.walls.bottom) {
        const wall = new THREE.Mesh(horizWall, wallMaterial);
        wall.position.set(baseX, wallHeight / 2, baseZ + MAZE_CELL_SIZE / 2);
        mazeGroup.add(wall);
      }
    }
  }

  const ambient = new THREE.AmbientLight(0x78c8ff, 0.3);
  mazeGroup.add(ambient);
  mazeLight = new THREE.PointLight(0x6df1ff, 1.1, 90, 2.2);
  mazeLight.position.set(start.x, 2.2, start.z);
  mazeGroup.add(mazeLight);

  mazeScene.add(mazeGroup);
}

function moveThroughMaze(delta) {
  if (!mazeCamera || !mazePath.length) return;
  const next = mazePath[mazeSegmentIndex + 1];
  if (!next) {
    buildMazeWorld();
    return;
  }

  const currentPos = new THREE.Vector3(
    mazeCamera.position.x,
    0,
    mazeCamera.position.z
  );
  const targetPos = new THREE.Vector3(next.x, 0, next.z);
  const direction = targetPos.clone().sub(currentPos);
  const distance = direction.length();

  if (distance < 0.1) {
    mazeSegmentIndex++;
    return;
  }

  direction.normalize();
  const speed = 6;
  mazeCamera.position.x += direction.x * speed * delta;
  mazeCamera.position.z += direction.z * speed * delta;

  mazeTargetAngle = Math.atan2(direction.x, direction.z);
  mazeCurrentAngle = THREE.MathUtils.lerp(
    mazeCurrentAngle,
    mazeTargetAngle,
    0.08
  );
  mazeCamera.rotation.y = mazeCurrentAngle;

  const time = mazeClock ? mazeClock.elapsedTime : 0;
  mazeCamera.position.y = 1.6 + Math.sin(time * 3) * 0.05;
  if (mazeLight) {
    mazeLight.position.copy(mazeCamera.position);
    mazeLight.position.y = 2.4;
  }
}

function animateMaze() {
  if (!mazeRenderer || !mazeScene || !mazeCamera) return;
  mazeFrameId = requestAnimationFrame(animateMaze);
  const delta = mazeClock ? mazeClock.getDelta() : 0.016;
  moveThroughMaze(delta);
  mazeRenderer.render(mazeScene, mazeCamera);
}

async function setupMazeScreensaver() {
  await ensureThree();
  if (!mazeCanvas) return;
  setScreensaverCanvas("3d");
  resizeScreensaverCanvases();
  if (!mazeRenderer) {
    mazeRenderer = new THREE.WebGLRenderer({
      canvas: mazeCanvas,
      antialias: true
    });
    mazeRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }
  mazeRenderer.setSize(window.innerWidth, window.innerHeight);
  mazeRenderer.setClearColor(0x000000, 1);

  mazeScene = new THREE.Scene();
  mazeCamera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  mazeClock = new THREE.Clock();
  buildMazeWorld();
  animateMaze();
}

function stopMaze() {
  if (mazeFrameId) cancelAnimationFrame(mazeFrameId);
  mazeFrameId = null;
  mazePath = [];
  mazeSegmentIndex = 0;
  if (mazeRenderer?.setAnimationLoop) mazeRenderer.setAnimationLoop(null);
}

function setupStarfield() {
  stars = [];
  for (let i = 0; i < numStars; i++) {
    stars.push({
      x: Math.random() * saverCanvas.width,
      y: Math.random() * saverCanvas.height,
      z: Math.random() * saverCanvas.width
    });
  }
}

function drawStars() {
  sCtx.fillStyle = "black";
  sCtx.fillRect(0, 0, saverCanvas.width, saverCanvas.height);
  sCtx.fillStyle = "white";
  for (let i = 0; i < numStars; i++) {
    let s = stars[i];
    s.z -= 10;
    if (s.z <= 0) {
      s.x = Math.random() * saverCanvas.width;
      s.y = Math.random() * saverCanvas.height;
      s.z = saverCanvas.width;
    }
    let k = 128.0 / s.z;
    let px = (s.x - saverCanvas.width / 2) * k + saverCanvas.width / 2;
    let py = (s.y - saverCanvas.height / 2) * k + saverCanvas.height / 2;
    if (
      px >= 0 &&
      px <= saverCanvas.width &&
      py >= 0 &&
      py <= saverCanvas.height
    ) {
      let size = (1 - s.z / saverCanvas.width) * 3;
      sCtx.fillRect(px, py, size, size);
    }
  }
}

function setupMatrix() {
  matrixFontSize = Math.max(14, Math.floor(saverCanvas.width / 80));
  const columns = Math.floor(saverCanvas.width / matrixFontSize);
  matrixDrops = new Array(columns)
    .fill(0)
    .map(() => Math.floor(Math.random() * -30));
  sCtx.fillStyle = "black";
  sCtx.fillRect(0, 0, saverCanvas.width, saverCanvas.height);
  sCtx.font = `${matrixFontSize}px monospace`;
}

function drawMatrix() {
  sCtx.fillStyle = "rgba(0, 0, 0, 0.25)";
  sCtx.fillRect(0, 0, saverCanvas.width, saverCanvas.height);
  sCtx.fillStyle = "#00ff7f";
  for (let i = 0; i < matrixDrops.length; i++) {
    const text =
      MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)] || "0";
    sCtx.fillText(text, i * matrixFontSize, matrixDrops[i] * matrixFontSize);
    if (matrixDrops[i] * matrixFontSize > saverCanvas.height && Math.random() > 0.975) {
      matrixDrops[i] = 0;
    }
    matrixDrops[i]++;
  }
}

function setupDvd() {
  const size = Math.max(80, Math.floor(Math.min(saverCanvas.width, saverCanvas.height) / 6));
  const startX = Math.random() * (saverCanvas.width - size);
  const startY = Math.random() * (saverCanvas.height - size / 2);
  dvdLogo = {
    x: startX,
    y: startY,
    dx: 4,
    dy: 3,
    w: size,
    h: size / 2,
    color: DVD_COLORS[Math.floor(Math.random() * DVD_COLORS.length)]
  };
  sCtx.fillStyle = "black";
  sCtx.fillRect(0, 0, saverCanvas.width, saverCanvas.height);
  sCtx.font = `${Math.floor(size / 3)}px 'Segoe UI', 'MS Sans Serif', sans-serif`;
}

function drawDvd() {
  if (!dvdLogo) return;
  sCtx.fillStyle = "rgba(0, 0, 0, 0.4)";
  sCtx.fillRect(0, 0, saverCanvas.width, saverCanvas.height);

  dvdLogo.x += dvdLogo.dx;
  dvdLogo.y += dvdLogo.dy;

  const hitX = dvdLogo.x <= 0 || dvdLogo.x + dvdLogo.w >= saverCanvas.width;
  const hitY = dvdLogo.y <= 0 || dvdLogo.y + dvdLogo.h >= saverCanvas.height;

  if (hitX) {
    dvdLogo.dx *= -1;
    dvdLogo.color = DVD_COLORS[Math.floor(Math.random() * DVD_COLORS.length)];
  }
  if (hitY) {
    dvdLogo.dy *= -1;
    dvdLogo.color = DVD_COLORS[Math.floor(Math.random() * DVD_COLORS.length)];
  }

  sCtx.fillStyle = dvdLogo.color;
  sCtx.strokeStyle = "#000";
  sCtx.lineWidth = 4;
  sCtx.beginPath();
  if (sCtx.roundRect) {
    sCtx.roundRect(dvdLogo.x, dvdLogo.y, dvdLogo.w, dvdLogo.h, dvdLogo.h / 4);
  } else {
    sCtx.rect(dvdLogo.x, dvdLogo.y, dvdLogo.w, dvdLogo.h);
  }
  sCtx.fill();
  sCtx.stroke();

  sCtx.fillStyle = "#000";
  sCtx.textAlign = "center";
  sCtx.textBaseline = "middle";
  sCtx.fillText("DVD", dvdLogo.x + dvdLogo.w / 2, dvdLogo.y + dvdLogo.h / 2 + 2);
}

function setupFireflies() {
  const count = Math.max(50, Math.floor((saverCanvas.width + saverCanvas.height) / 16));
  fireflies = new Array(count).fill(0).map(() => ({
    x: Math.random() * saverCanvas.width,
    y: Math.random() * saverCanvas.height,
    vx: (Math.random() - 0.5) * 1.2,
    vy: (Math.random() - 0.5) * 1.2,
    hue: Math.floor(Math.random() * 120) + 40,
    size: Math.random() * 1.8 + 2.2
  }));
  sCtx.fillStyle = "black";
  sCtx.fillRect(0, 0, saverCanvas.width, saverCanvas.height);
}

function drawFireflies() {
  sCtx.fillStyle = "rgba(0, 0, 0, 0.12)";
  sCtx.fillRect(0, 0, saverCanvas.width, saverCanvas.height);

  fireflies.forEach((fly) => {
    fly.vx += (Math.random() - 0.5) * 0.18;
    fly.vy += (Math.random() - 0.5) * 0.18;
    const speed = Math.hypot(fly.vx, fly.vy);
    const maxSpeed = 1.8;
    if (speed > maxSpeed) {
      fly.vx = (fly.vx / speed) * maxSpeed;
      fly.vy = (fly.vy / speed) * maxSpeed;
    }

    fly.x = (fly.x + fly.vx + saverCanvas.width) % saverCanvas.width;
    fly.y = (fly.y + fly.vy + saverCanvas.height) % saverCanvas.height;

    const radius = fly.size + Math.sin(Date.now() / 600 + fly.x * 0.02) * 0.8;
    const glow = sCtx.createRadialGradient(
      fly.x,
      fly.y,
      0,
      fly.x,
      fly.y,
      radius * 4
    );
    glow.addColorStop(0, `hsla(${fly.hue}, 100%, 75%, 1)`);
    glow.addColorStop(0.35, `hsla(${fly.hue + 30}, 100%, 65%, 0.7)`);
    glow.addColorStop(1, "rgba(0,0,0,0)");
    sCtx.fillStyle = glow;
    sCtx.beginPath();
    sCtx.arc(fly.x, fly.y, radius * 4, 0, Math.PI * 2);
    sCtx.fill();
  });
}

function setupBubbles() {
  const count = Math.max(35, Math.floor(saverCanvas.width / 24));
  bubbles = new Array(count).fill(0).map(() => ({
    x: Math.random() * saverCanvas.width,
    y: Math.random() * saverCanvas.height,
    r: Math.random() * 30 + 12,
    speed: Math.random() * 1.4 + 0.4,
    hue: Math.random() * 360,
    sway: Math.random() * 0.4 + 0.2,
    wobble: Math.random() * 1.2 + 0.4
  }));
  sCtx.fillStyle = "#00111f";
  sCtx.fillRect(0, 0, saverCanvas.width, saverCanvas.height);
}

function drawBubbles() {
  sCtx.fillStyle = "rgba(0, 10, 25, 0.22)";
  sCtx.fillRect(0, 0, saverCanvas.width, saverCanvas.height);

  const time = Date.now() / 1000;
  bubbles.forEach((bubble, idx) => {
    const drift = Math.sin(time * bubble.wobble + idx * 0.6) * bubble.sway;
    bubble.x += drift;
    bubble.y -= bubble.speed;

    if (bubble.y + bubble.r < 0) {
      bubble.y = saverCanvas.height + bubble.r + Math.random() * saverCanvas.height * 0.1;
      bubble.x = Math.random() * saverCanvas.width;
      bubble.hue = Math.random() * 360;
      bubble.r = Math.random() * 30 + 12;
    }

    if (bubble.x < -bubble.r) bubble.x = saverCanvas.width + bubble.r;
    if (bubble.x > saverCanvas.width + bubble.r) bubble.x = -bubble.r;

    const gradient = sCtx.createRadialGradient(
      bubble.x - bubble.r * 0.35,
      bubble.y - bubble.r * 0.35,
      bubble.r * 0.1,
      bubble.x,
      bubble.y,
      bubble.r * 1.4
    );
    gradient.addColorStop(0, `hsla(${bubble.hue}, 100%, 85%, 0.9)`);
    gradient.addColorStop(0.6, `hsla(${bubble.hue}, 80%, 65%, 0.5)`);
    gradient.addColorStop(1, "rgba(0, 20, 40, 0)");

    sCtx.fillStyle = gradient;
    sCtx.beginPath();
    sCtx.arc(bubble.x, bubble.y, bubble.r, 0, Math.PI * 2);
    sCtx.fill();
  });
}

function setupNeonWaves() {
  wavePhase = 0;
  const baseAmp = Math.max(30, Math.min(140, saverCanvas.height / 2.5));
  waveBands = new Array(5).fill(0).map((_, i) => ({
    hue: (i * 70 + Math.random() * 40) % 360,
    speed: 0.5 + Math.random() * 0.9,
    amplitude: baseAmp * (0.35 + Math.random() * 0.9),
    offset: Math.random() * Math.PI * 2
  }));
  sCtx.fillStyle = "#000";
  sCtx.fillRect(0, 0, saverCanvas.width, saverCanvas.height);
}

function drawNeonWaves() {
  wavePhase += 0.02;
  sCtx.fillStyle = "rgba(0, 0, 0, 0.25)";
  sCtx.fillRect(0, 0, saverCanvas.width, saverCanvas.height);

  const mid = saverCanvas.height / 2;
  waveBands.forEach((band, idx) => {
    const hue = (band.hue + wavePhase * 120) % 360;
    sCtx.strokeStyle = `hsla(${hue}, 90%, 60%, 0.85)`;
    sCtx.lineWidth = 1.5 + (idx % 2);
    sCtx.beginPath();
    for (let x = -20; x <= saverCanvas.width + 20; x += 12) {
      const y =
        mid +
        Math.sin(wavePhase * band.speed + x * 0.022 + band.offset) * band.amplitude +
        Math.cos(wavePhase * 0.7 + x * 0.015 + idx) * 10;
      if (x === -20) sCtx.moveTo(x, y);
      else sCtx.lineTo(x, y);
    }
    sCtx.stroke();
  });
}

function setupFish() {
  const count = Math.max(8, Math.floor((saverCanvas.width + saverCanvas.height) / 160));
  fishSchool = new Array(count).fill(0).map(() => ({
    x: Math.random() * saverCanvas.width,
    y: Math.random() * saverCanvas.height,
    size: 18 + Math.random() * 22,
    speed: 1 + Math.random() * 1.8,
    sway: Math.random() * Math.PI * 2,
    hue: Math.floor(Math.random() * 360),
    dir: Math.random() > 0.5 ? 1 : -1
  }));
  sCtx.fillStyle = "#001019";
  sCtx.fillRect(0, 0, saverCanvas.width, saverCanvas.height);
}

function drawFish() {
  sCtx.fillStyle = "rgba(0, 10, 20, 0.25)";
  sCtx.fillRect(0, 0, saverCanvas.width, saverCanvas.height);

  fishSchool.forEach((fish) => {
    fish.sway += 0.08;
    fish.x += fish.speed * fish.dir;
    fish.y += Math.sin(fish.sway) * 0.6;

    if (fish.x > saverCanvas.width + fish.size) fish.x = -fish.size;
    if (fish.x < -fish.size) fish.x = saverCanvas.width + fish.size;
    if (fish.y > saverCanvas.height + fish.size * 0.5) fish.y = -fish.size * 0.5;
    if (fish.y < -fish.size * 0.5) fish.y = saverCanvas.height + fish.size * 0.5;

    const bodyLength = fish.size * 2.4;
    const bodyHeight = fish.size * 1;
    const cx = fish.dir === 1 ? fish.x : fish.x + bodyLength;

    sCtx.save();
    sCtx.translate(cx, fish.y);
    sCtx.scale(fish.dir, 1);

    const gradient = sCtx.createLinearGradient(-bodyLength / 2, 0, bodyLength / 2, 0);
    gradient.addColorStop(0, `hsla(${fish.hue}, 70%, 60%, 0.9)`);
    gradient.addColorStop(1, `hsla(${(fish.hue + 80) % 360}, 80%, 70%, 0.9)`);
    sCtx.fillStyle = gradient;

    sCtx.beginPath();
    sCtx.ellipse(0, 0, bodyLength / 2, bodyHeight / 2, 0, 0, Math.PI * 2);
    sCtx.fill();

    sCtx.beginPath();
    sCtx.moveTo(-bodyLength / 2, 0);
    sCtx.lineTo(-bodyLength / 2 - fish.size * 0.6, fish.size * 0.6);
    sCtx.lineTo(-bodyLength / 2 - fish.size * 0.6, -fish.size * 0.6);
    sCtx.closePath();
    sCtx.fill();

    sCtx.fillStyle = "rgba(255,255,255,0.8)";
    sCtx.beginPath();
    sCtx.arc(bodyLength / 4, -fish.size * 0.12, fish.size * 0.18, 0, Math.PI * 2);
    sCtx.fill();
    sCtx.fillStyle = "#000";
    sCtx.beginPath();
    sCtx.arc(bodyLength / 4, -fish.size * 0.12, fish.size * 0.08, 0, Math.PI * 2);
    sCtx.fill();

    sCtx.restore();
  });
}

function setupTunnel() {
  const maxSize = Math.max(saverCanvas.width, saverCanvas.height);
  tunnelSegments = new Array(28).fill(0).map((_, i) => ({
    radius: maxSize * (i / 12),
    width: 3 + Math.random() * 5,
    angle: Math.random() * Math.PI * 2,
    speed: 6 + Math.random() * 4,
    hue: Math.floor(Math.random() * 360)
  }));
  sCtx.fillStyle = "#000";
  sCtx.fillRect(0, 0, saverCanvas.width, saverCanvas.height);
}

function drawTunnel() {
  const cx = saverCanvas.width / 2;
  const cy = saverCanvas.height / 2;
  const maxSize = Math.max(saverCanvas.width, saverCanvas.height);
  sCtx.fillStyle = "rgba(0, 0, 0, 0.2)";
  sCtx.fillRect(0, 0, saverCanvas.width, saverCanvas.height);

  tunnelSegments.forEach((seg) => {
    seg.radius -= seg.speed;
    seg.angle += 0.005;
    if (seg.radius < 20) {
      seg.radius = maxSize + Math.random() * maxSize * 0.5;
      seg.angle = Math.random() * Math.PI * 2;
      seg.hue = Math.floor(Math.random() * 360);
    }

    sCtx.save();
    sCtx.translate(cx, cy);
    sCtx.rotate(seg.angle);
    sCtx.strokeStyle = `hsla(${seg.hue}, 80%, 65%, 0.85)`;
    sCtx.lineWidth = seg.width;
    const size = seg.radius;
    sCtx.beginPath();
    sCtx.rect(-size, -size, size * 2, size * 2);
    sCtx.stroke();

    sCtx.strokeStyle = `hsla(${(seg.hue + 120) % 360}, 90%, 70%, 0.6)`;
    sCtx.lineWidth = 1;
    sCtx.beginPath();
    sCtx.moveTo(-size, 0);
    sCtx.lineTo(size, 0);
    sCtx.moveTo(0, -size);
    sCtx.lineTo(0, size);
    sCtx.stroke();
    sCtx.restore();
  });
}

function setupCastaway() {
  const w = saverCanvas.width;
  const h = saverCanvas.height;
  const actionPool = ["nap", "fish", "signal", "stare", "tinker", "campfire"];
  castawayScene = {
    time: 0,
    wave: 0,
    action: actionPool[Math.floor(Math.random() * actionPool.length)],
    actionTimer: 0,
    clouds: new Array(4).fill(0).map(() => ({
      x: Math.random() * w,
      y: h * 0.15 + Math.random() * h * 0.12,
      speed: 0.15 + Math.random() * 0.2,
      size: 50 + Math.random() * 80
    })),
    birds: new Array(6).fill(0).map(() => ({
      x: Math.random() * w,
      y: h * 0.2 + Math.random() * h * 0.15,
      speed: 1 + Math.random() * 0.8,
      flap: Math.random() * Math.PI * 2
    })),
    bottle: {
      x: Math.random() * w,
      y: h * 0.6 + Math.random() * h * 0.1,
      bob: Math.random() * Math.PI * 2
    }
  };
  castawayScene.actionTimer = 200 + Math.floor(Math.random() * 220);
  sCtx.fillStyle = "#000";
  sCtx.fillRect(0, 0, w, h);
}

function drawCastaway() {
  if (!castawayScene) return;
  const w = saverCanvas.width;
  const h = saverCanvas.height;
  castawayScene.time += 1;
  castawayScene.wave += 0.02;
  castawayScene.actionTimer -= 1;

  if (castawayScene.actionTimer <= 0) {
    const actions = ["nap", "fish", "signal", "stare", "tinker", "campfire"];
    const next = actions[Math.floor(Math.random() * actions.length)];
    castawayScene.action = next;
    castawayScene.actionTimer = 180 + Math.floor(Math.random() * 240);
  }

  const dayCycle = (Math.sin(castawayScene.time * 0.00035) + 1) / 2;
  const skyTop = `hsl(${200 - dayCycle * 80}, 80%, ${40 + dayCycle * 20}%)`;
  const skyBottom = `hsl(${210 - dayCycle * 40}, 70%, ${60 + dayCycle * 10}%)`;
  const skyGrad = sCtx.createLinearGradient(0, 0, 0, h);
  skyGrad.addColorStop(0, skyTop);
  skyGrad.addColorStop(1, skyBottom);
  sCtx.fillStyle = skyGrad;
  sCtx.fillRect(0, 0, w, h);

  const sunX = (w * (dayCycle * 0.7 + 0.15)) % (w + 80);
  const sunY = h * (0.25 - 0.15 * Math.cos(dayCycle * Math.PI));
  sCtx.fillStyle = `rgba(255, 230, 150, ${0.4 + dayCycle * 0.3})`;
  sCtx.beginPath();
  sCtx.arc(sunX, sunY, 50, 0, Math.PI * 2);
  sCtx.fill();
  sCtx.fillStyle = `rgba(255, 210, 120, ${0.8})`;
  sCtx.beginPath();
  sCtx.arc(sunX, sunY, 24, 0, Math.PI * 2);
  sCtx.fill();

  const oceanTop = `rgba(0, 70, 130, 0.9)`;
  const oceanBottom = `rgba(0, 30, 70, 0.95)`;
  const seaGrad = sCtx.createLinearGradient(0, h * 0.45, 0, h);
  seaGrad.addColorStop(0, oceanTop);
  seaGrad.addColorStop(1, oceanBottom);
  sCtx.fillStyle = seaGrad;
  sCtx.fillRect(0, h * 0.45, w, h * 0.65);

  sCtx.strokeStyle = "rgba(255,255,255,0.6)";
  sCtx.lineWidth = 2;
  for (let i = 0; i < 6; i++) {
    const waveY = h * 0.5 + i * 30;
    sCtx.beginPath();
    for (let x = 0; x <= w; x += 12) {
      const y =
        waveY +
        Math.sin(castawayScene.wave * (0.8 + i * 0.1) + x * 0.02) * (6 + i);
      if (x === 0) sCtx.moveTo(x, y);
      else sCtx.lineTo(x, y);
    }
    sCtx.stroke();
  }

  const islandX = w * 0.58;
  const islandY = h * 0.72;
  sCtx.fillStyle = "#d0a85b";
  sCtx.beginPath();
  sCtx.ellipse(islandX, islandY, 220, 70, 0, 0, Math.PI * 2);
  sCtx.fill();
  sCtx.fillStyle = "#c28c3b";
  sCtx.beginPath();
  sCtx.ellipse(islandX + 10, islandY + 6, 200, 52, 0, 0, Math.PI * 2);
  sCtx.fill();

  sCtx.save();
  sCtx.translate(islandX - 60, islandY - 120);
  sCtx.fillStyle = "#8b5a2b";
  sCtx.beginPath();
  sCtx.moveTo(0, 120);
  sCtx.lineTo(20, 10);
  sCtx.lineTo(40, 120);
  sCtx.closePath();
  sCtx.fill();
  sCtx.fillStyle = "#1d8c45";
  for (let i = 0; i < 5; i++) {
    sCtx.beginPath();
    sCtx.ellipse(20 + i * 4, 16 + i * 4, 60, 14, (Math.PI / 6) * (i - 2), 0, Math.PI * 2);
    sCtx.fill();
  }
  sCtx.restore();

  castawayScene.clouds.forEach((cloud) => {
    cloud.x += cloud.speed;
    if (cloud.x - cloud.size > w) cloud.x = -cloud.size;
    sCtx.fillStyle = "rgba(255,255,255,0.9)";
    sCtx.beginPath();
    sCtx.ellipse(cloud.x, cloud.y, cloud.size, cloud.size * 0.55, 0, 0, Math.PI * 2);
    sCtx.ellipse(cloud.x - cloud.size * 0.5, cloud.y + 6, cloud.size * 0.6, cloud.size * 0.35, 0, 0, Math.PI * 2);
    sCtx.ellipse(cloud.x + cloud.size * 0.5, cloud.y + 8, cloud.size * 0.7, cloud.size * 0.4, 0, 0, Math.PI * 2);
    sCtx.fill();
  });

  castawayScene.birds.forEach((bird) => {
    bird.x += bird.speed;
    bird.flap += 0.2;
    if (bird.x > w + 30) {
      bird.x = -20;
      bird.y = h * 0.2 + Math.random() * h * 0.15;
    }
    const wing = Math.sin(bird.flap) * 8;
    sCtx.strokeStyle = "rgba(0,0,0,0.6)";
    sCtx.lineWidth = 2;
    sCtx.beginPath();
    sCtx.moveTo(bird.x - 8, bird.y + wing);
    sCtx.quadraticCurveTo(bird.x, bird.y - 6, bird.x + 8, bird.y + wing);
    sCtx.stroke();
  });

  castawayScene.bottle.bob += 0.04;
  castawayScene.bottle.x += 0.4;
  if (castawayScene.bottle.x > w + 20) castawayScene.bottle.x = -20;
  const bottleY =
    castawayScene.bottle.y + Math.sin(castawayScene.bottle.bob) * 6 + Math.sin(castawayScene.wave * 1.4) * 4;
  sCtx.fillStyle = "rgba(220, 255, 255, 0.7)";
  sCtx.beginPath();
  sCtx.ellipse(castawayScene.bottle.x, bottleY, 8, 16, 0.2, 0, Math.PI * 2);
  sCtx.fill();
  sCtx.fillStyle = "rgba(80,120,160,0.9)";
  sCtx.fillRect(castawayScene.bottle.x - 3, bottleY - 16, 6, 6);

  const manX = islandX + 20;
  const manY = islandY - 18;
  const action = castawayScene.action;
  const bob = Math.sin(castawayScene.wave * 3) * 2;
  sCtx.strokeStyle = "#2d2415";
  sCtx.lineWidth = 6;
  sCtx.lineCap = "round";
  sCtx.beginPath();
  sCtx.moveTo(manX, manY - 18 + bob);
  sCtx.lineTo(manX, manY + 12 + bob);
  sCtx.stroke();

  sCtx.fillStyle = "#f4d7b2";
  sCtx.beginPath();
  sCtx.arc(manX, manY - 30 + bob, 10, 0, Math.PI * 2);
  sCtx.fill();

  const leftArm = action === "signal" ? -24 : -14;
  const rightArm = action === "fish" ? 28 : 14;
  sCtx.lineWidth = 4;
  sCtx.strokeStyle = "#3b2f1d";
  sCtx.beginPath();
  sCtx.moveTo(manX, manY - 4 + bob);
  sCtx.lineTo(manX + leftArm, manY + (action === "nap" ? 4 : -2) + bob);
  sCtx.stroke();
  sCtx.beginPath();
  sCtx.moveTo(manX, manY - 4 + bob);
  sCtx.lineTo(manX + rightArm, manY + (action === "fish" ? 16 : 2) + bob);
  sCtx.stroke();

  sCtx.lineWidth = 5;
  sCtx.beginPath();
  sCtx.moveTo(manX, manY + 12 + bob);
  sCtx.lineTo(manX - 10, manY + 32 + bob);
  sCtx.stroke();
  sCtx.beginPath();
  sCtx.moveTo(manX, manY + 12 + bob);
  sCtx.lineTo(manX + 12, manY + 32 + bob);
  sCtx.stroke();

  if (action === "fish") {
    sCtx.strokeStyle = "rgba(40,60,80,0.8)";
    sCtx.lineWidth = 2;
    sCtx.beginPath();
    sCtx.moveTo(manX + 28, manY + 14 + bob);
    sCtx.lineTo(manX + 32, manY - 18);
    sCtx.lineTo(manX + 34, manY - 60);
    sCtx.stroke();
    sCtx.beginPath();
    sCtx.moveTo(manX + 34, manY - 60);
    sCtx.lineTo(manX + 34, manY + 160 + Math.sin(castawayScene.wave * 3) * 18);
    sCtx.stroke();
  } else if (action === "signal") {
    sCtx.fillStyle = "#ffef4a";
    sCtx.beginPath();
    sCtx.ellipse(manX - 30, manY - 18, 12, 28, -0.3, 0, Math.PI * 2);
    sCtx.fill();
  } else if (action === "campfire") {
    const flicker = 6 + Math.sin(castawayScene.time * 0.25) * 3;
    sCtx.fillStyle = "#5b3a1a";
    sCtx.fillRect(manX - 70, manY + 32, 12, 8);
    sCtx.fillRect(manX - 56, manY + 32, 12, 8);
    const grad = sCtx.createRadialGradient(manX - 60, manY + 20, 2, manX - 60, manY + 20, 26);
    grad.addColorStop(0, "rgba(255,200,60,0.9)");
    grad.addColorStop(1, "rgba(255,100,40,0.1)");
    sCtx.fillStyle = grad;
    sCtx.beginPath();
    sCtx.ellipse(manX - 60, manY + 18, 14, flicker, 0, 0, Math.PI * 2);
    sCtx.fill();
  } else if (action === "tinker") {
    sCtx.fillStyle = "#7c7c7c";
    sCtx.fillRect(manX + 16, manY + 4 + bob, 18, 10);
    sCtx.fillRect(manX + 12, manY + 12 + bob, 6, 6);
  }

  sCtx.fillStyle = "rgba(0,0,0,0.2)";
  sCtx.beginPath();
  sCtx.ellipse(islandX + 10, islandY + 10, 220, 60, 0, 0, Math.PI * 2);
  sCtx.fill();
}

function setupFlyingToasters() {
  sCtx.fillStyle = "#020611";
  sCtx.fillRect(0, 0, saverCanvas.width, saverCanvas.height);
  const count = Math.max(6, Math.floor((saverCanvas.width + saverCanvas.height) / 230));
  toasters = new Array(count).fill(0).map((_, idx) => createFlyingToaster(idx));
}

function createFlyingToaster(seed) {
  const direction = Math.random() < 0.5 ? -1 : 1;
  const startX =
    direction === 1
      ? -120 - Math.random() * 160
      : saverCanvas.width + 120 + Math.random() * 160;
  return {
    x: startX,
    y: Math.random() * saverCanvas.height * 0.7 + saverCanvas.height * 0.15,
    vx: direction * (Math.random() * 1.6 + 1.2),
    vy: (Math.random() - 0.5) * 0.6,
    flap: Math.random() * Math.PI * 2,
    wobble: Math.random() * 0.8 + 0.4,
    scale: Math.random() * 0.35 + 0.75,
    sparkleOffset: seed + Math.random() * Math.PI,
    tint: TOASTER_COLORS[Math.floor(Math.random() * TOASTER_COLORS.length)]
  };
}

function drawFlyingToasters() {
  sCtx.fillStyle = "rgba(0, 0, 10, 0.25)";
  sCtx.fillRect(0, 0, saverCanvas.width, saverCanvas.height);

  const time = Date.now() / 1000;
  toasters.forEach((toaster, idx) => {
    toaster.x += toaster.vx;
    toaster.y += toaster.vy + Math.sin(time * toaster.wobble + idx) * 0.6;
    toaster.flap += 0.22 + toaster.wobble * 0.04;

    if (toaster.y < saverCanvas.height * 0.08 || toaster.y > saverCanvas.height * 0.92)
      toaster.vy *= -1;

    if (toaster.x < -200 || toaster.x > saverCanvas.width + 200) {
      toasters[idx] = createFlyingToaster(idx);
      return;
    }

    drawFlyingToasterShape(toaster, time);
  });
}

function drawFlyingToasterShape(toaster, time) {
  const baseWidth = 90;
  const baseHeight = 52;
  const wingLength = 38;
  const flapAngle = Math.sin(toaster.flap) * 0.7 + 0.9;

  sCtx.save();
  sCtx.translate(toaster.x, toaster.y);
  const facingLeft = toaster.vx < 0;
  sCtx.scale(toaster.scale * (facingLeft ? -1 : 1), toaster.scale);
  sCtx.rotate(Math.sin(time * 0.9 + toaster.sparkleOffset) * 0.18);

  const glow = sCtx.createRadialGradient(0, 0, 10, 0, 0, 80);
  glow.addColorStop(0, "rgba(200, 230, 255, 0.35)");
  glow.addColorStop(1, "rgba(0, 10, 30, 0)");
  sCtx.fillStyle = glow;
  sCtx.beginPath();
  sCtx.ellipse(0, baseHeight * 0.05, baseWidth * 0.9, baseHeight * 0.95, 0, 0, Math.PI * 2);
  sCtx.fill();

  const drawWing = (flip) => {
    sCtx.save();
    sCtx.scale(flip ? -1 : 1, 1);
    sCtx.translate(baseWidth / 2.4, baseHeight * 0.05);
    sCtx.rotate(-0.7 + flapAngle * 0.6);
    sCtx.beginPath();
    sCtx.moveTo(0, 0);
    sCtx.quadraticCurveTo(wingLength * 0.2, -wingLength * 0.4, wingLength * 0.5, -wingLength * flapAngle);
    sCtx.quadraticCurveTo(wingLength * 0.9, -wingLength * 0.25, wingLength, 0);
    sCtx.quadraticCurveTo(wingLength * 0.7, wingLength * 0.12, wingLength * 0.28, wingLength * 0.06);
    sCtx.closePath();
    sCtx.fillStyle = "#fdfdfd";
    sCtx.strokeStyle = "#c8d9f2";
    sCtx.lineWidth = 2.2;
    sCtx.fill();
    sCtx.stroke();
    sCtx.restore();
  };

  drawWing(false);
  drawWing(true);

  const bodyGradient = sCtx.createLinearGradient(
    -baseWidth / 2,
    -baseHeight / 2,
    baseWidth / 2,
    baseHeight / 2
  );
  bodyGradient.addColorStop(0, toaster.tint);
  bodyGradient.addColorStop(1, "#9fb1cc");

  sCtx.fillStyle = bodyGradient;
  sCtx.strokeStyle = "#5f6c83";
  sCtx.lineWidth = 2.4;
  sCtx.beginPath();
  if (sCtx.roundRect) {
    sCtx.roundRect(-baseWidth / 2, -baseHeight / 2, baseWidth, baseHeight, 12);
  } else {
    sCtx.rect(-baseWidth / 2, -baseHeight / 2, baseWidth, baseHeight);
  }
  sCtx.fill();
  sCtx.stroke();

  sCtx.fillStyle = "#8797af";
  sCtx.fillRect(-baseWidth / 2 + 8, -baseHeight / 2 + 6, baseWidth - 16, 8);
  sCtx.fillStyle = "#cbd5e8";
  sCtx.fillRect(-baseWidth / 2 + 12, -baseHeight / 2 + 8, baseWidth - 24, 6);

  sCtx.fillStyle = "#556076";
  sCtx.fillRect(-baseWidth / 2 + 14, -baseHeight / 2 + 20, baseWidth - 28, 4);
  sCtx.fillRect(-baseWidth / 2 + 14, -baseHeight / 2 + 28, baseWidth - 28, 4);

  const sliceWidth = 18;
  const sliceHeight = 18;
  const sliceOffset = Math.sin(time * 1.4 + toaster.sparkleOffset) * 2;
  sCtx.fillStyle = "#e1b679";
  sCtx.strokeStyle = "#c48f47";
  sCtx.lineWidth = 1.4;
  [
    [-sliceWidth - 6, -baseHeight / 2 - 4 - sliceOffset],
    [sliceWidth + 2, -baseHeight / 2 - 8 + sliceOffset]
  ].forEach(([sx, sy]) => {
    sCtx.beginPath();
    if (sCtx.roundRect) sCtx.roundRect(sx, sy, sliceWidth, sliceHeight, 4);
    else sCtx.rect(sx, sy, sliceWidth, sliceHeight);
    sCtx.fill();
    sCtx.stroke();
    sCtx.fillStyle = "#f3cf9c";
    sCtx.fillRect(sx + 4, sy + 4, sliceWidth - 8, sliceHeight - 10);
    sCtx.fillStyle = "#e1b679";
  });

  sCtx.fillStyle = "#2d3b4f";
  sCtx.beginPath();
  sCtx.arc(baseWidth / 2 - 16, baseHeight / 2 - 14, 6, 0, Math.PI * 2);
  sCtx.fill();
  sCtx.fillStyle = "#7ab2f7";
  sCtx.beginPath();
  sCtx.arc(baseWidth / 2 - 16, baseHeight / 2 - 14, 3, 0, Math.PI * 2);
  sCtx.fill();

  sCtx.restore();
}

function setupPipes() {
  pipes = [];
  sCtx.fillStyle = "black";
  sCtx.fillRect(0, 0, saverCanvas.width, saverCanvas.height);
  for (let i = 0; i < 4; i++) {
    pipes.push({
      x: Math.random() * saverCanvas.width,
      y: Math.random() * saverCanvas.height,
      dir: pipeDirections[Math.floor(Math.random() * pipeDirections.length)],
      color: PIPE_COLORS[i % PIPE_COLORS.length],
      stepSize: 14,
      turnCounter: 0
    });
  }
}

function chooseNewPipeDirection(pipe) {
  const options = pipeDirections.filter(
    (d) => !(d.x === -pipe.dir.x && d.y === -pipe.dir.y)
  );
  pipe.dir = options[Math.floor(Math.random() * options.length)];
  pipe.turnCounter = 0;
}

function adjustColor(col, amt) {
  const hex = col.replace("#", "");
  const num = parseInt(hex, 16);
  let r = (num >> 16) + amt;
  let g = ((num >> 8) & 0xff) + amt;
  let b = (num & 0xff) + amt;
  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));
  return `rgb(${r}, ${g}, ${b})`;
}

function drawPipes() {
  sCtx.fillStyle = "rgba(0,0,0,0.08)";
  sCtx.fillRect(0, 0, saverCanvas.width, saverCanvas.height);

  pipes.forEach((pipe) => {
    pipe.turnCounter++;
    const dangerMargin = 30;
    let nextX = pipe.x + pipe.dir.x * pipe.stepSize;
    let nextY = pipe.y + pipe.dir.y * pipe.stepSize;

    if (
      nextX < dangerMargin ||
      nextX > saverCanvas.width - dangerMargin ||
      nextY < dangerMargin ||
      nextY > saverCanvas.height - dangerMargin ||
      Math.random() < 0.1 * (pipe.turnCounter / 6)
    ) {
      chooseNewPipeDirection(pipe);
      nextX = pipe.x + pipe.dir.x * pipe.stepSize;
      nextY = pipe.y + pipe.dir.y * pipe.stepSize;
    }

    const highlight = adjustColor(pipe.color, 80);
    const shadow = adjustColor(pipe.color, -80);
    const grad = sCtx.createLinearGradient(pipe.x, pipe.y, nextX, nextY);
    grad.addColorStop(0, highlight);
    grad.addColorStop(0.5, pipe.color);
    grad.addColorStop(1, shadow);

    sCtx.lineWidth = 12;
    sCtx.lineCap = "round";
    sCtx.strokeStyle = grad;
    sCtx.beginPath();
    sCtx.moveTo(pipe.x, pipe.y);
    sCtx.lineTo(nextX, nextY);
    sCtx.stroke();

    sCtx.fillStyle = highlight;
    sCtx.beginPath();
    sCtx.arc(nextX, nextY, 4, 0, Math.PI * 2);
    sCtx.fill();

    pipe.x = nextX;
    pipe.y = nextY;
  });
}


export { screensaverContext, initScreensaver, submitLockPassphrase, hideUnlockPrompt };
