/**
 * Creates the stable service bag passed from the host shell into windows/apps.
 *
 * Keep this shape append-only where possible so apps can depend on these keys
 * existing even before a concrete implementation has been wired during boot.
 */
export function createSystemServices(overrides = {}) {
  return {
    windowManager: null,
    kernel: null,
    publish: null,
    subscribe: null,
    filesystem: null,
    fileSystemActions: null,
    wallpaper: null,
    audio: null,
    network: null,
    alertUser: null,
    ...overrides
  };
}

export function updateSystemServices(services, updates = {}) {
  if (!services) return createSystemServices(updates);
  Object.assign(services, updates);
  return services;
}
