# Contributing to Oriel

Thanks for wanting to work on Oriel. This is a vanilla ES module project built
with Vite — no framework, no transpiler, no CSS preprocessor. Keep it that way
unless there is a reason not to.

## Getting set up

```bash
npm install
npm run dev
```

Before opening a pull request, run the full local verification sequence:

```bash
npm run check   # lint, then tests, then a production build
```

CI runs the same three steps, so a green `check` means a green pipeline.

## Adding an app

Each app is a `BaseApp` subclass in `src/apps/<name>.js`, registered in four
places:

| File | What it declares |
| --- | --- |
| `apps/manifest.js` | Metadata — title, default window size, `appClass` name |
| `apps/runtimeBindings.js` | The `appClass` name → the module that exports it |
| `apps/programCategories.js` | Which Program Manager group it belongs to |
| `icons.js` | Its desktop and taskbar icon |

`AppRegistry.test.js` and `programCategories.test.js` fail if an app is missing
from any of them, so the tests will tell you what you forgot.

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for how registration, the
window manager, and the app host fit together.

## The lifecycle contract

Apps expose three hooks, and `src/apps/lifecycleContract.test.js` enforces the
rules against every registered app:

- **`getWindowContent()`** returns markup and nothing else. No listeners on
  `window` or `document`, no timers, no animation frames, no `fetch`, no audio
  contexts. Listeners on elements the method itself creates are fine — those are
  released with the window's DOM.
- **`mount()`** wires runtime behavior, once the window element exists.
- **`dispose()`** releases everything, and must be safe to call on an app that
  was never mounted — a window can be closed while its app is still loading.

Use the `BaseApp` helpers instead of the raw APIs so cleanup is automatic:
`listen()`, `setTimeout()`, `setInterval()`, `requestAnimationFrame()`,
`trackObjectUrl()`, `trackMediaElement()`, `trackMediaStream()`,
`trackAudioContext()`, `trackAbortController()`, `createBroadcastChannel()`.

## Style

- ES modules, double-quoted strings, two-space indent (see `.editorconfig`).
- Prefer the injected `services` bag over importing host singletons.
- Escape anything interpolated into markup with `escapeHtml()` from
  `utils/html.js`. Prefer `textContent` and DOM properties over building HTML
  from user-controlled strings at all.
- Match the conventions of the file you are editing.

## Tests

Tests are plain `node:test` files sitting next to the code they cover, named
`<module>.test.js`. There is no DOM environment — tests either exercise pure
logic or build a small fake DOM, as `windowManager.test.js` does.

```bash
npm test                  # everything
node --test src/state.test.js   # one file
npm run test:coverage     # coverage report
```

Add a test with any behavior change a reader could plausibly break later. A
regression test that cannot fail is not worth having — check that yours fails
before your fix and passes after.

## Security

Please report vulnerabilities privately rather than in a public issue. See
[`SECURITY.md`](SECURITY.md) for the process and what to include.
