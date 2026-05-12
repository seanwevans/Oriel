export class WindowLayoutService {
  constructor({ getWindows, getDesktop, saveDesktopState }) {
    this.getWindows = getWindows;
    this.getDesktop = getDesktop;
    this.saveDesktopState = saveDesktopState;
  }

  cascadeWindows() {
    const openWins = this.getWindows()
      .filter((w) => !w.minimized)
      .sort(
        (a, b) =>
          parseInt(a.el.style.zIndex || "0", 10) -
          parseInt(b.el.style.zIndex || "0", 10)
      );
    if (!openWins.length) return;

    const desktopRect = this.getDesktop().getBoundingClientRect();
    const width = Math.floor(desktopRect.width * 0.8);
    const height = Math.floor(desktopRect.height * 0.8);

    openWins.forEach((win, idx) => {
      win.maximized = false;
      win.prevRect = null;
      win.el.style.width = `${width}px`;
      win.el.style.height = `${height}px`;
      win.el.style.left = `${idx * 20}px`;
      win.el.style.top = `${idx * 20}px`;
    });
    this.saveDesktopState();
  }

  tileWindows() {
    const openWins = this.getWindows().filter((w) => !w.minimized);
    if (!openWins.length) return;

    const desktopRect = this.getDesktop().getBoundingClientRect();
    const count = openWins.length;
    const cols = Math.ceil(Math.sqrt(count));
    const rows = Math.ceil(count / cols);
    const width = Math.floor(desktopRect.width / cols);
    const height = Math.floor(desktopRect.height / rows);

    openWins.forEach((win, idx) => {
      const row = Math.floor(idx / cols);
      const col = idx % cols;
      win.maximized = false;
      win.prevRect = null;
      win.el.style.width = `${width}px`;
      win.el.style.height = `${height}px`;
      win.el.style.left = `${col * width}px`;
      win.el.style.top = `${row * height}px`;
    });
    this.saveDesktopState();
  }
}
