export class SimulatedKernel {
  constructor(onTick = () => {}) {
    this.processes = [];
    this.schedulerInterval = null;
    this.currentProcessIndex = 0;
    this.onTick = onTick;
    this.commandHandlers = new Map();
  }
  registerProcess(pid, name) {
    this.processes.push({
      pid: pid,
      name: name,
      state: "READY",
      priority: Math.floor(Math.random() * 10) + 1,
      cpuTime: 0
    });
    this.startScheduler();
  }
  unregisterProcess(pid) {
    const idx = this.processes.findIndex((p) => p.pid === pid);
    if (idx > -1) this.processes.splice(idx, 1);
  }
  startScheduler() {
    if (this.schedulerInterval) return;
    this.schedulerInterval = setInterval(() => this.tick(), 200);
  }
  normalizeCommandName(name) {
    return typeof name === "string" ? name.trim().toLowerCase() : "";
  }
  registerCommand(name, handler) {
    const normalized = this.normalizeCommandName(name);
    if (!normalized || typeof handler !== "function") return () => {};
    this.commandHandlers.set(normalized, handler);
    return () => this.unregisterCommand(normalized, handler);
  }
  unregisterCommand(name, handler) {
    const normalized = this.normalizeCommandName(name);
    if (!normalized) return;
    const existing = this.commandHandlers.get(normalized);
    if (handler && existing && existing !== handler) return;
    this.commandHandlers.delete(normalized);
  }
  getCommandHandler(name) {
    return this.commandHandlers.get(this.normalizeCommandName(name));
  }
  tick() {
    if (this.processes.length === 0) return;
    if (this.currentProcessIndex >= this.processes.length) {
      this.currentProcessIndex = 0;
    }
    const p = this.processes[this.currentProcessIndex];
    if (p) {
      if (p.state !== "WAITING") {
        p.state = "RUNNING";
        p.cpuTime += 200;
      }
    } else {
      this.currentProcessIndex = 0;
      return;
    }
    this.processes.forEach((proc, idx) => {
      if (idx !== this.currentProcessIndex) {
        if (proc.state === "RUNNING") proc.state = "READY";
        if (Math.random() < 0.1) proc.state = "WAITING";
        else if (proc.state === "WAITING" && Math.random() < 0.3)
          proc.state = "READY";
      }
    });
    this.currentProcessIndex =
      (this.currentProcessIndex + 1) % this.processes.length;
    this.onTick();
  }
}
