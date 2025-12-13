const subscribers = new Map();

function getHandlers(event) {
  let handlers = subscribers.get(event);
  if (!handlers) {
    handlers = new Set();
    subscribers.set(event, handlers);
  }
  return handlers;
}

export function subscribe(event, handler) {
  if (typeof handler !== "function") return () => {};
  const handlers = getHandlers(event);
  handlers.add(handler);
  return () => unsubscribe(event, handler);
}

export function unsubscribe(event, handler) {
  const handlers = subscribers.get(event);
  if (!handlers) return;
  handlers.delete(handler);
  if (handlers.size === 0) subscribers.delete(event);
}

export function publish(event, payload) {
  const handlers = subscribers.get(event);
  if (!handlers || handlers.size === 0) return;
  Array.from(handlers).forEach((handler) => {
    try {
      handler(payload);
    } catch (err) {
      console.error(`Error in handler for event '${event}'`, err);
    }
  });
}
