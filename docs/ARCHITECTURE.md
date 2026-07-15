# Oriel Architecture

Oriel is a retro desktop simulation built with vanilla ES modules and Vite. It
models a small operating system in the browser: a boot sequence, a simulated
kernel with a process scheduler, a virtual filesystem, a window manager, and a
registry of self-contained applications that share host services.

This document maps the project's topology. The diagrams render on GitHub and in
any Mermaid-aware viewer.

---

## 1. System topology

The entry point (`src/oriel.js`) constructs a single `OrielApp` orchestrator,
injecting every host subsystem as a dependency. `OrielApp` owns the kernel and
the window manager; the window manager owns app instantiation through the
`AppRegistry` and `AppHost`.

```mermaid
flowchart TD
  entry["src/oriel.js<br/>(entry point)"] --> orielApp["OrielApp<br/>core/OrielApp.js<br/>(orchestrator)"]

  subgraph subsystems["Injected host subsystems"]
    kernel["SimulatedKernel<br/>kernel.js"]
    fs["Virtual Filesystem<br/>filesystem.js"]
    state["Desktop State<br/>state.js"]
    wallpaper["Wallpaper<br/>wallpaper.js"]
    audio["Audio Engine<br/>audio.js"]
    net["Networking<br/>networking.js"]
    installer["Installer<br/>installer.js"]
    bus["Event Bus<br/>eventBus.js"]
  end

  orielApp --> kernel & fs & state & wallpaper & audio & net & installer & bus

  subgraph controllers["Desktop controllers"]
    desk["DesktopController"]
    imp["DesktopImportController"]
    fsa["FileSystemActions"]
    svc["systemServices"]
  end
  orielApp --> desk & imp & fsa & svc

  orielApp --> wm["WindowManager<br/>windowManager.js"]

  subgraph windowing["Windowing"]
    host["AppHost<br/>(lifecycle host)"]
    reg["AppRegistry<br/>(type → class)"]
    drag["WindowDragResizeController"]
    layout["WindowLayoutService"]
    persist["WindowStatePersistence"]
    content["windowContent"]
  end
  wm --> host & reg & drag & layout & persist & content

  reg --> manifest["APP_MANIFEST<br/>apps/manifest.js"]
  reg --> bindings["runtimeBindings.js<br/>(class table)"]
  host --> apps["App instances<br/>(extend BaseApp)"]
  apps --> base["BaseApp<br/>apps/base/BaseApp.js"]
```

---

## 2. Boot sequence

`window.onload` calls `OrielApp.start()`, which bootstraps installed apps, spins
up the kernel, restores saved desktop state, applies theme and wallpaper, wires
the desktop controllers, waits for the filesystem, then boots the desktop and
its shell affordances (splash, screensaver, drag-and-drop import).

```mermaid
sequenceDiagram
  participant Browser
  participant OrielApp
  participant Installer
  participant Kernel
  participant State
  participant WindowManager

  Browser->>OrielApp: window.onload → start()
  OrielApp->>OrielApp: cacheDom()
  OrielApp->>Installer: bootstrapInstallations() → purge legacy → install featured pens
  OrielApp->>Kernel: new SimulatedKernel(onTick)
  OrielApp->>State: loadDesktopState()
  OrielApp->>OrielApp: applySavedTheme + applyWallpaperSettings
  OrielApp->>OrielApp: initializeControllers() + registerShellGlobals()
  OrielApp->>OrielApp: await filesystemReady, installerReady
  OrielApp->>WindowManager: bootDesktop() → new WindowManager(state, services)
  OrielApp->>OrielApp: initSplash() + initScreensaver() + initDragAndDropImport()
```

---

## 3. Application registration pipeline

Each app is declared in four places, then resolved into a live class at runtime.
`composeRuntimeManifest` joins the metadata in `APP_MANIFEST` with the class
table in `runtimeBindings.js`, validating that every declared `appClass` has a
binding. `AppRegistry.createApp(type)` constructs the class; `AppHost` drives its
lifecycle.

