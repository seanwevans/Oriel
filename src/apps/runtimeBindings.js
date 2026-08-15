// Each app is bound to a loader rather than an eagerly imported class, so the
// entry chunk contains the desktop shell instead of all ~80 applications. The
// module for an app is fetched the first time that app is opened, then cached
// by the registry and by the module system itself.
//
// Bindings may also be a class directly. That form resolves synchronously and
// is what test harnesses use; `lazyApp` marks the deferred form explicitly so
// the two never have to be told apart by inspection.
export function lazyApp(loader) {
  return { __lazyAppLoader: loader };
}

export function isLazyApp(binding) {
  return typeof binding?.__lazyAppLoader === "function";
}

const RUNTIME_BINDING_FIELDS = [
  { field: "appClass", group: "appClasses", target: "appClass" }
];

export const runtimeBindings = {
  appClasses: {
    AngryBirdsApp: lazyApp(() => import("./angrybirds.js").then((m) => m.AngryBirdsApp)),
    ApiClientApp: lazyApp(() => import("./apiClient.js").then((m) => m.ApiClientApp)),
    BbsApp: lazyApp(() => import("./bbsDialer.js").then((m) => m.BbsApp)),
    BeatMakerApp: lazyApp(() => import("./beatMaker.js").then((m) => m.BeatMakerApp)),
    BrowserApp: lazyApp(() => import("./browser.js").then((m) => m.BrowserApp)),
    CalcApp: lazyApp(() => import("./calc.js").then((m) => m.CalcApp)),
    CannonDuelApp: lazyApp(() => import("./cannonDuel.js").then((m) => m.CannonDuelApp)),
    CardfileApp: lazyApp(() => import("./cardfile.js").then((m) => m.CardfileApp)),
    CeleryManApp: lazyApp(() => import("./celeryman.js").then((m) => m.CeleryManApp)),
    CharMapApp: lazyApp(() => import("./charmap.js").then((m) => m.CharMapApp)),
    ChessApp: lazyApp(() => import("./chess.js").then((m) => m.ChessApp)),
    ClipboardApp: lazyApp(() => import("./clipboard.js").then((m) => m.ClipboardApp)),
    ClockApp: lazyApp(() => import("./clock.js").then((m) => m.ClockApp)),
    CodePenApp: lazyApp(() => import("./codepen.js").then((m) => m.CodePenApp)),
    ColorPickerApp: lazyApp(() => import("./colorPicker.js").then((m) => m.ColorPickerApp)),
    CompilerApp: lazyApp(() => import("./console.js").then((m) => m.CompilerApp)),
    ConsoleApp: lazyApp(() => import("./console.js").then((m) => m.ConsoleApp)),
    ControlPanelApp: lazyApp(() => import("./controlPanel.js").then((m) => m.ControlPanelApp)),
    DatabaseApp: lazyApp(() => import("./database.js").then((m) => m.DatabaseApp)),
    DiscordApp: lazyApp(() => import("./discord.js").then((m) => m.DiscordApp)),
    DoomApp: lazyApp(() => import("./doom.js").then((m) => m.DoomApp)),
    EmailApp: lazyApp(() => import("./email.js").then((m) => m.EmailApp)),
    FileManagerApp: lazyApp(() => import("./fileManager.js").then((m) => m.FileManagerApp)),
    Game2048App: lazyApp(() => import("./game2048.js").then((m) => m.Game2048App)),
    GameOfLifeApp: lazyApp(() => import("./gameOfLife.js").then((m) => m.GameOfLifeApp)),
    HexEditorApp: lazyApp(() => import("./hexEditor.js").then((m) => m.HexEditorApp)),
    ImageViewerApp: lazyApp(() => import("./imageViewer.js").then((m) => m.ImageViewerApp)),
    IrcApp: lazyApp(() => import("./irc.js").then((m) => m.IrcApp)),
    JsonFormatterApp: lazyApp(() => import("./jsonFormatter.js").then((m) => m.JsonFormatterApp)),
    KakuroApp: lazyApp(() => import("./kakuro.js").then((m) => m.KakuroApp)),
    LineRiderApp: lazyApp(() => import("./linerider.js").then((m) => m.LineRiderApp)),
    MafiaApp: lazyApp(() => import("./mafia.js").then((m) => m.MafiaApp)),
    MarkdownViewerApp: lazyApp(() => import("./markdown.js").then((m) => m.MarkdownViewerApp)),
    MediaPlayerApp: lazyApp(() => import("./mediaPlayer.js").then((m) => m.MediaPlayerApp)),
    MessengerApp: lazyApp(() => import("./messenger.js").then((m) => m.MessengerApp)),
    MinecraftApp: lazyApp(() => import("./minecraft.js").then((m) => m.MinecraftApp)),
    MidiSequencerApp: lazyApp(() => import("./midiSequencer.js").then((m) => m.MidiSequencerApp)),
    MinesweeperApp: lazyApp(() => import("./minesweeper.js").then((m) => m.MinesweeperApp)),
    N64App: lazyApp(() => import("./n64.js").then((m) => m.N64App)),
    NetNewsApp: lazyApp(() => import("./netnews.js").then((m) => m.NetNewsApp)),
    NotepadApp: lazyApp(() => import("./notepad.js").then((m) => m.NotepadApp)),
    PacketLabApp: lazyApp(() => import("./packetLab.js").then((m) => m.PacketLabApp)),
    PaintApp: lazyApp(() => import("./paint.js").then((m) => m.PaintApp)),
    PapersPleaseApp: lazyApp(() => import("./papersPlease.js").then((m) => m.PapersPleaseApp)),
    PdfReaderApp: lazyApp(() => import("./pdfReader.js").then((m) => m.PdfReaderApp)),
    PhotoshopApp: lazyApp(() => import("./photoshop.js").then((m) => m.PhotoshopApp)),
    PinballApp: lazyApp(() => import("./pinball.js").then((m) => m.PinballApp)),
    PixelStudioApp: lazyApp(() => import("./pixelStudio.js").then((m) => m.PixelStudioApp)),
    PostgresApp: lazyApp(() => import("./postgres.js").then((m) => m.PostgresApp)),
    ProcessMonitorApp: lazyApp(() => import("./processMonitor.js").then((m) => m.ProcessMonitorApp)),
    ProgramManagerApp: lazyApp(() => import("./programManager.js").then((m) => m.ProgramManagerApp)),
    PythonApp: lazyApp(() => import("./console.js").then((m) => m.PythonApp)),
    RadioApp: lazyApp(() => import("./radio.js").then((m) => m.RadioApp)),
    RadioGardenApp: lazyApp(() => import("./radioGarden.js").then((m) => m.RadioGardenApp)),
    ReadmeApp: lazyApp(() => import("./readme.js").then((m) => m.ReadmeApp)),
    RegexTesterApp: lazyApp(() => import("./regexTester.js").then((m) => m.RegexTesterApp)),
    ResetApp: lazyApp(() => import("./reset.js").then((m) => m.ResetApp)),
    RetroAIApp: lazyApp(() => import("./retroAI.js").then((m) => m.RetroAIApp)),
    ReversiApp: lazyApp(() => import("./reversi.js").then((m) => m.ReversiApp)),
    RssApp: lazyApp(() => import("./rss.js").then((m) => m.RssApp)),
    Sandspiel3dApp: lazyApp(() => import("./sandspiel3d.js").then((m) => m.Sandspiel3dApp)),
    SandspielApp: lazyApp(() => import("./sandspiel.js").then((m) => m.SandspielApp)),
    ShaderLabApp: lazyApp(() => import("./shaderLab.js").then((m) => m.ShaderLabApp)),
    SheetsApp: lazyApp(() => import("./sheets.js").then((m) => m.SheetsApp)),
    SimCityApp: lazyApp(() => import("./simcity.js").then((m) => m.SimCityApp)),
    SkiFreeApp: lazyApp(() => import("./skifree.js").then((m) => m.SkiFreeApp)),
    SnakeApp: lazyApp(() => import("./snake.js").then((m) => m.SnakeApp)),
    SolitaireApp: lazyApp(() => import("./solitaire.js").then((m) => m.SolitaireApp)),
    SoundRecorderApp: lazyApp(() => import("./soundRecorder.js").then((m) => m.SoundRecorderApp)),
    SpotifyApp: lazyApp(() => import("./spotify.js").then((m) => m.SpotifyApp)),
    SudokuApp: lazyApp(() => import("./sudoku.js").then((m) => m.SudokuApp)),
    TaskManApp: lazyApp(() => import("./taskman.js").then((m) => m.TaskManApp)),
    TetrisApp: lazyApp(() => import("./tetris.js").then((m) => m.TetrisApp)),
    Ti83App: lazyApp(() => import("./ti83.js").then((m) => m.Ti83App)),
    TrackerApp: lazyApp(() => import("./tracker.js").then((m) => m.TrackerApp)),
    VmApp: lazyApp(() => import("./vm.js").then((m) => m.VmApp)),
    WhiteboardApp: lazyApp(() => import("./whiteboard.js").then((m) => m.WhiteboardApp)),
    WriteApp: lazyApp(() => import("./write.js").then((m) => m.WriteApp))
  }
};

