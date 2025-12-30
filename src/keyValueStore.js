const KEY_VALUE_STORE_KEY = "oriel-kv-store";

const createMemoryStorage = () => {
  const store = new Map();
  return {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => store.set(key, value),
    removeItem: (key) => store.delete(key)
  };
};

let memoryStorage = null;

function getStorage(storageOverride) {
  if (storageOverride) return storageOverride;
  if (typeof localStorage !== "undefined") return localStorage;
  if (!memoryStorage) memoryStorage = createMemoryStorage();
  return memoryStorage;
}

function readStore(storage) {
  try {
    const raw = storage.getItem(KEY_VALUE_STORE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed;
    }
  } catch (err) {
    console.warn("Failed to parse key-value store", err);
  }
  return {};
}

function writeStore(store, storage) {
  storage.setItem(KEY_VALUE_STORE_KEY, JSON.stringify(store));
  return store;
}

export function getKeyValue(key, { storage } = {}) {
  if (!key) return null;
  const targetStorage = getStorage(storage);
  const store = readStore(targetStorage);
  return Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null;
}

export function setKeyValue(key, value, { storage } = {}) {
  if (!key) return null;
  const targetStorage = getStorage(storage);
  const store = readStore(targetStorage);
  store[key] = value;
  writeStore(store, targetStorage);
  return store[key];
}

export function deleteKeyValue(key, { storage } = {}) {
  if (!key) return false;
  const targetStorage = getStorage(storage);
  const store = readStore(targetStorage);
  if (!Object.prototype.hasOwnProperty.call(store, key)) return false;
  delete store[key];
  writeStore(store, targetStorage);
  return true;
}

export function clearKeyValueStore({ storage } = {}) {
  const targetStorage = getStorage(storage);
  return writeStore({}, targetStorage);
}

export function listKeyValues({ storage } = {}) {
  const targetStorage = getStorage(storage);
  const store = readStore(targetStorage);
  return Object.entries(store);
}

export function getKeyValueStoreSnapshot({ storage } = {}) {
  const targetStorage = getStorage(storage);
  return readStore(targetStorage);
}
