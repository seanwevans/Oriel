export function getWindowContentElement(winEl) {
  if (!winEl) return null;
  return winEl.querySelector(".window-body, .window-content");
}
