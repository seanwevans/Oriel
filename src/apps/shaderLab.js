import { loadThree } from "../threeLoader.js";

const GLSL1_VERTEX = `precision highp float;
attribute vec3 position;
void main() {
  gl_Position = vec4(position, 1.0);
}`;

const GLSL3_VERTEX = `#version 300 es
precision highp float;
in vec3 position;
void main() {
  gl_Position = vec4(position, 1.0);
}`;

const DEFAULT_FRAGMENT = `
precision highp float;

uniform vec3 iResolution;
uniform float iTime;
uniform vec2 iMouse;

void main() {
  vec2 uv = gl_FragCoord.xy / iResolution.xy;
  vec2 p = uv - 0.5;
  p.x *= iResolution.x / iResolution.y;

  float vignette = smoothstep(0.9, 0.35, 1.0 - length(p));
  float wave = sin(iTime + length(p) * 6.2831);
  vec3 color = mix(vec3(0.07, 0.05, 0.12), vec3(0.25, 0.6, 0.9), uv.y);
  color += 0.35 * vec3(0.9, 0.4, 0.8) * wave * vignette;

  gl_FragColor = vec4(color, 1.0);
}
`;

const PRESETS = [
  {
    id: "sunset",
    name: "Sunset Horizon",
    url: new URL("../assets/shaders/sunset.frag", import.meta.url).href,
  },
  {
    id: "grid",
    name: "Retro Grid",
    url: new URL("../assets/shaders/grid.frag", import.meta.url).href,
  },
  {
    id: "nebula",
    name: "Nebula Noise",
    url: new URL("../assets/shaders/nebula.frag", import.meta.url).href,
  },
];

const ERROR_PATTERN = /ERROR:\s*\d+:(\d+)(?::(\d+))?:\s*(.*)/i;

const GLSL3_HINTS = [
  /#version\s+300\s+es/i,
  /\bout\s+vec4\b/i,
  /\bin\s+vec[234]\b/i,
];

const usesGLSL3 = (source) => GLSL3_HINTS.some((pattern) => pattern.test(source));

