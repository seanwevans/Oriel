import * as THREE from "three";

const BRUSHES = {
  sand: { color: 0xf5d48f, scatter: 0.8 },
  water: { color: 0x63c4ff, scatter: 1.2 },
  ember: { color: 0xff835c, scatter: 0.6 },
  aurora: { color: 0x9c8cff, scatter: 1 }
};

const WORLD_BOUNDS = 12;
const FLOOR_HEIGHT = 0.3;

export function getSandspiel3DRoot() {
  return `
    <div class="sandspiel3d">
      <div class="sandspiel3d-toolbar">
        <div class="sandspiel3d-title">Sandspiel3D — drop and sculpt colorful voxels.</div>
        <div class="sandspiel3d-controls">
          <label class="sandspiel3d-field">Brush
            <select class="sandspiel3d-brush">
              <option value="sand">Sand</option>
              <option value="water">Water</option>
              <option value="ember">Ember</option>
              <option value="aurora">Aurora</option>
            </select>
          </label>
          <label class="sandspiel3d-field">Gravity
            <input class="sandspiel3d-gravity" type="range" min="4" max="24" step="1" value="12">
          </label>
          <label class="sandspiel3d-field">Scatter
            <input class="sandspiel3d-scatter" type="range" min="0.2" max="2" step="0.1" value="1">
          </label>
          <button class="task-btn sandspiel3d-reset" type="button">Reset World</button>
        </div>
      </div>
      <div class="sandspiel3d-stage" role="presentation">
        <canvas class="sandspiel3d-canvas"></canvas>
        <div class="sandspiel3d-overlay" aria-live="polite">Click or drag to pour particles. Scroll to zoom.</div>
      </div>
    </div>
  `;
}

