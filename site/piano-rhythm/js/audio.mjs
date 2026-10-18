// Web Audio is the transport clock, not setInterval or frame count.
// The timer only feeds a short look-ahead queue into the sample-accurate scheduler.
export class PianoTransport {
  constructor() {
    this.ctx = null;
    this.voices = new Set();
    this.timer = null;
    this.active = false;
    this.paused = false;
    this.muted = false;
    this.origin = 0;
    this.pausedPosition = 0;
    this.onInterrupt = () => {};
  }

  async init() {
    if (!this.ctx) {
      const Context = window.AudioContext || window.webkitAudioContext;
      if (!Context)
        throw new Error(
          "此浏览器不支持 Web Audio，请使用新版 Safari、Chrome 或 Edge。",
        );
      this.ctx = new Context({ latencyHint: "interactive" });
      this.master = this.ctx.createGain();
      this.master.gain.value = this.muted ? 0 : 0.65;
      const compressor = this.ctx.createDynamicsCompressor();
      compressor.threshold.value = -14;
      compressor.ratio.value = 4;
      this.master.connect(compressor).connect(this.ctx.destination);
      const real = new Float32Array(9);
      const imag = new Float32Array([
        0, 1, 0.32, 0.14, 0.08, 0.045, 0.025, 0.012, 0.008,
      ]);
      this.wave = this.ctx.createPeriodicWave(real, imag);
      this.ctx.addEventListener("statechange", () => {
        if (this.active && !this.paused && this.ctx.state !== "running")
          this.onInterrupt();
      });
    }
    // Invoke resume synchronously in the tap/click call stack for iOS's
    // user-gesture policy. Some browsers leave its promise pending instead
    // of rejecting when audio is blocked; never leave the UI loading forever.
    let timeout;
    try {
      await Promise.race([
        this.ctx.resume(),
        new Promise((_, reject) => {
          timeout = setTimeout(
            () => reject(new Error("音频启动超时，请再次点击开始；如仍失败，请检查浏览器的音频权限。")),
            5000,
          );
        }),
      ]);
    } finally {
      clearTimeout(timeout);
    }
    if (this.ctx.state !== "running")
      throw new Error("音频尚未启动，请再点一次开始。");
  }

  clock() {
    // Map the output device timestamp to now, when available, to align visual/input
    // time with audible music rather than the slightly-ahead rendering clock.
    if (this.ctx.state === "running" && this.ctx.getOutputTimestamp) {
      const stamp = this.ctx.getOutputTimestamp();
      if (stamp.contextTime > 0 && stamp.performanceTime > 0) {
        return Math.min(
          this.ctx.currentTime,
          stamp.contextTime +
            (performance.now() - stamp.performanceTime) / 1000,
        );
      }
    }
    return this.ctx.currentTime;
  }

  now() {
    return this.paused ? this.pausedPosition : this.clock() - this.origin;
  }

  async start(chart, metronome) {
    this.stop();
    await this.init();
    this.chart = chart;
    this.origin = this.ctx.currentTime + 0.12 + chart.beat * 4;
    this.events = chart.events.slice();
    for (let i = -4; i < 0; i++)
      this.events.push({ at: i * chart.beat, kind: "click", strong: i === -4 });
    if (metronome) {
      for (let i = 0; i < chart.totalBeats; i++)
        this.events.push({
          at: i * chart.beat,
          kind: "click",
          strong: i % chart.song.meter === 0,
        });
    }
    this.events.sort((a, b) => a.at - b.at);
    this.cursor = 0;
    this.paused = false;
    this.active = true;
    this.schedule();
    this.timer = setInterval(() => this.schedule(), 25);
  }

  schedule() {
    if (!this.active || this.paused) return;
    const horizon = this.ctx.currentTime + 0.18;
    while (
      this.cursor < this.events.length &&
      this.origin + this.events[this.cursor].at < horizon
    ) {
      const event = this.events[this.cursor++];
      const when = this.origin + event.at;
      // Never dump a backlog of notes after a stalled event loop.
      if (when < this.ctx.currentTime - 0.08) continue;
      if (event.kind === "click")
        this.tone(event.strong ? 1100 : 760, when, 0.055, 0.08);
      else
        for (const midi of event.pitches) {
          this.tone(
            440 * 2 ** ((midi - 69) / 12),
            when,
            Math.min(2, event.duration * 1.15),
            (0.22 * event.volume) / Math.sqrt(event.pitches.length),
            true,
          );
        }
    }
  }

  tone(frequency, when, duration, volume, piano = false) {
    when = Math.max(this.ctx.currentTime, when);
    const oscillator = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    if (piano) oscillator.setPeriodicWave(this.wave);
    else oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, when);
    gain.gain.exponentialRampToValueAtTime(volume, when + 0.008);
    gain.gain.exponentialRampToValueAtTime(
      Math.max(0.0002, volume * 0.36),
      when + Math.min(0.12, duration * 0.5),
    );
    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      when + Math.max(0.04, duration),
    );
    oscillator.connect(gain).connect(this.master);
    const voice = { oscillator, gain };
    this.voices.add(voice);
    oscillator.onended = () => {
      this.voices.delete(voice);
      oscillator.disconnect();
      gain.disconnect();
    };
    oscillator.start(when);
    oscillator.stop(when + Math.max(0.04, duration) + 0.03);
  }

  mistake() {
    if (this.ctx?.state === "running" && !this.paused)
      this.tone(105, this.ctx.currentTime, 0.08, 0.035);
  }

  setMuted(muted) {
    this.muted = muted;
    if (this.master)
      this.master.gain.setTargetAtTime(
        muted ? 0 : 0.65,
        this.ctx.currentTime,
        0.02,
      );
  }

  async pause() {
    if (!this.active || this.paused) return;
    this.pausedPosition = this.now();
    this.paused = true;
    clearInterval(this.timer);
    await this.ctx.suspend();
  }

  async resume() {
    if (!this.active || !this.paused) return;
    await this.init();
    this.paused = false;
    this.schedule();
    this.timer = setInterval(() => this.schedule(), 25);
  }

  stop() {
    this.active = false;
    this.paused = false;
    clearInterval(this.timer);
    this.timer = null;
    for (const voice of this.voices) {
      voice.gain.gain.cancelScheduledValues(0);
      voice.gain.gain.value = 0;
      try {
        voice.oscillator.stop();
      } catch {
        /* already ended */
      }
      voice.oscillator.disconnect();
      voice.gain.disconnect();
    }
    this.voices.clear();
  }
}
