import { getMinecraftRoot, initMinecraft } from "../apps/minecraft.js";
import { getN64Root, initN64 } from "../apps/n64.js";
import { getNotepadContent, initNotepad, NotepadApp } from "../apps/notepad.js";
import { getCardfileContent, initCardfile } from "../apps/cardfile.js";
import { getClockContent, initClock } from "../apps/clock.js";
import { initDiscord } from "../apps/discord.js";
import { initSpotify } from "../apps/spotify.js";
import { initIRC } from "../apps/irc.js";
import { initBbs } from "../apps/bbsDialer.js";
import { initEmail } from "../apps/email.js";
import { initMessenger } from "../apps/messenger.js";
import { getRetroAIContent, initRetroAI } from "../apps/retroAI.js";
import { getKakuroContent, initKakuro } from "../apps/kakuro.js";
import { getMarkdownContent, initMarkdownViewer } from "../apps/markdown.js";
import { getMinesContent, initMinesweeper } from "../apps/minesweeper.js";
import { initCeleryMan } from "../apps/celeryman.js";
import { getPdfReaderContent, initPdfReader } from "../apps/pdfReader.js";
import { getPaintRoot, initPaint } from "../apps/paint.js";
import { getPixelStudioContent, initPixelStudio } from "../apps/pixelStudio.js";
import { getPostgresContent, initPostgres } from "../apps/postgres.js";
import { getVmContent, initVm } from "../apps/vm.js";
import { getWriteContent, initWrite } from "../apps/write.js";
import { getArtistContent, initArtist } from "../apps/artist.js";
import { getSandspielRoot, initSandspiel } from "../apps/sandspiel.js";
import { getSandspiel3DRoot, initSandspiel3d } from "../apps/sandspiel3d.js";
import { getWhiteboardRoot, initWhiteboard } from "../apps/whiteboard.js";
import { getImageViewerContent, initImageViewer } from "../apps/imageViewer.js";
import { getReversiContent, initReversi } from "../apps/reversi.js";
import { getSolitaireContent, initSolitaire } from "../apps/solitaire.js";
import { getSudokuContent, initSudoku } from "../apps/sudoku.js";
import { getCharMapContent, initCharMap } from "../apps/charmap.js";
import { getBeatMakerContent, initBeatMaker } from "../apps/beatMaker.js";
import { getMidiSequencerContent, initMidiSequencer } from "../apps/midiSequencer.js";
import { getDatabaseContent, initDatabase } from "../apps/database.js";
import { getMediaPlayerContent, initMediaPlayer } from "../apps/mediaPlayer.js";
import { getTaskManContent, initTaskMan } from "../apps/taskman.js";
import { getResetContent, initReset } from "../apps/reset.js";
import { getBrowserContent, getRadioContent, getRadioGardenContent, initRadio, initRadioGarden, initRssReader, initBrowser } from "../networking.js";
import { getHexEditorContent, initHexEditor } from "../apps/hexEditor.js";
import { getSoundRecContent, initSoundRecorder } from "../apps/soundRecorder.js";
import { getDoomContent, initDoom } from "../apps/doom.js";
import { getWinFileContent, initFileManager } from "../apps/fileManager.js";
import { getCompilerContent, getConsoleContent, getPythonContent, initConsole } from "../apps/console.js";
import { getPhotoshopContent, initPhotoshop } from "../apps/photoshop.js";
import { getLineRiderContent, initLineRider } from "../apps/linerider.js";
import { getSimCityContent, initSimCity } from "../apps/simcity.js";
import { getNetNewsContent, initNetNews } from "../apps/netnews.js";
import { getSkiFreeContent, initSkiFree } from "../apps/skifree.js";
import { getPinballContent, initPinball } from "../apps/pinball.js";
import { getAngryBirdsContent, initAngryBirds } from "../apps/angrybirds.js";
import { getCannonDuelContent, initCannonDuel } from "../apps/cannonDuel.js";
import { getMafiaContent, initMafia } from "../apps/mafia.js";
import { getPacketLabContent, initPacketLab } from "../apps/packetLab.js";
import { getApiClientContent, initApiClient } from "../apps/apiClient.js";
import { getTi83Root, initTi83 } from "../apps/ti83.js";
import { getTrackerContent, initTracker } from "../apps/tracker.js";
import { getControlPanelContent, initControlPanel } from "../apps/controlPanel.js";
import { getRuntimeInitializer } from "../installer.js";
import { getChessContent, initChess } from "../apps/chess.js";
import { getPapersContent, initPapersPlease } from "../apps/papersPlease.js";
import { getShaderLabRoot, initShaderLab } from "../apps/shaderLab.js";
import { getCodePenContent, initCodePen } from "../apps/codepen.js";
import { getCalcContent } from "../apps/calc.js";
import { getReadmeContent } from "../apps/readme.js";
import { getClipboardContent } from "../apps/clipboard.js";
import { getRssReaderContent } from "../apps/rss.js";
import { getCeleryManContent } from "../apps/celeryman.js";
import { getDiscordContent } from "../apps/discord.js";
import { getBbsContent } from "../apps/bbsDialer.js";
import { getSpotifyContent } from "../apps/spotify.js";
import { getMessengerContent } from "../apps/messenger.js";
import { getIRCContent } from "../apps/irc.js";
import { getEmailContent } from "../apps/email.js";
import { getProgramManagerContent } from "../apps/programManager.js";
import { LegacyFunctionApp } from "../apps/base/BaseApp.js";

