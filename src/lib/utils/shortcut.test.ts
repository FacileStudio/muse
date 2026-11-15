import { describe, expect, test } from 'bun:test';
import { keyCaps } from './shortcut.js';

describe('keyCaps', () => {
    test('mod is Command on Apple and Ctrl elsewhere', () => {
        expect(keyCaps('mod+k', true)).toEqual(['⌘', 'K']);
        expect(keyCaps('mod+k', false)).toEqual(['Ctrl', 'K']);
    });

    test('names map and single characters stay', () => {
        expect(keyCaps('shift+/', false)).toEqual(['Shift', '/']);
        expect(keyCaps('alt + Enter', true)).toEqual(['⌥', '↵']);
        expect(keyCaps('', false)).toEqual([]);
    });
});
