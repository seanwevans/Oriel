export const WINDOW_BODY_SELECTOR = ".window-body";

export function getWindowBodyContainer(root) {
  if (!root) return null;
  return root.querySelector(WINDOW_BODY_SELECTOR);
}

function isHTMLElement(node) {
  return typeof HTMLElement !== "undefined" && node instanceof HTMLElement;
}

export function resolveWindowContentContainer(targetElement, targetContainer) {
  if (targetContainer) return targetContainer;
  const win = targetElement?.closest ? targetElement.closest(".window") : null;
  return getWindowBodyContainer(win) || (isHTMLElement(targetElement) ? targetElement : null);
}
