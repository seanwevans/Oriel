import { getSystemVolume } from "../audio.js";

export function getBeatMakerContent() {
  const steps = Array.from({ length: 16 }, (_, i) =>
    `<div class="daw-step" data-step="${i}" title="Step ${i + 1}"></div>`
  ).join("");
  const row = (id, label) =>
    `<div class="daw-row" data-track="${id}"><div class="daw-row-label">${label}</div><div class="daw-step-row">${steps}</div></div>`;

  return `<div class="daw-layout">
                <div class="daw-toolbar">
                  <div class="daw-transport">
                    <button class="task-btn" id="daw-play">Play</button>
                    <button class="task-btn" id="daw-stop">Stop</button>
                  </div>
                  <div class="daw-tempo">
                    <label for="daw-tempo">Tempo</label>
                    <input type="range" id="daw-tempo" min="60" max="180" value="110">
                    <span id="daw-tempo-val">110</span> BPM
                  </div>
                  <div class="daw-tools">
                    <button class="task-btn" id="daw-random">Humanize</button>
                    <button class="task-btn" id="daw-clear">Clear</button>
                  </div>
                </div>
                <div class="daw-grid">
                  ${row("kick", "Kick")}
                  ${row("snare", "Snare")}
                  ${row("hihat", "Hi-Hat")}
                  ${row("clap", "Clap")}
                </div>
                <div class="daw-status" id="daw-status">Ready to lay down a beat.</div>
              </div>`;
}

export function initBeatMaker(win) {
  const tempo = win.querySelector("#daw-tempo");
  const tempoVal = win.querySelector("#daw-tempo-val");
  const status = win.querySelector("#daw-status");
  const playBtn = win.querySelector("#daw-play");
  const stopBtn = win.querySelector("#daw-stop");
  const randomBtn = win.querySelector("#daw-random");
  const clearBtn = win.querySelector("#daw-clear");

  const tracks = [
    { id: "kick", name: "Kick" },
    { id: "snare", name: "Snare" },
    { id: "hihat", name: "Hi-Hat" },
    { id: "clap", name: "Clap" }
  ];
  const stepsCount = 16;
  const pattern = Object.fromEntries(
    tracks.map((t) => [t.id, Array(stepsCount).fill(false)])
  );

  // Starter groove
  [0, 4, 8, 12].forEach((i) => (pattern.kick[i] = true));
  [4, 12].forEach((i) => (pattern.snare[i] = true));
  [2, 6, 10, 14].forEach((i) => (pattern.hihat[i] = true));
  pattern.clap[14] = true;

  let audioCtx = null;
  let timer = null;
  let currentStep = 0;

  const stepNodes = Array.from(win.querySelectorAll(".daw-step"));

  function ensureContext() {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === "suspended") audioCtx.resume();
    return audioCtx;
  }

  function renderPattern() {
    stepNodes.forEach((node) => {
      const track = node.closest(".daw-row").dataset.track;
      const stepIndex = parseInt(node.dataset.step);
      node.classList.toggle("active", pattern[track][stepIndex]);
    });
  }

  function highlightStep(stepIndex) {
    stepNodes.forEach((node) => {
      const isCurrent = parseInt(node.dataset.step) === stepIndex;
      node.classList.toggle("playhead", isCurrent);
    });
  }

  function connectWithVolume(node) {
    const gain = ensureContext().createGain();
    gain.gain.value = getSystemVolume();
    node.connect(gain);
    gain.connect(ensureContext().destination);
    return { node, gain };
  }

  function triggerKick(time) {
    const ctx = ensureContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(140, time);
    osc.frequency.exponentialRampToValueAtTime(55, time + 0.25);
    const volume = getSystemVolume();
    gain.gain.setValueAtTime(volume, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.35);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(time);
    osc.stop(time + 0.4);
  }

  function triggerNoise(duration, tone, cutoff) {
    const ctx = ensureContext();
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * tone;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = cutoff;
    const { gain } = connectWithVolume(noise);
    const volume = getSystemVolume();
    gain.gain.setValueAtTime(volume * 0.8, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    noise.connect(filter);
    filter.connect(gain);
    noise.start();
    noise.stop(ctx.currentTime + duration);
  }

  function triggerSnare(time) {
    const ctx = ensureContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(180, time);
    const volume = getSystemVolume();
    gain.gain.setValueAtTime(volume * 0.25, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(time);
    osc.stop(time + 0.25);
    triggerNoise(0.18, 0.7, 1000);
  }

  function triggerHat(time) {
    triggerNoise(0.1, 0.4, 6000);
  }

  function triggerClap(time) {
    const ctx = ensureContext();
    const bursts = [0, 0.03, 0.06];
    bursts.forEach((offset) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(400, time + offset);
      const volume = getSystemVolume();
      gain.gain.setValueAtTime(volume * 0.2, time + offset);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + offset + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(time + offset);
      osc.stop(time + offset + 0.16);
    });
  }

  function playStep(stepIndex, startTime) {
    tracks.forEach((t) => {
      if (!pattern[t.id][stepIndex]) return;
      const time = startTime + stepIndex * (60 / tempo.value) / 4;
      if (t.id === "kick") triggerKick(time);
      else if (t.id === "snare") triggerSnare(time);
      else if (t.id === "hihat") triggerHat(time);
      else if (t.id === "clap") triggerClap(time);
    });
  }

  function stepDurationMs() {
    return (60 / tempo.value) * 1000 / 4;
  }

  function playCurrentStep() {
    const now = ensureContext().currentTime;
    highlightStep(currentStep);
    playStep(currentStep, now);
    currentStep = (currentStep + 1) % stepsCount;
  }

  function startPlayback() {
    if (timer) return;
    currentStep = 0;
    playCurrentStep();
    timer = setInterval(playCurrentStep, stepDurationMs());
    status.textContent = "Playing pattern. Click steps to toggle sounds.";
  }

  function stopPlayback() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
    highlightStep(-1);
    status.textContent = "Stopped. Adjust tempo or toggle steps.";
  }

  tempo.addEventListener("input", () => {
    tempoVal.textContent = tempo.value;
    if (timer) {
      clearInterval(timer);
      timer = setInterval(playCurrentStep, stepDurationMs());
    }
  });

  playBtn.onclick = startPlayback;
  stopBtn.onclick = stopPlayback;

  randomBtn.onclick = () => {
    tracks.forEach((t) => {
      pattern[t.id] = pattern[t.id].map(() => Math.random() < 0.25);
    });
    renderPattern();
    status.textContent = "Humanized the beat with some random hits.";
  };

  clearBtn.onclick = () => {
    tracks.forEach((t) => pattern[t.id].fill(false));
    renderPattern();
    status.textContent = "Cleared all steps.";
  };

  renderPattern();
}
