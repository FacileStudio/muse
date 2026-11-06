import { describe, expect, test } from 'bun:test';
import { placePopup } from './placement.js';

describe('placePopup', () => {
    const base = { triggerTop: 100, triggerBottom: 144, gap: 6, margin: 8, need: 240 };

    test('opens down when there is room', () => {
        expect(placePopup({ ...base, viewportHeight: 800 })).toEqual({ up: false, maxHeight: 642 });
    });

    test('flips up near the bottom edge when above is larger', () => {
        const result = placePopup({ ...base, triggerTop: 600, triggerBottom: 644, viewportHeight: 700 });
        expect(result.up).toBe(true);
        expect(result.maxHeight).toBe(586);
    });

    test('stays down when neither side fits but below is larger', () => {
        expect(placePopup({ ...base, triggerTop: 20, triggerBottom: 64, viewportHeight: 200 }).up).toBe(false);
    });
});
