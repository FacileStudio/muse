import { describe, expect, test } from 'bun:test';
import { wantsFocus } from './search.js';

const press = { key: '/', ctrlKey: false, metaKey: false, altKey: false, defaultPrevented: false };

describe('wantsFocus', () => {
    test('takes the bare shortcut key on the page', () => {
        expect(wantsFocus(press, { tagName: 'BODY' }, '/')).toBe(true);
        expect(wantsFocus(press, null, '/')).toBe(true);
    });

    test('leaves typing in a field alone', () => {
        expect(wantsFocus(press, { tagName: 'INPUT' }, '/')).toBe(false);
        expect(wantsFocus(press, { tagName: 'TEXTAREA' }, '/')).toBe(false);
        expect(wantsFocus(press, { tagName: 'DIV', isContentEditable: true }, '/')).toBe(false);
    });

    test('ignores other keys, modifiers and handled events', () => {
        expect(wantsFocus({ ...press, key: 'a' }, null, '/')).toBe(false);
        expect(wantsFocus({ ...press, metaKey: true }, null, '/')).toBe(false);
        expect(wantsFocus({ ...press, defaultPrevented: true }, null, '/')).toBe(false);
    });
});
