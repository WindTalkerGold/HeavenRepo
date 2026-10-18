import { CITIES, MINUTE, localParts, zoneInfo, findOverlap } from './core.mjs';

const $ = selector => document.querySelector(selector);
const STORAGE = 'heavenrepo.timezone.v1';
const supported = Intl.supportedValuesOf ? Intl.supportedValuesOf('timeZone') : CITIES.map(c => c[0]);
const zones = [...new Set([...CITIES.map(c => c[0]), ...supported])];
const validZone = zone => {
  try { new Intl.DateTimeFormat('en', { timeZone: zone }).format(); return true; } catch { return false; }
};
let members = ['Asia/Shanghai', 'Europe/London', 'America/New_York'].map(zone => ({ zone, start: '07:00', end: '20:00' }));
try {
  const saved = JSON.parse(localStorage.getItem(STORAGE));
  if (Array.isArray(saved) && saved.length >= 2 && saved.length <= 4 &&
      new Set(saved.map(m => m.zone)).size === saved.length &&
      saved.every(m => m && typeof m.zone === 'string' && validZone(m.zone) &&
        /^([01]\d|2[0-3]):[0-5]\d$/.test(m.start) && /^([01]\d|2[0-3]):[0-5]\d$/.test(m.end))) {
    members = saved.map(({ zone, start, end }) => ({ zone, start, end }));
  }
} catch { /* Private mode or unavailable storage must not prevent use. */ }
const browserZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
let lastResult = null;
let textsToCopy = [];
let visibleZones = [];
const clockFormats = new Map();
function format(zone, options, instant = Date.now()) {
  const key = JSON.stringify([zone, options]);
  if (!clockFormats.has(key)) clockFormats.set(key, new Intl.DateTimeFormat('zh-CN', { timeZone: zone, ...options }));
  return clockFormats.get(key).format(instant);
}
function time(zone, instant, seconds = false) {
  return format(zone, { hour: '2-digit', minute: '2-digit', ...(seconds ? { second: '2-digit' } : {}), hourCycle: 'h23' }, instant);
}
function offset(zone, instant) {
  return format(zone, { timeZoneName: 'shortOffset' }, instant).split(' ').at(-1).replace('GMT', 'UTC');
}
function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}
function notice(text = '') { $('#notice').textContent = text; }
function save() {
  try { localStorage.setItem(STORAGE, JSON.stringify(members)); } catch { /* Optional persistence. */ }
}
function renderClocks() {
  const query = $('#zone-search').value.trim().toLowerCase();
  const matches = query ? zones.filter(zone => {
    const info = zoneInfo(zone);
    const searchable = `${zone} ${zone.replaceAll('_', ' ')} ${info.name} ${info.region} ${info.aliases}`.toLowerCase();
    return searchable.replaceAll('katmandu', 'kathmandu').includes(query.replaceAll('katmandu', 'kathmandu'));
  }) : CITIES.map(c => c[0]);
  visibleZones = matches.slice(0, 24);
  const grid = $('#world-clocks');
  grid.replaceChildren();
  if (!visibleZones.length) grid.append(el('p', 'no-clocks', '没有找到时区，试试中文城市名或英文 IANA 名称，如 Europe/London。'));
  for (const zone of visibleZones) {
    const info = zoneInfo(zone);
    const selected = members.some(m => m.zone === zone);
    const card = el('button', 'clock-card');
    card.type = 'button';
    card.dataset.zone = zone;
    card.setAttribute('aria-pressed', String(selected));
    card.setAttribute('aria-label', `${selected ? '移除' : '选择'} ${info.name} ${zone}`);
    card.disabled = !selected && members.length >= 4;
    const top = el('span', 'clock-top');
    top.append(el('span', 'city', info.name), el('span', 'pick', selected ? '✓' : '+'));
    const meta = el('span', 'clock-meta');
    meta.append(el('span', 'clock-date'), el('span', 'clock-offset'));
    card.append(top, el('span', 'zone-id', zone), el('span', 'clock-time'), meta);
    card.addEventListener('click', () => toggleZone(zone));
    grid.append(card);
  }
  $('#search-count').textContent = query ? `找到 ${matches.length} 个时区${matches.length > 24 ? '，显示前 24 个，请缩小搜索范围' : ''}` : '常用城市 · 搜索可查找更多 IANA 时区';
  updateClocks();
}
function updateClocks() {
  const now = Date.now();
  $('#local-time').textContent = time(browserZone, now, true);
  $('#local-date').textContent = format(browserZone, { month: 'long', day: 'numeric', weekday: 'long' }, now);
  for (const card of document.querySelectorAll('.clock-card')) {
    const zone = card.dataset.zone;
    card.querySelector('.clock-time').textContent = time(zone, now, true);
    card.querySelector('.clock-date').textContent = format(zone, { month: 'numeric', day: 'numeric', weekday: 'short' }, now);
    card.querySelector('.clock-offset').textContent = offset(zone, now);
  }
}
function toggleZone(zone) {
  const index = members.findIndex(m => m.zone === zone);
  if (index >= 0) {
    if (members.length <= 2) { notice('请至少保留 2 个时区。可以先添加新时区，再移除不需要的时区。'); return; }
    members.splice(index, 1);
  } else {
    if (members.length >= 4) { notice('最多选择 4 个时区，请先移除一个。'); return; }
    members.push({ zone, start: '07:00', end: '20:00' });
  }
  notice(members.length === 4 ? '已选满 4 个时区；移除一个后可选择其他时区。' : '');
  save();
  renderClocks();
  renderMembers();
  calculate();
}
function renderMembers() {
  $('#team-count').textContent = `${members.length} / 4 个时区`;
  $('#reference-note').textContent = `基准时区：${zoneInfo(members[0].zone).name}。查找这一天内的共同空档。`;
  const container = $('#team-members');
  container.replaceChildren();
  members.forEach((member, i) => {
    const info = zoneInfo(member.zone);
    const row = el('div', 'member');
    row.dataset.zone = member.zone;
    const identity = el('div', 'member-info');
    const heading = el('h3', '', info.name);
    if (i === 0) heading.append(el('small', '', '基准'));
    identity.append(heading, el('span', 'zone-id', member.zone));
    const window = el('div', 'window');
    for (const [field, label] of [['start', '开始'], ['end', '结束']]) {
      const wrap = el('label', '', label);
      const input = el('input');
      input.type = 'time'; input.required = true; input.step = '60'; input.value = member[field];
      input.dataset.field = field;
      input.setAttribute('aria-label', `${info.name}可用${label}时间`);
      input.addEventListener('change', () => {
        if (input.validity.valid && input.value) {
          member[field] = input.value;
          save();
          calculate();
        }
      });
      wrap.append(input); window.append(wrap);
      if (field === 'start') window.append(el('span', '', '—'));
    }
    const remove = el('button', 'remove', '×');
    remove.type = 'button'; remove.setAttribute('aria-label', `移除 ${info.name}`);
    remove.addEventListener('click', () => toggleZone(member.zone));
    row.append(el('span', 'member-index', String(i + 1).padStart(2, '0')), identity, window, remove);
    container.append(row);
  });
}
function addBars(track, runs, result) {
  for (const run of runs) {
    const bar = el('span', 'bar');
    bar.style.left = `${100 * (run.start - result.start) / (result.end - result.start)}%`;
    bar.style.width = `${100 * (run.end - run.start) / (result.end - result.start)}%`;
    track.append(bar);
  }
}
function renderTimeline(result) {
  const wrap = $('#timeline-wrap');
  wrap.replaceChildren();
  const timeline = el('div', 'timeline');
  const axis = el('div', 'axis');
  const ticks = el('div', 'ticks');
  for (let i = 0; i <= 4; i++) {
    const instant = result.start + (result.end - result.start) * i / 4;
    const tick = el('span', '', time(members[0].zone, instant));
    tick.style.left = `${i * 25}%`;
    ticks.append(tick);
  }
  axis.append(el('span', 'axis-label', '基准时区当地时间'), ticks);
  timeline.append(axis);
  [...members, { zone: null }].forEach((member, i) => {
    const common = !member.zone;
    const row = el('div', `timeline-row${common ? ' common-row' : ''}`);
    const label = el('div', 'row-label', common ? '大家都可以' : zoneInfo(member.zone).name);
    if (!common) label.append(el('small', '', `${member.start} – ${member.end}${member.start === member.end ? ' · 全天' : member.start > member.end ? ' · 跨午夜' : ''}`));
    const track = el('div', 'track');
    addBars(track, common ? result.overlaps : result.rows[i], result);
    row.append(label, track); timeline.append(row);
  });
  timeline.append(el('p', 'timeline-note', `横轴为 ${zoneInfo(members[0].zone).name} ${$('#meeting-date').value} 的完整一天（${(result.end - result.start) / (60 * MINUTE)} 小时），终点为次日 00:00。深绿色仅显示达到最短时长的空档。`));
  wrap.append(timeline);
}
function dateLabel(zone, instant) {
  return `${localParts(instant, zone).date} ${offset(zone, instant)}`;
}
function duration(minutes) {
  const h = Math.floor(minutes / 60), m = minutes % 60;
  return `${h ? `${h} 小时` : ''}${h && m ? ' ' : ''}${m ? `${m} 分钟` : ''}`;
}
function renderResults(result) {
  const container = $('#overlap-results');
  container.replaceChildren();
  textsToCopy = [];
  if (!result.overlaps.length) {
    $('#results-title').textContent = '还差一点，就能同频。';
    $('#result-summary').textContent = `未找到至少 ${$('#minimum').selectedOptions[0].textContent}的共同空档。`;
    const empty = el('div', 'empty');
    empty.append(el('strong', '', '这一天，大家的时间暂未交汇'), el('p', '', '试试扩大各地可用时段、缩短最短时长，或选择另一个日期。'));
    container.append(empty);
    return;
  }
  $('#results-title').textContent = '共同的时间，找到了。';
  const total = result.overlaps.reduce((n, r) => n + (r.end - r.start) / MINUTE, 0);
  $('#result-summary').textContent = `${$('#meeting-date').value} · ${members.length} 个时区 · ${result.overlaps.length} 段共同空档，共 ${duration(total)}。以下为可安排会议的完整窗口。`;
  result.overlaps.forEach((run, index) => {
    const card = el('article', 'result-card');
    const header = el('header');
    const heading = el('h3', '', `共同空档 ${String(index + 1).padStart(2, '0')} `);
    heading.append(el('span', '', ` / ${duration((run.end - run.start) / MINUTE)}`));
    const copy = el('button', 'copy', '复制时间');
    copy.type = 'button';
    copy.addEventListener('click', () => copyResult(index, copy));
    header.append(heading, copy);
    const times = el('div', 'result-times');
    const text = [`共同协作窗口 · ${duration((run.end - run.start) / MINUTE)}`];
    members.forEach(member => {
      const info = zoneInfo(member.zone);
      const startDate = dateLabel(member.zone, run.start), endDate = dateLabel(member.zone, run.end);
      const range = `${time(member.zone, run.start)} – ${time(member.zone, run.end)}`;
      const item = el('div');
      item.append(el('p', 'result-zone', info.name), el('p', 'result-range', range),
        el('p', 'result-day', startDate === endDate ? startDate : `${startDate} → ${endDate}`));
      item.title = `${member.zone}\n${startDate} ${time(member.zone, run.start)} → ${endDate} ${time(member.zone, run.end)}`;
      times.append(item);
      text.push(`${info.name} (${member.zone}): ${startDate} ${time(member.zone, run.start)} → ${endDate} ${time(member.zone, run.end)}`);
    });
    textsToCopy.push(text.join('\n'));
    card.append(header, times); container.append(card);
  });
}
async function copyResult(index, button) {
  const text = textsToCopy[index];
  try {
    if (!navigator.clipboard?.writeText) throw new Error('clipboard unavailable');
    await navigator.clipboard.writeText(text);
    button.textContent = '已复制 ✓';
    setTimeout(() => { button.textContent = '复制时间'; }, 2000);
  } catch {
    const area = el('textarea');
    area.value = text;
    area.setAttribute('aria-label', '复制协作时间');
    button.closest('article').append(area);
    area.focus(); area.select();
    notice('浏览器未允许自动复制，已选中时间文本，请按 Ctrl/Cmd+C 复制。');
    area.addEventListener('blur', () => area.remove(), { once: true });
  }
}
function calculate() {
  try {
    if (!$('#planner-form').checkValidity()) {
      throw new Error('请补全有效的日期与可用时间（日期范围 2000–2100 年）。');
    }
    lastResult = findOverlap($('#meeting-date').value, members, Number($('#minimum').value));
    renderTimeline(lastResult);
    renderResults(lastResult);
  } catch (error) {
    lastResult = null;
    $('#timeline-wrap').replaceChildren();
    $('#overlap-results').replaceChildren();
    $('#results-title').textContent = '请完善协作设置';
    $('#result-summary').textContent = error.message;
  }
}
$('#local-zone').textContent = browserZone;
$('#meeting-date').value = localParts(Date.now(), members[0].zone).date;
$('#zone-search').addEventListener('input', renderClocks);
$('#meeting-date').addEventListener('change', calculate);
$('#minimum').addEventListener('change', calculate);
$('#planner-form').addEventListener('submit', event => { event.preventDefault(); calculate(); });
renderClocks();
renderMembers();
calculate();
setInterval(() => { if (!document.hidden) updateClocks(); }, 1000);
document.addEventListener('visibilitychange', () => { if (!document.hidden) updateClocks(); });
