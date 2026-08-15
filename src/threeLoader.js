// Three.js is loaded on demand so the ~600 kB library stays out of the entry
// chunk — only Shader Lab, Sandspiel 3D, and the screensaver pull it in, and
// only once one of them is actually opened.
//
// This resolves the `three` package from node_modules rather than a CDN, so the
// version that ships is the one pinned in package-lock.json. Vite emits it as a
// separate chunk served from our own origin, which keeps the dependency inside
// the lockfile's integrity guarantees instead of trusting a third party at
// runtime.
let threePromise = null;

export function loadThree() {
  if (!threePromise) {
    threePromise = import("three");
  }
  return threePromise;
}
