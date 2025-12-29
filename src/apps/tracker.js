import { getSystemVolume } from "../audio.js";

const NOTE_FREQUENCIES = {
  C3: 130.81,
  "C#3": 138.59,
  D3: 146.83,
  "D#3": 155.56,
  E3: 164.81,
  F3: 174.61,
  "F#3": 185.0,
  G3: 196.0,
  "G#3": 207.65,
  A3: 220.0,
  "A#3": 233.08,
  B3: 246.94,
  C4: 261.63,
  "C#4": 277.18,
  D4: 293.66,
  "D#4": 311.13,
  E4: 329.63,
  F4: 349.23,
  "F#4": 369.99,
  G4: 392.0,
  "G#4": 415.3,
  A4: 440.0,
  "A#4": 466.16,
  B4: 493.88,
  C5: 523.25,
  "C#5": 554.37,
  D5: 587.33,
  "D#5": 622.25,
  E5: 659.26,
  F5: 698.46,
  G5: 783.99,
  A5: 880.0
};

const KEYBOARD_MAP = {
  a: "C4",
  w: "C#4",
  s: "D4",
  e: "D#4",
  d: "E4",
  f: "F4",
  t: "F#4",
  g: "G4",
  y: "G#4",
  h: "A4",
  u: "A#4",
  j: "B4",
  k: "C5",
  o: "D5",
  l: "E5"
};

const DEFAULT_TRACKS = [
  { id: "lead", name: "Lead", instrument: "pulse" },
  { id: "harmony", name: "Harmony", instrument: "square" },
  { id: "bass", name: "Bass", instrument: "triangle" },
  { id: "noise", name: "Drums", instrument: "noise" }
];

const INSTRUMENT_OPTIONS = [
  { value: "square", label: "Square" },
  { value: "pulse", label: "Pulse" },
  { value: "triangle", label: "Triangle" },
  { value: "noise", label: "Noise" }
];

export function getTrackerContent() {
  const steps = Array.from({ length: 16 }, (_, i) =>
    `<div class="tracker-step" data-step="${i}" title="Step ${i + 1}">—</div>`
  ).join("");

  const trackRow = (track) => `
    <div class="tracker-row" data-track="${track.id}">
      <div class="tracker-row-head">
        <div class="tracker-row-name">${track.name}</div>
        <select class="tracker-instrument" aria-label="Instrument for ${track.name}">
          ${INSTRUMENT_OPTIONS.map(
            (opt) =>
              `<option value="${opt.value}" ${
                opt.value === track.instrument ? "selected" : ""
              }>${opt.label}</option>`
          ).join("")}
        </select>
      </div>
      <div class="tracker-step-row">${steps}</div>
    </div>`;

  return `
    <div class="tracker-layout">
      <div class="tracker-toolbar">
        <div class="tracker-transport">
          <button class="task-btn" id="tracker-play">Play</button>
          <button class="task-btn" id="tracker-stop">Stop</button>
          <button class="task-btn" id="tracker-clear">Clear</button>
        </div>
        <div class="tracker-tempo">
          <label>Tempo
            <input type="range" min="60" max="180" value="120" id="tracker-tempo">
          </label>
          <span id="tracker-tempo-val">120</span> BPM
        </div>
        <div class="tracker-note-select">
          <label>Selected note
            <select id="tracker-note">
              ${Object.keys(NOTE_FREQUENCIES)
                .filter((n) => /3|4|5/.test(n))
                .map((note) => `<option value="${note}" ${note === "C4" ? "selected" : ""}>${note}</option>`)
                .join("")}
            </select>
          </label>
          <label>Live track
            <select id="tracker-live-track">
              ${DEFAULT_TRACKS.map(
                (t) => `<option value="${t.id}">${t.name}</option>`
              ).join("")}
            </select>
          </label>
          <label class="tracker-record-toggle"><input type="checkbox" id="tracker-arm"> Arm write</label>
        </div>
        <div class="tracker-export">
          <button class="task-btn" data-format="wav">Export WAV</button>
          <button class="task-btn" data-format="ogg">Export OGG</button>
        </div>
      </div>
      <div class="tracker-keyboard">
        <div>
          <label>Live instrument
            <select id="tracker-live-instrument">
              ${INSTRUMENT_OPTIONS.map(
                (opt) => `<option value="${opt.value}">${opt.label}</option>`
              ).join("")}
            </select>
          </label>
          <label>Write head <input type="number" id="tracker-head" min="1" max="16" value="1"></label>
        </div>
        <div class="tracker-keys-help">Use A W S E D F T G Y H U J K O L to jam. Arm write to drop notes into the pattern.</div>
      </div>
      <div class="tracker-grid">
        ${DEFAULT_TRACKS.map(trackRow).join("")}
      </div>
      <div class="tracker-status" id="tracker-status">Ready to sketch a chip-tune pattern.</div>
    </div>`;
}

