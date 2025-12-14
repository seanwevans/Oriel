import { getMediaPlayerTracks, registerMediaElement } from "../audio.js";

export async function initMediaPlayer(w) {
  const canvas = w.querySelector("#mplayer-canvas");
  const ctx = canvas.getContext("2d");
  const video = w.querySelector(".mplayer-video");

  const selectEl = w.querySelector(".mplayer-track-select");
  const seekEl = w.querySelector(".mplayer-seek");
  const currentEl = w.querySelector(".mplayer-current");
  const durationEl = w.querySelector(".mplayer-duration");
  const trackNameEl = w.querySelector(".mplayer-track-name");
  const fileInput = w.querySelector(".mplayer-file-input");
  const fileNameEl = w.querySelector(".mplayer-file-name");

  registerMediaElement(video);

  const tracks = [...getMediaPlayerTracks()];
  const addOption = (track, index, prefix = "") => {
    const opt = document.createElement("option");
    opt.value = index;
    opt.textContent = `${prefix}${track.name}`;
    selectEl.appendChild(opt);
  };
  tracks.forEach((t, i) => addOption(t, i));

  let interval = null;
  let x = 50;
  let y = 50;
  let dx = 2;
  let dy = 2;
  let currentTrack = 0;

  const formatTime = (seconds) => {
    if (!isFinite(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

  const animate = () => {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#00ff6a";
    ctx.font = "20px 'Courier New', monospace";
    ctx.fillText("ORIEL DVD", x, y);
    x += dx;
    y += dy;
    if (x < 0 || x > canvas.width - 100) dx = -dx;
    if (y < 20 || y > canvas.height - 10) dy = -dy;
  };

  const stopVisual = () => {
    clearInterval(interval);
    interval = null;
  };

  const resetVisual = () => {
    stopVisual();
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    x = 50;
    y = 50;
  };

  const isVideoTrack = (track) => {
    const type = (track.type || "").toLowerCase();
    if (type.startsWith("video/")) return true;
    const name = (track.name || "").toLowerCase();
    return /(\.mp4|\.webm|\.ogv|\.mov|\.mkv)$/.test(name);
  };

  const updateSeek = () => {
    const duration = video.duration;
    if (!isFinite(duration) || duration <= 0) {
      seekEl.value = 0;
      durationEl.textContent = formatTime(0);
      currentEl.textContent = formatTime(video.currentTime || 0);
      return;
    }
    seekEl.value = Math.floor((video.currentTime / duration) * 100);
    currentEl.textContent = formatTime(video.currentTime);
    durationEl.textContent = formatTime(duration);
  };

  const loadTrack = (index) => {
    currentTrack = index;
    const track = tracks[currentTrack];
    const videoMode = isVideoTrack(track);
    canvas.style.display = videoMode ? "none" : "block";
    video.src = track.url;
    video.currentTime = 0;
    trackNameEl.textContent = track.name;
    seekEl.value = 0;
    currentEl.textContent = "0:00";
    durationEl.textContent = "0:00";
    if (!videoMode) {
      resetVisual();
    } else {
      stopVisual();
    }
  };

  selectEl.addEventListener("change", (e) => {
    loadTrack(parseInt(e.target.value, 10));
    registerMediaElement(video);
    video.play();
    if (canvas.style.display !== "none" && !interval) interval = setInterval(animate, 30);
  });

  seekEl.addEventListener("input", () => {
    if (!video.duration || !isFinite(video.duration)) return;
    video.currentTime = (parseFloat(seekEl.value) / 100) * video.duration;
  });

  video.addEventListener("timeupdate", updateSeek);
  video.addEventListener("loadedmetadata", updateSeek);
  video.addEventListener("ended", () => {
    stopVisual();
    video.currentTime = 0;
    seekEl.value = 0;
    currentEl.textContent = formatTime(0);
  });

  fileInput.addEventListener("change", () => {
    if (!fileInput.files || !fileInput.files.length) {
      fileNameEl.textContent = "Load mp3 or video files from your computer to play them here.";
      return;
    }

    let startIndex = tracks.length;
    Array.from(fileInput.files).forEach((file) => {
      const url = URL.createObjectURL(file);
      const entry = { name: file.name, url, type: file.type };
      tracks.push(entry);
      addOption(entry, tracks.length - 1, "Local: ");
    });

    selectEl.value = `${startIndex}`;
    loadTrack(startIndex);
    registerMediaElement(video);
    video.play();

    const names = Array.from(fileInput.files)
      .map((f) => f.name)
      .join(", ");
    fileNameEl.textContent = names;
  });

  video.addEventListener("play", () => {
    if (canvas.style.display !== "none" && !interval) interval = setInterval(animate, 30);
  });

  video.addEventListener("pause", stopVisual);

  loadTrack(0);
}