export class AppRegistry {
  constructor({ controlPanelContext = {}, runtimeInitializerResolver = getRuntimeInitializer } = {}) {
    this.controlPanelContext = controlPanelContext;
    this.runtimeInitializerResolver = runtimeInitializerResolver;
    this.initializers = this.createInitializers();
    this.contentProviders = this.createContentProviders();
  }

  createInitializers() {
    return {
      mines: initMinesweeper,
      kakuro: initKakuro,
      solitaire: initSolitaire,
      reversi: initReversi,
      sudoku: initSudoku,
      mafia: initMafia,
      paint: initPaint,
      pixelstudio: initPixelStudio,
      notepad: initNotepad,
      photoshop: initPhotoshop,
      artist: initArtist,
      mplayer: initMediaPlayer,
      simcity: initSimCity,
      skifree: initSkiFree,
      angrybirds: initAngryBirds,
      cannonduel: initCannonDuel,
      pinball: initPinball,
      linerider: initLineRider,
      database: initDatabase,
      soundrec: initSoundRecorder,
      radio: initRadio,
      beatmaker: initBeatMaker,
      tracker: initTracker,
      midisequencer: initMidiSequencer,
      charmap: initCharMap,
      celeryman: initCeleryMan,
      postgres: initPostgres,
      winfile: initFileManager,
      clock: initClock,
      control: (w, initData, wmInstance) =>
        initControlPanel(this.controlPanelContext, w, initData, wmInstance),
      reset: initReset,
      chess: initChess,
      console: initConsole,
      packetlab: initPacketLab,
      retroai: initRetroAI,
      apiclient: initApiClient,
      write: initWrite,
      cardfile: initCardfile,
      taskman: initTaskMan,
      pdfreader: initPdfReader,
      imageviewer: initImageViewer,
      markdown: initMarkdownViewer,
      rss: initRssReader,
      netnews: initNetNews,
      browser: initBrowser,
      codepen: initCodePen,
      radiogarden: initRadioGarden,
      discord: initDiscord,
      bbs: initBbs,
      messenger: initMessenger,
      irc: initIRC,
      email: initEmail,
      spotify: initSpotify,
      doom: initDoom,
      minecraft: initMinecraft,
      n64: initN64,
      ti83: initTi83,
      shaderlab: initShaderLab,
      sandspiel: initSandspiel,
      sandspiel3d: initSandspiel3d,
      papers: initPapersPlease,
      whiteboard: initWhiteboard,
      vm: initVm,
      hexedit: initHexEditor
    };
  }


  createContentProviders() {
    return {
      progman: (_initData, services) => getProgramManagerContent(services.windowManager),
      mines: getMinesContent,
      kakuro: getKakuroContent,
      solitaire: getSolitaireContent,
      reversi: getReversiContent,
      sudoku: getSudokuContent,
      mafia: getMafiaContent,
      paint: getPaintRoot,
      pixelstudio: getPixelStudioContent,
      notepad: getNotepadContent,
      calc: getCalcContent,
      photoshop: getPhotoshopContent,
      artist: getArtistContent,
      mplayer: getMediaPlayerContent,
      simcity: getSimCityContent,
      skifree: getSkiFreeContent,
      angrybirds: getAngryBirdsContent,
      cannonduel: getCannonDuelContent,
      pinball: getPinballContent,
      linerider: getLineRiderContent,
      database: getDatabaseContent,
      soundrec: getSoundRecContent,
      radio: getRadioContent,
      beatmaker: getBeatMakerContent,
      tracker: getTrackerContent,
      midisequencer: getMidiSequencerContent,
      charmap: getCharMapContent,
      celeryman: getCeleryManContent,
      postgres: getPostgresContent,
      winfile: getWinFileContent,
      clock: getClockContent,
      control: getControlPanelContent,
      reset: getResetContent,
      chess: getChessContent,
      console: getConsoleContent,
      compiler: getCompilerContent,
      python: getPythonContent,
      packetlab: getPacketLabContent,
      retroai: getRetroAIContent,
      apiclient: getApiClientContent,
      write: getWriteContent,
      cardfile: getCardfileContent,
      taskman: getTaskManContent,
      pdfreader: getPdfReaderContent,
      imageviewer: getImageViewerContent,
      markdown: getMarkdownContent,
      rss: getRssReaderContent,
      netnews: getNetNewsContent,
      browser: getBrowserContent,
      codepen: (initData) => initData?.mode === "viewer" ? "" : getCodePenContent(initData),
      radiogarden: getRadioGardenContent,
      discord: getDiscordContent,
      bbs: getBbsContent,
      messenger: getMessengerContent,
      irc: getIRCContent,
      email: getEmailContent,
      spotify: getSpotifyContent,
      doom: getDoomContent,
      minecraft: getMinecraftRoot,
      n64: getN64Root,
      ti83: getTi83Root,
      shaderlab: getShaderLabRoot,
      sandspiel: getSandspielRoot,
      sandspiel3d: getSandspiel3DRoot,
      papers: getPapersContent,
      whiteboard: getWhiteboardRoot,
      vm: getVmContent,
      hexedit: getHexEditorContent,
      clipbrd: getClipboardContent,
      readme: getReadmeContent
    };
  }

  createApp(type, { windowEl = null, initData = null, services = {} } = {}) {
    if (type === "notepad") return new NotepadApp({ windowEl, initData, services });
    const initializer = this.resolve(type);
    const contentProvider = this.contentProviders[type] || null;
    if (!initializer && !contentProvider) return null;
    return new LegacyFunctionApp({ windowEl, initData, services, initializer, contentProvider });
  }

  resolve(type) {
    return this.initializers[type] || this.getRuntimeInitializer(type);
  }

  getRuntimeInitializer(type) {
    return this.runtimeInitializerResolver(type);
  }
}
