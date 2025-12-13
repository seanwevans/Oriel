export function initPaint(w) {
  const c = w.querySelector("canvas"),
    ctx = c.getContext("2d"),
    p = w.querySelector("#paint-palette");
  w.pS = {
    d: false,
    t: "brush",
    c: "#000",
    lx: 0,
    ly: 0
  };
  ctx.fillStyle = "#FFF";
  ctx.fillRect(0, 0, c.width, c.height);
  const cols = [
    "#000",
    "#FFF",
    "#808080",
    "#C0C0C0",
    "#800000",
    "#F00",
    "#808000",
    "#FF0",
    "#008000",
    "#0F0",
    "#008080",
    "#0FF",
    "#000080",
    "#00F",
    "#800080",
    "#F0F"
  ];
  cols.forEach((x) => {
    const s = document.createElement("div");
    s.className = "color-swatch";
    s.style.background = x;
    s.onclick = () => {
      w.querySelectorAll(".color-swatch").forEach((z) =>
        z.classList.remove("active")
      );
      s.classList.add("active");
      w.pS.c = x;
    };
    p.appendChild(s);
  });
  c.onmousedown = (e) => {
    w.pS.d = true;
    const r = c.getBoundingClientRect();
    w.pS.lx = e.clientX - r.left;
    w.pS.ly = e.clientY - r.top;
  };
  c.onmousemove = (e) => {
    if (!w.pS.d) return;
    const r = c.getBoundingClientRect(),
      x = e.clientX - r.left,
      y = e.clientY - r.top;
    ctx.beginPath();
    ctx.moveTo(w.pS.lx, w.pS.ly);
    ctx.lineTo(x, y);
    ctx.strokeStyle = w.pS.t === "eraser" ? "#FFF" : w.pS.c;
    ctx.lineWidth = w.pS.t === "eraser" ? 10 : 2;
    ctx.stroke();
    w.pS.lx = x;
    w.pS.ly = y;
  };
  window.onmouseup = () => {
    if (w.pS) w.pS.d = false;
  };
}

export function selectPaintTool(el, t) {
  const w = el.closest(".window");
  w.querySelectorAll(".tool-btn").forEach((b) => b.classList.remove("active"));
  el.classList.add("active");
  w.pS.t = t;
}

export function clearPaint(el) {
  const c = el.closest(".window").querySelector("canvas");
  c.getContext("2d").fillRect(0, 0, c.width, c.height);
}
