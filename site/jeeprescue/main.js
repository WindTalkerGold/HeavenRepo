import { Game, inside, BASE } from './engine.js';
import { Renderer } from './renderer.js';
const $ = id => document.getElementById(id);
const game = new Game();
const renderer = new Renderer($('game'), $('minimap'));
const keys = new Set();
const pointer = { down: false, grenade: false, queuedAim: false, x: 0, y: 0 };
let last = performance.now(), toastUntil = 0, lastMode = '', best = 0, soundEnabled = true;
let grenadeQueued = false, fireQueued = false;
try { best = Number(localStorage.getItem('jeep-rescue-best')) || 0; soundEnabled = localStorage.getItem('jeep-rescue-sound') !== 'off'; } catch { /* Storage is optional. */ }
class Sound {
  constructor() { this.context = null; }
  unlock() {
    if (!soundEnabled) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.context ||= new AudioContext();
      if (this.context.state === 'suspended') this.context.resume().catch(() => {});
    } catch { /* Audio is optional on restricted webviews. */ }
  }
  play(type) {
    const ctx = this.context;
    if (!soundEnabled || !ctx || ctx.state !== 'running') return;
    const now = ctx.currentTime;
    const tones = { shoot: [155, 60, 0.045, 'square', 0.023], throw: [410, 160, 0.13, 'triangle', 0.07], rescue: [590, 900, 0.13, 'sine', 0.07], deliver: [520, 1040, 0.3, 'triangle', 0.065], pickup: [420, 780, 0.2, 'sine', 0.07], hurt: [120, 55, 0.16, 'sawtooth', 0.065], destroy: [95, 32, 0.23, 'sawtooth', 0.07], explode: [90, 25, 0.34, 'sawtooth', 0.09], lose: [180, 40, 0.6, 'triangle', 0.1], win: [440, 880, 0.6, 'triangle', 0.1] };
    const [start, end, duration, wave, volume] = tones[type] || tones.pickup;
    const osc = ctx.createOscillator(), gain = ctx.createGain();
    osc.type = wave; osc.frequency.setValueAtTime(start, now); osc.frequency.exponentialRampToValueAtTime(end, now + duration);
    gain.gain.setValueAtTime(volume, now); gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.connect(gain); gain.connect(ctx.destination); osc.start(now); osc.stop(now + duration);
  }
}
const sound = new Sound();
function updateSoundButton() { $('sound').textContent = soundEnabled ? 'SOUND ON' : 'SOUND OFF'; $('sound').setAttribute('aria-pressed', String(soundEnabled)); }
function toggleSound() {
  soundEnabled = !soundEnabled;
  try { localStorage.setItem('jeep-rescue-sound', soundEnabled ? 'on' : 'off'); } catch {}
  updateSoundButton(); sound.unlock();
}
function clearInput() { keys.clear(); pointer.down = false; pointer.grenade = false; pointer.queuedAim = false; grenadeQueued = false; fireQueued = false; }
function begin() {
  clearInput(); sound.unlock();
  if (game.mode === 'paused') game.pause();
  else { game.reset(); game.start(); }
  lastMode = ''; toastUntil = 0; $('toast').classList.remove('show');
  $('game').focus({ preventScroll: true });
  syncUI();
}
function pause() {
  if (game.mode !== 'playing' && game.mode !== 'paused') return;
  game.pause(); clearInput(); sound.unlock(); syncUI();
  if (game.mode === 'playing') $('game').focus({ preventScroll: true });
}
function restart() {
  if (game.mode === 'ready') { begin(); return; }
  if (game.mode === 'won' || game.mode === 'lost') { begin(); return; }
  game.mode = 'paused'; clearInput(); syncUI();
  $('overlay-tag').textContent = 'RESTART MISSION?';
  $('overlay-title').innerHTML = 'A FRESH<br><em>START.</em>';
  $('overlay-copy').textContent = 'Restart clears your current mission progress. Press P or Escape to go back, or deploy again below.';
  $('start').innerHTML = 'RESTART MISSION <span>↗</span>';
  $('start').onclick = () => { game.reset(); begin(); };
}
$('start').onclick = begin; $('pause').onclick = pause; $('restart').onclick = restart; $('sound').onclick = toggleSound;
const captured = new Set(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'KeyW', 'KeyA', 'KeyS', 'KeyD', 'KeyZ', 'KeyJ', 'KeyX', 'KeyE', 'KeyP', 'Escape', 'KeyR', 'KeyM', 'Enter']);
window.addEventListener('keydown', event => {
  if (event.ctrlKey || event.altKey || event.metaKey) return;
  if (captured.has(event.code)) event.preventDefault();
  if (!event.repeat) {
    if (event.code === 'Enter' && game.mode !== 'playing') { $('start').click(); return; }
    if (event.code === 'KeyP' || event.code === 'Escape') { pause(); return; }
    if (event.code === 'KeyR') { restart(); return; }
    if (event.code === 'KeyM') { toggleSound(); return; }
    if (game.mode === 'playing' && ['KeyX', 'KeyE'].includes(event.code)) grenadeQueued = true;
    if (game.mode === 'playing' && ['Space', 'KeyZ', 'KeyJ'].includes(event.code)) fireQueued = true;
  }
  keys.add(event.code);
});
window.addEventListener('keyup', event => keys.delete(event.code));
window.addEventListener('blur', () => { clearInput(); if (game.mode === 'playing') pause(); });
document.addEventListener('visibilitychange', () => { if (document.hidden && game.mode === 'playing') pause(); });
$('game').addEventListener('contextmenu', e => e.preventDefault());
function point(event) {
  const box = $('game').getBoundingClientRect();
  pointer.x = (event.clientX - box.left) * $('game').width / box.width;
  pointer.y = (event.clientY - box.top) * $('game').height / box.height;
}
$('game').addEventListener('pointerdown', e => {
  if (game.mode !== 'playing') return;
  point(e); pointer.queuedAim = true; sound.unlock(); $('game').focus({ preventScroll: true });
  if (e.button === 0) { pointer.down = true; fireQueued = true; }
  if (e.button === 2) { pointer.grenade = true; grenadeQueued = true; }
  try { $('game').setPointerCapture(e.pointerId); } catch {}
  e.preventDefault();
});
$('game').addEventListener('pointermove', point);
window.addEventListener('pointerup', e => { if (e.button === 0) pointer.down = false; if (e.button === 2) pointer.grenade = false; });
$('game').addEventListener('pointercancel', clearInput);
function pressed(...codes) { return codes.some(code => keys.has(code)); }
function input() {
  const state = {
    x: Number(pressed('ArrowRight', 'KeyD')) - Number(pressed('ArrowLeft', 'KeyA')),
    y: Number(pressed('ArrowDown', 'KeyS')) - Number(pressed('ArrowUp', 'KeyW')),
    fire: fireQueued || pressed('Space', 'KeyZ', 'KeyJ') || pointer.down,
    grenade: grenadeQueued || pressed('KeyX', 'KeyE') || pointer.grenade,
    aim: pointer.queuedAim || pointer.down || pointer.grenade ? renderer.screenToWorld(pointer.x, pointer.y) : null,
  };
  grenadeQueued = false; fireQueued = false; pointer.queuedAim = false;
  return state;
}
function updateOverlay() {
  const mode = game.mode;
  if (mode === lastMode) return;
  lastMode = mode;
  $('overlay').hidden = mode === 'playing';
  document.body.classList.toggle('paused', mode === 'paused');
  $('pause').disabled = !['playing', 'paused'].includes(mode);
  $('pause').innerHTML = mode === 'paused' ? 'RESUME <kbd>P</kbd>' : 'PAUSE <kbd>P</kbd>';
  $('briefing-goals').hidden = mode !== 'ready';
  $('start').onclick = begin;
  if (mode === 'ready') return;
  if (mode === 'playing') return;
  const won = mode === 'won';
  $('overlay-tag').textContent = mode === 'paused' ? 'RADIO SILENCE / PAUSED' : won ? 'MISSION ACCOMPLISHED' : 'MISSION FAILED / JEEP LOST';
  $('overlay-title').innerHTML = mode === 'paused' ? 'TAKE A<br><em>BREATHER.</em>' : won ? 'EVERYONE<br><em>MADE IT HOME.</em>' : 'DOWN, NOT<br><em>OUT.</em>';
  $('overlay-copy').textContent = mode === 'paused' ? 'Your mission is waiting. Resume when you’re ready.' : won ? `Six soldiers evacuated. Command tank destroyed. Final score: ${game.score.toLocaleString()}.` : `Score: ${game.score.toLocaleString()}. Try short rescue runs: extraction repairs armor and refills grenades.`;
  $('start').innerHTML = mode === 'paused' ? 'RESUME MISSION <span>↗</span>' : 'DEPLOY AGAIN <span>↗</span>';
  $('start-note').textContent = mode === 'paused' ? 'PRESS P / ESCAPE TO RESUME · R TO RESTART' : 'PRESS ENTER TO TRY ANOTHER RUN';
}
function syncUI() {
  const p = game.player;
  const hp = Math.ceil(p.hp);
  $('armor').textContent = hp; $('armor-bar').style.width = `${hp}%`;
  $('armor-bar').style.background = hp > 55 ? '#6ed2ae' : hp > 25 ? '#edc86f' : '#ed856b';
  $('rescued').textContent = game.delivered; $('cargo').textContent = p.cargo.length;
  $('grenades').textContent = p.grenades; $('score').textContent = String(game.score).padStart(6, '0');
  $('clock').textContent = `${String(Math.floor(game.time / 60)).padStart(2, '0')}:${String(Math.floor(game.time % 60)).padStart(2, '0')}`;
  $('objective').textContent = game.mode === 'ready' ? 'MISSION READY · DEPLOY WHEN READY' : game.objective().label;
  const dispatch = inside(p, BASE) ? 'Extraction is safe. Unload passengers, repair armor, and refill grenades here.' : p.cargo.length === 3 ? 'Seats full. Follow the green waypoint home. Passengers are safe aboard your jeep.' : p.hp < 35 ? 'Armor critical. Fall back to extraction or collect a repair crate marked with a cross.' : game.delivered === 6 ? 'All soldiers are safe. Use grenades against the command tank, then come home.' : p.y < 950 ? 'You crossed the river. The command tank is further north. Grenades do not hurt your passengers.' : 'The yellow squares are stranded soldiers. Follow the road north to cross the bridge.';
  $('dispatch').textContent = dispatch;
  if (game.score > best) {
    best = game.score;
    try { localStorage.setItem('jeep-rescue-best', String(best)); } catch {}
  }
  $('best').textContent = String(best).padStart(6, '0');
  updateOverlay();
}
function frame(now) {
  const dt = Math.min((now - last) / 1000, 1 / 30); last = now;
  game.update(dt, input());
  for (const event of game.takeEvents()) {
    sound.play(event.type);
    if (event.text) { $('toast').textContent = event.text; $('toast').classList.add('show'); toastUntil = now + 2700; }
  }
  if (now > toastUntil) $('toast').classList.remove('show');
  renderer.draw(game); syncUI();
  requestAnimationFrame(frame);
}
updateSoundButton(); syncUI(); requestAnimationFrame(frame);
// Exposed for local smoke tests and experimentation. No network or privileged APIs.
window.jeepRescue = { game, renderer, begin, pause };
