import { registerMediaElement } from "../audio.js";
import { BaseApp } from "./base/BaseApp.js";

export class SoundRecorderApp extends BaseApp {
  getWindowContent() {
    return `<div class="sound-rec-layout"><div class="sound-vis"><canvas class="sound-wave-canvas" width="246" height="56"></canvas></div><div class="sound-controls"><div class="media-btn" id="btn-rec" title="Record"><div class="symbol-rec"></div></div><div class="media-btn" id="btn-stop" title="Stop"><div class="symbol-stop"></div></div><div class="media-btn" id="btn-play" title="Play"><div class="symbol-play"></div></div></div><div style="margin-top:5px; font-size:12px;" id="sound-status">Ready</div></div>`;


  }

  mount() {
    const w = this.windowEl;
    const app = this;
  const canvas = w.querySelector(".sound-wave-canvas");
  const ctx = canvas.getContext("2d");
  const status = w.querySelector("#sound-status");

  let mediaRecorder;
  let audioChunks = [];
  let audioBlob = null;
  let audioUrl = null;
  let audioCtx;
  let analyser;
  let dataArray;
  let source;
  let streamRef;
  let animationId;
  let playbackAudio = null;
  let disposed = false;

  const revokeAudioUrl = () => {
    if (!audioUrl) return;
    URL.revokeObjectURL(audioUrl);
    audioUrl = null;
  };

  function draw() {
    if (!analyser) return;
    animationId = app.requestAnimationFrame(draw);
    analyser.getByteTimeDomainData(dataArray);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#0f0";
    ctx.beginPath();
    const sliceWidth = canvas.width / dataArray.length;
    let x = 0;
    for (let i = 0; i < dataArray.length; i++) {
      const v = dataArray[i] / 128.0;
      const y = (v * canvas.height) / 2;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
      x += sliceWidth;
    }
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
  }

  const recBtn = w.querySelector("#btn-rec");
  const stopBtn = w.querySelector("#btn-stop");
  const playBtn = w.querySelector("#btn-play");

  const onRecord = async () => {
    try {
      if (!audioCtx) audioCtx = app.trackAudioContext(new (window.AudioContext || window.webkitAudioContext)());
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef = app.trackMediaStream(stream);

      analyser = audioCtx.createAnalyser();
      source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.fftSize = 256;
      dataArray = new Uint8Array(analyser.frequencyBinCount);
      draw();

      mediaRecorder = new MediaRecorder(stream);
      audioChunks = [];
      mediaRecorder.ondataavailable = (event) => audioChunks.push(event.data);
      mediaRecorder.onstop = () => {
        if (disposed) return;
        revokeAudioUrl();
        audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        if (audioUrl) URL.revokeObjectURL(audioUrl);
        audioUrl = disposed ? null : app.trackObjectUrl(URL.createObjectURL(audioBlob));
        status.innerText = disposed ? "Ready" : "Stopped. Ready to play.";
        app.cancelAnimationFrame(animationId);
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      };

      mediaRecorder.start();
      status.innerText = "Recording...";
      status.style.color = "red";
    } catch (err) {
      status.innerText = "Error: Mic access denied.";
    }
  };

  const onStop = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
      if (streamRef) streamRef.getTracks().forEach((track) => track.stop());
      status.style.color = "black";
    }
  };

  const onPlay = () => {
    if (audioUrl) {
      if (playbackAudio) playbackAudio.pause();
      const audio = new Audio(audioUrl);
      playbackAudio = audio;
      registerMediaElement(audio);
      audio.play();
      status.innerText = "Playing...";
      audio.onended = () => {
        status.innerText = "Ready";
        if (playbackAudio === audio) playbackAudio = null;
      };
    }
  };

  app.listen(recBtn, "click", onRecord);
  app.listen(stopBtn, "click", onStop);
  app.listen(playBtn, "click", onPlay);


    this._dispose = () => {
    if (disposed) return;
    disposed = true;
    if (mediaRecorder && mediaRecorder.state !== "inactive") mediaRecorder.stop();
    if (streamRef) streamRef.getTracks().forEach((track) => track.stop());
    if (playbackAudio) {
      playbackAudio.pause();
      playbackAudio.src = "";
      playbackAudio = null;
    }
    app.cancelAnimationFrame(animationId);
    if (source) source.disconnect();
    revokeAudioUrl();

    };

    return this;

  }

  dispose() {
    const dispose = this._dispose;
    this._dispose = null;
    if (dispose) dispose();
    super.dispose();
  }
}