```mermaid
flowchart LR
  subgraph declare["Declared per app"]
    m["manifest.js<br/>metadata + appClass name"]
    b["runtimeBindings.js<br/>name → class"]
    c["programCategories.js<br/>Program Manager group"]
    i["icons.js<br/>desktop/taskbar icon"]
  end

  m --> compose["composeRuntimeManifest()<br/>validate + join"]
  b --> compose
  compose --> registry["AppRegistry.manifest<br/>{ type → { …, appClass } }"]
  registry --> create["createApp(type, ctx)"]
  create --> instance["new AppClass({ windowEl, initData, services })"]
  instance --> host["AppHost mounts + tracks"]

  c --> progman["Program Manager<br/>categorized list"]
  i --> desktop["Desktop / taskbar rendering"]
```

> **Adding an app:** create `apps/<name>.js` exporting a `BaseApp` subclass, then
> register it in `manifest.js`, `runtimeBindings.js`, `programCategories.js`, and
> `icons.js`. `AppRegistry.test.js` and `programCategories.test.js` enforce that
> every manifest entry resolves a class and belongs to exactly one category.

---

## 4. App lifecycle (`BaseApp`)

Apps expose only three lifecycle hooks to the host. `getWindowContent()` must be
side-effect free (markup only); `mount()` attaches behavior after the window
element exists; `dispose()` releases every resource. `BaseApp` provides tracked
wrappers (`listen`, `setInterval`, `requestAnimationFrame`, `trackObjectUrl`,
`trackMediaElement`, `trackAbortController`, …) so cleanup is automatic.

```mermaid
flowchart TD
  new["new AppClass({ windowEl, initData, services })"] --> gwc["getWindowContent()<br/>returns markup — no side effects"]
  gwc --> setEl["setWindowElement(windowEl)"]
  setEl --> mount["mount()<br/>wire behavior via tracked helpers"]

  mount --> running{{"running"}}
  running -->|"listen(target, type, fn)"| d1["disposable"]
  running -->|"setInterval / setTimeout"| d2["disposable"]
  running -->|"requestAnimationFrame"| d3["disposable"]
  running -->|"trackObjectUrl / trackMediaElement / trackAbortController"| d4["disposable"]

  d1 & d2 & d3 & d4 --> pool[("this.disposables")]
  close["window closed"] --> dispose["dispose()"]
  pool --> dispose
  dispose --> released["all listeners, timers, frames,<br/>URLs, media & controllers released"]
```

---

## 5. Runtime services

The kernel and window manager inject a shared `services` bag into every app
(via the `AppRegistry` → `AppHost` construction path). Apps should use these
injected dependencies instead of importing host singletons.

| Service | Purpose |
| --- | --- |
| `windowManager` | Open, close, focus, and restore windows |
| `kernel` | The simulated process scheduler (`processes`, ticks) |
| `publish` / `subscribe` | Event bus for cross-window messaging (`fs:change`, `network:config-update`, …) |
| `filesystem` / `fileSystemActions` | Virtual FS reads, writes, import/export, native mount |
| `controlPanelContext` | Shared control-panel state merged in at construction |

The `SimulatedKernel` runs a tick-based scheduler (200 ms) that advances process
states (`READY` → `RUNNING` → `WAITING`) and calls back on each tick — for
example, to refresh the Task List and Process Monitor process views.

---

## 6. Directory map

```
src/
  oriel.js                 Entry point; builds OrielApp with injected deps
  core/
    OrielApp.js            Orchestrator: boot, controllers, services
    AppRegistry.js         Resolves manifest + bindings → app classes
    AppHost.js             Instantiates and drives app lifecycles
    DesktopController.js   Desktop, icons, context menu
    systemServices.js      Shared services bag
  windowManager.js         Windows, focus, z-order; owns AppHost + AppRegistry
  window/                  Drag/resize, layout, persistence, DOM helpers
  kernel.js                Simulated process scheduler
  filesystem.js            Virtual filesystem (+ native mount)
  state.js                 Desktop state load/save
  audio.js  wallpaper.js  networking.js  installer.js  eventBus.js
  apps/
    base/BaseApp.js        App lifecycle contract
    manifest.js            App metadata + appClass names
    runtimeBindings.js     appClass name → class table
    programCategories.js   Program Manager grouping
    <app>.js               ~70 self-contained apps
  icons.js                 SVG icons keyed by app type
  oriel.css                All styles
```

See the repository [`README.md`](../README.md) for the application catalog and
developer commands.
