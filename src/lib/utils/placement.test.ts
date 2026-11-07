import { describe, expect, test } from 'bun:test';
import { placeAcross, placePopup } from './placement.js';

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

describe('placeAcross', () => {
    const base = { viewportWidth: 360, width: 240, margin: 8 };

    test('start keeps the trigger left edge when it fits', () => {
        expect(placeAcross({ ...base, triggerLeft: 20, triggerRight: 80, align: 'auto' })).toEqual({ left: 20, align: 'start' });
    });

    test('auto lines up with the right edge when the left edge would clip', () => {
        expect(placeAcross({ ...base, triggerLeft: 300, triggerRight: 344, align: 'auto' })).toEqual({ left: 104, align: 'end' });
    });

    test('start is clamped inside the viewport', () => {
        expect(placeAcross({ ...base, triggerLeft: 300, triggerRight: 344, align: 'start' })).toEqual({ left: 112, align: 'start' });
    });

    test('end is clamped to the left margin', () => {
        expect(placeAcross({ ...base, triggerLeft: 4, triggerRight: 40, align: 'end' })).toEqual({ left: 8, align: 'end' });
    });

    test('a menu wider than the viewport pins to the left margin', () => {
        expect(placeAcross({ ...base, width: 400, triggerLeft: 300, triggerRight: 344, align: 'auto' }).left).toBe(8);
    });
});
