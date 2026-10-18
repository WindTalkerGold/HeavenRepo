// Original gameplay simulation. No DOM or renderer dependencies.
export const WORLD = Object.freeze({ width: 1280, height: 2240 });
export const BASE = Object.freeze({ x: 515, y: 1920, w: 250, h: 190 });
export const BRIDGE = Object.freeze({ x: 570, y: 960, w: 210, h: 160 });
export const MAX_CARGO = 3;
export const TOTAL_SOLDIERS = 6;
export const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
export const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
export const inside = (p, box) => p.x >= box.x && p.x <= box.x + box.w && p.y >= box.y && p.y <= box.y + box.h;
export function circleBox(x, y, r, box) {
  return Math.hypot(x - clamp(x, box.x, box.x + box.w), y - clamp(y, box.y, box.y + box.h)) < r;
}
export function rng(seed = 417) {
  return () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
}
export const OBSTACLES = Object.freeze([
  { x: 230, y: 1480, w: 185, h: 110, type: 'bunker' },
  { x: 895, y: 1135, w: 170, h: 110, type: 'bunker' },
  { x: 255, y: 405, w: 190, h: 110, type: 'bunker' },
  { x: 840, y: 480, w: 125, h: 95, type: 'bunker' },
  { x: 60, y: 1750, w: 130, h: 80, type: 'rock' },
  { x: 1020, y: 1670, w: 120, h: 95, type: 'rock' },
  { x: 85, y: 710, w: 150, h: 105, type: 'rock' },
  { x: 1020, y: 700, w: 130, h: 100, type: 'rock' },
  { x: 145, y: 215, w: 170, h: 80, type: 'rock' },
  { x: 950, y: 195, w: 150, h: 80, type: 'rock' },
]);
// River collision leaves one generous, clearly marked crossing.
const RIVER_WALLS = [{ x: 0, y: 980, w: BRIDGE.x, h: 120 }, { x: BRIDGE.x + BRIDGE.w, y: 980, w: WORLD.width - BRIDGE.x - BRIDGE.w, h: 120 }];
const WALLS = [...OBSTACLES, ...RIVER_WALLS];
const soldierPositions = [[310, 1660], [370, 1660], [925, 1310], [985, 1310], [335, 605], [395, 605]];
const enemyPositions = [
  [505, 1660, 'scout'], [210, 1620, 'scout'], [710, 1530, 'scout'],
  [450, 1420, 'turret'], [1090, 1300, 'scout'], [840, 1320, 'scout'],
  [675, 1170, 'tank'], [675, 855, 'scout'], [490, 720, 'scout'],
  [260, 615, 'scout'], [525, 520, 'turret'], [810, 665, 'tank'],
  [850, 380, 'scout'], [485, 330, 'scout'],
];
export class Game {
  constructor() { this.reset(); }
  reset() {
    this.random = rng();
    this.mode = 'ready'; this.time = 0; this.score = 0; this.delivered = 0;
    this.player = { x: 640, y: 2010, dx: 0, dy: -1, hp: 100, cargo: [], grenades: 6, fireTimer: 0, grenadeTimer: 0, invulnerable: 0, rearm: 0, moving: false };
    this.soldiers = soldierPositions.map(([x, y], id) => ({ x, y, id, status: 'waiting' }));
    this.enemies = enemyPositions.map(([x, y, type], id) => this.makeEnemy(x, y, type, id));
    this.boss = this.makeEnemy(650, 240, 'boss', 99);
    this.enemies.push(this.boss);
    this.bullets = []; this.grenades = []; this.effects = []; this.events = [];
    this.pickups = [{ x: 620, y: 1450, type: 'repair', used: false }, { x: 680, y: 750, type: 'ammo', used: false }, { x: 810, y: 290, type: 'repair', used: false }];
    this.shake = 0; this.lastDamage = 0;
  }
  makeEnemy(x, y, type, id) {
    const hp = { scout: 16, turret: 32, tank: 56, boss: 240 }[type];
    return { x, y, originX: x, originY: y, type, id, hp, maxHp: hp, radius: type === 'boss' ? 43 : type === 'tank' ? 24 : 15, cooldown: 0.8 + this.random() * 1.3, angle: Math.PI / 2, flash: 0, dead: false };
  }
  start() { if (this.mode === 'ready') this.mode = 'playing'; }
  pause() { if (this.mode === 'playing') this.mode = 'paused'; else if (this.mode === 'paused') this.mode = 'playing'; }
  emit(type, data = {}) { this.events.push({ type, ...data }); }
  takeEvents() { return this.events.splice(0); }
  blocked(x, y, radius = 16) {
    return x < radius || y < radius || x > WORLD.width - radius || y > WORLD.height - radius || WALLS.some(box => circleBox(x, y, radius, box));
  }
  move(entity, dx, dy, radius = 16) {
    if (!this.blocked(entity.x + dx, entity.y, radius)) entity.x += dx;
    if (!this.blocked(entity.x, entity.y + dy, radius)) entity.y += dy;
  }
  clearShot(a, b) {
    const steps = Math.ceil(distance(a, b) / 20);
    for (let i = 1; i < steps; i++) {
      const f = i / steps;
      if (WALLS.some(box => inside({ x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f }, box))) return false;
    }
    return true;
  }
  update(dt, input = {}) {
    if (this.mode !== 'playing') return;
    dt = clamp(dt, 0, 1 / 30);
    this.time += dt;
    const p = this.player;
    p.fireTimer -= dt; p.grenadeTimer -= dt;
    p.invulnerable = Math.max(0, p.invulnerable - dt);
    this.shake = Math.max(0, this.shake - dt * 12);
    let mx = clamp(input.x || 0, -1, 1), my = clamp(input.y || 0, -1, 1);
    const length = Math.hypot(mx, my);
    p.moving = length > 0;
    if (length) {
      mx /= length; my /= length;
      p.dx = mx; p.dy = my;
      this.move(p, mx * 230 * dt, my * 230 * dt);
    }
    if (input.aim && distance(p, input.aim) > 5) {
      const n = distance(p, input.aim);
      p.dx = (input.aim.x - p.x) / n; p.dy = (input.aim.y - p.y) / n;
    }
    if (input.fire && p.fireTimer <= 0) {
      p.fireTimer = 0.13;
      this.bullets.push({ x: p.x + p.dx * 25, y: p.y + p.dy * 25, vx: p.dx * 760, vy: p.dy * 760, friendly: true, ttl: 0.72, damage: 8 });
      this.emit('shoot');
    }
    if (input.grenade && p.grenadeTimer <= 0 && p.grenades > 0) {
      p.grenadeTimer = 0.5; p.grenades--;
      const target = { x: clamp(p.x + p.dx * 195, 25, WORLD.width - 25), y: clamp(p.y + p.dy * 195, 25, WORLD.height - 25) };
      this.grenades.push({ sx: p.x, sy: p.y, x: p.x, y: p.y, tx: target.x, ty: target.y, age: 0 });
      this.emit('throw');
    }
    for (const soldier of this.soldiers) {
      if (soldier.status === 'waiting' && p.cargo.length < MAX_CARGO && distance(p, soldier) < 39) {
        soldier.status = 'aboard'; p.cargo.push(soldier.id); this.score += 100;
        this.emit('rescue', { text: `Soldier aboard · ${p.cargo.length}/${MAX_CARGO} seats` });
      }
    }
    const atBase = inside(p, BASE);
    if (atBase) {
      if (p.cargo.length) {
        const count = p.cargo.length;
        for (const id of p.cargo) this.soldiers[id].status = 'delivered';
        this.delivered += count; this.score += count * 250; p.cargo = [];
        this.emit('deliver', { text: `${count} soldiers evacuated · ${this.delivered}/${TOTAL_SOLDIERS} safe` });
      }
      p.hp = Math.min(100, p.hp + 14 * dt);
      p.rearm += dt;
      if (p.rearm >= 1.2) { p.grenades = Math.min(6, p.grenades + 1); p.rearm = 0; }
      if (this.delivered === TOTAL_SOLDIERS && this.boss.dead) {
        this.mode = 'won'; this.score += 1000 + Math.floor(p.hp * 10);
        this.emit('win'); return;
      }
    } else p.rearm = 0;
    for (const pickup of this.pickups) {
      if (!pickup.used && distance(p, pickup) < 34) {
        pickup.used = true;
        if (pickup.type === 'repair') p.hp = Math.min(100, p.hp + 40);
        else p.grenades = Math.min(9, p.grenades + 4);
        this.emit('pickup', { text: pickup.type === 'repair' ? 'Field repair · +40 armor' : 'Supply cache · +4 grenades' });
      }
    }
    for (const enemy of this.enemies) {
      if (enemy.dead) continue;
      enemy.cooldown -= dt; enemy.flash = Math.max(0, enemy.flash - dt);
      const d = distance(enemy, p);
      enemy.angle = Math.atan2(p.y - enemy.y, p.x - enemy.x);
      if (enemy.type === 'scout' && d < 320 && d > 150 && !atBase) {
        this.move(enemy, (p.x - enemy.x) / d * 38 * dt, (p.y - enemy.y) / d * 38 * dt, enemy.radius);
      }
      const range = enemy.type === 'boss' ? 520 : enemy.type === 'tank' ? 430 : 350;
      if (d < range && !atBase && enemy.cooldown <= 0 && this.clearShot(enemy, p)) {
        enemy.cooldown = enemy.type === 'boss' ? 1.1 : enemy.type === 'scout' ? 1.9 : 2.3;
        const spread = enemy.type === 'boss' ? [-0.22, 0, 0.22] : [0];
        for (const offset of spread) {
          const angle = enemy.angle + offset;
          const speed = enemy.type === 'boss' ? 235 : 205;
          this.bullets.push({ x: enemy.x + Math.cos(angle) * (enemy.radius + 8), y: enemy.y + Math.sin(angle) * (enemy.radius + 8), vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, friendly: false, ttl: 2.8, damage: enemy.type === 'scout' ? 8 : 12 });
        }
        enemy.flash = 0.15;
      }
      if (d < enemy.radius + 14 && !atBase) this.hurt(16);
    }
    for (const bullet of this.bullets) {
      if (bullet.ttl <= 0) continue;
      // Substeps prevent a fast projectile from tunneling through a soldier or wall.
      const steps = Math.max(1, Math.ceil(Math.hypot(bullet.vx, bullet.vy) * dt / 8));
      for (let i = 0; i < steps && bullet.ttl > 0; i++) {
        bullet.x += bullet.vx * dt / steps; bullet.y += bullet.vy * dt / steps;
        if (this.blocked(bullet.x, bullet.y, 2)) { bullet.ttl = 0; this.spark(bullet.x, bullet.y); break; }
        if (bullet.friendly) {
          const hit = this.enemies.find(e => !e.dead && distance(e, bullet) < e.radius + 3);
          if (hit) { this.hitEnemy(hit, bullet.damage); bullet.ttl = 0; }
        } else if (!atBase && distance(p, bullet) < 18) {
          this.hurt(bullet.damage); bullet.ttl = 0;
        }
      }
      bullet.ttl -= dt;
    }
    this.bullets = this.bullets.filter(b => b.ttl > 0);
    for (const grenade of this.grenades) {
      grenade.age += dt;
      const t = Math.min(1, grenade.age / 0.62);
      grenade.x = grenade.sx + (grenade.tx - grenade.sx) * t;
      grenade.y = grenade.sy + (grenade.ty - grenade.sy) * t;
      if (t >= 1) {
        this.effects.push({ x: grenade.x, y: grenade.y, type: 'blast', age: 0, ttl: 0.6, radius: 115 });
        for (const enemy of this.enemies) if (!enemy.dead && distance(enemy, grenade) < 115 + enemy.radius) this.hitEnemy(enemy, 60);
        this.shake = 5; this.emit('explode');
      }
    }
    this.grenades = this.grenades.filter(g => g.age < 0.62);
    for (const effect of this.effects) { effect.age += dt; effect.ttl -= dt; }
    this.effects = this.effects.filter(e => e.ttl > 0);
  }
  spark(x, y) { this.effects.push({ x, y, type: 'spark', age: 0, ttl: 0.16, radius: 9 }); }
  hurt(amount) {
    const p = this.player;
    if (p.invulnerable > 0 || this.mode !== 'playing') return;
    p.hp = Math.max(0, p.hp - amount); p.invulnerable = 0.6;
    this.lastDamage = this.time; this.shake = 6;
    this.emit('hurt');
    if (p.hp <= 0) { this.mode = 'lost'; this.emit('lose'); }
  }
  hitEnemy(enemy, amount) {
    if (enemy.dead) return;
    enemy.hp = Math.max(0, enemy.hp - amount); enemy.flash = 0.1;
    this.spark(enemy.x, enemy.y);
    if (enemy.hp <= 0) {
      enemy.dead = true;
      this.score += { scout: 150, turret: 250, tank: 400, boss: 1500 }[enemy.type];
      this.effects.push({ x: enemy.x, y: enemy.y, type: 'blast', age: 0, ttl: 0.65, radius: enemy.type === 'boss' ? 95 : 45 });
      this.emit('destroy', { boss: enemy.type === 'boss', text: enemy.type === 'boss' ? 'Command tank destroyed. Bring everyone home!' : undefined });
    }
  }
  objective() {
    const p = this.player;
    if (p.cargo.length === MAX_CARGO || (p.cargo.length && !this.soldiers.some(s => s.status === 'waiting'))) return { x: 640, y: 2010, label: 'RETURN TO EXTRACTION', color: '#60d6b1' };
    const waiting = this.soldiers.filter(s => s.status === 'waiting');
    if (waiting.length) {
      const nearest = waiting.reduce((a, b) => distance(a, p) < distance(b, p) ? a : b);
      return { ...nearest, label: p.cargo.length ? 'RESCUE OR RETURN TO BASE' : 'FIND THE STRANDED SOLDIERS', color: '#f7c762' };
    }
    if (p.cargo.length) return { x: 640, y: 2010, label: 'RETURN TO EXTRACTION', color: '#60d6b1' };
    if (!this.boss.dead) return { x: this.boss.x, y: this.boss.y, label: 'DESTROY THE COMMAND TANK', color: '#ff856c' };
    return { x: 640, y: 2010, label: 'RETURN TO BASE · MISSION COMPLETE', color: '#60d6b1' };
  }
}
