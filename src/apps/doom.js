let jsDosLoadPromise = null;

function loadJsDos() {
  if (window.Dos) return Promise.resolve(); // already loaded

  if (jsDosLoadPromise) return jsDosLoadPromise; // already loading

  jsDosLoadPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://js-dos.com/6.22/current/js-dos.js";
    script.onload = () => resolve();
    script.onerror = (e) => reject(e);
    document.head.appendChild(script);
  });

  return jsDosLoadPromise;
}

export function initDoom(win) {
  const container = win.querySelector("#doom-container");
  if (!container) return;

  const savedTitle = document.title;
  const restoreTitle = () => { document.title = savedTitle; };

  loadJsDos()
    .then(() => {
      return window.Dos(container, {
        style: "none",
        wdosboxUrl: "https://js-dos.com/6.22/current/wdosbox.js"
      }).ready((fs, main) => {
        restoreTitle();
        fs.extract("https://js-dos.com/cdn/upload/DOOM-@evilution.zip").then(() => {
          restoreTitle();
          main(["-c", "cd doom", "-c", "doom"]).then((ci) => {
            win.doomCI = ci;
            restoreTitle();
            setTimeout(restoreTitle, 100);
          });
        });
      });
    })
    .catch((err) => {
      console.error("Failed to load js-dos:", err);
      container.innerHTML =
        '<div style="color:#f44;font-family:var(--font-main);padding:8px;">Failed to load DOOM (js-dos load error).</div>';
    });
}
