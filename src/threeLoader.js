let threePromise = null;

export function loadThree() {
  if (!threePromise) {
    threePromise = import(
      "https://cdn.jsdelivr.net/npm/three@0.182.0/build/three.module.js"
    );
  }
  return threePromise;
}
