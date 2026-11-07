import { expect, test } from 'bun:test';
import { headerForKey, toggleOpen } from './accordion.js';

test('a single accordion opens one panel at a time', () => {
    expect(toggleOpen([], 'a', false)).toEqual(['a']);
    expect(toggleOpen(['a'], 'b', false)).toEqual(['b']);
    expect(toggleOpen(['a'], 'a', false)).toEqual([]);
});

test('a multiple accordion adds and removes', () => {
    expect(toggleOpen(['a'], 'b', true)).toEqual(['a', 'b']);
    expect(toggleOpen(['a', 'b'], 'a', true)).toEqual(['b']);
});

test('headers wrap and skip disabled ones', () => {
    const flags = [false, true, false];
    expect(headerForKey(flags, 0, 'ArrowDown')).toBe(2);
    expect(headerForKey(flags, 2, 'ArrowDown')).toBe(0);
    expect(headerForKey(flags, 0, 'ArrowUp')).toBe(2);
    expect(headerForKey(flags, 1, 'Home')).toBe(0);
    expect(headerForKey(flags, 0, 'End')).toBe(2);
    expect(headerForKey(flags, 0, 'Enter')).toBe(-1);
});
