import { SONGS, compileSong } from "./songs.mjs";
import { RhythmEngine } from "./engine.mjs";
import { PianoTransport } from "./audio.mjs";
import { TrackView, timeLabel } from "./view.mjs";

const $ = (id) => document.getElementById(id);
const transport = new PianoTransport();
const view = new TrackView($("track"));
let selected = SONGS[0];
let chart = compileSong(selected);
let engine = new RhythmEngine(chart);
let phase = "ready";
let offset = 0;
let feedbackTimer = null;
let padTimer = null;
let spaceHeld = false;
let pointerHeld = null;
let lastFrame = performance.now();

for (const song of SONGS) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "song-card";
  button.dataset.song = song.id;
  button.style.setProperty("--song-color", song.color);
  button.setAttribute("aria-pressed", "false");
  button.innerHTML = `<span class="song-art" aria-hidden="true">${song.symbol}</span><span><strong>${song.title}</strong><small>${song.english}</small><span class="song-meta">${song.level} <span>·</span> ${song.bpm} BPM <span>·</span> ${song.meter}/4</span></span>`;
  button.addEventListener("click", () => {
    if (phase === "ready") {
      selected = song;
      selectSong();
    }
  });
  $("songs").append(button);
}

function selectSong() {
  chart = compileSong(selected, Number($("speed").value));
  engine = new RhythmEngine(chart);
  view.clear();
  $("song-title").textContent = selected.title;
  $("song-credit").textContent = selected.composer;
  $("bpm").textContent = Math.round(chart.bpm);
  $("note-count").textContent = `${chart.notes.length} NOTES`;
  $("cover-copy").textContent = selected.description;
  document.documentElement.style.setProperty("--accent", selected.color);
  document
    .querySelectorAll(".song-card")
    .forEach((button) =>
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.song === selected.id),
      ),
    );
  updateHud(0);
}

function updateHud(time) {
  $("score").textContent = String(engine.score).padStart(6, "0");
  $("combo").replaceChildren(document.createTextNode(String(engine.combo)));
  const times = document.createElement("span");
  times.textContent = " ×";
  $("combo").append(times);
  $("accuracy").textContent =
    engine.judged + engine.counts.stray
      ? `${engine.accuracy.toFixed(1)}%`
      : "—";
  $("progress").value = Math.max(0, Math.min(1, time / chart.duration));
  $("time").textContent =
    `${timeLabel(Math.min(chart.duration, time))} / ${timeLabel(chart.duration)}`;
}

function setPhase(next) {
  phase = next;
  $("stage").dataset.phase = next;
  const active = next === "countin" || next === "playing";
  const busy = next === "loading" || next === "pausing";
  document.body.classList.toggle(
    "in-session",
    active || next === "paused" || busy,
  );
  $("hit-pad").disabled = !active;
  $("start").hidden = next !== "ready";
  $("start").disabled = busy;
  $("pause").disabled = !active && next !== "paused";
  $("pause").textContent = next === "paused" ? "继续演奏" : "暂停";
  $("back").disabled = next === "ready" || next === "finished" || busy;
  for (const control of document.querySelectorAll(
    ".song-card, #speed, #offset, #metronome",
  ))
    control.disabled = next !== "ready";
  $("cover").hidden = active || next === "finished";
  $("countdown").hidden = next !== "countin";
  if (next === "ready") {
    $("cover-title").textContent = "让每一拍，刚刚好。";
    $("cover-copy").textContent = selected.description;
    $("session-hint").textContent = "4 拍预备后开始 · 每个音符点一下，不用长按";
  } else if (next === "paused" || next === "pausing") {
    $("cover-title").textContent = "让旋律，等你一下。";
    $("cover-copy").textContent = "已暂停。点击「继续演奏」从原处继续。";
  } else if (next === "loading") {
    $("cover-title").textContent = "琴声准备中…";
    $("cover-copy").textContent = "正在启动音频，请稍候。";
  }
}

function clearFeedback() {
  clearTimeout(feedbackTimer);
  clearTimeout(padTimer);
  $("feedback").className = "feedback";
  $("hit-pad").removeAttribute("data-judgment");
  $("hit-pad").classList.remove("pressed");
  $("stage").classList.remove("error");
  view.clear();
}

async function start() {
  if (phase !== "ready") return;
  $("notice").textContent = "";
  clearFeedback();
  engine = new RhythmEngine(chart);
  offset = Number($("offset").value) / 1000;
  setPhase("loading");
  try {
    await transport.start(chart, $("metronome").checked);
    lastFrame = performance.now();
    setPhase("countin");
    $("stage").focus({ preventScroll: true });
    if (matchMedia("(max-width: 680px)").matches)
      window.scrollTo({ top: 0, behavior: "auto" });
    if (document.hidden) await pause();
  } catch (error) {
    transport.stop();
    setPhase("ready");
    $("notice").textContent = error.message || "音频无法启动，请刷新后重试。";
  }
}

