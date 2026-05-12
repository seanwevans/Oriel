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
import { getMessengerContent, initMessenger } from "./messenger.js";
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
import { getWhiteboardRoot, initWhiteboard } from "./whiteboard.js";
import { getImageViewerContent, initImageViewer } from "./imageViewer.js";
import { getReversiContent, initReversi } from "./reversi.js";
import { getSolitaireContent, initSolitaire } from "./solitaire.js";
import { getSudokuContent, initSudoku } from "./sudoku.js";
import { getCharMapContent, initCharMap } from "./charmap.js";
import { getBeatMakerContent, initBeatMaker } from "./beatMaker.js";
import { getMidiSequencerContent, initMidiSequencer } from "./midiSequencer.js";
import { getDatabaseContent, initDatabase } from "./database.js";
import { getMediaPlayerContent, initMediaPlayer } from "./mediaPlayer.js";
import { getTaskManContent, initTaskMan } from "./taskman.js";
import { getResetContent, initReset } from "./reset.js";
import { getHexEditorContent, initHexEditor } from "./hexEditor.js";
import { getSoundRecContent, initSoundRecorder } from "./soundRecorder.js";
import { getDoomContent, initDoom } from "./doom.js";
import { getWinFileContent, initFileManager } from "./fileManager.js";
import { getCompilerContent, getConsoleContent, getPythonContent, initConsole } from "./console.js";
import { getPhotoshopContent, initPhotoshop } from "./photoshop.js";
import { getLineRiderContent, initLineRider } from "./linerider.js";
import { getSimCityContent, initSimCity } from "./simcity.js";
import { getNetNewsContent, initNetNews } from "./netnews.js";
import { getSkiFreeContent, initSkiFree } from "./skifree.js";
import { getPinballContent, initPinball } from "./pinball.js";
import { getAngryBirdsContent, initAngryBirds } from "./angrybirds.js";
import { getCannonDuelContent, initCannonDuel } from "./cannonDuel.js";
import { getMafiaContent, initMafia } from "./mafia.js";
import { getPacketLabContent, initPacketLab } from "./packetLab.js";
import { getApiClientContent, initApiClient } from "./apiClient.js";
import { getTi83Root, initTi83 } from "./ti83.js";
import { getTrackerContent, initTracker } from "./tracker.js";
import { getControlPanelContent, initControlPanel } from "./controlPanel.js";
import { getChessContent, initChess } from "./chess.js";
import { getPapersContent, initPapersPlease } from "./papersPlease.js";
import { getShaderLabRoot, initShaderLab } from "./shaderLab.js";
import { getCodePenContent, initCodePen } from "./codepen.js";
import { getCalcContent, initCalc } from "./calc.js";
import { getReadmeContent } from "./readme.js";
import { getClipboardContent } from "./clipboard.js";
import { getRssReaderContent, initRssReader } from "./rss.js";
import { getProgramManagerContent } from "./programManager.js";
import { getBrowserContent, initBrowser } from "./browser.js";
import { getRadioGardenContent, initRadioGarden } from "./radioGarden.js";
import { getRadioContent, initRadio } from "./radio.js";

const RUNTIME_BINDING_FIELDS = [
  { field: "initializer", group: "initializers", target: "initializer" },
  { field: "contentProvider", group: "contentProviders", target: "contentProvider" },
  { field: "appClass", group: "appClasses", target: "appClass" },
  { field: "initializerKey", group: "initializerKeys", target: "initializer" },
  { field: "contentProviderKey", group: "contentProviderKeys", target: "contentProvider" }
];

export const runtimeBindings = {
  initializers: {
    initAngryBirds,
    initApiClient,
    initBbs,
    initBeatMaker,
    initCalc,
    initCannonDuel,
    initCardfile,
    initCeleryMan,
    initCharMap,
    initChess,
    initClock,
    initCodePen,
    initConsole,
    initControlPanel,
    initDatabase,
    initDiscord,
    initDoom,
    initEmail,
    initFileManager,
    initHexEditor,
    initIRC,
    initImageViewer,
    initKakuro,
    initLineRider,
    initMafia,
    initMarkdownViewer,
    initMediaPlayer,
    initMessenger,
    initMinecraft,
    initMidiSequencer,
    initMinesweeper,
    initN64,
    initNetNews,
    initPacketLab,
    initPaint,
    initPapersPlease,
    initPdfReader,
    initPhotoshop,
    initPinball,
    initPixelStudio,
    initPostgres,
    initReset,
    initRetroAI,
    initReversi,
    initSandspiel,
    initSandspiel3d,
    initShaderLab,
    initSimCity,
    initSkiFree,
    initSolitaire,
    initSoundRecorder,
    initSpotify,
    initSudoku,
    initTaskMan,
    initTi83,
    initTracker,
    initVm,
    initWhiteboard,
    initWrite
  },
  contentProviders: {
    getAngryBirdsContent,
    getApiClientContent,
    getBbsContent,
    getBeatMakerContent,
    getCalcContent,
    getCannonDuelContent,
    getCardfileContent,
    getCeleryManContent,
    getCharMapContent,
    getChessContent,
    getClipboardContent,
    getClockContent,
    getCompilerContent,
    getConsoleContent,
    getControlPanelContent,
    getDatabaseContent,
    getDiscordContent,
    getDoomContent,
    getEmailContent,
    getHexEditorContent,
    getIRCContent,
    getImageViewerContent,
    getKakuroContent,
    getLineRiderContent,
    getMafiaContent,
    getMarkdownContent,
    getMediaPlayerContent,
    getMessengerContent,
    getMinecraftRoot,
    getMidiSequencerContent,
    getMinesContent,
    getN64Root,
    getNetNewsContent,
    getPacketLabContent,
    getPaintRoot,
    getPapersContent,
    getPdfReaderContent,
    getPhotoshopContent,
    getPinballContent,
    getPixelStudioContent,
    getPostgresContent,
    getPythonContent,
    getReadmeContent,
    getResetContent,
    getRetroAIContent,
    getReversiContent,
    getRssReaderContent,
    getSandspiel3DRoot,
    getSandspielRoot,
    getShaderLabRoot,
    getSimCityContent,
    getSkiFreeContent,
    getSolitaireContent,
    getSoundRecContent,
    getSpotifyContent,
    getSudokuContent,
    getTaskManContent,
    getTi83Root,
    getTrackerContent,
    getVmContent,
    getWhiteboardRoot,
    getWinFileContent,
    getWriteContent
  },
  appClasses: {
    NotepadApp
  },
  initializerKeys: {
    browser: initBrowser,
    radio: initRadio,
    radiogarden: initRadioGarden,
    rss: initRssReader
  },
  contentProviderKeys: {
    browser: getBrowserContent,
    codepen: (initData) => (initData?.mode === "viewer" ? "" : getCodePenContent(initData)),
    programManager: (_initData, services) => getProgramManagerContent(services.windowManager),
    radio: getRadioContent,
    radiogarden: getRadioGardenContent
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
