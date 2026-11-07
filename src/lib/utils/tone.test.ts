import { expect, test } from 'bun:test';
import { isUrgent, toneFill, type Tone } from './tone.js';

const ALL: Tone[] = ['neutral', 'accent', 'info', 'success', 'warning', 'danger', 'owner', 'admin'];

test('every tone has a fill', () => {
    expect(Object.keys(toneFill).sort()).toEqual([...ALL].sort());
});

test('only warning and danger are urgent', () => {
    expect(ALL.filter(isUrgent)).toEqual(['warning', 'danger']);
});
