import { describe, expect, test } from 'bun:test';
import { keyAction } from './keys.js';

describe('keyAction', () => {
    test('closed: arrows, enter and space open at the selection', () => {
        for (const key of ['ArrowDown', 'Enter', ' ']) expect(keyAction(false, { key })).toEqual({ kind: 'open', at: 'selected' });
    });

    test('closed: up and home open on the first, end on the last', () => {
        expect(keyAction(false, { key: 'ArrowUp' })).toEqual({ kind: 'open', at: 'first' });
        expect(keyAction(false, { key: 'Home' })).toEqual({ kind: 'open', at: 'first' });
        expect(keyAction(false, { key: 'End' })).toEqual({ kind: 'open', at: 'last' });
    });

    test('open: navigation, commit, escape and tab', () => {
        expect(keyAction(true, { key: 'ArrowDown' })).toEqual({ kind: 'move', key: 'ArrowDown' });
        expect(keyAction(true, { key: 'PageDown' })).toEqual({ kind: 'move', key: 'PageDown' });
        expect(keyAction(true, { key: 'Enter' })).toEqual({ kind: 'commit' });
        expect(keyAction(true, { key: ' ' })).toEqual({ kind: 'commit' });
        expect(keyAction(true, { key: 'ArrowUp', altKey: true })).toEqual({ kind: 'commit' });
        expect(keyAction(true, { key: 'Escape' })).toEqual({ kind: 'close' });
        expect(keyAction(true, { key: 'Tab' })).toEqual({ kind: 'tab' });
    });

    test('printable keys type ahead, and space joins the buffer while typing', () => {
        expect(keyAction(false, { key: 'a' })).toEqual({ kind: 'type', char: 'a' });
        expect(keyAction(true, { key: 'a' })).toEqual({ kind: 'type', char: 'a' });
        expect(keyAction(true, { key: ' ' }, true)).toEqual({ kind: 'type', char: ' ' });
    });

    test('shortcuts and unknown keys are ignored', () => {
        expect(keyAction(false, { key: 'a', ctrlKey: true })).toEqual({ kind: 'ignore' });
        expect(keyAction(true, { key: 'F5' })).toEqual({ kind: 'ignore' });
    });
});