async function pause() {
  if (phase !== "playing" && phase !== "countin") return;
  setPhase("pausing");
  try {
    await transport.pause();
  } catch {
    /* Browser interruption can already have suspended the context. */
  }
  clearFeedback();
  setPhase("paused");
}

async function togglePause() {
  if (phase === "playing" || phase === "countin") return pause();
  if (phase !== "paused") return;
  setPhase("loading");
  try {
    await transport.resume();
    lastFrame = performance.now();
    setPhase(transport.now() - offset < 0 ? "countin" : "playing");
    $("stage").focus({ preventScroll: true });
    if (document.hidden) await pause();
  } catch {
    setPhase("paused");
    $("notice").textContent = "音频未能恢复，请再次点击继续，或结束后重试。";
  }
}

function ready() {
  transport.stop();
  clearFeedback();
  if ($("results").open) $("results").close();
  setPhase("ready");
  $("notice").textContent = "";
  selectSong();
  $("start").focus({ preventScroll: true });
}

function judge(events) {
  if (!events.length) return;
  // All misses are accounted for; just show the latest visual notification.
  const event = events[events.length - 1];
  const { kind, delta } = event;
  const label = {
    perfect: "PERFECT",
    good: "GOOD",
    miss: "MISS",
    stray: "OFF BEAT",
  }[kind];
  const detail =
    kind === "miss"
      ? "漏拍了 · 下一拍重新来"
      : kind === "stray"
        ? delta < 0
          ? "太早了 · 等音符落到金线"
          : "空按 / 太晚了 · 跟上下一拍"
        : `${Math.abs(delta * 1000) < 5 ? "正中节拍" : `${delta < 0 ? "稍早" : "稍晚"} ${Math.round(Math.abs(delta) * 1000)} ms`} · ${engine.combo} 连击`;
  const feedback = $("feedback");
  feedback.querySelector("strong").textContent = label;
  feedback.querySelector("span").textContent = detail;
  feedback.className = `feedback ${kind}`;
  void feedback.offsetWidth;
  feedback.classList.add("show");
  $("hit-pad").dataset.judgment = kind;
  view.feedback(kind);
  if (kind === "miss" || kind === "stray") {
    $("stage").classList.remove("error");
    void $("stage").offsetWidth;
    $("stage").classList.add("error");
    transport.mistake();
  }
  clearTimeout(feedbackTimer);
  feedbackTimer = setTimeout(() => {
    feedback.classList.remove("show");
    $("hit-pad").removeAttribute("data-judgment");
    $("stage").classList.remove("error");
  }, 650);
}

function tap() {
  if (phase !== "playing" && phase !== "countin") return;
  const time = transport.now() - offset;
  $("hit-pad").classList.add("pressed");
  clearTimeout(padTimer);
  padTimer = setTimeout(() => $("hit-pad").classList.remove("pressed"), 95);
  // Count-in is free practice; the first note can be hit up to 125 ms early.
  judge(engine.tap(time));
  updateHud(transport.now());
}

function finish() {
  transport.stop();
  setPhase("finished");
  clearFeedback();
  const result = engine.summary();
  $("grade").textContent = result.grade;
  $("result-score").textContent = result.score.toLocaleString();
  $("result-song").textContent = `${selected.title} · ${$("speed").value}×`;
  $("result-accuracy").textContent = `${result.accuracy.toFixed(1)}%`;
  $("result-combo").textContent = `${result.maxCombo} ×`;
  $("result-counts").replaceChildren();
  for (const [key, label] of [
    ["perfect", "PERFECT"],
    ["good", "GOOD"],
    ["miss", "漏拍"],
    ["stray", "错拍"],
  ]) {
    const item = document.createElement("div");
    item.textContent = label;
    const count = document.createElement("b");
    count.textContent = result.counts[key];
    item.append(count);
    $("result-counts").append(item);
  }
  $("result-advice").textContent =
    result.accuracy >= 90
      ? "节奏就在你的指尖。要不要换一首，或试试 1.25×？"
      : result.meanOffset !== null && Math.abs(result.meanOffset) > 35
        ? `你的命中平均${result.meanOffset < 0 ? "提前" : "延后"} ${Math.round(Math.abs(result.meanOffset))} ms。试着跟着琴声按，或在选曲区微调延迟。`
        : "试试 0.75× 慢练。长音只按一次，休止时留一点空白，下一拍会更从容。";
  $("results").showModal();
}

