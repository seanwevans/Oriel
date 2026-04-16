export const WINDOW_BODY_SELECTOR = ".window-body";

export function getWindowBodyContainer(root) {
  if (!root) return null;
  return root.querySelector(WINDOW_BODY_SELECTOR);
}
