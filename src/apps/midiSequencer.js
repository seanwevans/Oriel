import { getSystemVolume } from "../audio.js";
import { midiNoteToFrequency, parseMidiFile } from "../midi.js";

const NOTE_LANES = [
  { name: "C5", midi: 72 },
  { name: "B4", midi: 71 },
  { name: "A#4", midi: 70 },
  { name: "A4", midi: 69 },
  { name: "G#4", midi: 68 },
  { name: "G4", midi: 67 },
  { name: "F#4", midi: 66 },
  { name: "F4", midi: 65 },
  { name: "E4", midi: 64 },
  { name: "D#4", midi: 63 },
  { name: "D4", midi: 62 },
  { name: "C#4", midi: 61 },
  { name: "C4", midi: 60 },
  { name: "B3", midi: 59 },
  { name: "A#3", midi: 58 },
  { name: "A3", midi: 57 }
];

const DEFAULT_TRACKS = [
  { id: "lead", name: "Lead", color: "#5ce1ff", oscillator: "sawtooth" },
  { id: "chords", name: "Chords", color: "#ff6f61", oscillator: "triangle" },
  { id: "bass", name: "Bass", color: "#ffd166", oscillator: "square" },
  { id: "accent", name: "Accent", color: "#00c853", oscillator: "sine" }
];

export function getMidiSequencerContent() {
  return `
    <div class="midi-sequencer">
      <div class="midi-toolbar">
        <div class="midi-transport">
          <button class="task-btn" id="midi-play">Play</button>
          <button class="task-btn" id="midi-stop">Stop</button>
          <button class="task-btn" id="midi-clear">Clear Grid</button>
          <span class="midi-status" id="midi-status">Ready to sketch.</span>
        </div>
        <div class="midi-controls">
          <label>Tempo
            <input type="range" id="midi-tempo" min="60" max="200" value="120">
          </label>
          <span id="midi-tempo-display">120 BPM</span>
          <label class="midi-file-picker">Import .mid
            <input type="file" id="midi-file" accept=".mid,.midi,audio/midi">
          </label>
        </div>
      </div>
      <div class="midi-body">
        <div class="midi-track-list" id="midi-track-list"></div>
        <div class="midi-grid" id="midi-grid"></div>
      </div>
    </div>
  `;
}

