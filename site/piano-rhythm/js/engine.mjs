// Pure, deterministic judgment. All times are seconds on the audio timeline.
export const WINDOWS = Object.freeze({ perfect: 0.055, good: 0.125 });
const EPSILON = 1e-8;

export class RhythmEngine {
  constructor(chart) {
    this.notes = chart.notes.map((note) => ({ ...note, result: null }));
    this.score = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.counts = { perfect: 0, good: 0, miss: 0, stray: 0 };
    this.offsets = [];
    this.firstPending = 0;
  }

  get judged() {
    return this.counts.perfect + this.counts.good + this.counts.miss;
  }
  get accuracy() {
    const attempts = this.judged + this.counts.stray;
    return attempts
      ? ((this.counts.perfect + this.counts.good * 0.7) / attempts) * 100
      : 100;
  }
  get complete() {
    return this.judged === this.notes.length;
  }

  advance(time) {
    if (!Number.isFinite(time)) return [];
    const events = [];
    for (let i = this.firstPending; i < this.notes.length; i++) {
      const note = this.notes[i];
      if (note.at + WINDOWS.good >= time - EPSILON) break;
      if (!note.result) {
        note.result = "miss";
        this.counts.miss++;
        this.combo = 0;
        events.push({ kind: "miss", note, delta: null });
      }
    }
    this.skipJudged();
    return events;
  }

  tap(time) {
    if (!Number.isFinite(time) || time < -WINDOWS.good) return [];
    const events = this.advance(time);
    let closest = null;
    let distance = WINDOWS.good + EPSILON;
    for (let i = this.firstPending; i < this.notes.length; i++) {
      const note = this.notes[i];
      if (note.at > time + WINDOWS.good + EPSILON) break;
      const delta = Math.abs(note.at - time);
      if (!note.result && delta < distance) {
        closest = note;
        distance = delta;
      }
    }
    if (closest) {
      const delta = time - closest.at;
      const kind =
        Math.abs(delta) <= WINDOWS.perfect + EPSILON ? "perfect" : "good";
      closest.result = kind;
      this.counts[kind]++;
      this.combo++;
      this.maxCombo = Math.max(this.maxCombo, this.combo);
      this.score +=
        (kind === "perfect" ? 100 : 70) + Math.min(this.combo, 50) * 2;
      this.offsets.push(delta * 1000);
      events.push({ kind, note: closest, delta });
      this.skipJudged();
    } else {
      this.counts.stray++;
      this.combo = 0;
      this.score = Math.max(0, this.score - 30);
      // Use the nearest onset (including a just-missed note) for early/late feedback.
      const nearest = this.notes.reduce(
        (best, note) =>
          !best || Math.abs(time - note.at) < Math.abs(time - best.at)
            ? note
            : best,
        null,
      );
      events.push({
        kind: "stray",
        note: null,
        delta: nearest ? time - nearest.at : 1,
      });
    }
    return events;
  }

  skipJudged() {
    while (
      this.firstPending < this.notes.length &&
      this.notes[this.firstPending].result
    )
      this.firstPending++;
  }

  summary() {
    const accuracy = this.accuracy;
    return {
      score: this.score,
      maxCombo: this.maxCombo,
      accuracy,
      counts: { ...this.counts },
      grade:
        accuracy >= 98
          ? "S"
          : accuracy >= 90
            ? "A"
            : accuracy >= 75
              ? "B"
              : accuracy >= 60
                ? "C"
                : "D",
      meanOffset: this.offsets.length
        ? this.offsets.reduce((a, b) => a + b, 0) / this.offsets.length
        : null,
    };
  }
}
