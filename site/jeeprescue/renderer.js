import { WORLD, BASE, BRIDGE, OBSTACLES, clamp, rng, distance } from './engine.js';
const TAU = Math.PI * 2;
const rect = (ctx, color, x, y, w, h) => { ctx.fillStyle = color; ctx.fillRect(x, y, w, h); };
function text(ctx, message, x, y, color = '#f3ecd1', size = 12, align = 'center') {
  ctx.fillStyle = color; ctx.font = `bold ${size}px monospace`; ctx.textAlign = align; ctx.fillText(message, x, y);
}
function palm(ctx, x, y, scale, seed) {
  ctx.save(); ctx.translate(x, y); ctx.scale(scale, scale);
  rect(ctx, '#293e35', 2, -1, 10, 34); rect(ctx, '#806340', -3, -6, 6, 32);
  for (let i = 0; i < 7; i++) {
    ctx.save(); ctx.rotate(i * TAU / 7 + seed);
    rect(ctx, '#304f38', 0, -6, 40, 13); rect(ctx, '#426a43', 1, -5, 33, 7); rect(ctx, '#57804a', 3, -4, 22, 3);
    ctx.restore();
  }
  rect(ctx, '#a3984d', -4, -4, 8, 8); ctx.restore();
}
function buildTerrain() {
  const canvas = document.createElement('canvas'); canvas.width = WORLD.width; canvas.height = WORLD.height;
  const ctx = canvas.getContext('2d'); const random = rng(911);
  rect(ctx, '#748259', 0, 0, canvas.width, canvas.height);
  const shades = ['#77865c', '#718057', '#798960', '#6e7e54'];
  for (let y = 0; y < WORLD.height; y += 32) for (let x = 0; x < WORLD.width; x += 32) {
    rect(ctx, shades[Math.floor(random() * shades.length)], x, y, 32, 32);
    if (random() > 0.4) rect(ctx, '#87956a', x + random() * 26, y + random() * 26, 3, 2);
  }
  // Winding service road connects the bridge, command post, and extraction.
  const road = new Path2D(); road.moveTo(640, 2300); road.bezierCurveTo(510, 1720, 855, 1600, 675, 1060); road.bezierCurveTo(710, 740, 560, 450, 650, 0);
  ctx.lineWidth = 170; ctx.strokeStyle = '#5c694c'; ctx.stroke(road);
  ctx.lineWidth = 154; ctx.strokeStyle = '#b1a072'; ctx.stroke(road);
  ctx.lineWidth = 125; ctx.strokeStyle = '#bbaa7a'; ctx.stroke(road);
  const spur = new Path2D(); spur.moveTo(650, 1670); spur.lineTo(330, 1660); spur.moveTo(710, 1310); spur.lineTo(995, 1310); spur.moveTo(610, 600); spur.lineTo(345, 600);
  ctx.lineWidth = 58; ctx.strokeStyle = '#a3946b'; ctx.stroke(spur);
  for (let i = 0; i < 160; i++) {
    const x = 565 + random() * 175, y = random() * WORLD.height;
    if (y > 970 && y < 1110) continue;
    rect(ctx, '#aa9869', x, y, 2 + random() * 8, 3);
  }
  rect(ctx, '#485f48', 0, 960, WORLD.width, 160);
  rect(ctx, '#305f62', 0, 980, WORLD.width, 120);
  rect(ctx, '#3b7373', 0, 987, WORLD.width, 106);
  for (let i = 0; i < 140; i++) rect(ctx, '#48827e', random() * WORLD.width, 990 + random() * 95, 10 + random() * 30, 2);
  rect(ctx, '#403f35', BRIDGE.x - 6, 955, BRIDGE.w + 12, 170);
  rect(ctx, '#9a855c', BRIDGE.x + 9, 955, BRIDGE.w - 18, 170);
  for (let y = 958; y < 1125; y += 11) rect(ctx, '#b1a070', BRIDGE.x + 10, y, BRIDGE.w - 20, 6);
  rect(ctx, '#d0bd85', BRIDGE.x, 957, 8, 166); rect(ctx, '#d0bd85', BRIDGE.x + BRIDGE.w - 8, 957, 8, 166);
  text(ctx, 'CROSSING  /  01', BRIDGE.x + BRIDGE.w / 2, 1150, '#d6dcb1', 12);
  // Extraction is always safe, repairs armor, and replenishes grenades.
  rect(ctx, '#41584a', BASE.x - 15, BASE.y - 15, BASE.w + 30, BASE.h + 30);
  rect(ctx, '#70886b', BASE.x, BASE.y, BASE.w, BASE.h);
  ctx.strokeStyle = '#b6dfae'; ctx.lineWidth = 3; ctx.setLineDash([12, 10]); ctx.strokeRect(BASE.x + 9, BASE.y + 9, BASE.w - 18, BASE.h - 18); ctx.setLineDash([]);
  ctx.strokeStyle = '#c2d7ac'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(640, 2010, 49, 0, TAU); ctx.stroke();
  rect(ctx, '#c2d7ac', 635, 1983, 10, 54); rect(ctx, '#c2d7ac', 619, 2005, 42, 10);
  text(ctx, 'EXTRACTION', 640, 1900, '#e6eaca', 16);
  text(ctx, 'SAFE ZONE · REPAIR + REARM', 640, 2146, '#e6eaca', 11);
  for (const [x, y, name] of [[340, 1660, 'OUTPOST A'], [955, 1310, 'OUTPOST B'], [365, 605, 'OUTPOST C']]) {
    rect(ctx, '#67724b', x - 92, y - 68, 185, 105);
    ctx.strokeStyle = '#d1b96b'; ctx.lineWidth = 2; ctx.setLineDash([5, 6]); ctx.strokeRect(x - 92, y - 68, 185, 105); ctx.setLineDash([]);
    text(ctx, name, x, y + 66, '#f4d583', 12);
    for (let j = 0; j < 3; j++) { rect(ctx, '#544d38', x - 80 + j * 20, y - 56, 16, 10); rect(ctx, '#9a8c58', x - 80 + j * 20, y - 58, 15, 8); }
  }
  rect(ctx, '#615e45', 520, 115, 260, 200);
  ctx.strokeStyle = '#b9825d'; ctx.lineWidth = 3; ctx.strokeRect(526, 121, 248, 188);
  text(ctx, 'ENEMY COMMAND', 650, 95, '#ffe0a8', 16);
  for (const box of OBSTACLES) {
    rect(ctx, '#3e4a39', box.x + 7, box.y + 9, box.w, box.h);
    if (box.type === 'bunker') {
      rect(ctx, '#464e43', box.x, box.y, box.w, box.h);
      rect(ctx, '#a39e7e', box.x + 4, box.y + 4, box.w - 8, box.h - 12);
      rect(ctx, '#888973', box.x + 12, box.y + 12, box.w - 24, box.h - 28);
      for (let x = box.x + 20; x < box.x + box.w - 20; x += 42) rect(ctx, '#4b584a', x, box.y + box.h - 18, 23, 8);
      rect(ctx, '#b6b191', box.x + 12, box.y + 10, box.w - 24, 5);
    } else {
      rect(ctx, '#747764', box.x, box.y + 9, box.w, box.h - 15);
      rect(ctx, '#94927a', box.x + 14, box.y, box.w - 26, box.h - 18);
      rect(ctx, '#aaab8b', box.x + 22, box.y + 8, box.w / 2, 10);
    }
  }
  for (let i = 0; i < 140; i++) {
    const x = 25 + random() * (WORLD.width - 50), y = 30 + random() * (WORLD.height - 60);
    if ((x > 240 && x < 1080) || (y > 920 && y < 1150)) continue;
    palm(ctx, x, y, 0.7 + random() * 0.65, random());
  }
  for (const [x, y] of [[425, 1790], [925, 1830], [200, 1350], [1110, 1430], [420, 835], [905, 855], [490, 450], [770, 350]]) palm(ctx, x, y, 1.05, 0.3);
  return canvas;
}
export class Renderer {
  constructor(canvas, minimap) {
    this.canvas = canvas; this.ctx = canvas.getContext('2d', { alpha: false }); this.minimap = minimap;
    this.terrain = buildTerrain(); this.camera = { x: 160, y: 1640 };
    this.ctx.imageSmoothingEnabled = false;
  }
  screenToWorld(x, y) { return { x: x + this.camera.x, y: y + this.camera.y }; }
  draw(game) {
    const { ctx, canvas } = this; const p = game.player;
    this.camera.x = clamp(p.x - canvas.width / 2, 0, WORLD.width - canvas.width);
    this.camera.y = clamp(p.y - canvas.height * 0.58, 0, WORLD.height - canvas.height);
    ctx.save(); ctx.translate(-Math.floor(this.camera.x), -Math.floor(this.camera.y));
    if (game.shake > 0) ctx.translate(Math.sin(game.time * 115) * game.shake, Math.cos(game.time * 130) * game.shake);
    ctx.drawImage(this.terrain, 0, 0);
    for (const pickup of game.pickups) if (!pickup.used) this.pickup(pickup, game.time);
    for (const enemy of game.enemies) if (enemy.dead) {
      rect(ctx, '#494636', enemy.x - enemy.radius, enemy.y - 10, enemy.radius * 2, 20);
      rect(ctx, '#61513c', enemy.x - 13, enemy.y - 15, 25, 26);
      rect(ctx, '#333e32', enemy.x - 4, enemy.y - 4, 10, 8);
    }
    for (const soldier of game.soldiers) if (soldier.status === 'waiting') this.soldier(soldier, game.time);
    for (const enemy of game.enemies) if (!enemy.dead && this.visible(enemy)) this.enemy(enemy, game);
    for (const bullet of game.bullets) {
      ctx.strokeStyle = bullet.friendly ? '#fff4b0' : '#ffb194'; ctx.lineWidth = bullet.friendly ? 4 : 6;
      ctx.beginPath(); ctx.moveTo(bullet.x, bullet.y); ctx.lineTo(bullet.x - bullet.vx * 0.013, bullet.y - bullet.vy * 0.013); ctx.stroke();
    }
    for (const grenade of game.grenades) {
      const hop = Math.sin(grenade.age / 0.62 * Math.PI) * 48;
      rect(ctx, '#4a553b', grenade.x - 4, grenade.y - 3, 10, 7);
      rect(ctx, '#f7d381', grenade.x - 5, grenade.y - hop - 7, 9, 10);
      rect(ctx, '#fff3a1', grenade.x - 2, grenade.y - hop - 10, 4, 4);
    }
    if (game.mode !== 'lost' || Math.floor(game.time * 8) % 2) this.jeep(p, game);
    for (const effect of game.effects) this.effect(effect);
    this.waypoint(game);
    ctx.restore();
    this.drawCompass(game);
    if (game.mode === 'playing' && game.time - game.lastDamage < 0.15 && game.lastDamage > 0) {
      rect(ctx, '#ed614f25', 0, 0, canvas.width, canvas.height);
    }
    this.drawMap(game);
  }
  visible(p) { return p.x > this.camera.x - 80 && p.x < this.camera.x + this.canvas.width + 80 && p.y > this.camera.y - 80 && p.y < this.camera.y + this.canvas.height + 80; }
  jeep(p, game) {
    const ctx = this.ctx;
    if (p.invulnerable > 0 && Math.floor(game.time * 20) % 2 === 0) ctx.globalAlpha = 0.45;
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(Math.atan2(p.dy, p.dx) + Math.PI / 2);
    rect(ctx, '#35443388', -16, -17, 37, 49);
    for (const x of [-20, 13]) { rect(ctx, '#243632', x, -17, 8, 15); rect(ctx, '#243632', x, 9, 8, 16); rect(ctx, '#53614b', x + 1, -14, 6, 3); rect(ctx, '#53614b', x + 1, 12, 6, 3); }
    rect(ctx, '#253c39', -14, -25, 28, 54); rect(ctx, '#52a98a', -13, -23, 26, 50);
    rect(ctx, '#94c49b', -11, -23, 22, 3); rect(ctx, '#35775f', -10, -19, 20, 13);
    rect(ctx, '#f3df94', -12, -24, 5, 4); rect(ctx, '#f3df94', 7, -24, 5, 4);
    rect(ctx, '#263f3f', -10, -3, 20, 14); rect(ctx, '#a1c0a0', -10, -5, 20, 3);
    rect(ctx, '#6cb38b', -9, 14, 18, 11); rect(ctx, '#314e43', -7, 16, 14, 7);
    // Rear seat indicators correspond to real cargo.
    for (let i = 0; i < p.cargo.length; i++) rect(ctx, '#f9d470', -8 + i * 6, 17, 4, 5);
    rect(ctx, '#c1ccb0', -3, -34, 6, 28); rect(ctx, '#263f38', -4, -16, 8, 11);
    if (p.fireTimer > 0.095) { rect(ctx, '#ffe8a0', -6, -40, 12, 8); rect(ctx, '#ffffff', -2, -44, 4, 10); }
    ctx.restore(); ctx.globalAlpha = 1;
    if (p.moving && game.mode === 'playing') {
      ctx.globalAlpha = 0.23; ctx.fillStyle = '#ebd9a2';
      ctx.beginPath(); ctx.arc(p.x - p.dx * 34, p.y - p.dy * 34, 9 + Math.sin(game.time * 18) * 3, 0, TAU); ctx.fill(); ctx.globalAlpha = 1;
    }
  }
  soldier(s, time) {
    const ctx = this.ctx; const bounce = Math.sin(time * 5 + s.id) * 2;
    ctx.strokeStyle = '#f5d57455'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(s.x, s.y, 26 + Math.sin(time * 3) * 3, 0, TAU); ctx.stroke();
    rect(ctx, '#3b4d37', s.x - 9, s.y + 8, 20, 5);
    rect(ctx, '#35443a', s.x - 7, s.y + 5, 5, 7); rect(ctx, '#35443a', s.x + 2, s.y + 5, 5, 7);
    rect(ctx, '#dfc36b', s.x - 7, s.y - 4, 14, 11); rect(ctx, '#f3d5a0', s.x - 5, s.y - 14, 10, 11);
    rect(ctx, '#f9db76', s.x - 7, s.y - 16, 14, 5); rect(ctx, '#f4daa1', s.x + 7, s.y - 9 + bounce, 4, 11);
    text(ctx, '+', s.x, s.y - 28 + bounce, '#ffe38d', 18);
  }
  enemy(e, game) {
    const ctx = this.ctx;
    ctx.save(); ctx.translate(e.x, e.y); ctx.rotate(e.angle + Math.PI / 2);
    if (e.type === 'scout') {
      rect(ctx, '#354035', -10, -8, 21, 25); rect(ctx, '#6f4f3d', -8, -7, 16, 20);
      rect(ctx, '#c09170', -6, -13, 12, 9); rect(ctx, '#a14d3d', -8, -16, 16, 6);
      rect(ctx, '#c4c2a3', 6, -20, 4, 24); rect(ctx, '#293b32', -7, 12, 5, 6); rect(ctx, '#293b32', 2, 12, 5, 6);
    } else {
      const big = e.type === 'boss'; const w = big ? 74 : e.type === 'tank' ? 43 : 32; const h = big ? 86 : 49;
      rect(ctx, '#323b33', -w / 2 - 7, -h / 2, 11, h); rect(ctx, '#323b33', w / 2 - 4, -h / 2, 11, h);
      for (let y = -h / 2 + 4; y < h / 2; y += 9) { rect(ctx, '#5b5e4c', -w / 2 - 6, y, 9, 3); rect(ctx, '#5b5e4c', w / 2 - 3, y, 9, 3); }
      rect(ctx, big ? '#955846' : '#82765a', -w / 2, -h / 2 + 3, w, h - 6);
      rect(ctx, big ? '#b77657' : '#9c9068', -w / 2 + 5, -h / 2 + 7, w - 10, 7);
      rect(ctx, '#594e3c', -w / 2 + 8, h / 2 - 20, w - 16, 11);
      rect(ctx, '#4f5140', -w / 4, -15, w / 2, 34); rect(ctx, big ? '#c7885e' : '#b1a175', -w / 4 + 3, -12, w / 2 - 6, 25);
      rect(ctx, '#3b4237', -5, -h / 2 - 16, 10, h / 2 + 20); rect(ctx, '#b2ac83', -3, -h / 2 - 13, 6, 21);
      if (big) { text(ctx, '✕', 0, 10, '#f4cd97', 18); }
    }
    if (e.flash > 0) { ctx.globalAlpha = 0.45; rect(ctx, '#ffecc0', -13, -15, 26, 28); ctx.globalAlpha = 1; }
    ctx.restore();
    if (e.hp < e.maxHp || e.type === 'boss') {
      const w = e.type === 'boss' ? 100 : 36;
      rect(ctx, '#263831', e.x - w / 2, e.y - e.radius - 18, w, 5);
      rect(ctx, '#f09b6d', e.x - w / 2, e.y - e.radius - 18, w * e.hp / e.maxHp, 5);
      if (e.type === 'boss') text(ctx, 'COMMAND TANK', e.x, e.y - e.radius - 27, '#ffe0a8', 11);
    }
  }
  pickup(p, time) {
    const ctx = this.ctx; const bob = Math.sin(time * 3) * 2;
    rect(ctx, '#3b4e3c', p.x - 15, p.y - 13 + bob, 30, 30); rect(ctx, '#d7c27a', p.x - 13, p.y - 15 + bob, 26, 26);
    rect(ctx, '#7f8657', p.x - 11, p.y - 13 + bob, 22, 22);
    if (p.type === 'repair') { rect(ctx, '#eeeac4', p.x - 3, p.y - 11 + bob, 6, 18); rect(ctx, '#eeeac4', p.x - 9, p.y - 5 + bob, 18, 6); }
    else { rect(ctx, '#efdc95', p.x - 7, p.y - 8 + bob, 5, 14); rect(ctx, '#efdc95', p.x + 2, p.y - 8 + bob, 5, 14); }
  }
  effect(e) {
    const ctx = this.ctx;
    if (e.type === 'spark') {
      ctx.globalAlpha = clamp(e.ttl / 0.16, 0, 1); rect(ctx, '#fff1b0', e.x - 5, e.y - 5, 10, 10); ctx.globalAlpha = 1; return;
    }
    const t = e.age / 0.65, radius = e.radius * (0.18 + Math.min(t * 2, 1));
    ctx.globalAlpha = clamp(1 - t, 0, 1);
    ctx.fillStyle = t < 0.25 ? '#fff0ae' : '#e9aa57'; ctx.beginPath(); ctx.arc(e.x, e.y, radius * (1 - t * 0.45), 0, TAU); ctx.fill();
    ctx.strokeStyle = '#ffe4a0'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(e.x, e.y, radius, 0, TAU); ctx.stroke();
    for (let i = 0; i < 8; i++) { const a = i * TAU / 8; rect(ctx, '#f8d986', e.x + Math.cos(a) * radius - 3, e.y + Math.sin(a) * radius - 3, 6, 6); }
    ctx.globalAlpha = 1;
  }
  waypoint(game) {
    const target = game.objective(); if (!this.visible(target)) return;
    const ctx = this.ctx; ctx.strokeStyle = `${target.color}90`; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(target.x, target.y, 43 + Math.sin(game.time * 3) * 3, 0, TAU); ctx.stroke();
  }
  drawCompass(game) {
    const ctx = this.ctx, target = game.objective(), p = game.player;
    const d = distance(p, target);
    if (d < 75) return;
    const angle = Math.atan2(target.y - p.y, target.x - p.x);
    ctx.save(); ctx.translate(43, 44); ctx.rotate(angle + Math.PI / 2);
    ctx.fillStyle = target.color; ctx.beginPath(); ctx.moveTo(0, -13); ctx.lineTo(9, 11); ctx.lineTo(0, 6); ctx.lineTo(-9, 11); ctx.closePath(); ctx.fill(); ctx.restore();
    text(ctx, `${Math.round(d / 10)} m`, 70, 47, '#faf2d5', 13, 'left');
    text(ctx, 'N', this.canvas.width - 30, 40, '#f4eacc', 16);
    ctx.fillStyle = '#f4eacc'; ctx.beginPath(); ctx.moveTo(this.canvas.width - 30, 48); ctx.lineTo(this.canvas.width - 34, 62); ctx.lineTo(this.canvas.width - 26, 62); ctx.fill();
  }
  drawMap(game) {
    const ctx = this.minimap.getContext('2d'), w = this.minimap.width, h = this.minimap.height;
    ctx.fillStyle = '#304c3d'; ctx.fillRect(0, 0, w, h);
    const sx = w / WORLD.width, sy = h / WORLD.height;
    ctx.strokeStyle = '#819373'; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(640 * sx, h); ctx.bezierCurveTo(510 * sx, 1720 * sy, 855 * sx, 1600 * sy, 675 * sx, 1060 * sy); ctx.bezierCurveTo(710 * sx, 740 * sy, 560 * sx, 450 * sy, 650 * sx, 0); ctx.stroke();
    rect(ctx, '#356c71', 0, 980 * sy, w, 120 * sy); rect(ctx, '#b5a26d', BRIDGE.x * sx, 965 * sy, BRIDGE.w * sx, 150 * sy);
    for (const box of OBSTACLES) rect(ctx, '#8f9978', box.x * sx, box.y * sy, box.w * sx, box.h * sy);
    rect(ctx, '#68cdaa', BASE.x * sx, BASE.y * sy, BASE.w * sx, BASE.h * sy);
    for (const s of game.soldiers) if (s.status === 'waiting') rect(ctx, '#f6ce6c', s.x * sx - 3, s.y * sy - 3, 6, 6);
    if (!game.boss.dead) rect(ctx, '#f18f72', game.boss.x * sx - 5, game.boss.y * sy - 5, 10, 10);
    ctx.strokeStyle = '#eef1d176'; ctx.lineWidth = 1; ctx.strokeRect(this.camera.x * sx, this.camera.y * sy, this.canvas.width * sx, this.canvas.height * sy);
    const p = game.player; ctx.save(); ctx.translate(p.x * sx, p.y * sy); ctx.rotate(Math.atan2(p.dy, p.dx) + Math.PI / 2);
    ctx.fillStyle = '#fff9d8'; ctx.beginPath(); ctx.moveTo(0, -6); ctx.lineTo(4, 5); ctx.lineTo(-4, 5); ctx.fill(); ctx.restore();
  }
}
