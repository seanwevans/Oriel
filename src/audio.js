const VOLUME_STORAGE_KEY = "oriel-volume";
const activeMediaElements = new Set();
let mediaPlayerTracks = null;
let systemVolume = loadStoredVolume();
let lastNonZeroVolume = systemVolume || 0.7;
let testToneContext = null;

function clampVolume(v) {
  return Math.min(1, Math.max(0, v));
}

function loadStoredVolume() {
  const stored = parseFloat(localStorage.getItem(VOLUME_STORAGE_KEY));
  if (isNaN(stored)) return 0.7;
  return clampVolume(stored);
}

function generateToneUrl(freq, duration = 1.2, sampleRate = 22050) {
  const sampleCount = Math.floor(sampleRate * duration);
  const buffer = new ArrayBuffer(44 + sampleCount * 2);
  const view = new DataView(buffer);
  const bytes = new Uint8Array(buffer);

  const writeString = (offset, str) => {
    for (let i = 0; i < str.length; i++) bytes[offset + i] = str.charCodeAt(i);
  };

  writeString(0, "RIFF");
  view.setUint32(4, 36 + sampleCount * 2, true);
  writeString(8, "WAVEfmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, "data");
  view.setUint32(40, sampleCount * 2, true);

  for (let i = 0; i < sampleCount; i++) {
    const sample = Math.sin((2 * Math.PI * freq * i) / sampleRate) * 0.35;
    view.setInt16(44 + i * 2, sample * 32767, true);
  }

  return URL.createObjectURL(new Blob([buffer], { type: "audio/wav" }));
}

function updateVolumeUIElements(volume) {
  const percent = `${Math.round(volume * 100)}%`;
  document
    .querySelectorAll(".volume-slider")
    .forEach((slider) => (slider.value = Math.round(volume * 100)));
  document
    .querySelectorAll(".volume-percent")
    .forEach((label) => (label.textContent = percent));
  document
    .querySelectorAll(".volume-mute-toggle")
    .forEach((chk) => (chk.checked = volume === 0));
}

export function getMediaPlayerTracks() {
  if (!mediaPlayerTracks) {
    mediaPlayerTracks = [
      {
        name: "Synth Bell (C5)",
        url: generateToneUrl(523.25, 1.2),
        type: "audio/wav"
      },
      {
        name: "Retro Chime (E4)",
        url: generateToneUrl(329.63, 1.5),
        type: "audio/wav"
      },
      {
        name: "Soft Drone (A3)",
        url: generateToneUrl(220, 2),
        type: "audio/wav"
      }
    ];
  }
  return mediaPlayerTracks;
}

export function getSystemVolume() {
  return systemVolume;
}

export function getLastNonZeroVolume() {
  return lastNonZeroVolume;
}

export function setSystemVolume(value) {
  systemVolume = clampVolume(value);
  if (systemVolume > 0) lastNonZeroVolume = systemVolume;
  localStorage.setItem(VOLUME_STORAGE_KEY, systemVolume.toString());
  activeMediaElements.forEach((el) => {
    el.volume = systemVolume;
  });
  updateVolumeUIElements(systemVolume);
}

export function registerMediaElement(el) {
  if (!el) return;
  el.volume = systemVolume;
  activeMediaElements.add(el);
  const cleanup = () => activeMediaElements.delete(el);
  el.addEventListener("ended", cleanup, { once: true });
  el.addEventListener("pause", () => {
    if (el.currentTime === 0 || el.currentTime >= (el.duration || 0)) {
      cleanup();
    }
  });
}

export function playVolumeTest() {
  testToneContext =
    testToneContext || new (window.AudioContext || window.webkitAudioContext)();
  const ctx = testToneContext;
  if (ctx.state === "suspended") ctx.resume();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.value = 880;
  gain.gain.value = systemVolume;
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.4);
}