export function initTracker(win) {
  const tempo = win.querySelector("#tracker-tempo");
  const tempoVal = win.querySelector("#tracker-tempo-val");
  const noteSelect = win.querySelector("#tracker-note");
  const status = win.querySelector("#tracker-status");
  const armWrite = win.querySelector("#tracker-arm");
  const headInput = win.querySelector("#tracker-head");
  const liveTrackSelect = win.querySelector("#tracker-live-track");
  const liveInstrumentSelect = win.querySelector("#tracker-live-instrument");
  const exportButtons = win.querySelectorAll(".tracker-export .task-btn");

  const tracks = DEFAULT_TRACKS.map((t) => ({ ...t }));
  const stepsCount = 16;
  const pattern = Object.fromEntries(
    tracks.map((t) => [t.id, Array(stepsCount).fill(null)])
  );

  let audioCtx = null;
  let timer = null;
  let currentStep = 0;

  const stepNodes = Array.from(win.querySelectorAll(".tracker-step"));

  function ensureContext() {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === "suspended") audioCtx.resume();
    return audioCtx;
  }

  function stepDurationSeconds(customTempo) {
    const bpm = customTempo || parseFloat(tempo.value);
    return (60 / bpm) / 4;
  }

  function renderPattern() {
    stepNodes.forEach((node) => {
      const track = node.closest(".tracker-row").dataset.track;
      const stepIndex = parseInt(node.dataset.step, 10);
      const note = pattern[track][stepIndex];
      node.textContent = note || "—";
      node.classList.toggle("active", !!note);
      node.classList.toggle("playhead", parseInt(node.dataset.step, 10) === currentStep);
    });
  }

  function instrumentFor(trackId) {
    const select = win.querySelector(`.tracker-row[data-track="${trackId}"] .tracker-instrument`);
    return select?.value || "square";
  }

  function createTone(ctx, instrument, frequency, duration, destination, startTime) {
    const dest = destination || ctx.destination;
    if (!dest) return;
    const start = startTime ?? ctx.currentTime;
    const end = start + duration;

    if (instrument === "noise") {
      const bufferSize = Math.floor(ctx.sampleRate * duration);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const gain = ctx.createGain();
      const volume = getSystemVolume();
      gain.gain.setValueAtTime(volume * 0.3, start);
      gain.gain.exponentialRampToValueAtTime(0.0001, end);
      noise.connect(gain);
      gain.connect(dest);
      noise.start(start);
      noise.stop(end);
      return;
    }

    const osc = ctx.createOscillator();
    if (instrument === "pulse") {
      const real = new Float32Array([0, 1, 0, 1, 0, 0.5]);
      const imag = new Float32Array(real.length);
      osc.setPeriodicWave(ctx.createPeriodicWave(real, imag));
    } else {
      osc.type = instrument;
    }
    osc.frequency.value = frequency;

    const gain = ctx.createGain();
    const volume = getSystemVolume();
    gain.gain.setValueAtTime(volume * 0.6, start);
    gain.gain.exponentialRampToValueAtTime(0.0001, end);

    osc.connect(gain);
    gain.connect(dest);

    osc.start(start);
    osc.stop(end);
  }

  function playNote(
    trackId,
    note,
    startTime,
    duration,
    ctxOverride,
    destination,
    instrumentOverride
  ) {
    const ctx = ctxOverride || ensureContext();
    const freq = NOTE_FREQUENCIES[note];
    if (!freq) return;
    const instrument = instrumentOverride || instrumentFor(trackId);
    createTone(ctx, instrument, freq, duration, destination, startTime);
  }

  function playCurrentStep() {
    const ctx = ensureContext();
    const now = ctx.currentTime;
    stepNodes.forEach((node) => {
      const isPlayhead = parseInt(node.dataset.step, 10) === currentStep;
      node.classList.toggle("playhead", isPlayhead);
    });
    tracks.forEach((track) => {
      const note = pattern[track.id][currentStep];
      if (note) {
        playNote(track.id, note, now, stepDurationSeconds() * 0.9);
      }
    });
    currentStep = (currentStep + 1) % stepsCount;
  }

  function startPlayback() {
    if (timer) return;
    currentStep = 0;
    renderPattern();
    playCurrentStep();
    timer = setInterval(playCurrentStep, stepDurationSeconds() * 1000);
    status.textContent = "Playing pattern. Click steps to write notes.";
  }

  function stopPlayback() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
    currentStep = 0;
    renderPattern();
    status.textContent = "Stopped. Adjust tempo or toggle notes.";
  }

  function clearPattern() {
    tracks.forEach((t) => pattern[t.id].fill(null));
    renderPattern();
    status.textContent = "Pattern cleared.";
  }

  function writeNote(trackId, stepIndex, note) {
    pattern[trackId][stepIndex] = note;
    status.textContent = `${note} placed on ${trackId} @ step ${stepIndex + 1}.`;
    renderPattern();
  }

  function handleStepClick(e) {
    const stepIndex = parseInt(e.target.dataset.step, 10);
    const trackId = e.target.closest(".tracker-row").dataset.track;
    const note = noteSelect.value;
    if (pattern[trackId][stepIndex] === note) {
      pattern[trackId][stepIndex] = null;
      status.textContent = `Cleared ${trackId} step ${stepIndex + 1}.`;
    } else {
      writeNote(trackId, stepIndex, note);
    }
    renderPattern();
  }

  function handleKeyDown(e) {
    const note = KEYBOARD_MAP[e.key.toLowerCase()];
    if (!note) return;
    playNote(
      liveTrackSelect.value,
      note,
      undefined,
      stepDurationSeconds() * 0.9,
      undefined,
      undefined,
      liveInstrumentSelect.value
    );
    status.textContent = `Live: ${note} (${liveInstrumentSelect.value})`;
    if (armWrite.checked) {
      const head = Math.max(1, Math.min(stepsCount, parseInt(headInput.value, 10) || 1)) - 1;
      writeNote(liveTrackSelect.value, head, note);
      headInput.value = ((head + 1) % stepsCount) + 1;
    }
  }

  function schedulePattern(ctx, destination, loops = 1) {
    const isOffline =
      typeof OfflineAudioContext !== "undefined" && ctx instanceof OfflineAudioContext;
    const stepDur = stepDurationSeconds(isOffline ? tempo.value : undefined);
    for (let l = 0; l < loops; l++) {
      for (let step = 0; step < stepsCount; step++) {
        const t = ctx.currentTime + (l * stepsCount + step) * stepDur;
        tracks.forEach((track) => {
          const note = pattern[track.id][step];
          if (note) playNote(track.id, note, t, stepDur * 0.9, ctx, destination);
        });
      }
    }
    return stepDur * stepsCount * loops;
  }

  async function exportWav() {
    if (typeof OfflineAudioContext === "undefined") {
      status.textContent = "Offline audio not supported in this browser.";
      return;
    }
    const loops = 2;
    const duration = stepDurationSeconds() * stepsCount * loops;
    const sampleRate = 44100;
    const ctx = new OfflineAudioContext(1, sampleRate * (duration + 1), sampleRate);
    schedulePattern(ctx, ctx.destination, loops);
    const buffer = await ctx.startRendering();
    const wav = audioBufferToWav(buffer);
    downloadBlob(wav, "chip-pattern.wav");
    status.textContent = "Rendered WAV export.";
  }

  async function exportOgg() {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const dest = ctx.createMediaStreamDestination();
    const loops = 2;
    const totalDuration = schedulePattern(ctx, dest, loops);
    const recorder = new MediaRecorder(dest.stream, { mimeType: "audio/ogg" });
    const chunks = [];
    recorder.ondataavailable = (ev) => chunks.push(ev.data);
    const completion = new Promise((resolve) => {
      recorder.onstop = () => resolve(new Blob(chunks, { type: "audio/ogg" }));
    });
    recorder.start();
    setTimeout(() => recorder.stop(), (totalDuration + 0.2) * 1000);
    const blob = await completion;
    downloadBlob(blob, "chip-pattern.ogg");
    status.textContent = "Exported OGG recording.";
  }

  function audioBufferToWav(buffer) {
    const numOfChan = buffer.numberOfChannels;
    const length = buffer.length * numOfChan * 2 + 44;
    const out = new ArrayBuffer(length);
    const view = new DataView(out);
    const channels = [];
    let offset = 0;
    let pos = 0;

    function setUint16(data) {
      view.setUint16(pos, data, true);
      pos += 2;
    }

    function setUint32(data) {
      view.setUint32(pos, data, true);
      pos += 4;
    }

    setUint32(0x46464952);
    setUint32(length - 8);
    setUint32(0x45564157);
    setUint32(0x20746d66);
    setUint32(16);
    setUint16(1);
    setUint16(numOfChan);
    setUint32(buffer.sampleRate);
    setUint32(buffer.sampleRate * 2 * numOfChan);
    setUint16(numOfChan * 2);
    setUint16(16);
    setUint32(0x61746164);
    setUint32(length - pos - 4);

    for (let i = 0; i < numOfChan; i++) channels.push(buffer.getChannelData(i));

    while (pos < length) {
      for (let i = 0; i < numOfChan; i++) {
        const sample = Math.max(-1, Math.min(1, channels[i][offset]));
        view.setInt16(pos, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
        pos += 2;
      }
      offset++;
    }

    return new Blob([out], { type: "audio/wav" });
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  tempo.addEventListener("input", () => {
    tempoVal.textContent = tempo.value;
    if (timer) {
      clearInterval(timer);
      timer = setInterval(playCurrentStep, stepDurationSeconds() * 1000);
    }
  });

  stepNodes.forEach((node) => node.addEventListener("click", handleStepClick));

  win.querySelector("#tracker-play").onclick = startPlayback;
  win.querySelector("#tracker-stop").onclick = stopPlayback;
  win.querySelector("#tracker-clear").onclick = clearPattern;

  exportButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.dataset.format === "wav") exportWav();
      else exportOgg();
    });
  });

  win.addEventListener("keydown", handleKeyDown);

  renderPattern();
}