export function validateRuntimeBindings(manifest, bindings = runtimeBindings) {
  const missingBindings = [];

  for (const [type, definition] of Object.entries(manifest)) {
    for (const { field, group } of RUNTIME_BINDING_FIELDS) {
      const key = definition[field];
      if (key && !bindings[group]?.[key]) {
        missingBindings.push(`${type}.${field}: ${key}`);
      }
    }
  }

  if (missingBindings.length > 0) {
    throw new Error(`Missing app runtime bindings: ${missingBindings.join(", ")}`);
  }
}

// Resolves one binding into the pair the registry consumes: `appClass` when the
// class is already in memory (so windows can open without awaiting anything),
// and `loadAppClass` as the uniform async accessor that works for both shapes.
function composeBinding(target, binding) {
  const loaderField = `load${target[0].toUpperCase()}${target.slice(1)}`;

  // The manifest holds a binding *name* under `target`; both branches must
  // overwrite that string so callers never mistake it for a resolved class.
  if (isLazyApp(binding)) {
    return { [target]: null, [loaderField]: binding.__lazyAppLoader };
  }

  return { [target]: binding, [loaderField]: () => Promise.resolve(binding) };
}

export function composeRuntimeManifest(manifest, bindings = runtimeBindings) {
  validateRuntimeBindings(manifest, bindings);

  return Object.fromEntries(
    Object.entries(manifest).map(([type, definition]) => [
      type,
      RUNTIME_BINDING_FIELDS.reduce(
        (composedDefinition, { field, group, target }) => {
          const key = definition[field];
          if (!key) return composedDefinition;
          return {
            ...composedDefinition,
            ...composeBinding(target, bindings[group][key])
          };
        },
        { ...definition }
      )
    ])
  );
}
