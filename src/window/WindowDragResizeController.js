export class WindowDragResizeController {
  constructor({ focusWindow, saveDesktopState }) {
    this.focusWindow = focusWindow;
    this.saveDesktopState = saveDesktopState;
    this.dragState = {
      isDragging: false,
      initialX: 0,
      initialY: 0,
      offX: 0,
      offY: 0,
      currentWin: null
    };
    this.resizeState = {
      isResizing: false,
      currentWin: null,
      handleType: null,
      initialX: 0,
      initialY: 0,
      initialW: 0,
      initialH: 0,
      initialL: 0,
      initialT: 0
    };
  }

  startDrag(e, winEl) {
    if (e.target.closest(".win-btn") || e.target.closest(".sys-box")) return;
    this.dragState.isDragging = true;
    this.dragState.currentWin = winEl;
    this.dragState.initialX = e.clientX;
    this.dragState.initialY = e.clientY;
    this.dragState.offX = winEl.offsetLeft;
    this.dragState.offY = winEl.offsetTop;
    this.focusWindow(winEl.dataset.id);
  }

  onDrag(e) {
    if (!this.dragState.isDragging) return;
    const dx = e.clientX - this.dragState.initialX;
    const dy = e.clientY - this.dragState.initialY;
    this.dragState.currentWin.style.left = this.dragState.offX + dx + "px";
    this.dragState.currentWin.style.top = this.dragState.offY + dy + "px";
  }

  endDrag() {
    if (!this.dragState.isDragging) return;
    this.dragState.isDragging = false;
    this.dragState.currentWin = null;
    this.saveDesktopState();
  }

  startResize(e, winEl, type) {
    e.stopPropagation();
    e.preventDefault();
    this.resizeState.isResizing = true;
    this.resizeState.currentWin = winEl;
    this.resizeState.handleType = type;
    this.resizeState.initialX = e.clientX;
    this.resizeState.initialY = e.clientY;
    const rect = winEl.getBoundingClientRect();
    this.resizeState.initialW = rect.width;
    this.resizeState.initialH = rect.height;
    this.resizeState.initialL = rect.left;
    this.resizeState.initialT = rect.top;
    this.focusWindow(winEl.dataset.id);
  }

  onResize(e) {
    if (!this.resizeState.isResizing) return;
    const dx = e.clientX - this.resizeState.initialX;
    const dy = e.clientY - this.resizeState.initialY;
    const type = this.resizeState.handleType;
    const win = this.resizeState.currentWin;
    let newW = this.resizeState.initialW;
    let newH = this.resizeState.initialH;
    let newL = this.resizeState.initialL;
    let newT = this.resizeState.initialT;
    if (type.includes("e")) newW += dx;
    if (type.includes("s")) newH += dy;
    if (type.includes("w")) {
      newW -= dx;
      newL += dx;
    }
    if (type.includes("n")) {
      newH -= dy;
      newT += dy;
    }
    if (newW > 100) {
      win.style.width = newW + "px";
      win.style.left = newL + "px";
    }
    if (newH > 100) {
      win.style.height = newH + "px";
      win.style.top = newT + "px";
    }
  }

  endResize() {
    if (!this.resizeState.isResizing) return;
    this.resizeState.isResizing = false;
    this.resizeState.currentWin = null;
    this.saveDesktopState();
  }
}
