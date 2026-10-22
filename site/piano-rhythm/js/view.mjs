const COLORS = {
  perfect: "#a5efd7",
  good: "#eac88e",
  miss: "#ff8795",
  stray: "#ff8795",
};
export const timeLabel = (seconds) => {
  const value = Math.max(0, Math.floor(seconds));
  return `${String(Math.floor(value / 60)).padStart(2, "0")}:${String(value % 60).padStart(2, "0")}`;
};

// roundRect is missing in Safari before 16 and older mobile Chromium.
// Keep the fallback local rather than patching the browser's prototype.
function roundedRect(ctx, x, y, width, height, radius) {
  if (typeof ctx.roundRect === "function") {
    ctx.roundRect(x, y, width, height, radius);
    return;
  }
  const r = Math.min(radius, width / 2, height / 2);
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

// The pendulum is a real metronome: its extremes land exactly on the beats that
// the falling notes are judged against, so sight and sound share one clock.
export class MetronomeView {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
    if (typeof ResizeObserver === "function") {
      this.resizeObserver = new ResizeObserver(() => this.resize());
      this.resizeObserver.observe(canvas);
    } else {
      window.addEventListener("resize", () => this.resize());
    }
    this.resize();
  }

  resize() {
    const box = this.canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (this.width === box.width && this.height === box.height && this.dpr === dpr)
      return;
    this.width = box.width;
    this.height = box.height;
    this.dpr = dpr;
    this.canvas.width = Math.round(box.width * dpr);
    this.canvas.height = Math.round(box.height * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  draw(chart, time, state = "idle") {
    const c = this.ctx;
    if (!this.resizeObserver) this.resize();
    const w = this.width,
      h = this.height;
    if (!w || !h) return;
    c.clearRect(0, 0, w, h);
    const meter = chart.song.meter;
    const beat = chart.beat;
    const live = state === "playing" || state === "paused";
    const accent = chart.song.color || "#eac88e";
    const elapsed = live ? time : 0;
    // Negative count-in values work with floor(): phase stays inside 0..1.
    const index = Math.floor(elapsed / beat + 1e-9);
    const phase = elapsed / beat - index;
    const beatNo = ((index % meter) + meter) % meter;
    const cx = w / 2,
      pivotY = 12;
    const arm = Math.max(30, h - 54);
    const maxAngle = Math.min(
      0.6,
      Math.asin(Math.max(0.18, (w / 2 - 8) / arm)),
    );
    const angle = live ? maxAngle * Math.cos(Math.PI * phase) : 0;
    const tipX = cx + Math.sin(angle) * arm;
    const tipY = pivotY + Math.cos(angle) * arm;
    const pulse = state === "playing" ? Math.max(0, 1 - phase * 2.2) : 0;
    const glow = !this.reducedMotion.matches;

    c.strokeStyle = "#8cbbc01f";
    c.lineWidth = 1;
    c.beginPath();
    c.arc(cx, pivotY, arm * 0.98, Math.PI / 2 - maxAngle, Math.PI / 2 + maxAngle);
    c.stroke();

    if (pulse > 0.02 && glow) {
      c.globalAlpha = pulse * 0.35;
      c.strokeStyle = accent;
      c.beginPath();
      c.arc(cx, pivotY, 5 + phase * 15, 0, Math.PI * 2);
      c.stroke();
      c.globalAlpha = 1;
    }

    c.strokeStyle = live ? accent : "#7c8b96";
    c.globalAlpha = live ? 0.95 : 0.55;
    c.lineWidth = 2.5;
    c.lineCap = "round";
    if (pulse > 0.3 && glow) {
      c.shadowColor = accent;
      c.shadowBlur = 10;
    }
    c.beginPath();
    c.moveTo(cx, pivotY);
    c.lineTo(tipX, tipY);
    c.stroke();
    c.shadowBlur = 0;
    c.globalAlpha = 1;

    const weightX = cx + Math.sin(angle) * arm * 0.64;
    const weightY = pivotY + Math.cos(angle) * arm * 0.64;
    c.fillStyle = live ? accent : "#8b98a3";
    c.beginPath();
    c.arc(weightX, weightY, 4.4, 0, Math.PI * 2);
    c.fill();

    c.globalAlpha = 0.8;
    c.beginPath();
    c.arc(tipX, tipY, 1.6, 0, Math.PI * 2);
    c.fill();
    c.globalAlpha = 1;

    c.fillStyle = "#33434f";
    c.beginPath();
    c.arc(cx, pivotY, 2.2, 0, Math.PI * 2);
    c.fill();

    const dotY = h - 28;
    const gap = Math.min(12, (w - 8) / meter);
    for (let i = 0; i < meter; i++) {
      const x = cx + (i - (meter - 1) / 2) * gap;
      const on = live && beatNo === i;
      if (on) {
        c.globalAlpha = 0.25;
        c.fillStyle = accent;
        c.beginPath();
        c.arc(x, dotY, 5.4, 0, Math.PI * 2);
        c.fill();
        c.globalAlpha = 1;
      }
      c.fillStyle = on ? accent : "#41525e";
      c.beginPath();
      c.arc(x, dotY, on ? 3.6 : 2.4, 0, Math.PI * 2);
      c.fill();
    }

    const bars = Math.max(1, Math.ceil(chart.totalBeats / meter));
    const bar = Math.floor(index / meter) + 1;
    c.fillStyle = "#8fa3b1";
    c.font = "9px ui-monospace, Menlo, monospace";
    c.textAlign = "center";
    c.fillText(
      !live
        ? `${Math.round(chart.bpm)} BPM`
        : bar < 1
          ? "预备"
          : `${String(Math.min(bars, bar)).padStart(2, "0")}/${String(bars).padStart(2, "0")}`,
      cx,
      h - 9,
    );
  }
}

export class TrackView {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
    this.bursts = [];
    this.flash = null;
    if (typeof ResizeObserver === "function") {
      this.resizeObserver = new ResizeObserver(() => this.resize());
      this.resizeObserver.observe(canvas);
    } else {
      window.addEventListener("resize", () => this.resize());
    }
    this.resize();
  }

  resize() {
    const box = this.canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (this.width === box.width && this.height === box.height && this.dpr === dpr)
      return;
    this.width = box.width;
    this.height = box.height;
    this.dpr = dpr;
    this.canvas.width = Math.round(box.width * dpr);
    this.canvas.height = Math.round(box.height * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  clear() {
    this.bursts = [];
    this.flash = null;
  }

  feedback(kind) {
    this.flash = { kind, at: performance.now() };
    if (
      !this.reducedMotion.matches &&
      (kind === "perfect" || kind === "good")
    ) {
      this.bursts.push({ kind, at: performance.now() });
      this.bursts = this.bursts.slice(-5);
    }
  }

  draw(chart, notes, time, active) {
    const c = this.ctx;
    let w = this.width,
      h = this.height;
    // Also catches layout changes (e.g. entering mobile play mode) without RO.
    if (!this.resizeObserver) {
      this.resize();
      w = this.width;
      h = this.height;
    }
    if (!w || !h) return;
    c.clearRect(0, 0, w, h);
    const x = w / 2,
      hitY = h - 57;
    const laneWidth = Math.min(190, w * 0.53);
    const travel = Math.max(1.6, chart.beat * 3.2);
    const position = (at) => hitY - ((at - time) / travel) * (hitY - 22);
    const gradient = c.createLinearGradient(0, 0, 0, h);
    gradient.addColorStop(0, "#a5efd700");
    gradient.addColorStop(1, "#a5efd70b");
    c.fillStyle = gradient;
    c.fillRect(x - laneWidth / 2, 0, laneWidth, h);
    c.strokeStyle = "#8cbbc019";
    c.lineWidth = 1;
    for (const side of [-1, 1]) {
      c.beginPath();
      c.moveTo(x + (side * laneWidth) / 2, 0);
      c.lineTo(x + (side * laneWidth) / 2, h);
      c.stroke();
    }
    // Musical beat grid; wider gaps in the chart remain visibly empty.
    const startBeat = Math.floor(time / chart.beat) - 1;
    for (
      let beat = startBeat;
      beat < startBeat + Math.ceil(travel / chart.beat) + 3;
      beat++
    ) {
      const y = position(beat * chart.beat);
      if (y < 32 || y > hitY + 20) continue;
      c.strokeStyle = beat % chart.song.meter === 0 ? "#839ca030" : "#839ca014";
      c.beginPath();
      c.moveTo(24, y);
      c.lineTo(w - 24, y);
      c.stroke();
      if (beat >= 0 && beat % chart.song.meter === 0) {
        c.fillStyle = "#9caebc66";
        c.font = "9px monospace";
        c.textAlign = "left";
        c.fillText(
          String(Math.floor(beat / chart.song.meter) + 1).padStart(2, "0"),
          12,
          y - 5,
        );
      }
    }
    for (const note of notes) {
      const y = position(note.at);
      if (y < 30 || y > hitY + 35 || (note.result && note.result !== "miss"))
        continue;
      const alpha =
        Math.min(1, (y - 26) / 35) * (note.result === "miss" ? 0.25 : 1);
      const near = Math.abs(note.at - time) < 0.13;
      const width = Math.min(112, laneWidth * 0.65);
      c.globalAlpha = Math.max(0, alpha);
      if (near && !note.result) {
        c.shadowBlur = 20;
        c.shadowColor = "#eac88e88";
      }
      c.fillStyle =
        note.result === "miss"
          ? COLORS.miss
          : near
            ? "#f4e5ca"
            : chart.song.color;
      c.beginPath();
      roundedRect(c, x - width / 2, y - 12, width, 24, 6);
      c.fill();
      c.shadowBlur = 0;
      c.fillStyle = "#18303b";
      c.font = "600 10px monospace";
      c.textAlign = "center";
      c.fillText(note.label.replace(/\d/g, ""), x, y + 3.5);
      c.globalAlpha = 1;
    }
    const age = this.flash ? performance.now() - this.flash.at : Infinity;
    const glow = age < 300 ? 1 - age / 300 : 0;
    c.strokeStyle = glow ? COLORS[this.flash.kind] : "#eac88e";
    c.lineWidth = glow ? 2.5 : 1.5;
    c.shadowColor = c.strokeStyle;
    c.shadowBlur = glow ? 18 : 6;
    c.beginPath();
    c.moveTo(32, hitY);
    c.lineTo(w - 32, hitY);
    c.stroke();
    c.shadowBlur = 0;
    for (const side of [-1, 1]) {
      const dotX = x + side * (laneWidth / 2 + 10);
      c.fillStyle = "#eac88e";
      c.beginPath();
      c.arc(dotX, hitY, 3, 0, Math.PI * 2);
      c.fill();
    }
    if (active && !this.reducedMotion.matches) {
      const phase = (((time / chart.beat) % 1) + 1) % 1;
      c.strokeStyle = `rgba(234,200,142,${(1 - phase) * 0.18})`;
      c.lineWidth = 1;
      c.beginPath();
      roundedRect(
        c,
        x - 65 - phase * 15,
        hitY - 17 - phase * 4,
        130 + phase * 30,
        34 + phase * 8,
        8,
      );
      c.stroke();
    }
    this.bursts = this.bursts.filter(
      (burst) => performance.now() - burst.at < 550,
    );
    for (const burst of this.bursts) {
      const progress = (performance.now() - burst.at) / 550;
      c.globalAlpha = 1 - progress;
      c.fillStyle = COLORS[burst.kind];
      for (let i = 0; i < 14; i++) {
        const angle = (i * Math.PI * 2) / 14;
        const radius = 18 + progress * 75;
        c.beginPath();
        c.arc(
          x + Math.cos(angle) * radius,
          hitY + Math.sin(angle) * radius * 0.48 - progress * 22,
          2 * (1 - progress) + 0.5,
          0,
          Math.PI * 2,
        );
        c.fill();
      }
      c.globalAlpha = 1;
    }
  }
}
