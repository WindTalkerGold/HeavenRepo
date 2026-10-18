import test from 'node:test';
import assert from 'node:assert/strict';
import { MINUTE, localParts, timeToMinute, isAvailable, findOverlap } from '../site/timezone/core.mjs';
const member = (zone, start = '07:00', end = '20:00') => ({ zone, start, end });
const utc = s => Date.parse(`${s}Z`);
const pairs = r => r.overlaps.map(w => [new Date(w.start).toISOString(), new Date(w.end).toISOString()]);

test('minute precision and availability boundaries, overnight and all day', () => {
  assert.equal(timeToMinute('07:15'), 435);
  assert.throws(() => timeToMinute('24:00'));
  assert.equal(isAvailable(420, 420, 1200), true);
  assert.equal(isAvailable(1200, 420, 1200), false);
  assert.equal(isAvailable(30, 1320, 120), true);
  assert.equal(isAvailable(120, 1320, 120), false);
  assert.equal(isAvailable(100, 420, 420), true);
});
test('Hyderabad, Tallinn, Prague and Redmond use correct winter/summer rules', () => {
  const zones = ['Asia/Kolkata', 'Europe/Tallinn', 'Europe/Prague', 'America/Los_Angeles'];
  assert.deepEqual(zones.map(zone => localParts(utc('2026-01-15T12:00:00'), zone).minute),
    [17 * 60 + 30, 14 * 60, 13 * 60, 4 * 60]);
  assert.deepEqual(zones.map(zone => localParts(utc('2026-07-15T12:00:00'), zone).minute),
    [17 * 60 + 30, 15 * 60, 14 * 60, 5 * 60]);
  const members = zones.map(zone => member(zone));
  assert.equal(findOverlap('2026-01-15', members).overlaps.length, 0);
  assert.deepEqual(pairs(findOverlap('2026-07-15', members)),
    [['2026-07-15T14:00:00.000Z', '2026-07-15T14:30:00.000Z']]);
});
test('Beijing / London / New York winter overlap', () => {
  const r = findOverlap('2026-01-15', [member('Asia/Shanghai'), member('Europe/London'), member('America/New_York')]);
  assert.deepEqual(pairs(r), []); // Beijing ends at 12 UTC, New York starts at 12 UTC.
});
test('summer overlap and minimum duration', () => {
  const members = [member('Asia/Shanghai'), member('Europe/London'), member('America/New_York')];
  assert.deepEqual(pairs(findOverlap('2026-07-15', members)), [['2026-07-15T11:00:00.000Z', '2026-07-15T12:00:00.000Z']]);
  assert.equal(findOverlap('2026-07-15', members, 61).overlaps.length, 0);
  assert.equal(findOverlap('2026-07-15', members, 60).overlaps.length, 1);
});
test('overnight windows and date-line date labels', () => {
  const r = findOverlap('2026-01-15', [member('Asia/Shanghai', '22:00', '02:00'), member('America/Los_Angeles', '06:00', '10:00')]);
  assert.deepEqual(pairs(r), [
    ['2026-01-14T16:00:00.000Z', '2026-01-14T18:00:00.000Z'],
    ['2026-01-15T14:00:00.000Z', '2026-01-15T16:00:00.000Z'],
  ]);
  assert.equal(localParts(r.start, 'America/Los_Angeles').date, '2026-01-14');
});
test('half-hour and quarter-hour offsets, four members', () => {
  const r = findOverlap('2026-01-15', [member('UTC', '00:00', '00:00'), member('Asia/Kolkata', '09:15', '10:15'), member('Asia/Kathmandu', '09:30', '10:30'), member('Asia/Shanghai', '11:45', '12:45')]);
  assert.deepEqual(pairs(r), [['2026-01-15T03:45:00.000Z', '2026-01-15T04:45:00.000Z']]);
});
test('reference day correctly spans 23/25 hours at DST transitions', () => {
  const members = [member('America/New_York', '00:00', '00:00'), member('UTC', '00:00', '00:00')];
  const spring = findOverlap('2026-03-08', members);
  const fall = findOverlap('2026-11-01', members);
  assert.equal((spring.end - spring.start) / MINUTE, 23 * 60);
  assert.equal((fall.end - fall.start) / MINUTE, 25 * 60);
  assert.deepEqual(pairs(spring), [['2026-03-08T05:00:00.000Z', '2026-03-09T04:00:00.000Z']]);
  assert.deepEqual(pairs(fall), [['2026-11-01T04:00:00.000Z', '2026-11-02T05:00:00.000Z']]);
});
test('nonexistent spring times do not create a phantom overlap', () => {
  assert.equal(findOverlap('2026-03-08', [member('America/New_York', '02:00', '03:00'), member('UTC', '00:00', '00:00')]).overlaps.length, 0);
});
test('both occurrences of repeated fall times are considered', () => {
  const r = findOverlap('2026-11-01', [member('America/New_York', '01:15', '01:45'), member('UTC', '00:00', '00:00')]);
  assert.deepEqual(pairs(r), [
    ['2026-11-01T05:15:00.000Z', '2026-11-01T05:45:00.000Z'],
    ['2026-11-01T06:15:00.000Z', '2026-11-01T06:45:00.000Z'],
  ]);
});
test('different DST change dates affect overlap', () => {
  const members = [member('Europe/London', '09:00', '17:00'), member('America/New_York', '09:00', '17:00')];
  assert.equal(findOverlap('2026-03-15', members).overlaps[0].start, utc('2026-03-15T13:00:00'));
  assert.equal(findOverlap('2026-04-15', members).overlaps[0].start, utc('2026-04-15T13:00:00'));
  assert.equal(findOverlap('2026-03-15', members).overlaps[0].end, utc('2026-03-15T17:00:00'));
  assert.equal(findOverlap('2026-04-15', members).overlaps[0].end, utc('2026-04-15T16:00:00'));
});
test('invalid input and skipped calendar date are rejected', () => {
  const m = [member('UTC'), member('Asia/Shanghai')];
  assert.throws(() => findOverlap('2026-02-30', m));
  assert.throws(() => findOverlap('', m));
  assert.throws(() => findOverlap('2026-01-15', [m[0]]));
  assert.throws(() => findOverlap('2026-01-15', [m[0], m[0]]));
  assert.throws(() => findOverlap('2026-01-15', m, NaN));
  assert.throws(() => findOverlap('2011-12-30', [member('Pacific/Apia'), member('UTC')]));
});
