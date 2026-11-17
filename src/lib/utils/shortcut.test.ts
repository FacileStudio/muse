import { describe, expect, test } from 'bun:test';
import { ariaKeyShortcuts, keyCaps, shortcutText } from './shortcut.js';

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

describe('ariaKeyShortcuts', () => {
    test('mod is Meta on Apple and Control elsewhere, in the ARIA spelling', () => {
        expect(ariaKeyShortcuts('mod+shift+k', true)).toBe('Meta+Shift+K');
        expect(ariaKeyShortcuts('mod+shift+k', false)).toBe('Control+Shift+K');
    });

    test('named keys take their KeyboardEvent.key names', () => {
        expect(ariaKeyShortcuts('alt + enter', false)).toBe('Alt+Enter');
        expect(ariaKeyShortcuts('ctrl+up', true)).toBe('Control+ArrowUp');
        expect(ariaKeyShortcuts('esc', false)).toBe('Escape');
        expect(ariaKeyShortcuts('f2', false)).toBe('F2');
    });
});

describe('shortcutText', () => {
    test('glyphs run together on Apple, words join with + elsewhere', () => {
        expect(shortcutText('mod+shift+k', true)).toBe('⌘⇧K');
        expect(shortcutText('mod+shift+k', false)).toBe('Ctrl+Shift+K');
    });
});
