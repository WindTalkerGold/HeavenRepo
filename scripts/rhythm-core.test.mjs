import test from "node:test";
import assert from "node:assert/strict";
import {
  SONGS,
  compileSong,
  pitchToMidi,
} from "../site/piano-rhythm/js/songs.mjs";
import { RhythmEngine, WINDOWS } from "../site/piano-rhythm/js/engine.mjs";

const makeChart = () => ({
  notes: [0, 1, 2].map((at, id) => ({
    id,
    at,
    duration: 0.5,
    pitches: [60],
    label: "C4",
  })),
});

test("every arrangement compiles at every UI speed without mutating source data", () => {
  const before = JSON.stringify(SONGS);
  for (const song of SONGS)
    for (const speed of [0.75, 1, 1.25]) {
      const chart = compileSong(song, speed);
      assert.ok(chart.notes.length >= 20);
      assert.ok(chart.duration > 10 && chart.duration < 90);
      assert.ok(
        chart.notes.every(
          (note, i) =>
            note.duration > 0 &&
            note.at >= 0 &&
            note.at < chart.duration &&
            note.pitches.every(Number.isFinite) &&
            (!i || note.at > chart.notes[i - 1].at),
        ),
      );
      assert.ok(
        chart.events.every(
          (event, i) => !i || event.at >= chart.events[i - 1].at,
        ),
      );
      assert.equal(new RhythmEngine(chart).notes.length, chart.notes.length);
    }
  assert.equal(JSON.stringify(SONGS), before);
  assert.equal(pitchToMidi("A4"), 69);
  assert.equal(pitchToMidi("D#5"), pitchToMidi("Eb5"));
  assert.throws(() => pitchToMidi("bad"));
  assert.throws(() => compileSong(SONGS[0], 0));
  assert.throws(() => compileSong(SONGS[0], NaN));
});

test("rests and chords create no extra taps; speed scales the whole timeline", () => {
  const song = {
    bpm: 120,
    meter: 4,
    bass: [],
    phrases: ["-:1 C4+E4:1 -:0.5 G4:0.5"],
  };
  const normal = compileSong(song),
    slow = compileSong(song, 0.75);
  assert.equal(normal.notes.length, 2);
  assert.deepEqual(normal.notes[0].pitches, [60, 64]);
  assert.equal(normal.notes[0].at, 0.5);
  assert.equal(normal.notes[1].at, 1.25);
  assert.equal(slow.duration, normal.duration / 0.75);
});

test("Perfect and Good accept exact inclusive window boundaries", () => {
  for (const delta of [-WINDOWS.perfect, 0, WINDOWS.perfect]) {
    const engine = new RhythmEngine(makeChart());
    assert.equal(engine.tap(delta).at(-1).kind, "perfect");
    assert.equal(engine.score, 102);
  }
  for (const delta of [-WINDOWS.good, -0.06, 0.06, WINDOWS.good]) {
    const engine = new RhythmEngine(makeChart());
    assert.equal(engine.tap(delta).at(-1).kind, "good");
    assert.equal(engine.score, 72);
  }
});

test("count-in and nonfinite input cannot add scores or penalties", () => {
  const engine = new RhythmEngine(makeChart());
  for (const time of [-2, -0.2, NaN, Infinity])
    assert.deepEqual(engine.tap(time), []);
  assert.equal(engine.score, 0);
  assert.equal(engine.judged, 0);
});

test("duplicate taps cannot farm score; empty taps reset combo and subtract points", () => {
  const engine = new RhythmEngine(makeChart());
  engine.tap(0);
  engine.tap(0.01);
  assert.equal(engine.counts.perfect, 1);
  assert.equal(engine.counts.stray, 1);
  assert.equal(engine.score, 72);
  assert.equal(engine.combo, 0);
  assert.equal(engine.maxCombo, 1);
  assert.equal(engine.accuracy, 50);
});

test("misses are emitted exactly once and hold/repeat is not needed for sustain", () => {
  const engine = new RhythmEngine(makeChart());
  engine.tap(0);
  assert.equal(engine.advance(1.125).length, 0);
  assert.equal(engine.advance(1.126)[0].kind, "miss");
  assert.equal(engine.advance(1.9).length, 0);
  assert.equal(engine.combo, 0);
  engine.tap(2);
  assert.equal(engine.complete, true);
  assert.deepEqual(engine.summary().counts, {
    perfect: 2,
    good: 0,
    miss: 1,
    stray: 0,
  });
});

test("overlapping windows choose the nearest unresolved note, not a future ghost", () => {
  const engine = new RhythmEngine({ notes: [{ at: 0 }, { at: 0.24 }] });
  const hit = engine.tap(0.122).at(-1);
  assert.equal(hit.note.at, 0.24);
  assert.equal(engine.advance(0.13)[0].note.at, 0);
  assert.equal(engine.complete, true);
});

test("late taps report late, even after the missed note has been consumed", () => {
  const engine = new RhythmEngine(makeChart());
  const events = engine.tap(0.2);
  assert.deepEqual(
    events.map((event) => event.kind),
    ["miss", "stray"],
  );
  assert.ok(events.at(-1).delta > 0);
  assert.equal(engine.score, 0);
});

test("timing correction uses a single adjusted timestamp", () => {
  const engine = new RhythmEngine(makeChart());
  const lateHardwareTime = 0.2,
    compensation = 0.2;
  assert.equal(
    engine.tap(lateHardwareTime - compensation).at(-1).kind,
    "perfect",
  );
});

test("full autoplay and no-input outcomes are finite, consistent, and isolated per round", () => {
  for (const song of SONGS) {
    const chart = compileSong(song);
    const perfect = new RhythmEngine(chart);
    for (const note of chart.notes) perfect.tap(note.at);
    assert.equal(perfect.summary().grade, "S");
    assert.equal(perfect.accuracy, 100);
    assert.equal(perfect.maxCombo, chart.notes.length);
    assert.equal(perfect.complete, true);
    const silent = new RhythmEngine(chart);
    silent.advance(chart.duration + 1);
    assert.equal(silent.score, 0);
    assert.equal(silent.counts.miss, chart.notes.length);
    assert.equal(silent.summary().grade, "D");
    assert.equal(silent.summary().meanOffset, null);
    assert.equal(silent.complete, true);
    assert.ok(chart.notes.every((note) => !("result" in note)));
  }
});