let hudFrame = 0;
function frame(timestamp) {
  const active = phase === "playing" || phase === "countin";
  // A badly stalled tab should not silently penalize a whole phrase.
  if (active && timestamp - lastFrame > 1000) {
    pause();
    $("notice").textContent = "检测到页面中断，已暂停。可以继续，或重新开始。";
  }
  lastFrame = timestamp;
  const running = phase === "playing" || phase === "countin";
  const time =
    running || phase === "paused" || phase === "pausing"
      ? transport.now()
      : phase === "finished"
        ? chart.duration
        : -chart.beat * 2.5;
  if (running) {
    const judgedTime = time - offset;
    if (phase === "countin" && judgedTime >= 0) {
      setPhase("playing");
      $("session-hint").textContent = "空格 / 点按下方节拍键 · Esc 或 P 暂停";
    }
    if (phase === "countin")
      $("count-value").textContent = Math.min(
        4,
        Math.max(1, Math.ceil(-judgedTime / chart.beat)),
      );
    judge(engine.advance(judgedTime));
    if (++hudFrame % 4 === 0) updateHud(time);
    if (time > chart.duration + 0.5 && engine.complete) {
      updateHud(chart.duration);
      finish();
    }
  }
  view.draw(chart, engine.notes, time - (running ? offset : 0), running);
  requestAnimationFrame(frame);
}

$("start").addEventListener("click", start);
$("pause").addEventListener("click", togglePause);
$("back").addEventListener("click", ready);
$("retry").addEventListener("click", () => {
  ready();
  start();
});
$("choose").addEventListener("click", ready);
$("results").addEventListener("cancel", (event) => {
  event.preventDefault();
  ready();
});
$("speed").addEventListener("change", selectSong);
$("offset").addEventListener("input", () => {
  const value = Number($("offset").value);
  $("offset-value").textContent = `${value > 0 ? "+" : ""}${value} ms`;
});
$("mute").addEventListener("click", () => {
  transport.setMuted(!transport.muted);
  $("mute").textContent = `声音 · ${transport.muted ? "关" : "开"}`;
  $("mute").setAttribute("aria-pressed", String(transport.muted));
});

// Both input paths call the same judge at pointer/key DOWN, never at click/up.
$("hit-pad").addEventListener("pointerdown", (event) => {
  if (!event.isPrimary || event.button !== 0 || pointerHeld !== null) return;
  event.preventDefault();
  pointerHeld = event.pointerId;
  // Capture is optional: some mobile browsers can reject it. The hit and
  // window-level release handlers must still work when that happens.
  try {
    $("hit-pad").setPointerCapture(event.pointerId);
  } catch {
    /* pointerup / pointercancel on window still release the held pointer */
  }
  tap();
});
const releasePointer = (event) => {
  if (pointerHeld === event.pointerId) pointerHeld = null;
};
window.addEventListener("pointerup", releasePointer);
window.addEventListener("pointercancel", releasePointer);
$("hit-pad").addEventListener("lostpointercapture", releasePointer);
$("hit-pad").addEventListener("contextmenu", (event) => event.preventDefault());
$("hit-pad").addEventListener("click", (event) => {
  if (event.detail === 0 && !spaceHeld) tap();
});
document.addEventListener("keydown", (event) => {
  if (
    event.ctrlKey ||
    event.altKey ||
    event.metaKey ||
    /^(INPUT|SELECT|TEXTAREA)$/.test(event.target.tagName) ||
    $("results").open
  )
    return;
  if (event.code === "Space" && (phase === "playing" || phase === "countin")) {
    event.preventDefault();
    if (!event.repeat && !spaceHeld) {
      spaceHeld = true;
      tap();
    }
  } else if (
    (event.code === "Escape" || event.code === "KeyP") &&
    !event.repeat
  ) {
    event.preventDefault();
    togglePause();
  }
});
document.addEventListener("keyup", (event) => {
  if (event.code === "Space" && spaceHeld) {
    event.preventDefault();
    spaceHeld = false;
  }
});
function autoPause() {
  spaceHeld = false;
  pointerHeld = null;
  pause();
}
document.addEventListener("visibilitychange", () => {
  if (document.hidden) autoPause();
});
window.addEventListener("blur", autoPause);
transport.onInterrupt = autoPause;
// Reset before entering the back/forward cache so a restored page cannot keep
// a stale running state whose audio transport has already stopped.
window.addEventListener("pagehide", ready);

selectSong();
setPhase("ready");
$("start").textContent = "开始演奏 ↗";
requestAnimationFrame(frame);
