"use strict";

/* ========= 题库（由 data/*.js 以 <script> 注入到 window.TYPING_DATA） ========= */
let LETTERS, SYMBOLS_LC, SYMBOLS_UC, WORDS, SENTENCES, HANZI, HAN_SENTENCES;
const DIGITS = "0123456789".split("");

function loadData(){
  const d = window.TYPING_DATA || {};
  const l = d.letters || {};
  LETTERS = (l.letters || "").split("");
  SYMBOLS_LC = (l.symbolsNoShift || "").split("");
  SYMBOLS_UC = (l.symbolsShift || "").split("");
  WORDS = d.words || [];          // 格式: [{ word: "apple", meaning: "苹果" }, ...]
  SENTENCES = d.sentences || [];
  const c = d.chinese || {};
  HANZI = c.characters || [];
  HAN_SENTENCES = c.sentences || [];
}

/* ========= 阶段配置 ========= */
function getStages(){
  return [
    { id:1, title:"字母 / 数字 · 会发声", desc:"出现一个大写字母或数字，按下对应键即可（不区分大小写），每个键有固定音符。", mode:"react", ci:true,  rounds:20 },
    { id:2, title:"单字母 · 区分大小写",   desc:"出现字母或符号，必须按对大小写（大写要按 Shift，符号也要 Shift）。", mode:"react", ci:false, rounds:20 },
    { id:3, title:"单词打字",             desc:"完整打出一个英文单词。", mode:"word",  rounds:15 },
    { id:4, title:"句子打字",             desc:"完整打出一句话（含空格）。", mode:"word",  rounds:10 },
    { id:5, title:"单字 · 中文",           desc:"出现一个汉字，用拼音输入法打出来。", mode:"ime",   rounds:20, pool:HANZI },
    { id:6, title:"中文句子",             desc:"出现一句中文，用拼音输入法打完整句。", mode:"ime",   rounds:8,  pool:HAN_SENTENCES },
  ];
}
// 中文阶段的题库必须在阶段配置创建前加载。
loadData();
const STAGES = getStages();

/* ========= 状态 ========= */
let current = null;             // 当前 stage 配置
let queue = [];                 // 本轮题目
let qIdx = 0;
let roundTimes = [];            // 本轮每次记录
let itemStart = 0;
let itemPenalty = 0;            // 当前题罚时 ms
let timerInterval = null;       // 实时计时器
let nextItemTimeout = null;     // 答对后的切题延迟
let awaitingNextItem = false;   // 切题动画期间不再接受答案
let typedCount = 0;             // word 模式已正确键入数
let composing = false;          // ime 模式合成中
let scaleTimer = null;          // 对照表「依次播放全部」定时器

/* ========= DOM ========= */
const $ = (id) => document.getElementById(id);
const menuEl = $("menu");
const practiceEl = $("practice");
const resultsEl = $("results");
const targetEl = $("target");
const targetBox = $("targetBox");
const noteBadge = $("noteBadge");
const staffPanel = $("staffPanel");
const noteChartEl = $("notechart");
const imeInput = $("imeInput");
const timerLine = $("timerLine");
const hintEl = $("hint");
const progressEl = $("progress");
const stageLabel = $("stageLabel");

