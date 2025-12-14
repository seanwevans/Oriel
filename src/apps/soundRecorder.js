import { registerMediaElement } from "../audio.js";

export function initSoundRecorder(w) {
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

  function draw() {
    if (!analyser) return;
    animationId = requestAnimationFrame(draw);
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

  w.querySelector("#btn-rec").onclick = async () => {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef = stream;

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
        audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        audioUrl = URL.createObjectURL(audioBlob);
        status.innerText = "Stopped. Ready to play.";
        cancelAnimationFrame(animationId);
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

  w.querySelector("#btn-stop").onclick = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
      if (streamRef) streamRef.getTracks().forEach((track) => track.stop());
      status.style.color = "black";
    }
  };

  w.querySelector("#btn-play").onclick = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      registerMediaElement(audio);
      audio.play();
      status.innerText = "Playing...";
      audio.onended = () => {
        status.innerText = "Ready";
      };
    }
  };
}
