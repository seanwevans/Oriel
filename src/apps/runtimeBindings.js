import { MinecraftApp } from "./minecraft.js";
import { N64App } from "./n64.js";
import { NotepadApp } from "./notepad.js";
import { CardfileApp } from "./cardfile.js";
import { ClockApp } from "./clock.js";
import { DiscordApp } from "./discord.js";
import { SpotifyApp } from "./spotify.js";
import { IrcApp } from "./irc.js";
import { BbsApp } from "./bbsDialer.js";
import { EmailApp } from "./email.js";
import { MessengerApp } from "./messenger.js";
import { RetroAIApp } from "./retroAI.js";
import { KakuroApp } from "./kakuro.js";
import { MarkdownViewerApp } from "./markdown.js";
import { MinesweeperApp } from "./minesweeper.js";
import { CeleryManApp } from "./celeryman.js";
import { PdfReaderApp } from "./pdfReader.js";
import { PaintApp } from "./paint.js";
import { PixelStudioApp } from "./pixelStudio.js";
import { PostgresApp } from "./postgres.js";
import { VmApp } from "./vm.js";
import { WriteApp } from "./write.js";
import { SandspielApp } from "./sandspiel.js";
import { Sandspiel3dApp } from "./sandspiel3d.js";
import { WhiteboardApp } from "./whiteboard.js";
import { ImageViewerApp } from "./imageViewer.js";
import { ReversiApp } from "./reversi.js";
import { SolitaireApp } from "./solitaire.js";
import { SudokuApp } from "./sudoku.js";
import { CharMapApp } from "./charmap.js";
import { BeatMakerApp } from "./beatMaker.js";
import { MidiSequencerApp } from "./midiSequencer.js";
import { DatabaseApp } from "./database.js";
import { MediaPlayerApp } from "./mediaPlayer.js";
import { TaskManApp } from "./taskman.js";
import { ResetApp } from "./reset.js";
import { HexEditorApp } from "./hexEditor.js";
import { SoundRecorderApp } from "./soundRecorder.js";
import { DoomApp } from "./doom.js";
import { FileManagerApp } from "./fileManager.js";
import { CompilerApp, ConsoleApp, PythonApp } from "./console.js";
import { PhotoshopApp } from "./photoshop.js";
import { LineRiderApp } from "./linerider.js";
import { SimCityApp } from "./simcity.js";
import { NetNewsApp } from "./netnews.js";
import { SkiFreeApp } from "./skifree.js";
import { PinballApp } from "./pinball.js";
import { AngryBirdsApp } from "./angrybirds.js";
import { CannonDuelApp } from "./cannonDuel.js";
import { MafiaApp } from "./mafia.js";
import { PacketLabApp } from "./packetLab.js";
import { ApiClientApp } from "./apiClient.js";
import { Ti83App } from "./ti83.js";
import { TrackerApp } from "./tracker.js";
import { ControlPanelApp } from "./controlPanel.js";
import { ChessApp } from "./chess.js";
import { PapersPleaseApp } from "./papersPlease.js";
import { ShaderLabApp } from "./shaderLab.js";
import { CodePenApp } from "./codepen.js";
import { CalcApp } from "./calc.js";
import { ReadmeApp } from "./readme.js";
import { ClipboardApp } from "./clipboard.js";
import { RssApp } from "./rss.js";
import { SheetsApp } from "./sheets.js";
import { ProgramManagerApp } from "./programManager.js";
import { BrowserApp } from "./browser.js";
import { RadioGardenApp } from "./radioGarden.js";
import { RadioApp } from "./radio.js";

const RUNTIME_BINDING_FIELDS = [
  { field: "appClass", group: "appClasses", target: "appClass" }
];

export const runtimeBindings = {
  appClasses: {
    AngryBirdsApp,
    ApiClientApp,
    BbsApp,
    BeatMakerApp,
    BrowserApp,
    CalcApp,
    CannonDuelApp,
    CardfileApp,
    CeleryManApp,
    CharMapApp,
    ChessApp,
    ClipboardApp,
    ClockApp,
    CodePenApp,
    CompilerApp,
    ConsoleApp,
    ControlPanelApp,
    DatabaseApp,
    DiscordApp,
    DoomApp,
    EmailApp,
    FileManagerApp,
    HexEditorApp,
    ImageViewerApp,
    IrcApp,
    KakuroApp,
    LineRiderApp,
    MafiaApp,
    MarkdownViewerApp,
    MediaPlayerApp,
    MessengerApp,
    MinecraftApp,
    MidiSequencerApp,
    MinesweeperApp,
    N64App,
    NetNewsApp,
    NotepadApp,
    PacketLabApp,
    PaintApp,
    PapersPleaseApp,
    PdfReaderApp,
    PhotoshopApp,
    PinballApp,
    PixelStudioApp,
    PostgresApp,
    ProgramManagerApp,
    PythonApp,
    RadioApp,
    RadioGardenApp,
    ReadmeApp,
    ResetApp,
    RetroAIApp,
    ReversiApp,
    RssApp,
    Sandspiel3dApp,
    SandspielApp,
    ShaderLabApp,
    SheetsApp,
    SimCityApp,
    SkiFreeApp,
    SolitaireApp,
    SoundRecorderApp,
    SpotifyApp,
    SudokuApp,
    TaskManApp,
    Ti83App,
    TrackerApp,
    VmApp,
    WhiteboardApp,
    WriteApp
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
            [target]: bindings[group][key]
          };
        },
        { ...definition }
      )
    ])
  );
}
