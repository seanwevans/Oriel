import { getWindowBodyContainer } from "../windowContent.js";

export function addKeyboardActivation(el, handler) {
  if (!el) return;
  el.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handler();
    }
  });
}

export function setupMenuBar(win) {
  const menuBar = win.querySelector(".menu-bar");
  if (!menuBar) return;
  const items = Array.from(menuBar.querySelectorAll(".menu-item"));
  if (!items.length) return;

  menuBar.setAttribute("role", "menubar");
  let focusedIndex = 0;

  const focusItem = (idx) => {
    const safeIndex = ((idx % items.length) + items.length) % items.length;
    focusedIndex = safeIndex;
    items.forEach((item, i) => {
      item.tabIndex = i === safeIndex ? 0 : -1;
    });
    items[safeIndex].focus();
  };

  items.forEach((item, idx) => {
    item.setAttribute("role", "menuitem");
    item.tabIndex = idx === 0 ? 0 : -1;
    item.addEventListener("focus", () => {
      focusedIndex = idx;
    });
    item.addEventListener("click", () => {
      focusedIndex = idx;
      focusItem(idx);
    });
    item.addEventListener("keydown", (e) => {
      const key = e.key;
      if (key === "ArrowRight") {
        e.preventDefault();
        focusItem(focusedIndex + 1);
      } else if (key === "ArrowLeft") {
        e.preventDefault();
        focusItem(focusedIndex - 1);
      } else if (key === "Home") {
        e.preventDefault();
        focusItem(0);
      } else if (key === "End") {
        e.preventDefault();
        focusItem(items.length - 1);
      } else if (key === "Enter" || key === " ") {
        e.preventDefault();
        item.click();
      } else if (key === "Escape") {
        e.preventDefault();
        item.blur();
      }
    });
  });
}

export function createWindowDOM({
  id,
  type,
  title,
  width,
  height,
  content,
  stateOverrides = {},
  windowCount = 0,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onStartDrag,
  onStartResize
}) {
  const win = document.createElement("div");
  win.classList.add("window");
  const resolvedWidth =
    typeof width === "number" ? `${width}px` : width || width === 0 ? width : "";
  const resolvedHeight =
    typeof height === "number" ? `${height}px` : height || height === 0 ? height : "";
  win.setAttribute("role", "dialog");
  win.setAttribute("aria-label", title);
  const resolvedLeft =
    stateOverrides.left !== undefined
      ? stateOverrides.left
      : `${40 + windowCount * 20}px`;
  const resolvedTop =
    stateOverrides.top !== undefined
      ? stateOverrides.top
      : `${40 + windowCount * 20}px`;
  win.style.width = resolvedWidth;
  win.style.height = resolvedHeight;
  win.style.left = typeof resolvedLeft === "number" ? `${resolvedLeft}px` : resolvedLeft;
  win.style.top = typeof resolvedTop === "number" ? `${resolvedTop}px` : resolvedTop;
  win.dataset.id = id;
  win.dataset.appType = type;
  win.dataset.title = title;

  const resizeHandles = ["n", "s", "e", "w", "ne", "nw", "se", "sw"];
  resizeHandles.forEach((handleType) => {
    const resizer = document.createElement("div");
    resizer.classList.add("resizer", handleType);
    resizer.dataset.resize = handleType;
    win.appendChild(resizer);
  });

  const titleBar = document.createElement("div");
  titleBar.classList.add("title-bar");

  const closeBtn = document.createElement("div");
  closeBtn.classList.add("sys-box");
  closeBtn.textContent = "-";
  closeBtn.addEventListener("click", () => onClose?.(id));
  titleBar.appendChild(closeBtn);

  const titleText = document.createElement("div");
  titleText.classList.add("title-bar-text");
  titleText.textContent = title;
  titleBar.appendChild(titleText);

  const controls = document.createElement("div");
  controls.classList.add("win-controls-right");

  const minimizeBtn = document.createElement("div");
  minimizeBtn.classList.add("win-btn");
  minimizeBtn.textContent = "▼";
  minimizeBtn.addEventListener("click", () => onMinimize?.(id));
  controls.appendChild(minimizeBtn);

  const maximizeBtn = document.createElement("div");
  maximizeBtn.classList.add("win-btn");
  maximizeBtn.textContent = "▲";
  maximizeBtn.addEventListener("click", () => onMaximize?.(id));
  controls.appendChild(maximizeBtn);

  titleBar.appendChild(controls);
  win.appendChild(titleBar);

  const menuBar = document.createElement("div");
  menuBar.classList.add("menu-bar");
  ["File", "Edit", "Help"].forEach((label) => {
    const menuItem = document.createElement("div");
    menuItem.classList.add("menu-item");
    menuItem.textContent = label;
    menuBar.appendChild(menuItem);
  });
  win.appendChild(menuBar);

  const windowBody = document.createElement("div");
  windowBody.classList.add("window-body");
  win.appendChild(windowBody);
  const contentArea = getWindowBodyContainer(win);
  if (contentArea) {
    if (typeof content === "string") {
      contentArea.innerHTML = content;
    } else if (globalThis.Node && content instanceof Node) {
      contentArea.appendChild(content);
    }
  }

  titleBar.addEventListener("mousedown", (e) => {
    if (
      e.target.classList.contains("sys-box") ||
      e.target.classList.contains("win-btn")
    )
      return;
    onStartDrag?.(e, win);
  });

  closeBtn.setAttribute("role", "button");
  closeBtn.setAttribute("aria-label", `Close ${title}`);
  closeBtn.tabIndex = 0;
  addKeyboardActivation(closeBtn, () => onClose?.(id));

  minimizeBtn.setAttribute("role", "button");
  minimizeBtn.setAttribute("aria-label", `Minimize ${title}`);
  minimizeBtn.tabIndex = 0;
  addKeyboardActivation(minimizeBtn, () => onMinimize?.(id));

  maximizeBtn.setAttribute("role", "button");
  maximizeBtn.setAttribute("aria-label", `Maximize ${title}`);
  maximizeBtn.tabIndex = 0;
  addKeyboardActivation(maximizeBtn, () => onMaximize?.(id));
  setupMenuBar(win);

  win.querySelectorAll(".resizer").forEach((r) => {
    r.addEventListener("mousedown", (e) =>
      onStartResize?.(e, win, r.dataset.resize)
    );
  });
  win.addEventListener("mousedown", () => onFocus?.(id));
  return win;
}
