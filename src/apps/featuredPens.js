import { installPenApp } from "./codepen.js";
import { getManifestForApp } from "../installer.js";
import { readFileStoreValue, writeFileStoreValue } from "../filesystem.js";

// Curated demos that ship pre-installed as Oriel apps. Each carries its own
// HTML/CSS/JS source and is installed once through the regular pen install
// pipeline (virtual-filesystem manifest + runtime registry). They compile to a
// self-contained sandboxed iframe -- no network, no CodePen chrome. Uninstalling
// one keeps it uninstalled because the seed marker below remembers which ids
// have already been offered.
export const FEATURED_CODEPEN_PENS = [
  {
    id: "starfield",
    name: "Starfield",
    width: 720,
    height: 540,
    html: `<canvas id="s"></canvas>`,
    css: `html,body{margin:0;height:100%;background:#000;overflow:hidden}canvas{display:block}`,
    js: `const c=document.getElementById("s"),x=c.getContext("2d");
let w,h,stars=[];
function resize(){w=c.width=innerWidth;h=c.height=innerHeight;stars=Array.from({length:400},()=>({x:Math.random()*w-w/2,y:Math.random()*h-h/2,z:Math.random()*w}))}
addEventListener("resize",resize);resize();
function tick(){
  x.fillStyle="rgba(0,0,0,.4)";x.fillRect(0,0,w,h);
  x.save();x.translate(w/2,h/2);
  for(const s of stars){
    s.z-=4;if(s.z<=0){s.z=w;s.x=Math.random()*w-w/2;s.y=Math.random()*h-h/2}
    const k=128/s.z,px=s.x*k,py=s.y*k,r=Math.max(0,(1-s.z/w)*2.5);
    x.fillStyle="#fff";x.beginPath();x.arc(px,py,r,0,7);x.fill();
  }
  x.restore();requestAnimationFrame(tick);
}
tick();`
  },
  {
    id: "bouncing-logo",
    name: "Bouncing Logo",
    width: 720,
    height: 540,
    html: `<div id="logo">ORIEL</div>`,
    css: `html,body{margin:0;height:100%;background:#0b1020;overflow:hidden;font-family:system-ui,sans-serif}
#logo{position:absolute;top:0;left:0;font-size:52px;font-weight:800;letter-spacing:6px;will-change:transform}`,
    js: `const l=document.getElementById("logo");
let x=40,y=40,dx=2.2,dy=2;
function hue(){l.style.color="hsl("+Math.floor(Math.random()*360)+",90%,60%)"}
hue();
function tick(){
  const w=innerWidth-l.offsetWidth,h=innerHeight-l.offsetHeight;
  x+=dx;y+=dy;
  if(x<=0||x>=w){dx=-dx;x=Math.max(0,Math.min(w,x));hue()}
  if(y<=0||y>=h){dy=-dy;y=Math.max(0,Math.min(h,y));hue()}
  l.style.transform="translate("+x+"px,"+y+"px)";
  requestAnimationFrame(tick);
}
tick();`
  },
  {
    id: "matrix-rain",
    name: "Matrix Rain",
    width: 720,
    height: 540,
    html: `<canvas id="m"></canvas>`,
    css: `html,body{margin:0;height:100%;background:#000;overflow:hidden}canvas{display:block}`,
    js: `const c=document.getElementById("m"),x=c.getContext("2d");
const chars="\\u30A2\\u30A4\\u30A6\\u30A8\\u30AA\\u30AB0123456789".split("");
let cols,drops=[];
function resize(){c.width=innerWidth;c.height=innerHeight;cols=Math.floor(c.width/16);drops=Array(cols).fill(1)}
addEventListener("resize",resize);resize();
setInterval(()=>{
  x.fillStyle="rgba(0,0,0,.06)";x.fillRect(0,0,c.width,c.height);
  x.fillStyle="#39ff14";x.font="16px monospace";
  for(let i=0;i<cols;i++){
    const t=chars[Math.floor(Math.random()*chars.length)];
    x.fillText(t,i*16,drops[i]*16);
    if(drops[i]*16>c.height&&Math.random()>.975)drops[i]=0;
    drops[i]++;
  }
},45);`
  }
];

export const FEATURED_PENS_SEED_KEY = "oriel-featured-codepen-seeded";

async function readSeededIds() {
  try {
    const stored = await readFileStoreValue(FEATURED_PENS_SEED_KEY);
    if (Array.isArray(stored?.ids)) {
      return stored.ids.filter((id) => typeof id === "string");
    }
  } catch (err) {
    console.warn("Failed to read featured pen seed marker", err);
  }
  return [];
}

async function writeSeededIds(ids) {
  try {
    await writeFileStoreValue(FEATURED_PENS_SEED_KEY, { ids });
  } catch (err) {
    console.warn("Failed to persist featured pen seed marker", err);
  }
}

export async function installFeaturedCodePenApps({
  pens = FEATURED_CODEPEN_PENS,
  installApp = installPenApp,
  isInstalled = (id) => Boolean(getManifestForApp(id)),
  loadSeededIds = readSeededIds,
  saveSeededIds = writeSeededIds
} = {}) {
  const seeded = new Set(await loadSeededIds());
  const installed = [];
  let seedChanged = false;

  for (const pen of pens) {
    if (!pen?.id) {
      console.warn("Skipping featured pen entry with no id.");
      continue;
    }
    const id = `pen-${pen.id}`;
    // Seeded before: the user may have uninstalled it since, so never resurrect.
    if (seeded.has(id)) continue;
    if (isInstalled(id)) {
      seeded.add(id);
      seedChanged = true;
      continue;
    }

    try {
      const { manifest } = await installApp({
        id: pen.id,
        name: pen.name,
        html: pen.html,
        css: pen.css,
        js: pen.js,
        width: pen.width,
        height: pen.height
      });
      installed.push(manifest.id);
      seeded.add(id);
      seedChanged = true;
    } catch (err) {
      // Leave the pen unseeded so the next boot retries the install.
      console.warn(`Failed to install featured pen '${pen.name}':`, err);
    }
  }

  if (seedChanged) await saveSeededIds(Array.from(seeded));
  return installed;
}