export function initMidiSequencer(win) {
  const playBtn = win.querySelector("#midi-play");
  const stopBtn = win.querySelector("#midi-stop");
  const clearBtn = win.querySelector("#midi-clear");
  const tempoSlider = win.querySelector("#midi-tempo");
  const tempoDisplay = win.querySelector("#midi-tempo-display");
  const fileInput = win.querySelector("#midi-file");
  const statusLabel = win.querySelector("#midi-status");
  const trackList = win.querySelector("#midi-track-list");
  const gridEl = win.querySelector("#midi-grid");

  let audioCtx = null;
  let stepTimer = null;
  let isPlaying = false;
  let stepCount = 32;
  let currentStep = 0;
  let activeTrackId = DEFAULT_TRACKS[0].id;

  const tracks = DEFAULT_TRACKS.map((t) => ({
    ...t,
    muted: false,
    grid: NOTE_LANES.map(() => Array(stepCount).fill(false))
  }));

  function ensureAudioContext() {
    audioCtx =
      audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === "suspended") audioCtx.resume();
    return audioCtx;
  }

  function setStatus(text) {
    if (statusLabel) statusLabel.textContent = text;
  }

  function stepDurationSeconds() {
    const bpm = parseFloat(tempoSlider.value) || 120;
    return (60 / bpm) / 4; // 16th notes
  }

  function renderTrackList() {
    if (!trackList) return;
    trackList.innerHTML = DEFAULT_TRACKS.map(
      (track) => `
        <div class="midi-track ${track.id === activeTrackId ? "active" : ""}" data-track="${track.id}">
          <span class="midi-track-swatch" style="background:${track.color}"></span>
          <span class="midi-track-name">${track.name}</span>
          <label class="midi-track-mute"><input type="checkbox" ${
            tracks.find((t) => t.id === track.id)?.muted ? "checked" : ""
          } data-mute="${track.id}"> Mute</label>
        </div>
      `
    ).join("");
  }

  function updateTempoLabel() {
    tempoDisplay.textContent = `${tempoSlider.value} BPM`;
  }

  function rebuildGrid() {
    if (!gridEl) return;
    gridEl.style.setProperty("--midi-steps", stepCount);
    gridEl.innerHTML = "";

    const headerRow = document.createElement("div");
    headerRow.className = "midi-grid-row header";
    headerRow.innerHTML = `<div class="midi-grid-label">Note</div>`;
    for (let i = 0; i < stepCount; i++) {
      const beat = Math.floor(i / 4) + 1;
      const label = (i % 4 === 0) ? ` ${beat}` : "";
      const cell = document.createElement("div");
      cell.className = "midi-grid-cell beat-marker";
      cell.textContent = label;
      headerRow.appendChild(cell);
    }
    gridEl.appendChild(headerRow);

    NOTE_LANES.forEach((lane, laneIndex) => {
      const row = document.createElement("div");
      row.className = "midi-grid-row";
      const label = document.createElement("div");
      label.className = "midi-grid-label";
      label.textContent = lane.name;
      row.appendChild(label);

      for (let step = 0; step < stepCount; step++) {
        const cell = document.createElement("div");
        cell.className = "midi-grid-cell";
        cell.dataset.noteIndex = laneIndex;
        cell.dataset.stepIndex = step;
        row.appendChild(cell);
      }

      gridEl.appendChild(row);
    });

    refreshGrid();
  }

  function refreshGrid() {
    if (!gridEl) return;
    const activeTrack = tracks.find((t) => t.id === activeTrackId) || tracks[0];
    const cells = gridEl.querySelectorAll(".midi-grid-cell:not(.beat-marker)");
    cells.forEach((cell) => {
      const noteIndex = parseInt(cell.dataset.noteIndex, 10);
      const stepIndex = parseInt(cell.dataset.stepIndex, 10);
      const isOn = activeTrack?.grid?.[noteIndex]?.[stepIndex];
      cell.classList.toggle("on", !!isOn);
      cell.style.backgroundColor = isOn ? activeTrack.color : "";
    });

    const playheadCells = gridEl.querySelectorAll(".playhead");
    playheadCells.forEach((c) => c.classList.remove("playhead"));
    gridEl
      .querySelectorAll(`[data-step-index="${currentStep}"]`)
      .forEach((c) => c.classList.add("playhead"));
  }

  function toggleCell(cell) {
    const noteIndex = parseInt(cell.dataset.noteIndex, 10);
    const stepIndex = parseInt(cell.dataset.stepIndex, 10);
    const track = tracks.find((t) => t.id === activeTrackId);
    if (!track || Number.isNaN(noteIndex) || Number.isNaN(stepIndex)) return;
    const nextState = !track.grid[noteIndex][stepIndex];
    track.grid[noteIndex][stepIndex] = nextState;
    cell.classList.toggle("on", nextState);
    cell.style.backgroundColor = nextState ? track.color : "";
  }

  function clearGrid() {
    tracks.forEach((track) => {
      track.grid.forEach((row) => row.fill(false));
    });
    refreshGrid();
  }

  function triggerNote(midiNumber, durationSeconds, color, waveform = "sine") {
    const ctx = ensureAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = waveform;
    osc.frequency.value = midiNoteToFrequency(midiNumber);
    gain.gain.value = getSystemVolume() * 0.35;
    osc.connect(gain);
    gain.connect(ctx.destination);
    const now = ctx.currentTime;
    gain.gain.setValueAtTime(gain.gain.value, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + durationSeconds);
    osc.start(now);
    osc.stop(now + durationSeconds + 0.01);
    if (color && win) {
      const flash = document.createElement("div");
      flash.className = "midi-flash";
      flash.style.background = color;
      win.querySelector(".midi-sequencer")?.appendChild(flash);
      setTimeout(() => flash.remove(), 180);
    }
  }

  function playStep() {
    const duration = stepDurationSeconds();
    tracks.forEach((track) => {
      if (track.muted) return;
      track.grid.forEach((row, laneIndex) => {
        if (row[currentStep]) {
          triggerNote(
            NOTE_LANES[laneIndex].midi,
            duration,
            track.color,
            track.oscillator
          );
        }
      });
    });

    currentStep = (currentStep + 1) % stepCount;
    refreshGrid();
  }

  function startPlayback() {
    if (isPlaying) return;
    ensureAudioContext();
    currentStep = 0;
    refreshGrid();
    const intervalMs = stepDurationSeconds() * 1000;
    stepTimer = setInterval(playStep, intervalMs);
    isPlaying = true;
    setStatus("Playing pattern.");
  }

  function stopPlayback() {
    if (stepTimer) {
      clearInterval(stepTimer);
      stepTimer = null;
    }
    isPlaying = false;
    currentStep = 0;
    refreshGrid();
    setStatus("Stopped.");
  }

  function resizeSteps(newCount) {
    if (newCount === stepCount) return;
    stepCount = Math.max(8, Math.min(newCount, 128));
    tracks.forEach((track) => {
      track.grid = NOTE_LANES.map((_, i) => {
        const existing = track.grid[i] || [];
        const nextRow = Array(stepCount).fill(false);
        for (let s = 0; s < Math.min(stepCount, existing.length); s++) {
          nextRow[s] = existing[s];
        }
        return nextRow;
      });
    });
    rebuildGrid();
  }

  function projectMidiToGrid(parsed) {
    if (!parsed) return;
    const channelTracks = parsed.tracks
      .map((t, idx) => ({ channel: idx, notes: t.notes }))
      .filter((t) => t.notes.length);

    const maxStep = channelTracks.reduce((max, track) => {
      const localMax = track.notes.reduce((m, note) => {
        const noteStep = Math.round((note.startTick / parsed.ticksPerBeat) * 4);
        return Math.max(m, noteStep);
      }, 0);
      return Math.max(max, localMax);
    }, 0);

    resizeSteps(Math.max(stepCount, maxStep + 8));

    // Clear existing
    clearGrid();

    channelTracks.forEach((importTrack, idx) => {
      const targetTrack = tracks[idx] || tracks[tracks.length - 1];
      importTrack.notes.forEach((note) => {
        const stepIndex = Math.round((note.startTick / parsed.ticksPerBeat) * 4);
        const laneIndex = NOTE_LANES.findIndex((lane) => lane.midi === note.noteNumber);
        if (laneIndex === -1) return;
        if (stepIndex < targetTrack.grid[laneIndex].length) {
          targetTrack.grid[laneIndex][stepIndex] = true;
        }
      });
    });

    activeTrackId = tracks[0].id;
    renderTrackList();
    refreshGrid();
    const bpm = Math.min(Math.max(parsed.bpm || 120, 60), 200);
    tempoSlider.value = bpm;
    updateTempoLabel();
    setStatus(`Imported MIDI (${channelTracks.length} track${channelTracks.length === 1 ? "" : "s"}).`);
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = parseMidiFile(e.target.result);
        projectMidiToGrid(parsed);
      } catch (err) {
        console.error(err);
        alert("Unable to read MIDI file. The file may be unsupported.");
      }
    };
    reader.readAsArrayBuffer(file);
  }

  gridEl?.addEventListener("click", (e) => {
    const cell = e.target.closest(".midi-grid-cell");
    if (cell && !cell.classList.contains("beat-marker")) {
      toggleCell(cell);
    }
  });

  trackList?.addEventListener("click", (e) => {
    const trackEl = e.target.closest(".midi-track");
    const muteToggle = e.target.closest("input[data-mute]");
    if (muteToggle) {
      const target = tracks.find((t) => t.id === muteToggle.dataset.mute);
      if (target) target.muted = muteToggle.checked;
      return;
    }
    if (trackEl?.dataset.track) {
      activeTrackId = trackEl.dataset.track;
      renderTrackList();
      refreshGrid();
      setStatus(`Editing ${trackEl.querySelector(".midi-track-name")?.textContent || "track"}.`);
    }
  });

  tempoSlider?.addEventListener("input", () => {
    updateTempoLabel();
    if (isPlaying) {
      stopPlayback();
      startPlayback();
    }
  });

  playBtn?.addEventListener("click", startPlayback);
  stopBtn?.addEventListener("click", stopPlayback);
  clearBtn?.addEventListener("click", () => {
    stopPlayback();
    clearGrid();
    setStatus("Cleared pattern.");
  });
  fileInput?.addEventListener("change", handleFileChange);

  renderTrackList();
  updateTempoLabel();
  rebuildGrid();
}
