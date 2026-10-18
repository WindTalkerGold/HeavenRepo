"use strict";

/* ============================================================
   打字音效引擎
   ------------------------------------------------------------
   把 26 个字母 + 10 个数字键固定映射到 do~si 的音阶，用 Web Audio
   API 实时合成，不需要任何外部音频文件。

   固定映射规则：
   - 按键顺序为 A-Z 然后 0-9，共 36 个键。
   - 从「高音 do」开始，按大调音阶（do re mi fa sol la si）逐个下行，
     跨越多个八度，一直到「低音 do」。
   - 每个键永远发出同一个音（映射固定不变）。
     例如：A = 最高音 do，往后越来越低，9 = 最低音 do。
   ============================================================ */

(function () {
  // 36 个按键的固定顺序
  const KEY_ORDER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split("");

  // 大调（do re mi fa sol la si）在一个八度内的半音偏移
  const MAJOR_STEPS = [0, 2, 4, 5, 7, 9, 11];
  const SOLFEGE = ["do", "re", "mi", "fa", "sol", "la", "si"];
  const NOTE_LETTERS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

  // 最低音的 MIDI 音高：C3 = 48。36 个自然音正好跨到最高音 C8 = 108。
  // （最低音选 C3/130Hz 而不是更低的 C2/65Hz，因为普通笔记本喇叭
  //   基本放不出 100Hz 以下的低音，会听起来"没声音"。）
  const BASE_MIDI = 48; // C3

  function midiForDiatonicIndex(i) {
    const octave = Math.floor(i / 7);
    const degree = i % 7;
    return BASE_MIDI + octave * 12 + MAJOR_STEPS[degree];
  }
  function midiToFreq(m) { return 440 * Math.pow(2, (m - 69) / 12); }
  function midiToOctave(m) { return Math.floor(m / 12) - 1; }
  function midiToName(m) { return NOTE_LETTERS[m % 12] + midiToOctave(m); }

  // 生成固定映射：key -> { freq, midi, solfege, name, octave }
  const NOTE_MAP = {};
  const N = KEY_ORDER.length; // 36
  KEY_ORDER.forEach((key, keyIdx) => {
    // key 0 (A) 对应最高音，key 35 (9) 对应最低音 —— 从高音到低音下行
    const diatonicIdx = (N - 1) - keyIdx;
    const midi = midiForDiatonicIndex(diatonicIdx);
    NOTE_MAP[key] = {
      freq: midiToFreq(midi),
      midi: midi,
      solfege: SOLFEGE[diatonicIdx % 7],
      name: midiToName(midi),
      octave: midiToOctave(midi)
    };
  });

  class ToneEngine {
    constructor() {
      this.ctx = null;
      this.enabled = this._loadEnabled();
      this.lastNote = null;
    }

    _loadEnabled() {
      try {
        const v = localStorage.getItem("typing_sound_on");
        return v === null ? true : v === "1";
      } catch (e) { return true; }
    }

    setEnabled(on) {
      this.enabled = !!on;
      try { localStorage.setItem("typing_sound_on", on ? "1" : "0"); } catch (e) {}
      if (on) this.resume();
    }

    toggle() { this.setEnabled(!this.enabled); return this.enabled; }

    _ensureCtx() {
      if (!this.ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        this.ctx = new AC();
      }
      return this.ctx;
    }

    // 浏览器要求用户首次交互后才允许播放；每次点击/按键都尝试恢复
    resume() {
      const ctx = this._ensureCtx();
      if (ctx && ctx.state === "suspended") ctx.resume();
    }

    noteForKey(key) {
      if (typeof key !== "string" || key.length !== 1) return null;
      return NOTE_MAP[key.toUpperCase()] || null;
    }

    // 播放某个键对应的固定音；返回该音的信息（未映射的键返回 null）
    playKey(key) {
      const note = this.noteForKey(key);
      if (note) {
        this.lastNote = note;
        if (this.enabled) this._play(note.freq);
      }
      return note;
    }

    _play(freq) {
      const ctx = this._ensureCtx();
      if (!ctx) return;
      if (ctx.state === "suspended") ctx.resume();
      const now = ctx.currentTime;

      // 主音（三角波，音色柔和）+ 高八度正弦泛音（让声音更清亮）
      const osc = ctx.createOscillator();
      osc.type = "triangle";
      osc.frequency.value = freq;

      const osc2 = ctx.createOscillator();
      osc2.type = "sine";
      osc2.frequency.value = freq * 2;
      const g2 = ctx.createGain();
      // 低音的基频在小喇叭上很弱，靠高一个八度的泛音帮忙"补出"音高，
      // 所以频率越低，泛音给得越多。
      g2.gain.value = freq < 300 ? 0.5 : 0.25;

      // 响度补偿：低音听感更弱、且小喇叭衰减大 -> 加大音量；
      // 高音听感更强、容易刺耳 -> 减小音量。以 ~700Hz 为基准。
      let comp = Math.sqrt(700 / freq);
      comp = Math.max(0.35, Math.min(2.5, comp));

      // 音量包络：快速起音 + 指数衰减，类似清脆的木琴/铃声
      const gain = ctx.createGain();
      const peak = 0.24 * comp;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(peak, now + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

      osc.connect(gain);
      osc2.connect(g2).connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc2.start(now);
      osc.stop(now + 0.5);
      osc2.stop(now + 0.5);
    }
  }

  window.NOTE_MAP = NOTE_MAP;
  window.KEY_ORDER = KEY_ORDER;
  window.SoundFX = new ToneEngine();
})();
