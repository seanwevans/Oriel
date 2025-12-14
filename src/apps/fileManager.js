import { ICONS } from "../icons.js";
import { MOCK_FS, hydrateNativeDirectory } from "../filesystem.js";

async function initFileManager(w) {
  const defaultDrive = Object.keys(MOCK_FS)[0] || "C\\";
  w.cP = defaultDrive;
  w.cD = MOCK_FS[defaultDrive];
  w.currentDirObj = w.cD;
  await rFT(w);
  await rFL(w);
}


function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

async function openNativeFile(node, displayName) {
  const handle = node?.nativeHandle;
  if (!handle?.getFile) throw new Error("Native file handle unavailable.");

  const file = await handle.getFile();
  const name = node?.nativeName || displayName || file.name;
  const ext = (name.split(".").pop() || "").toLowerCase();
  const textExts = ["txt", "md", "json", "csv", "js", "ts", "css", "log"]; // default to notepad

  if (textExts.includes(ext)) {
    const text = await file.text();
    wm.openWindow("notepad", name, 400, 300, {
      text,
      nativeFileHandle: handle,
      fileName: name
    });
    return;
  }

  if (file.type.startsWith("image/") || ["png", "jpg", "jpeg", "gif", "bmp", "webp"].includes(ext)) {
    const src = await readFileAsDataUrl(file);
    wm.openWindow("imageviewer", name, 720, 540, { name, src });
    return;
  }

  if (file.type === "application/pdf" || ext === "pdf") {
    const src = await readFileAsDataUrl(file);
    wm.openWindow("pdfreader", name, 700, 500, { name, src });
    return;
  }

  const buffer = new Uint8Array(await file.arrayBuffer());
  wm.openWindow("hexedit", name, 640, 520, buffer);
}

async function rFT(w) {
  const r = w.querySelector("#file-tree-root");
  r.innerHTML = "";
  const updateHeaders = (path) => {
    const treeHeader = w.querySelector(".winfile-tree .winfile-pane-header");
    if (treeHeader) treeHeader.textContent = path.split("\\")[0] + "\\";
  };

  const b = async (c, p, o) => {
    if (o?.nativeHandle) await hydrateNativeDirectory(o);
    const d = document.createElement("div");
    d.className = "tree-item " + (w.cP === p ? "selected" : "");
    d.innerHTML =
      ICONS.folder + `<span>${p.split("\\").pop() || "C\\"}</span>`;
    d.onclick = async (e) => {
      e.stopPropagation();
      w.cP = p;
      w.cD = o;
      w.currentDirObj = o;
      await rFT(w);
      await rFL(w);
    };
    c.appendChild(d);
    if (o.children) {
      const s = document.createElement("div");
      s.style.paddingLeft = "15px";
      const dirEntries = Object.keys(o.children).filter((k) => o.children[k].type === "dir");
      for (const k of dirEntries) {
        await b(s, p === "C\\" ? p + k : p + "\\" + k, o.children[k]);
      }
      c.appendChild(s);
    }
  };
  const drives = Object.entries(MOCK_FS);
  for (const [driveKey, node] of drives) {
    await b(r, driveKey, node);
  }
  updateHeaders(w.cP || "C\\");
}

async function rFL(w) {
  const v = w.querySelector("#file-list-view");
  w.querySelector("#file-list-header").innerText = w.cP + "*.*";
  v.innerHTML = "";
  if (w.cD?.nativeHandle) await hydrateNativeDirectory(w.cD);
  if (w.cD && w.cD.children)
    Object.keys(w.cD.children)
      .sort()
      .forEach((k) => {
        const i = w.cD.children[k],
          r = document.createElement("div");
        r.className = "file-item";
        r.innerHTML =
          (i.type === "file"
            ? k.endsWith(".EXE")
              ? ICONS.file_exe
              : ICONS.file_txt
            : ICONS.folder) + `<span>${k}</span>`;
        r.ondblclick = async () => {
          if (i.type === "dir") {
            const np = w.cP.endsWith("\\") ? w.cP + k : w.cP + "\\" + k;
            w.cP = np;
            w.cD = i;
            w.currentDirObj = i;
            await rFT(w);
            await rFL(w);
          } else if (i.nativeHandle) {
            openNativeFile(i, k).catch((err) => {
              alert(`Unable to open file: ${err.message}`);
            });
          } else if (i.app) {
            const size =
              i.app === "skifree"
                ? { w: 520, h: 520 }
                : i.app === "imageviewer"
                  ? { w: 720, h: 540 }
                  : i.app === "beatmaker"
                    ? { w: 720, h: 420 }
                    : { w: 400, h: 300 };
            wm.openWindow(i.app, i.app.toUpperCase(), size.w, size.h, i.content);
          }
        };
        r.onclick = () => {
          w.querySelectorAll(".file-item").forEach((x) =>
            x.classList.remove("selected")
          );
          r.classList.add("selected");
        };
        v.appendChild(r);
      });
}

export { initFileManager, rFT, rFL };
