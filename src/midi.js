const NOTE_NAMES = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B"
];

export function midiNoteNumberToName(num) {
  const octave = Math.floor(num / 12) - 1;
  const name = NOTE_NAMES[num % 12] || "?";
  return `${name}${octave}`;
}

export function midiNoteToFrequency(num) {
  return 440 * Math.pow(2, (num - 69) / 12);
}

function readVarInt(view, state) {
  let result = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const byte = view.getUint8(state.pos++);
    result = (result << 7) + (byte & 0x7f);
    if ((byte & 0x80) === 0) break;
  }
  return result;
}

export function parseMidiFile(arrayBuffer) {
  const view = new DataView(arrayBuffer);
  const state = { pos: 0 };

  function readString(len) {
    let str = "";
    for (let i = 0; i < len; i++) {
      str += String.fromCharCode(view.getUint8(state.pos++));
    }
    return str;
  }

  function readUint16() {
    const val = view.getUint16(state.pos, false);
    state.pos += 2;
    return val;
  }

  function readUint32() {
    const val = view.getUint32(state.pos, false);
    state.pos += 4;
    return val;
  }

  const headerId = readString(4);
  if (headerId !== "MThd") {
    throw new Error("Invalid MIDI file: missing header chunk");
  }

  const headerLength = readUint32();
  const formatType = readUint16();
  const trackCount = readUint16();
  const division = readUint16();
  // Skip any extra header bytes
  state.pos = 8 + headerLength;

  const ticksPerBeat = division & 0x7fff;
  let microsecondsPerBeat = 500000; // default 120bpm

  const parsedTracks = [];

  for (let t = 0; t < trackCount; t++) {
    const chunkId = readString(4);
    if (chunkId !== "MTrk") {
      throw new Error("Invalid MIDI file: expected track chunk");
    }
    const chunkLength = readUint32();
    const trackEnd = state.pos + chunkLength;

    let tick = 0;
    let runningStatus = null;
    const openNotes = new Map();
    const notes = [];
    const tempoEvents = [];

    while (state.pos < trackEnd) {
      const delta = readVarInt(view, state);
      tick += delta;

      let statusByte = view.getUint8(state.pos);
      if (statusByte & 0x80) {
        state.pos++;
        runningStatus = statusByte;
      } else if (runningStatus !== null) {
        // Use running status
        statusByte = runningStatus;
      } else {
        throw new Error("Malformed MIDI track: missing status byte");
      }

      if (statusByte === 0xff) {
        const metaType = view.getUint8(state.pos++);
        const length = readVarInt(view, state);
        if (metaType === 0x51 && length === 3) {
          microsecondsPerBeat = view.getUint8(state.pos) * 65536 + view.getUint8(state.pos + 1) * 256 + view.getUint8(state.pos + 2);
          tempoEvents.push({ tick, microsecondsPerBeat });
        }
        state.pos += length;
        continue;
      }

      if (statusByte === 0xf0 || statusByte === 0xf7) {
        const length = readVarInt(view, state);
        state.pos += length;
        continue;
      }

      const eventType = statusByte & 0xf0;
      const channel = statusByte & 0x0f;

      const dataByte1 = view.getUint8(state.pos++);
      const dataByte2 =
        eventType === 0xc0 || eventType === 0xd0 ? null : view.getUint8(state.pos++);

      if (eventType === 0x90) {
        const velocity = dataByte2 || 0;
        if (velocity === 0) {
          // Treated as note off
          const key = `${channel}-${dataByte1}`;
          const start = openNotes.get(key);
          if (start) {
            notes.push({
              channel,
              noteNumber: dataByte1,
              velocity: start.velocity,
              startTick: start.tick,
              durationTicks: tick - start.tick
            });
            openNotes.delete(key);
          }
        } else {
          openNotes.set(`${channel}-${dataByte1}`, {
            tick,
            velocity
          });
        }
      } else if (eventType === 0x80) {
        const key = `${channel}-${dataByte1}`;
        const start = openNotes.get(key);
        if (start) {
          notes.push({
            channel,
            noteNumber: dataByte1,
            velocity: start.velocity,
            startTick: start.tick,
            durationTicks: tick - start.tick
          });
          openNotes.delete(key);
        }
      }
    }

    parsedTracks.push({ notes, tempoEvents });
  }

  const bpm = Math.round(60000000 / microsecondsPerBeat);

  return {
    formatType,
    trackCount,
    ticksPerBeat,
    microsecondsPerBeat,
    bpm,
    tracks: parsedTracks
  };
}
