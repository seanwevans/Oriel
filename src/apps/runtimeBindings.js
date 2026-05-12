import { getMinecraftRoot, initMinecraft } from "./minecraft.js";
import { getN64Root, initN64 } from "./n64.js";
import { NotepadApp } from "./notepad.js";
import { getCardfileContent, initCardfile } from "./cardfile.js";
import { getClockContent, initClock } from "./clock.js";
import { getDiscordContent, initDiscord } from "./discord.js";
import { getSpotifyContent, initSpotify } from "./spotify.js";
import { getIRCContent, initIRC } from "./irc.js";
import { getBbsContent, initBbs } from "./bbsDialer.js";
import { getEmailContent, initEmail } from "./email.js";
import { MessengerApp } from "./messenger.js";
import { getRetroAIContent, initRetroAI } from "./retroAI.js";
import { getKakuroContent, initKakuro } from "./kakuro.js";
import { getMarkdownContent, initMarkdownViewer } from "./markdown.js";
import { getMinesContent, initMinesweeper } from "./minesweeper.js";
import { getCeleryManContent, initCeleryMan } from "./celeryman.js";
import { getPdfReaderContent, initPdfReader } from "./pdfReader.js";
import { getPaintRoot, initPaint } from "./paint.js";
import { getPixelStudioContent, initPixelStudio } from "./pixelStudio.js";
import { getPostgresContent, initPostgres } from "./postgres.js";
import { getVmContent, initVm } from "./vm.js";
import { getWriteContent, initWrite } from "./write.js";
import { getSandspielRoot, initSandspiel } from "./sandspiel.js";
import { getSandspiel3DRoot, initSandspiel3d } from "./sandspiel3d.js";
import { WhiteboardApp } from "./whiteboard.js";
import { getImageViewerContent, initImageViewer } from "./imageViewer.js";
import { getReversiContent, initReversi } from "./reversi.js";
import { getSolitaireContent, initSolitaire } from "./solitaire.js";
import { getSudokuContent, initSudoku } from "./sudoku.js";
import { getCharMapContent, initCharMap } from "./charmap.js";
import { getBeatMakerContent, initBeatMaker } from "./beatMaker.js";
import { MidiSequencerApp } from "./midiSequencer.js";
import { getDatabaseContent, initDatabase } from "./database.js";
import { MediaPlayerApp } from "./mediaPlayer.js";
import { getTaskManContent, initTaskMan } from "./taskman.js";
import { getResetContent, initReset } from "./reset.js";
import { getHexEditorContent, initHexEditor } from "./hexEditor.js";
import { SoundRecorderApp } from "./soundRecorder.js";
import { getDoomContent, initDoom } from "./doom.js";
import { FileManagerApp } from "./fileManager.js";
import { CompilerApp, ConsoleApp, PythonApp } from "./console.js";
import { getPhotoshopContent, initPhotoshop } from "./photoshop.js";
import { getLineRiderContent, initLineRider } from "./linerider.js";
import { getSimCityContent, initSimCity } from "./simcity.js";
import { NetNewsApp } from "./netnews.js";
import { getSkiFreeContent, initSkiFree } from "./skifree.js";
import { getPinballContent, initPinball } from "./pinball.js";
import { getAngryBirdsContent, initAngryBirds } from "./angrybirds.js";
import { getCannonDuelContent, initCannonDuel } from "./cannonDuel.js";
import { getMafiaContent, initMafia } from "./mafia.js";
import { getPacketLabContent, initPacketLab } from "./packetLab.js";
import { getApiClientContent, initApiClient } from "./apiClient.js";
import { getTi83Root, initTi83 } from "./ti83.js";
import { TrackerApp } from "./tracker.js";
import { getControlPanelContent, initControlPanel } from "./controlPanel.js";
import { getChessContent, initChess } from "./chess.js";
import { getPapersContent, initPapersPlease } from "./papersPlease.js";
import { getShaderLabRoot, initShaderLab } from "./shaderLab.js";
import { getCodePenContent, initCodePen } from "./codepen.js";
import { getCalcContent, initCalc } from "./calc.js";
import { getReadmeContent } from "./readme.js";
import { getClipboardContent } from "./clipboard.js";
import { RssApp } from "./rss.js";
import { getProgramManagerContent } from "./programManager.js";
import { getBrowserContent, initBrowser } from "./browser.js";
import { getRadioGardenContent, initRadioGarden } from "./radioGarden.js";
import { getRadioContent, initRadio } from "./radio.js";
import { BaseApp } from "./base/BaseApp.js";

