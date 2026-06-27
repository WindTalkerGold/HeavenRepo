"use strict";

/* ========= 题库（由 data/*.js 以 <script> 注入到 window.TYPING_DATA） ========= */
let LETTERS, SYMBOLS_LC, SYMBOLS_UC, WORDS, SENTENCES, HANZI, HAN_SENTENCES;

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
    { id:1, title:"单字母 · 不区分大小写", desc:"出现一个字母或符号，按下对应键即可（不区分大小写）。", mode:"react", ci:true,  rounds:20 },
    { id:2, title:"单字母 · 区分大小写",   desc:"出现字母或符号，必须按对大小写（大写要按 Shift，符号也要 Shift）。", mode:"react", ci:false, rounds:20 },
    { id:3, title:"单词打字",             desc:"完整打出一个英文单词。", mode:"word",  rounds:15 },
    { id:4, title:"句子打字",             desc:"完整打出一句话（含空格）。", mode:"word",  rounds:10 },
    { id:5, title:"单字 · 中文",           desc:"出现一个汉字，用拼音输入法打出来。", mode:"ime",   rounds:20, pool:HANZI },
    { id:6, title:"中文句子",             desc:"出现一句中文，用拼音输入法打完整句。", mode:"ime",   rounds:8,  pool:HAN_SENTENCES },
  ];
}
const STAGES = getStages();

/* ========= 状态 ========= */
let scores = loadMirror();      // { "<id>": [ {time, date}, ... ] }
let current = null;             // 当前 stage 配置
let queue = [];                 // 本轮题目
let qIdx = 0;
let roundTimes = [];            // 本轮每次记录
let itemStart = 0;
let itemPenalty = 0;            // 当前题罚时 ms
let timerInterval = null;       // 实时计时器
let typedCount = 0;             // word 模式已正确键入数
let composing = false;          // ime 模式合成中

/* ========= DOM ========= */
const $ = (id) => document.getElementById(id);
const menuEl = $("menu");
const practiceEl = $("practice");
const resultsEl = $("results");
const lbEl = $("leaderboard");
const targetEl = $("target");
const targetBox = $("targetBox");
const imeInput = $("imeInput");
const timerLine = $("timerLine");
const hintEl = $("hint");
const progressEl = $("progress");
const stageLabel = $("stageLabel");

