export function initClock(w) {
  const canvas = w.querySelector(".clock-canvas");
  const ctx = canvas.getContext("2d");
  const digital = w.querySelector(".clock-digital");
  const layout = w.querySelector(".clock-layout");
  let analogMode = true;

  const formatTime = (date) => {
    const hh = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");
    const ss = String(date.getSeconds()).padStart(2, "0");
    return `${hh}:${mm}:${ss}`;
  };

  const drawAnalog = (date) => {
    const wH = canvas.width;
    const center = wH / 2;
    ctx.clearRect(0, 0, wH, wH);
    ctx.fillStyle = "#f5f5f5";
    ctx.fillRect(0, 0, wH, wH);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(center, center, center - 10, 0, Math.PI * 2);
    ctx.stroke();
    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI / 6) * i;
      const inner = center - 15;
      const outer = center - 5;
      ctx.beginPath();
      ctx.moveTo(
        center + inner * Math.sin(angle),
        center - inner * Math.cos(angle)
      );
      ctx.lineTo(
        center + outer * Math.sin(angle),
        center - outer * Math.cos(angle)
      );
      ctx.stroke();
    }

    const sec = date.getSeconds();
    const min = date.getMinutes();
    const hr = date.getHours() % 12;

    const drawHand = (value, max, length, width, color) => {
      const angle = (Math.PI * 2 * (value / max)) - Math.PI / 2;
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.lineTo(
        center + length * Math.cos(angle),
        center + length * Math.sin(angle)
      );
      ctx.stroke();
    };

    drawHand(hr + min / 60, 12, center - 55, 4, "#000");
    drawHand(min + sec / 60, 60, center - 35, 3, "#000");
    drawHand(sec, 60, center - 25, 2, "red");
  };

  const render = () => {
    const now = new Date();
    if (analogMode) {
      canvas.style.display = "block";
      digital.style.display = "none";
      drawAnalog(now);
    } else {
      canvas.style.display = "none";
      digital.style.display = "block";
      digital.innerText = formatTime(now);
    }
  };

  layout?.addEventListener("dblclick", () => {
    analogMode = !analogMode;
    render();
  });

  render();
  setInterval(render, 1000);
}