const RUNTIME_BINDING_FIELDS = [
  { field: "appClass", group: "appClasses", target: "appClass" }
];

function createRuntimeAppClass({ initializer = null, contentProvider = null, initializerContext = null } = {}) {
  return class RuntimeApp extends BaseApp {
    getWindowContent() {
      if (!contentProvider) return "";
      return contentProvider(this.initData, this.services);
    }

    mount() {
      if (!initializer) return null;
      const args = [this.windowEl, this.initData, this.services.windowManager, this.services, this];
      if (initializerContext) {
        return initializer(initializerContext(this.services), ...args);
      }
      return initializer(...args);
    }
  };
}

const ProgramManagerApp = createRuntimeAppClass({
  contentProvider: (_initData, services) => getProgramManagerContent(services.windowManager)
});
const WriteApp = createRuntimeAppClass({ initializer: initWrite, contentProvider: getWriteContent });
const CodePenApp = createRuntimeAppClass({
  initializer: initCodePen,
  contentProvider: (initData) => (initData?.mode === "viewer" ? "" : getCodePenContent(initData))
});
const CardfileApp = createRuntimeAppClass({ initializer: initCardfile, contentProvider: getCardfileContent });
const CalcApp = createRuntimeAppClass({ initializer: initCalc, contentProvider: getCalcContent });
const MinesweeperApp = createRuntimeAppClass({ initializer: initMinesweeper, contentProvider: getMinesContent });
const KakuroApp = createRuntimeAppClass({ initializer: initKakuro, contentProvider: getKakuroContent });
const SolitaireApp = createRuntimeAppClass({ initializer: initSolitaire, contentProvider: getSolitaireContent });
const ChessApp = createRuntimeAppClass({ initializer: initChess, contentProvider: getChessContent });
const ReversiApp = createRuntimeAppClass({ initializer: initReversi, contentProvider: getReversiContent });
const SudokuApp = createRuntimeAppClass({ initializer: initSudoku, contentProvider: getSudokuContent });
const MafiaApp = createRuntimeAppClass({ initializer: initMafia, contentProvider: getMafiaContent });
const PaintApp = createRuntimeAppClass({ initializer: initPaint, contentProvider: getPaintRoot });
const PixelStudioApp = createRuntimeAppClass({ initializer: initPixelStudio, contentProvider: getPixelStudioContent });
const PhotoshopApp = createRuntimeAppClass({ initializer: initPhotoshop, contentProvider: getPhotoshopContent });
const SimCityApp = createRuntimeAppClass({ initializer: initSimCity, contentProvider: getSimCityContent });
const AngryBirdsApp = createRuntimeAppClass({ initializer: initAngryBirds, contentProvider: getAngryBirdsContent });
const SkiFreeApp = createRuntimeAppClass({ initializer: initSkiFree, contentProvider: getSkiFreeContent });
const CannonDuelApp = createRuntimeAppClass({ initializer: initCannonDuel, contentProvider: getCannonDuelContent });
const PinballApp = createRuntimeAppClass({ initializer: initPinball, contentProvider: getPinballContent });
const LineRiderApp = createRuntimeAppClass({ initializer: initLineRider, contentProvider: getLineRiderContent });
const RadioApp = createRuntimeAppClass({ initializer: initRadio, contentProvider: getRadioContent });
const BeatMakerApp = createRuntimeAppClass({ initializer: initBeatMaker, contentProvider: getBeatMakerContent });
const SpotifyApp = createRuntimeAppClass({ initializer: initSpotify, contentProvider: getSpotifyContent });
const CharMapApp = createRuntimeAppClass({ initializer: initCharMap, contentProvider: getCharMapContent });
const ClockApp = createRuntimeAppClass({ initializer: initClock, contentProvider: getClockContent });
const ControlPanelApp = createRuntimeAppClass({
  initializer: initControlPanel,
  contentProvider: getControlPanelContent,
  initializerContext: (services) => services.controlPanelContext || {}
});
const ResetApp = createRuntimeAppClass({ initializer: initReset, contentProvider: getResetContent });
const ImageViewerApp = createRuntimeAppClass({ initializer: initImageViewer, contentProvider: getImageViewerContent });
const PdfReaderApp = createRuntimeAppClass({ initializer: initPdfReader, contentProvider: getPdfReaderContent });
const MarkdownViewerApp = createRuntimeAppClass({ initializer: initMarkdownViewer, contentProvider: getMarkdownContent });
const ClipboardApp = createRuntimeAppClass({ contentProvider: getClipboardContent });
const TaskManApp = createRuntimeAppClass({ initializer: initTaskMan, contentProvider: getTaskManContent });
const DatabaseApp = createRuntimeAppClass({ initializer: initDatabase, contentProvider: getDatabaseContent });
const PostgresApp = createRuntimeAppClass({ initializer: initPostgres, contentProvider: getPostgresContent });
const ApiClientApp = createRuntimeAppClass({ initializer: initApiClient, contentProvider: getApiClientContent });
const PacketLabApp = createRuntimeAppClass({ initializer: initPacketLab, contentProvider: getPacketLabContent });
const RetroAIApp = createRuntimeAppClass({ initializer: initRetroAI, contentProvider: getRetroAIContent });
const HexEditorApp = createRuntimeAppClass({ initializer: initHexEditor, contentProvider: getHexEditorContent });
const BrowserApp = createRuntimeAppClass({ initializer: initBrowser, contentProvider: getBrowserContent });
const CeleryManApp = createRuntimeAppClass({ initializer: initCeleryMan, contentProvider: getCeleryManContent });
const VmApp = createRuntimeAppClass({ initializer: initVm, contentProvider: getVmContent });
const RadioGardenApp = createRuntimeAppClass({ initializer: initRadioGarden, contentProvider: getRadioGardenContent });
const DiscordApp = createRuntimeAppClass({ initializer: initDiscord, contentProvider: getDiscordContent });
const BbsApp = createRuntimeAppClass({ initializer: initBbs, contentProvider: getBbsContent });
const EmailApp = createRuntimeAppClass({ initializer: initEmail, contentProvider: getEmailContent });
const IrcApp = createRuntimeAppClass({ initializer: initIRC, contentProvider: getIRCContent });
const ReadmeApp = createRuntimeAppClass({ contentProvider: getReadmeContent });
const DoomApp = createRuntimeAppClass({ initializer: initDoom, contentProvider: getDoomContent });
const Ti83App = createRuntimeAppClass({ initializer: initTi83, contentProvider: getTi83Root });
const N64App = createRuntimeAppClass({ initializer: initN64, contentProvider: getN64Root });
const MinecraftApp = createRuntimeAppClass({ initializer: initMinecraft, contentProvider: getMinecraftRoot });
const SandspielApp = createRuntimeAppClass({ initializer: initSandspiel, contentProvider: getSandspielRoot });
const Sandspiel3dApp = createRuntimeAppClass({ initializer: initSandspiel3d, contentProvider: getSandspiel3DRoot });
const ShaderLabApp = createRuntimeAppClass({ initializer: initShaderLab, contentProvider: getShaderLabRoot });
const PapersPleaseApp = createRuntimeAppClass({ initializer: initPapersPlease, contentProvider: getPapersContent });

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
