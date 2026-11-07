import { expect, test } from 'bun:test';
import { activeCell, cellsOf, isComplete, sanitizeCode } from './otp.js';

test('a pasted code loses its spaces and dashes and is cut to length', () => {
    expect(sanitizeCode('123 456', 6)).toBe('123456');
    expect(sanitizeCode('12-34-56-78', 6)).toBe('123456');
    expect(sanitizeCode('12ab', 6)).toBe('12');
});

test('alphanumeric codes keep letters', () => {
    expect(sanitizeCode('a1-B2 c3', 6, 'alphanumeric')).toBe('a1B2c3');
    expect(sanitizeCode('éà', 6, 'alphanumeric')).toBe('');
});

test('cells pad with empty strings', () => {
    expect(cellsOf('12', 4)).toEqual(['1', '2', '', '']);
    expect(cellsOf('', 0)).toEqual([]);
});

test('the caret sits on the next empty cell, then on the last', () => {
    expect(activeCell('', 6)).toBe(0);
    expect(activeCell('123', 6)).toBe(3);
    expect(activeCell('123456', 6)).toBe(5);
});

test('complete means exactly full', () => {
    expect(isComplete('123456', 6)).toBe(true);
    expect(isComplete('12345', 6)).toBe(false);
    expect(isComplete('', 0)).toBe(false);
});
