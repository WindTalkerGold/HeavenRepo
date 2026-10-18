// Public-domain melodies, newly simplified for a single-button rhythm game.
// Tokens are pitch:duration in quarter-note beats; '-' is a rest, '+' a chord.
export const SONGS = [
  {
    id: "twinkle",
    title: "小星星",
    english: "TWINKLE, TWINKLE",
    composer: "法国传统旋律 · 莫扎特变奏曲主题",
    level: "入门",
    bpm: 100,
    meter: 4,
    color: "#a5efd7",
    symbol: "✦",
    description: "从熟悉的旋律开始。每个音只点一下，长音之后耐心等下一拍。",
    phrases: [
      "C4:1 C4:1 G4:1 G4:1 A4:1 A4:1 G4:2",
      "F4:1 F4:1 E4:1 E4:1 D4:1 D4:1 C4:2",
      "G4:1 G4:1 F4:1 F4:1 E4:1 E4:1 D4:2",
      "G4:1 G4:1 F4:1 F4:1 E4:1 E4:1 D4:2",
      "C4:1 C4:1 G4:1 G4:1 A4:1 A4:1 G4:2",
      "F4:1 F4:1 E4:1 E4:1 D4:1 D4:1 C4:2",
    ],
    bass: ["C3+E3", "F3+C4", "F3+A3", "G2+B2", "C3+E3", "G2+B2"],
  },
  {
    id: "joy",
    title: "欢乐颂",
    english: "ODE TO JOY",
    composer: "L. van Beethoven · 第九交响曲主题",
    level: "基础",
    bpm: 108,
    meter: 4,
    color: "#b9c3ff",
    symbol: "♪",
    description: "稳定的四拍，加上附点与短音。注意句尾突然靠近的两个音符。",
    phrases: [
      "E4:1 E4:1 F4:1 G4:1 G4:1 F4:1 E4:1 D4:1",
      "C4:1 C4:1 D4:1 E4:1 E4:1.5 D4:0.5 D4:2",
      "E4:1 E4:1 F4:1 G4:1 G4:1 F4:1 E4:1 D4:1",
      "C4:1 C4:1 D4:1 E4:1 D4:1.5 C4:0.5 C4:2",
    ],
    bass: ["C3+G3", "G2+D3", "C3+G3", "G2+B2"],
  },
  {
    id: "elise",
    title: "致爱丽丝",
    english: "FÜR ELISE",
    composer: "L. van Beethoven · WoO 59 开头节选",
    level: "进阶",
    bpm: 72,
    meter: 3,
    color: "#f1c79d",
    symbol: "♬",
    description: "E 与升 D 的交替、八分音符与留白。看准判定线，不要一直连点。",
    // Starts at the pickup; intentionally simplified, not a full score edition.
    phrases: [
      "E5:0.5 D#5:0.5 E5:0.5 D#5:0.5 E5:0.5 B4:0.5 D5:0.5 C5:0.5 A4:1 -:0.5",
      "C4:0.5 E4:0.5 A4:0.5 B4:1 -:0.5 E4:0.5 G#4:0.5 B4:0.5 C5:1 -:0.5",
      "E4:0.5 E5:0.5 D#5:0.5 E5:0.5 D#5:0.5 E5:0.5 B4:0.5 D5:0.5 C5:0.5 A4:1 -:0.5",
      "C4:0.5 E4:0.5 A4:0.5 B4:1 -:0.5 E4:0.5 C5:0.5 B4:0.5 A4:2",
    ],
    bass: [],
  },
  {
    id: "minuet",
    title: "G 大调小步舞曲",
    english: "MINUET IN G",
    composer: "Christian Petzold · BWV Anh. 114 主题节选",
    level: "进阶",
    bpm: 100,
    meter: 3,
    color: "#efb6d4",
    symbol: "𝄞",
    description: "一、二、三，像舞步一样起伏。四分与八分音符交替，保持轻盈。",
    phrases: [
      "D5:1 G4:0.5 A4:0.5 B4:0.5 C5:0.5 D5:1 G4:1 G4:1",
      "E5:1 C5:0.5 D5:0.5 E5:0.5 F#5:0.5 G5:1 G4:1 G4:1",
      "C5:1 D5:0.5 C5:0.5 B4:0.5 A4:0.5 B4:1 C5:0.5 B4:0.5 A4:0.5 G4:0.5",
      "F#4:1 G4:0.5 A4:0.5 B4:0.5 G4:0.5 B4:1 A4:2",
    ],
    bass: [
      "G2+D3",
      "G2+B2",
      "C3+G3",
      "G2+B2",
      "A2+E3",
      "G2+D3",
      "D3+A3",
      "D3+F#3",
    ],
  },
];

export function pitchToMidi(pitch) {
  const match = /^([A-G])(#|b)?([0-8])$/.exec(pitch);
  if (!match) throw new Error(`Invalid pitch: ${pitch}`);
  const step = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }[match[1]];
  return (
    (Number(match[3]) + 1) * 12 +
    step +
    (match[2] === "#" ? 1 : match[2] === "b" ? -1 : 0)
  );
}

export function compileSong(song, speed = 1) {
  if (!Number.isFinite(speed) || speed < 0.5 || speed > 1.5)
    throw new Error("Invalid speed");
  const beat = 60 / (song.bpm * speed);
  const notes = [],
    events = [];
  let cursor = 0;
  for (const token of song.phrases.join(" ").trim().split(/\s+/)) {
    const [pitch, length] = token.split(":");
    const beats = Number(length);
    if (!Number.isFinite(beats) || beats <= 0)
      throw new Error(`Invalid duration: ${token}`);
    if (pitch !== "-") {
      const pitches = pitch.split("+").map(pitchToMidi);
      const note = {
        id: notes.length,
        at: cursor * beat,
        duration: beats * beat,
        pitches,
        label: pitch,
      };
      notes.push(note);
      events.push({ ...note, kind: "piano", volume: 1 });
    }
    cursor += beats;
  }
  if (!notes.length) throw new Error("Empty chart");
  // Simple new left-hand arrangement; accompaniment never creates extra tap targets.
  if (song.bass.length) {
    for (let bar = 0; bar * song.meter < cursor; bar++) {
      events.push({
        at: bar * song.meter * beat,
        duration: song.meter * beat * 0.85,
        pitches: song.bass[bar % song.bass.length].split("+").map(pitchToMidi),
        kind: "piano",
        volume: 0.32,
      });
    }
  }
  return {
    song,
    notes,
    events: events.sort((a, b) => a.at - b.at),
    beat,
    duration: cursor * beat,
    totalBeats: cursor,
    bpm: song.bpm * speed,
  };
}