function createVoxel(color) {
  const geometry = new THREE.BoxGeometry(0.6, 0.6, 0.6);
  const material = new THREE.MeshStandardMaterial({ color, roughness: 0.6, metalness: 0 });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

export function initSandspiel3d(win) {
  const canvas = win.querySelector(".sandspiel3d-canvas");
  if (!canvas) return;

  const brushSelect = win.querySelector(".sandspiel3d-brush");
  const gravitySlider = win.querySelector(".sandspiel3d-gravity");
  const scatterSlider = win.querySelector(".sandspiel3d-scatter");
  const resetBtn = win.querySelector(".sandspiel3d-reset");

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.shadowMap.enabled = true;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0c0f1c);

  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 200);
  camera.position.set(6, 10, 14);

  const ambient = new THREE.HemisphereLight(0xffffff, 0x222222, 0.75);
  scene.add(ambient);

  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(10, 14, 8);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.set(1024, 1024);
  scene.add(dirLight);

  const floorGeo = new THREE.BoxGeometry(WORLD_BOUNDS * 2, FLOOR_HEIGHT, WORLD_BOUNDS * 2);
  const floorMat = new THREE.MeshStandardMaterial({ color: 0x2b3146, roughness: 0.9, metalness: 0.1 });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.position.y = -FLOOR_HEIGHT / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  const boundsHelper = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(WORLD_BOUNDS * 2, WORLD_BOUNDS * 1.5, WORLD_BOUNDS * 2)),
    new THREE.LineBasicMaterial({ color: 0x3a4b7a })
  );
  boundsHelper.position.y = WORLD_BOUNDS * 0.3;
  scene.add(boundsHelper);

  const raycaster = new THREE.Raycaster();
  const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

  const voxels = [];
  let isPointerDown = false;
  let spawnInterval = null;
  let lastTime = performance.now();

  function resize() {
    const rect = canvas.getBoundingClientRect();
    camera.aspect = rect.width / rect.height;
    camera.updateProjectionMatrix();
    renderer.setSize(rect.width, rect.height, false);
  }

  resize();

  function clearWorld() {
    voxels.forEach((v) => scene.remove(v.mesh));
    voxels.length = 0;
  }

  function spawnVoxel(targetPoint) {
    const brush = BRUSHES[brushSelect?.value] || BRUSHES.sand;
    const scatterScale = parseFloat(scatterSlider?.value || "1");
    const mesh = createVoxel(brush.color);
    const jitter = (Math.random() - 0.5) * brush.scatter * scatterScale;
    const position = targetPoint.clone();
    position.y = WORLD_BOUNDS * 0.9;
    position.x = Math.max(-WORLD_BOUNDS + 0.6, Math.min(WORLD_BOUNDS - 0.6, position.x + jitter));
    position.z = Math.max(-WORLD_BOUNDS + 0.6, Math.min(WORLD_BOUNDS - 0.6, position.z + jitter));

    mesh.position.copy(position);
    scene.add(mesh);

    const velocity = new THREE.Vector3((Math.random() - 0.5) * 0.4, 0, (Math.random() - 0.5) * 0.4);
    voxels.push({ mesh, velocity });
  }

  function getPointerTarget(event) {
    const rect = canvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera({ x, y }, camera);
    const point = new THREE.Vector3();
    raycaster.ray.intersectPlane(groundPlane, point);
    return point.clamp(
      new THREE.Vector3(-WORLD_BOUNDS + 1, 0, -WORLD_BOUNDS + 1),
      new THREE.Vector3(WORLD_BOUNDS - 1, 0, WORLD_BOUNDS - 1)
    );
  }

  function startPouring(evt) {
    isPointerDown = true;
    const target = getPointerTarget(evt);
    spawnVoxel(target);
    spawnInterval = window.setInterval(() => spawnVoxel(target), 160);
  }

  function stopPouring() {
    isPointerDown = false;
    if (spawnInterval) {
      window.clearInterval(spawnInterval);
      spawnInterval = null;
    }
  }

  canvas.addEventListener("pointerdown", (evt) => {
    canvas.setPointerCapture(evt.pointerId);
    startPouring(evt);
  });

  canvas.addEventListener("pointermove", (evt) => {
    if (!isPointerDown || !spawnInterval) return;
    const target = getPointerTarget(evt);
    spawnVoxel(target);
  });

  canvas.addEventListener("pointerup", (evt) => {
    canvas.releasePointerCapture(evt.pointerId);
    stopPouring();
  });

  canvas.addEventListener("pointerleave", stopPouring);

  resetBtn?.addEventListener("click", clearWorld);

  let zoom = 14;
  canvas.addEventListener("wheel", (evt) => {
    evt.preventDefault();
    zoom = Math.min(26, Math.max(8, zoom + Math.sign(evt.deltaY)));
  });

  function update(delta) {
    const gravity = parseFloat(gravitySlider?.value || "12");
    const damping = 0.8;

    voxels.forEach((voxel) => {
      voxel.velocity.y -= gravity * delta;
      voxel.mesh.position.addScaledVector(voxel.velocity, delta);

      const limit = WORLD_BOUNDS - 0.6;
      if (Math.abs(voxel.mesh.position.x) > limit) {
        voxel.mesh.position.x = Math.sign(voxel.mesh.position.x) * limit;
        voxel.velocity.x *= -damping;
      }
      if (Math.abs(voxel.mesh.position.z) > limit) {
        voxel.mesh.position.z = Math.sign(voxel.mesh.position.z) * limit;
        voxel.velocity.z *= -damping;
      }

      const minY = FLOOR_HEIGHT * 0.5;
      if (voxel.mesh.position.y < minY) {
        voxel.mesh.position.y = minY;
        voxel.velocity.y *= -0.45;
        voxel.velocity.x *= damping;
        voxel.velocity.z *= damping;

        if (Math.abs(voxel.velocity.y) < 0.6) {
          voxel.velocity.y = 0;
        }
      }
    });

    const t = performance.now() * 0.0002;
    const radius = zoom;
    camera.position.x = Math.cos(t) * radius;
    camera.position.z = Math.sin(t) * radius;
    camera.position.y = 8 + Math.sin(t * 0.5) * 1.5;
    camera.lookAt(new THREE.Vector3(0, 1, 0));
  }

  function render() {
    const now = performance.now();
    const delta = Math.min(0.05, (now - lastTime) / 1000);
    lastTime = now;

    resize();
    update(delta);
    renderer.render(scene, camera);
    animationId = requestAnimationFrame(render);
  }

  let animationId = requestAnimationFrame(render);

  win.sandspiel3dCleanup = () => {
    cancelAnimationFrame(animationId);
    clearWorld();
    renderer.dispose();
    floorGeo.dispose();
    floorMat.dispose();
  };
}
