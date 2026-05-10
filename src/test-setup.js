// Mock IndexedDB by removing it from the global scope
// This forces the filesystem module to gracefully fall back to localStorage
// which is already properly mocked in test files

const originalIndexedDB = globalThis.indexedDB;

// Delete indexedDB so filesystem.js treats it as unavailable
// and uses localStorage fallback instead
delete globalThis.indexedDB;

export function restoreIndexedDB() {
  if (originalIndexedDB) {
    globalThis.indexedDB = originalIndexedDB;
  }
}