/* ========= 工具 ========= */
function fmt(ms){
  return (ms/1000).toFixed(2) + " 秒";
}
function nowISO(){ return new Date().toISOString(); }
function rand(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

function pick(stage){
  if(stage.mode === "react"){
    if(stage.id === 1) return Math.random()<0.75 ? rand(LETTERS) : rand(SYMBOLS_LC);
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

/* ========= 成绩持久化 ========= */
const IDB_DB = "typing_scores";
const IDB_STORE = "kv";
const IDB_KEY = "fileHandle";

function idbOpen(){
  return new Promise((res, rej)=>{
    if(!indexedDB){ rej(new Error("no idb")); return; }
    const r = indexedDB.open(IDB_DB, 1);
    r.onupgradeneeded = ()=> r.result.createObjectStore(IDB_STORE);
    r.onsuccess = ()=> res(r.result);
    r.onerror = ()=> rej(r.error);
  });
}
async function idbGet(key){
  try{ const db = await idbOpen(); return await new Promise((res,rej)=>{ const tx=db.transaction(IDB_STORE,"readonly"); const rq=tx.objectStore(IDB_STORE).get(key); rq.onsuccess=()=>res(rq.result); rq.onerror=()=>rej(rq.error); }); }catch(e){ return undefined; }
}
async function idbSet(key, val){
  try{ const db = await idbOpen(); await new Promise((res,rej)=>{ const tx=db.transaction(IDB_STORE,"readwrite"); tx.objectStore(IDB_STORE).put(val,key); tx.oncomplete=()=>res(); tx.onerror=()=>rej(tx.error); }); }catch(e){}
}

let fileHandle = null;
let fsSupported = typeof window !== "undefined" && "showSaveFilePicker" in window;

function loadMirror(){
  try{ return JSON.parse(localStorage.getItem("typing_scores") || "{}"); }
  catch(e){ return {}; }
}
function saveMirror(){
  try{ localStorage.setItem("typing_scores", JSON.stringify(scores)); }catch(e){}
}

async function persist(){
  saveMirror();
  if(fileHandle){
    try{
      const w = await fileHandle.createWritable();
      await w.write(JSON.stringify(scores, null, 2));
      await w.close();
    }catch(e){ console.warn("write file failed", e); }
  }
}

async function ensureFilePermissions(){
  if(!fileHandle) return false;
  const opts = { mode: "readwrite" };
  if(await fileHandle.queryPermission(opts) === "granted") return true;
  if(await fileHandle.requestPermission(opts) === "granted") return true;
  return false;
}

async function readScoresFromHandle(){
  try{
    const f = await fileHandle.getFile();
    const txt = await f.text();
    if(txt && txt.trim()){
      const obj = JSON.parse(txt);
      for(const k of Object.keys(obj)){ scores[k] = obj[k]; }
    }
  }catch(e){ console.warn("read file failed", e); }
}

async function pickFile(){
  if(!fsSupported){
    toast("当前浏览器不支持文件写入，已用本地存储保存", true);
    return;
  }
  try{
    const h = await window.showSaveFilePicker({
      suggestedName: "typing-scores.json",
      types: [{ description: "JSON 成绩文件", accept: { "application/json": [".json"] } }]
    });
    fileHandle = h;
    await idbSet(IDB_KEY, h);
    await readScoresFromHandle();
    await persist();
    updateFileStatus();
    toast("成绩文件已连接");
    renderMenu();
  }catch(e){
    if(e && e.name !== "AbortError") toast("选择文件失败", true);
  }
}

async function initFile(){
  if(!fsSupported){ updateFileStatus(); return; }
  try{
    const h = await idbGet(IDB_KEY);
    if(h){ fileHandle = h; }
  }catch(e){}
  if(fileHandle){
    const ok = await ensureFilePermissions();
    if(ok){
      await readScoresFromHandle();
      saveMirror();
    }
  }
  updateFileStatus();
}

function updateFileStatus(){
  const el = $("filestatus");
  if(!fsSupported){
    el.textContent = "本地存储模式（浏览器不支持文件写入）";
    el.className = "filestatus warn";
  } else if(fileHandle){
    el.textContent = "成绩文件：已连接 " + (fileHandle.name || "scores.json");
    el.className = "filestatus ok";
  } else {
    el.textContent = "成绩文件：未连接（点击下方选择/新建）";
    el.className = "filestatus warn";
  }
}

/* ========= 菜单 ========= */
function renderMenu(){
  hideAll(); menuEl.style.display = "grid";
  lbEl.classList.remove("active"); lbEl.innerHTML = "";
  menuEl.innerHTML = "";
  STAGES.forEach(s=>{
    const card = document.createElement("div");
    card.className = "stage-card";
    const best = bestOf(s.id);
    card.innerHTML =
      `<span class="num">${s.id}</span><span class="title">${s.title}</span>` +
      `<div class="desc">${s.desc}</div>` +
      `<div class="best">最快：${best ? fmt(best) : "暂无"}　·　共 ${countOf(s.id)} 次记录</div>`;
    card.onclick = ()=> startStage(s);
    menuEl.appendChild(card);
  });
}
function hideAll(){
  menuEl.style.display = "none";
  practiceEl.classList.remove("active");
  resultsEl.classList.remove("active");
  lbEl.classList.remove("active");
}
function bestOf(id){ const a = scores[id] || []; return a.length ? a[0].time : null; }
function countOf(id){ return (scores[id] || []).length; }
function addScore(id, time){
  const a = scores[id] || [];
  a.push({ time: Math.round(time), date: nowISO() });
  a.sort((x,y)=> x.time - y.time);
  scores[id] = a.slice(0, 10);
  persist();
}

/* ========= 排行榜 ========= */
function renderLeaderboard(){
  hideAll();
  lbEl.classList.add("active");
  lbEl.innerHTML = "";
  STAGES.forEach(s=>{
    const a = scores[s.id] || [];
    const div = document.createElement("div");
    div.className = "lb-stage";
    let rows = "";
    if(a.length === 0){
      rows = `<div class="empty">还没有成绩，去练一练吧！</div>`;
    } else {
      rows = "<table><tr><th>#</th><th>成绩</th><th>日期</th></tr>";
      a.forEach((r,i)=>{
        rows += `<tr><td>${i+1}</td><td class="t">${fmt(r.time)}</td><td class="t">${r.date.slice(0,16).replace("T"," ")}</td></tr>`;
      });
      rows += "</table>";
    }
    div.innerHTML = `<h3>阶段 ${s.id} · ${s.title}</h3>${rows}`;
    lbEl.appendChild(div);
  });
  lbEl.innerHTML += `<div class="btns"><button class="ghost" onclick="renderMenu()">返回菜单</button></div>`;
}

/* ========= 开始阶段 ========= */
function startStage(stage){
  current = stage;
  queue = [];
  for(let i=0;i<stage.rounds;i++) queue.push(pick(stage));
  qIdx = 0; roundTimes = [];
  hideAll();
  practiceEl.classList.add("active");
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

function nextItem(){
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
  } else if(current.mode === "word"){
    // item 可能是字符串（句子）或对象（带释义的单词）
    const displayText = typeof item === "object" ? item.word : item;
    const meaning = typeof item === "object" ? item.meaning : "";
    renderWordTarget(displayText, 0, meaning);
    hintEl.textContent = meaning || "按错每次加 0.5秒";
  } else { // react
    targetEl.innerHTML = `<span class="cur">${item}</span>`;
    hintEl.textContent = current.ci ? "不区分大小写，按错加 0.5秒" : "区分大小写，按错加 0.5秒";
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
  if(!current || !practiceEl.classList.contains("active")) return;
  if(current.mode === "ime") return; // ime 用 input 事件
  if(e.metaKey || e.ctrlKey || e.altKey) return;
  if(e.repeat) return;
  if(e.key.length !== 1 && e.key !== " ") return;
  const key = e.key === " " ? " " : e.key;
  if(current.mode === "react"){
    e.preventDefault();
    handleReact(key);
  } else if(current.mode === "word"){
    e.preventDefault();
    handleWord(key);
  }
}

function handleReact(key){
  const target = queue[qIdx];
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
    addScore(current.id, t);
    qIdx++;
    setTimeout(nextItem, 180);
  } else {
    itemPenalty += 500;
    updateLiveTimer();
    targetBox.classList.add("flash-bad");
    targetEl.querySelector(".cur")?.classList.add("wrongflash");
    setTimeout(()=> targetBox.classList.remove("flash-bad"), 200);
  }
}

function handleWord(key){
  const item = queue[qIdx];
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
      addScore(current.id, t);
      qIdx++;
      targetBox.classList.add("flash-ok");
      setTimeout(()=>{ targetBox.classList.remove("flash-ok"); nextItem(); }, 220);
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
  if(e.key === "Enter"){ e.preventDefault(); checkIme(); }
});
function checkIme(){
  if(!current || current.mode !== "ime") return;
  const target = queue[qIdx];
  const val = imeInput.value;
  if(val === target){
    clearInterval(timerInterval);
    const t = performance.now() - itemStart + itemPenalty;
    roundTimes.push(t);
    addScore(current.id, t);
    qIdx++;
    targetBox.classList.add("flash-ok");
    setTimeout(()=>{ targetBox.classList.remove("flash-ok"); nextItem(); }, 220);
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
  const prevBest = (() => { const a = scores[current.id]||[]; return a.length? a[0].time : Infinity; })();
  const isBest = best <= prevBest && times.length>0;
  $("resTitle").textContent = `阶段 ${current.id} 完成！`;
  $("resBig").innerHTML = `平均 ${(avg/1000).toFixed(2)} 秒`;
  $("resSub").innerHTML = `本轮最快 ${(best/1000).toFixed(2)} 秒　·　共 ${times.length} 题`
    + (isBest ? `　·　<span class="newbest">★ 创下新纪录！</span>` : "");
}

/* ========= 按钮绑定 ========= */
$("btnLeaderboard").onclick = renderLeaderboard;
$("btnPickFile").onclick = pickFile;
$("btnExport").onclick = ()=>{
  const blob = new Blob([JSON.stringify(scores, null, 2)], {type:"application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "typing-scores-backup.json";
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
  toast("已导出备份文件");
};
$("btnReset").onclick = ()=>{
  if(confirm("确定清空所有阶段的成绩记录吗？此操作不可撤销。")){
    scores = {};
    saveMirror();
    if(fileHandle) persist();
    toast("成绩已清空");
    renderMenu();
  }
};
$("btnAgain").onclick = ()=> startStage(current);
$("btnBack").onclick = renderMenu;
$("btnNext").onclick = ()=> startStage(current);
$("btnResBack").onclick = renderMenu;

/* ========= 启动 ========= */
loadData();
initFile().then(renderMenu);
