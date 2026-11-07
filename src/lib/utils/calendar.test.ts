import { expect, test } from 'bun:test';
import {
    addDays,
    addMonths,
    clampDate,
    dateForKey,
    firstWeekday,
    formatDate,
    isDisabled,
    isIsoDate,
    monthGrid,
    monthRange,
    startOfWeek,
    todayIso,
    weekdayNames
} from './calendar.js';

test('isIsoDate rejects shapes and impossible days', () => {
    expect(isIsoDate('2026-11-07')).toBe(true);
    expect(isIsoDate('2026-02-30')).toBe(false);
    expect(isIsoDate('2026-2-3')).toBe(false);
    expect(isIsoDate(20261107)).toBe(false);
});

test('day arithmetic crosses months, years and leap days', () => {
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(addDays('2028-03-01', -1)).toBe('2028-02-29');
    expect(addMonths('2026-01-31', 1)).toBe('2026-02-28');
    expect(addMonths('2026-03-31', -1)).toBe('2026-02-28');
    expect(addMonths('2026-11-15', 2)).toBe('2027-01-15');
});

test('todayIso is the local calendar date', () => {
    expect(todayIso(new Date(2026, 10, 7, 23, 59))).toBe('2026-11-07');
});

test('weeks start on the asked weekday and cover the whole month', () => {
    expect(startOfWeek('2026-11-07', 1)).toBe('2026-11-02');
    expect(startOfWeek('2026-11-07', 0)).toBe('2026-11-01');
    const weeks = monthGrid('2026-11-15', 1);
    expect(weeks[0][0]).toBe('2026-10-26');
    expect(weeks.at(-1)?.at(-1)).toBe('2026-12-06');
    expect(weeks.every((w) => w.length === 7)).toBe(true);
    expect(weeks.flat()).toContain('2026-11-30');
});

test('February can fit in four weeks', () => {
    expect(monthGrid('2027-02-10', 1)).toHaveLength(4);
});

test('min and max disable and clamp', () => {
    const bounds = { min: '2026-11-05', max: '2026-11-20' };
    expect(isDisabled('2026-11-04', bounds)).toBe(true);
    expect(isDisabled('2026-11-05', bounds)).toBe(false);
    expect(isDisabled('2026-11-21', bounds)).toBe(true);
    expect(clampDate('2026-12-01', bounds)).toBe('2026-11-20');
    expect(isDisabled('2030-01-01', {})).toBe(false);
});

test('grid keys follow the APG date picker', () => {
    const none = {};
    expect(dateForKey('2026-11-10', 'ArrowRight', false, 1, none)).toBe('2026-11-11');
    expect(dateForKey('2026-11-10', 'ArrowLeft', false, 1, none)).toBe('2026-11-09');
    expect(dateForKey('2026-11-10', 'ArrowDown', false, 1, none)).toBe('2026-11-17');
    expect(dateForKey('2026-11-10', 'ArrowUp', false, 1, none)).toBe('2026-11-03');
    expect(dateForKey('2026-11-11', 'Home', false, 1, none)).toBe('2026-11-09');
    expect(dateForKey('2026-11-11', 'End', false, 1, none)).toBe('2026-11-15');
    expect(dateForKey('2026-11-11', 'PageDown', false, 1, none)).toBe('2026-12-11');
    expect(dateForKey('2026-11-11', 'PageUp', true, 1, none)).toBe('2025-11-11');
    expect(dateForKey('2026-11-11', 'x', false, 1, none)).toBeNull();
    expect(dateForKey('2026-11-18', 'ArrowRight', false, 1, { max: '2026-11-18' })).toBe('2026-11-18');
});

test('the week starts where the locale says', () => {
    expect(firstWeekday('fr')).toBe(1);
    expect(firstWeekday('de-DE')).toBe(1);
    expect(firstWeekday('en-US')).toBe(0);
});

test('names and formats come from Intl', () => {
    const names = weekdayNames('fr', 1);
    expect(names).toHaveLength(7);
    expect(names[0].long.toLowerCase()).toBe('lundi');
    expect(weekdayNames('en', 0)[0].long).toBe('Sunday');
    expect(formatDate('2026-11-07', 'en', { dateStyle: 'medium' })).toBe('Nov 7, 2026');
    expect(formatDate('2026-11-07', 'fr')).toBe('7 novembre 2026');
});

test('monthRange spans the month of any date in it', () => {
    expect(monthRange('2028-02-10')).toEqual({ first: '2028-02-01', last: '2028-02-29' });
    expect(monthRange('2026-12-31')).toEqual({ first: '2026-12-01', last: '2026-12-31' });
});