export function getShaderLabRoot() {
  const options = PRESETS.map(
    (preset) => `<option value="${preset.id}">${preset.name}</option>`
  ).join("");

  return `
    <div class="shaderlab">
      <div class="shaderlab-toolbar">
        <div class="shaderlab-controls">
          <label class="shaderlab-field">Preset
            <select class="shaderlab-preset">${options}</select>
          </label>
          <button class="task-btn shaderlab-load">Load Preset</button>
          <button class="task-btn shaderlab-run">Run Shader</button>
        </div>
        <div class="shaderlab-stats" aria-live="polite">
          <span class="shaderlab-fps">FPS: --</span>
          <span class="shaderlab-frame">Frame: -- ms</span>
        </div>
      </div>
      <div class="shaderlab-body">
        <div class="shaderlab-editor">
          <div class="shaderlab-editor-header">Fragment Shader</div>
          <textarea class="shaderlab-code" spellcheck="false" aria-label="GLSL fragment shader"></textarea>
          <div class="shaderlab-hint">Uniforms: iResolution (xyz), iTime (seconds), iMouse (pixel coords)</div>
          <div class="shaderlab-errors" aria-live="assertive"></div>
        </div>
        <div class="shaderlab-preview" role="presentation">
          <canvas class="shaderlab-canvas"></canvas>
          <div class="shaderlab-overlay">
            <div class="shaderlab-overlay-text">Live preview</div>
            <div class="shaderlab-metrics"></div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function parseShaderErrors(log) {
  if (!log) return [];
  return log
    .split("\n")
    .map((line) => {
      const match = line.match(ERROR_PATTERN);
      if (match) {
        return {
          line: Number(match[1]),
          column: match[2] ? Number(match[2]) : undefined,
          message: match[3]?.trim() || "Shader compile error",
        };
      }
      return line.trim() ? { message: line.trim() } : null;
    })
    .filter(Boolean);
}

function validateShader(gl, fragmentSource, vertexSource, glslVersion) {
  if (glslVersion === "glsl3" && !(gl instanceof WebGL2RenderingContext)) {
    return {
      ok: false,
      errors: [
        {
          message: "WebGL2 is required for #version 300 es shaders. Please use WebGL2-compatible code or remove the version directive.",
        },
      ],
      stage: "context",
    };
  }

  const compile = (source, type) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    const ok = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    const log = gl.getShaderInfoLog(shader) || "";
    return { ok, log, shader };
  };

  const vertex = compile(vertexSource, gl.VERTEX_SHADER);
  if (!vertex.ok) {
    gl.deleteShader(vertex.shader);
    return { ok: false, errors: parseShaderErrors(vertex.log), stage: "vertex" };
  }

  const fragment = compile(fragmentSource, gl.FRAGMENT_SHADER);
  if (!fragment.ok) {
    gl.deleteShader(vertex.shader);
    gl.deleteShader(fragment.shader);
    return { ok: false, errors: parseShaderErrors(fragment.log), stage: "fragment" };
  }

  const program = gl.createProgram();
  gl.attachShader(program, vertex.shader);
  gl.attachShader(program, fragment.shader);
  gl.linkProgram(program);
  const linked = gl.getProgramParameter(program, gl.LINK_STATUS);
  const linkLog = gl.getProgramInfoLog(program) || "";

  gl.deleteShader(vertex.shader);
  gl.deleteShader(fragment.shader);
  gl.deleteProgram(program);

  if (!linked) {
    return { ok: false, errors: parseShaderErrors(linkLog), stage: "link" };
  }

  return { ok: true };
}

export async function initShaderLab(win) {
  const THREE = await loadThree();
  const canvas = win.querySelector(".shaderlab-canvas");
  const codeArea = win.querySelector(".shaderlab-code");
  const presetSelect = win.querySelector(".shaderlab-preset");
  const loadBtn = win.querySelector(".shaderlab-load");
  const runBtn = win.querySelector(".shaderlab-run");
  const errorBox = win.querySelector(".shaderlab-errors");
  const fpsEl = win.querySelector(".shaderlab-fps");
  const frameEl = win.querySelector(".shaderlab-frame");
  const metricsEl = win.querySelector(".shaderlab-metrics");

  if (!canvas || !codeArea) return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  const gl = renderer.getContext();

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
  camera.position.z = 1;
  const geometry = new THREE.PlaneGeometry(2, 2);
  const uniforms = {
    iResolution: { value: new THREE.Vector3(1, 1, 1) },
    iTime: { value: 0 },
    iMouse: { value: new THREE.Vector2(0, 0) },
  };

  let material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: GLSL1_VERTEX,
    fragmentShader: DEFAULT_FRAGMENT,
    glslVersion: THREE.GLSL1,
  });
  let mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  let animationId = null;
  let startTime = performance.now();
  let lastFrame = startTime;
  let fpsAccumulator = 0;
  let fpsFrames = 0;

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    renderer.setSize(rect.width, rect.height, false);
    uniforms.iResolution.value.set(rect.width, rect.height, 1);
  };

  const render = (now) => {
    resize();
    uniforms.iTime.value = (now - startTime) / 1000;
    fpsFrames += 1;
    fpsAccumulator += now - lastFrame;
    const frameMs = now - lastFrame;
    lastFrame = now;

    if (fpsAccumulator >= 500) {
      const fps = (fpsFrames / fpsAccumulator) * 1000;
      if (fpsEl) fpsEl.textContent = `FPS: ${fps.toFixed(1)}`;
      fpsAccumulator = 0;
      fpsFrames = 0;
    }
    if (frameEl) frameEl.textContent = `Frame: ${frameMs.toFixed(2)} ms`;

    renderer.render(scene, camera);
    const drawCalls = renderer.info.render.calls;
    const triangles = renderer.info.render.triangles;
    if (metricsEl)
      metricsEl.textContent = `Draws: ${drawCalls} · Tris: ${triangles} · Res: ${Math.round(
        uniforms.iResolution.value.x
      )}×${Math.round(uniforms.iResolution.value.y)}`;

    animationId = requestAnimationFrame(render);
  };

  const setErrors = (errors) => {
    if (!errorBox) return;
    if (!errors || errors.length === 0) {
      errorBox.textContent = "";
      errorBox.classList.remove("has-errors");
      return;
    }
    errorBox.classList.add("has-errors");
    errorBox.innerHTML = errors
      .map((err) => {
        const loc = err.line ? `Line ${err.line}${err.column ? ", Col " + err.column : ""}: ` : "";
        return `<div>${loc}${err.message}</div>`;
      })
      .join("");
  };

  const applyShader = (source) => {
    const fragSource = source || codeArea.value || DEFAULT_FRAGMENT;
    const glsl3 = usesGLSL3(fragSource);
    const vertexSource = glsl3 ? GLSL3_VERTEX : GLSL1_VERTEX;
    const glslVersion = glsl3 ? "glsl3" : "glsl1";
    const validation = validateShader(gl, fragSource, vertexSource, glslVersion);
    if (!validation.ok) {
      setErrors(validation.errors);
      return;
    }

    setErrors([]);
    material.dispose();
    material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: vertexSource,
      fragmentShader: fragSource,
      glslVersion: glsl3 ? THREE.GLSL3 : THREE.GLSL1,
    });
    mesh.material = material;
  };

  const loadPreset = async (id) => {
    const preset = PRESETS.find((p) => p.id === id) || PRESETS[0];
    if (!preset) return;
    try {
      const res = await fetch(preset.url);
      const text = await res.text();
      codeArea.value = text;
      applyShader(text);
    } catch (err) {
      setErrors([{ message: err.message || "Unable to load preset" }]);
    }
  };

  const debouncedRun = (() => {
    let handle = null;
    return () => {
      if (handle) cancelAnimationFrame(handle);
      handle = requestAnimationFrame(() => applyShader());
    };
  })();

  codeArea.value = DEFAULT_FRAGMENT.trim();
  applyShader(DEFAULT_FRAGMENT);
  if (presetSelect?.value) loadPreset(presetSelect.value);
  render(startTime);

  canvas.addEventListener("pointermove", (evt) => {
    const rect = canvas.getBoundingClientRect();
    uniforms.iMouse.value.set(evt.clientX - rect.left, rect.height - (evt.clientY - rect.top));
  });

  codeArea.addEventListener("input", debouncedRun);
  runBtn?.addEventListener("click", () => applyShader());
  loadBtn?.addEventListener("click", () => loadPreset(presetSelect?.value));
  presetSelect?.addEventListener("change", () => loadPreset(presetSelect.value));

  win.shaderLabCleanup = () => {
    cancelAnimationFrame(animationId);
    material.dispose();
    geometry.dispose();
    renderer.dispose();
  };
}