/* ========= 工具 ========= */
function rand(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

function pick(stage){
  if(stage.mode === "react"){
    if(stage.id === 1) return rand(LETTERS.concat(DIGITS)); // 26 字母 + 10 数字，每个键都有固定音符
    if(Math.random()<0.6){
      const L = rand(LETTERS);
      return Math.random()<0.5 ? L : L.toUpperCase();
    }
    return rand(SYMBOLS_UC);
  }
  if(stage.id === 3) return rand(WORDS); // 返回对象 { word, meaning }
  if(stage.id === 4) return rand(SENTENCES);
  if(stage.mode === "ime") return rand(stage.pool);
}

function toast(msg, bad){
  const t = $("toast");
  t.textContent = msg;
  t.className = "toast show" + (bad ? " bad" : "");
  clearTimeout(toast._t);
  toast._t = setTimeout(()=> t.className = "toast" + (bad?" bad":""), 1600);
}

/* ========= 清理旧版成绩（不再读取、保存历史，也不访问本地文件） ========= */
function clearLegacyScores(){
  try{ localStorage.removeItem("typing_scores"); }catch(e){}
  try{ window.indexedDB.deleteDatabase("typing_scores"); }catch(e){}
}

/* ========= 菜单 ========= */
function renderMenu(){
  hideAll(); menuEl.style.display = "grid";
  menuEl.innerHTML = "";
  STAGES.forEach(s=>{
    const card = document.createElement("div");
    card.className = "stage-card";
    card.innerHTML =
      `<span class="num">${s.id}</span><span class="title">${s.title}</span>` +
      `<div class="desc">${s.desc}</div>`;
    card.onclick = ()=> startStage(s);
    menuEl.appendChild(card);
  });
}
function hideAll(){
  clearInterval(timerInterval);
  clearTimeout(nextItemTimeout);
  timerInterval = null;
  nextItemTimeout = null;
  awaitingNextItem = false;
  menuEl.style.display = "none";
  practiceEl.classList.remove("active");
  resultsEl.classList.remove("active");
  if(noteChartEl) noteChartEl.classList.remove("active");
  if(scaleTimer){ clearInterval(scaleTimer); scaleTimer = null; }
}
/* ========= 音符对照表（每个键 -> 音符 + 五线谱，可点击试听） ========= */
function renderNoteChart(){
  hideAll();
  if(!noteChartEl) return;
  noteChartEl.classList.add("active");
  if(window.SoundFX) window.SoundFX.resume();
  const order = window.KEY_ORDER || [];
  const map = window.NOTE_MAP || {};
  let cells = "";
  order.forEach(k=>{
    const note = map[k];
    if(!note) return;
    const staff = window.renderNoteStaff ? window.renderNoteStaff(note, { mini:true }) : "";
    cells += `<div class="nc-cell" data-key="${k}" role="button" tabindex="0" title="点击试听 ${note.name} · ${note.solfege}">`
      + `<div class="nc-key">${k}</div>`
      + `<div class="nc-staff">${staff}</div>`
      + `<div class="nc-note">${note.name} · ${note.solfege}</div>`
      + `<div class="nc-hz">${Math.round(note.freq)} Hz</div>`
      + `</div>`;
  });
  noteChartEl.innerHTML =
    `<h3>音符对照表 · 从高音 do 到低音 do</h3>`
    + `<div class="nc-sub">按键顺序 A–Z、0–9，每个键固定一个音符。`
    + `<b>点击任意方格即可试听</b>，也可以直接按键盘上的键（点右上角 🔊 可开关声音）</div>`
    + `<div class="nc-grid">${cells}</div>`
    + `<div class="btns">`
    + `<button id="btnPlayScale">▶ 依次播放全部</button>`
    + `<button class="ghost" onclick="renderMenu()">返回菜单</button>`
    + `</div>`;

  noteChartEl.querySelectorAll(".nc-cell").forEach(cell=>{
    cell.onclick = ()=> previewKey(cell.dataset.key);
    cell.onkeydown = (e)=>{
      if(e.key === "Enter" || e.key === " "){ e.preventDefault(); previewKey(cell.dataset.key); }
    };
  });
  const btnScale = $("btnPlayScale");
  if(btnScale) btnScale.onclick = playAllNotes;
}

// 在对照表里试听某个键：播放声音 + 高亮该格
function previewKey(k){
  if(!k || !window.SoundFX) return;
  window.SoundFX.resume();
  const prevEnabled = window.SoundFX.enabled;
  if(!prevEnabled) toast("声音已关闭，点右上角 🔊 开启", true);
  window.SoundFX.playKey(k);
  const cell = noteChartEl && noteChartEl.querySelector(`.nc-cell[data-key="${k}"]`);
  if(cell){
    cell.classList.remove("playing");
    void cell.offsetWidth;
    cell.classList.add("playing");
    setTimeout(()=> cell.classList.remove("playing"), 420);
  }
}

// 从高音到低音依次播放全部 36 个音
function playAllNotes(){
  const order = window.KEY_ORDER || [];
  const btn = $("btnPlayScale");
  if(scaleTimer){ // 再次点击则停止
    clearInterval(scaleTimer); scaleTimer = null;
    if(btn) btn.textContent = "▶ 依次播放全部";
    return;
  }
  if(window.SoundFX) window.SoundFX.resume();
  if(btn) btn.textContent = "■ 停止播放";
  let i = 0;
  previewKey(order[i++]);
  scaleTimer = setInterval(()=>{
    if(i >= order.length){
      clearInterval(scaleTimer); scaleTimer = null;
      if(btn) btn.textContent = "▶ 依次播放全部";
      return;
    }
    previewKey(order[i++]);
  }, 320);
}

/* ========= 开始阶段 ========= */
function startStage(stage){
  current = stage;
  if(window.SoundFX) window.SoundFX.resume();
  queue = [];
  for(let i=0;i<stage.rounds;i++) queue.push(pick(stage));
  qIdx = 0; roundTimes = [];
  hideAll();
  practiceEl.classList.add("active");
  // 避免重新开始按钮保留焦点，打空格时意外再次触发按钮。
  if(document.activeElement instanceof HTMLElement) document.activeElement.blur();
  stageLabel.innerHTML = `阶段 ${stage.id}：<b>${stage.title}</b>`;
  imeInput.style.display = "none";
  $("btnAgain").style.display = "";
  renderProgress();
  nextItem();
}

function renderProgress(){
  progressEl.innerHTML = "";
  for(let i=0;i<queue.length;i++){
    const dot = document.createElement("i");
    if(i < qIdx) dot.className = "done";
    progressEl.appendChild(dot);
  }
}

function updateLiveTimer(){
  const elapsed = performance.now() - itemStart + itemPenalty;
  const penaltyText = itemPenalty > 0 ? `<span class="penalty">+${(itemPenalty/1000).toFixed(1)}秒</span>` : "";
  $("liveTimer").innerHTML = (elapsed/1000).toFixed(2) + " 秒 " + penaltyText;
}

function scheduleNextItem(delay){
  awaitingNextItem = true;
  nextItemTimeout = setTimeout(()=>{
    nextItemTimeout = null;
    if(practiceEl.classList.contains("active")) nextItem();
  }, delay);
}

function nextItem(){
  awaitingNextItem = false;
  if(qIdx >= queue.length){ finishRound(); return; }
  if(timerInterval) clearInterval(timerInterval);
  renderProgress();
  const item = queue[qIdx];
  typedCount = 0; itemPenalty = 0;
  targetBox.classList.remove("flash-bad","flash-ok");

  if(current.mode === "ime"){
    targetEl.innerHTML = `<span class="rest">${item}</span>`;
    imeInput.value = "";
    imeInput.classList.remove("wrong");
    imeInput.style.display = "block";
    imeInput.focus();
    hintEl.textContent = "用拼音输入法打出来，按错加 0.5秒";
    displayNote(null);
  } else if(current.mode === "word"){
    // item 可能是字符串（句子）或对象（带释义的单词）
    const displayText = typeof item === "object" ? item.word : item;
    const meaning = typeof item === "object" ? item.meaning : "";
    renderWordTarget(displayText, 0, meaning);
    hintEl.textContent = meaning || "按错每次加 0.5秒";
    displayNote(noteFor(displayText[0])); // 显示当前要打的字母对应的音
  } else { // react
    const shown = current.ci ? String(item).toUpperCase() : String(item);
    targetEl.innerHTML = `<span class="cur">${escapeHtml(shown)}</span>`;
    hintEl.textContent = current.ci ? "不区分大小写，按错加 0.5秒" : "区分大小写，按错加 0.5秒";
    displayNote(noteFor(item)); // 一出题就显示目标音符（五线谱）
  }
  timerLine.innerHTML = `第 ${qIdx+1} / ${queue.length} 题`;
  itemStart = performance.now();
  updateLiveTimer();
  timerInterval = setInterval(updateLiveTimer, 100);
}

function renderWordTarget(item, cursor, meaning){
  let html = "";
  for(let i=0;i<item.length;i++){
    if(i < cursor) html += `<span class="ok">${escapeHtml(item[i])}</span>`;
    else if(i === cursor) html += `<span class="cur">${escapeHtml(item[i])}</span>`;
    else html += `<span class="rest">${escapeHtml(item[i])}</span>`;
  }
  if(meaning) html += `<div style="font-size:18px;margin-top:12px;color:var(--muted);">${meaning}</div>`;
  targetEl.innerHTML = html;
}
function escapeHtml(ch){
  if(ch === " ") return "·";  // 空格用 · 占位显示
  return ch.replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;" }[c]));
}

/* ========= 输入处理 ========= */
document.addEventListener("keydown", onKeydown);
function onKeydown(e){
  if(e.metaKey || e.ctrlKey || e.altKey) return;
  if(e.repeat) return;

  // 在音符对照表页面，直接按键盘即可试听
  if(noteChartEl && noteChartEl.classList.contains("active")){
    if(e.key.length !== 1) return;
    const k = e.key.toUpperCase();
    if(window.NOTE_MAP && window.NOTE_MAP[k]){ e.preventDefault(); previewKey(k); }
    return;
  }

  if(!current || !practiceEl.classList.contains("active")) return;
  if(current.mode === "ime") return; // ime 用 input 事件
  if(e.key.length !== 1 && e.key !== " ") return;
  const key = e.key === " " ? " " : e.key;
  // 播放该键对应的固定音符（字母/数字才有音），并让当前音符提示跳动一下
  const played = window.SoundFX ? window.SoundFX.playKey(key) : null;
  if(played) pulseBadge();
  if(current.mode === "react"){
    e.preventDefault();
    handleReact(key);
  } else if(current.mode === "word"){
    e.preventDefault();
    handleWord(key);
  }
}

function noteFor(ch){
  return (window.SoundFX && ch != null) ? window.SoundFX.noteForKey(String(ch)) : null;
}

// 显示某个音符（角标 + 五线谱）；传入 null 则清空
function displayNote(note){
  if(!note){
    if(noteBadge) noteBadge.textContent = "";
    if(staffPanel) staffPanel.innerHTML = "";
    return;
  }
  if(noteBadge) noteBadge.textContent = `🎵 ${note.name} · ${note.solfege}`;
  if(staffPanel && window.renderNoteStaff){
    staffPanel.innerHTML = window.renderNoteStaff(note)
      + `<div class="staff-cap">${note.name} · ${note.solfege}</div>`;
  }
}

// 只做跳动动画，不改变显示的音符
function pulseBadge(){
  if(!noteBadge) return;
  noteBadge.classList.remove("pulse");
  void noteBadge.offsetWidth; // 触发重绘以重启动画
  noteBadge.classList.add("pulse");
}

function handleReact(key){
  if(awaitingNextItem || qIdx >= queue.length) return;
  const target = queue[qIdx];
  if(!target) return;
  let match;
  if(current.ci){
    match = key.toLowerCase() === target.toLowerCase();
  } else {
    match = key === target;
  }
  if(match){
    clearInterval(timerInterval);
    const t = performance.now() - itemStart + itemPenalty;
    targetBox.classList.add("flash-ok");
    roundTimes.push(t);
    qIdx++;
    scheduleNextItem(180);
  } else {
    itemPenalty += 500;
    updateLiveTimer();
    targetBox.classList.add("flash-bad");
    targetEl.querySelector(".cur")?.classList.add("wrongflash");
    setTimeout(()=> targetBox.classList.remove("flash-bad"), 200);
  }
}

function handleWord(key){
  if(awaitingNextItem || qIdx >= queue.length) return;
  const item = queue[qIdx];
  if(!item) return;
  const target = typeof item === "object" ? item.word : item;
  const meaning = typeof item === "object" ? item.meaning : "";
  const expected = target[typedCount];
  if(key === expected || (current.ci && key.toLowerCase() === expected.toLowerCase())){
    typedCount++;
    renderWordTarget(target, typedCount, meaning);
    if(typedCount >= target.length){
      clearInterval(timerInterval);
      const t = performance.now() - itemStart + itemPenalty;
      roundTimes.push(t);
      qIdx++;
      targetBox.classList.add("flash-ok");
      scheduleNextItem(220);
    } else {
      displayNote(noteFor(target[typedCount])); // 显示下一个要打的字母的音
    }
  } else {
    itemPenalty += 500;
    updateLiveTimer();
    targetBox.classList.add("flash-bad");
    const cur = targetEl.querySelector(".cur");
    if(cur) cur.classList.add("wrongflash");
    setTimeout(()=>{ targetBox.classList.remove("flash-bad"); }, 180);
  }
}

/* IME 输入 */
imeInput.addEventListener("compositionstart", ()=> composing = true);
imeInput.addEventListener("compositionend", ()=> { composing = false; checkIme(); });
imeInput.addEventListener("input", ()=> { if(!composing) checkIme(); });
imeInput.addEventListener("keydown", (e)=>{
  if(e.key === "Enter" && !e.isComposing && !composing){ e.preventDefault(); checkIme(); }
});
function checkIme(){
  if(!current || current.mode !== "ime" || composing || awaitingNextItem
    || !practiceEl.classList.contains("active") || qIdx >= queue.length) return;
  const target = queue[qIdx];
  const val = imeInput.value;
  if(val === target){
    clearInterval(timerInterval);
    const t = performance.now() - itemStart + itemPenalty;
    roundTimes.push(t);
    qIdx++;
    targetBox.classList.add("flash-ok");
    scheduleNextItem(220);
  } else if(val && !target.startsWith(val)){
    itemPenalty += 500;
    updateLiveTimer();
    imeInput.classList.add("wrong");
  } else {
    imeInput.classList.remove("wrong");
  }
}

/* ========= 结束本轮 ========= */
function finishRound(){
  if(timerInterval) clearInterval(timerInterval);
  hideAll();
  resultsEl.classList.add("active");
  const times = roundTimes.slice();
  const avg = times.length ? times.reduce((a,b)=>a+b,0)/times.length : 0;
  const best = times.length ? Math.min(...times) : 0;
  $("resTitle").textContent = `阶段 ${current.id} 完成！`;
  $("resBig").innerHTML = `平均 ${(avg/1000).toFixed(2)} 秒`;
  $("resSub").textContent = `本轮最快 ${(best/1000).toFixed(2)} 秒　·　共 ${times.length} 题`;
}

/* ========= 按钮绑定 ========= */
function updateSoundBtn(){
  const b = $("btnSound");
  if(!b || !window.SoundFX) return;
  b.textContent = window.SoundFX.enabled ? "🔊 声音：开" : "🔇 声音：关";
}
$("btnSound").onclick = ()=>{
  if(!window.SoundFX) return;
  const on = window.SoundFX.toggle();
  updateSoundBtn();
  toast(on ? "声音已开启" : "声音已关闭");
};
$("btnNoteChart").onclick = renderNoteChart;
$("btnAgain").onclick = ()=> startStage(current);
$("btnBack").onclick = renderMenu;
$("btnNext").onclick = ()=> startStage(current);
$("btnResBack").onclick = renderMenu;

/* ========= 启动 ========= */
clearLegacyScores();
renderMenu();
updateSoundBtn();
