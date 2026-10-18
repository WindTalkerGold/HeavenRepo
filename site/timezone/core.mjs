// All comparisons are made on real UTC instants, not fixed-offset local clocks.
export const MINUTE = 60_000;
const formatters = new Map();
export function localParts(instant, zone) {
  if (!formatters.has(zone)) formatters.set(zone, new Intl.DateTimeFormat('en-CA', {
    timeZone: zone, year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }));
  const parts = Object.fromEntries(formatters.get(zone).formatToParts(instant).map(p => [p.type, p.value]));
  return { date: `${parts.year}-${parts.month}-${parts.day}`, minute: Number(parts.hour) * 60 + Number(parts.minute) };
}
export function timeToMinute(time) {
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) throw new Error('请输入有效时间');
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}
export function isAvailable(minute, start, end) {
  if (start === end) return true; // Explicitly documented as all day.
  return start < end ? minute >= start && minute < end : minute >= start || minute < end;
}
export function groupRuns(values, origin, step = MINUTE) {
  const runs = [];
  let start = null;
  for (let i = 0; i <= values.length; i++) {
    if (values[i] && start === null) start = i;
    if (!values[i] && start !== null) {
      runs.push({ start: origin + start * step, end: origin + i * step });
      start = null;
    }
  }
  return runs;
}
export function findOverlap(date, members, minimum = 30) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(`${date}T00:00:00Z`)) ||
      new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10) !== date) throw new Error('请选择有效日期');
  if (members.length < 2 || members.length > 4) throw new Error('请选择 2–4 个时区');
  if (new Set(members.map(m => m.zone)).size !== members.length) throw new Error('请勿重复选择时区');
  if (!Number.isFinite(minimum) || minimum < 1) throw new Error('最短时长应至少为 1 分钟');
  const windows = members.map(m => ({ ...m, from: timeToMinute(m.start), to: timeToMinute(m.end) }));
  // Find the reference zone's actual calendar day. It may contain 23, 24, or 25 hours.
  const origin = Date.parse(`${date}T00:00:00Z`) - 24 * 60 * MINUTE;
  let dayStart = null;
  let dayEnd = null;
  for (let i = 0; i < 72 * 60; i++) {
    const t = origin + i * MINUTE;
    if (localParts(t, members[0].zone).date === date) {
      if (dayStart === null) dayStart = t;
      dayEnd = t + MINUTE;
    }
  }
  if (dayStart === null) throw new Error('该日期在基准时区不存在，请选择其他日期');
  const count = (dayEnd - dayStart) / MINUTE;
  const masks = windows.map(w => Array.from({ length: count }, (_, i) =>
    isAvailable(localParts(dayStart + i * MINUTE, w.zone).minute, w.from, w.to)));
  const common = Array.from({ length: count }, (_, i) => masks.every(mask => mask[i]));
  const overlaps = groupRuns(common, dayStart).filter(r => (r.end - r.start) / MINUTE >= minimum);
  return { start: dayStart, end: dayEnd, rows: masks.map(mask => groupRuns(mask, dayStart)), overlaps };
}

export const CITIES = [
  ['Asia/Shanghai', '北京 / 上海', '中国'], ['Asia/Hong_Kong', '香港', '中国'],
  ['Asia/Tokyo', '东京', '日本'], ['Asia/Seoul', '首尔', '韩国'],
  ['Asia/Singapore', '新加坡', '新加坡'],
  ['Asia/Kolkata', '海德拉巴 / 孟买 / 新德里', '印度', 'Hyderabad Mumbai New Delhi'],
  ['Asia/Dubai', '迪拜', '阿联酋'], ['Europe/London', '伦敦', '英国'],
  ['Europe/Paris', '巴黎', '法国'], ['Europe/Berlin', '柏林', '德国'],
  ['Europe/Tallinn', '塔林', '爱沙尼亚', 'Tallinn'], ['Europe/Prague', '布拉格', '捷克', 'Prague Praha'],
  ['America/New_York', '纽约', '美国东部'], ['America/Chicago', '芝加哥', '美国中部'],
  ['America/Denver', '丹佛', '美国山地'],
  ['America/Los_Angeles', 'Redmond / 洛杉矶', '美国太平洋时间', '雷德蒙德 Pacific PT PST PDT'],
  ['America/Toronto', '多伦多', '加拿大'], ['America/Sao_Paulo', '圣保罗', '巴西'],
  ['Australia/Sydney', '悉尼', '澳大利亚'], ['Pacific/Auckland', '奥克兰', '新西兰'],
  ['Africa/Johannesburg', '约翰内斯堡', '南非'], ['UTC', '协调世界时', 'UTC'],
];
export function zoneInfo(zone) {
  const city = CITIES.find(c => c[0] === zone);
  return { zone, name: city?.[1] || zone.split('/').at(-1).replaceAll('_', ' '), region: city?.[2] || zone.split('/')[0], aliases: city?.[3] || '' };
}
