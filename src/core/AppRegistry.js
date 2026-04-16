import { initMinecraft } from "../apps/minecraft.js";
import { initN64 } from "../apps/n64.js";
import { initNotepad } from "../apps/notepad.js";
import { initCardfile } from "../apps/cardfile.js";
import { initClock } from "../apps/clock.js";
import { initDiscord } from "../apps/discord.js";
import { initSpotify } from "../apps/spotify.js";
import { initIRC } from "../apps/irc.js";
import { initBbs } from "../apps/bbsDialer.js";
import { initEmail } from "../apps/email.js";
import { initMessenger } from "../apps/messenger.js";
import { initRetroAI } from "../apps/retroAI.js";
import { initKakuro } from "../apps/kakuro.js";
import { initMarkdownViewer } from "../apps/markdown.js";
import { initMinesweeper } from "../apps/minesweeper.js";
import { initCeleryMan } from "../apps/celeryman.js";
import { initPdfReader } from "../apps/pdfReader.js";
import { initPaint } from "../apps/paint.js";
import { initPixelStudio } from "../apps/pixelStudio.js";
import { initPostgres } from "../apps/postgres.js";
import { initVm } from "../apps/vm.js";
import { initWrite } from "../apps/write.js";
import { initArtist } from "../apps/artist.js";
import { initSandspiel } from "../apps/sandspiel.js";
import { initSandspiel3d } from "../apps/sandspiel3d.js";
import { initWhiteboard } from "../apps/whiteboard.js";
import { initImageViewer } from "../apps/imageViewer.js";
import { initReversi } from "../apps/reversi.js";
import { initSolitaire } from "../apps/solitaire.js";
import { initSudoku } from "../apps/sudoku.js";
import { initCharMap } from "../apps/charmap.js";
import { initBeatMaker } from "../apps/beatMaker.js";
import { initMidiSequencer } from "../apps/midiSequencer.js";
import { initDatabase } from "../apps/database.js";
import { initMediaPlayer } from "../apps/mediaPlayer.js";
import { initTaskMan } from "../apps/taskman.js";
import { initReset } from "../apps/reset.js";
import { initRadio, initRadioGarden, initRssReader, initBrowser } from "../networking.js";
import { initHexEditor } from "../apps/hexEditor.js";
import { initSoundRecorder } from "../apps/soundRecorder.js";
import { initDoom } from "../apps/doom.js";
import { initFileManager } from "../apps/fileManager.js";
import { initConsole } from "../apps/console.js";
import { initPhotoshop } from "../apps/photoshop.js";
import { initLineRider } from "../apps/linerider.js";
import { initSimCity } from "../apps/simcity.js";
import { initNetNews } from "../apps/netnews.js";
import { initSkiFree } from "../apps/skifree.js";
import { initPinball } from "../apps/pinball.js";
import { initAngryBirds } from "../apps/angrybirds.js";
import { initCannonDuel } from "../apps/cannonDuel.js";
import { initMafia } from "../apps/mafia.js";
import { initPacketLab } from "../apps/packetLab.js";
import { initApiClient } from "../apps/apiClient.js";
import { initTi83 } from "../apps/ti83.js";
import { initTracker } from "../apps/tracker.js";
import { initControlPanel } from "../apps/controlPanel.js";
import { getRuntimeInitializer } from "../installer.js";
import { initChess } from "../apps/chess.js";
import { initPapersPlease } from "../apps/papersPlease.js";
import { initShaderLab } from "../apps/shaderLab.js";

export class AppRegistry {
  constructor({ controlPanelContext = {}, runtimeInitializerResolver = getRuntimeInitializer } = {}) {
    this.controlPanelContext = controlPanelContext;
    this.runtimeInitializerResolver = runtimeInitializerResolver;
    this.initializers = this.createInitializers();
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

  resolve(type) {
    return this.initializers[type] || this.getRuntimeInitializer(type);
  }

  getRuntimeInitializer(type) {
    return this.runtimeInitializerResolver(type);
  }
}
