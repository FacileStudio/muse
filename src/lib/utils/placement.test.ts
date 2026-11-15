import { describe, expect, test } from 'bun:test';
import { placeAcross, placePopup, placeSide } from './placement.js';

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

describe('placeAcross center', () => {
    test('centres on the trigger and clamps inside the viewport', () => {
        const base = { viewportWidth: 360, width: 100, margin: 8, align: 'center' as const };
        expect(placeAcross({ ...base, triggerLeft: 130, triggerRight: 230 })).toEqual({ left: 130, align: 'center' });
        expect(placeAcross({ ...base, triggerLeft: 0, triggerRight: 20 }).left).toBe(8);
    });
});

describe('placeSide', () => {
    const base = {
        anchor: { left: 150, top: 300, right: 210, bottom: 340 },
        width: 100,
        height: 80,
        viewportWidth: 360,
        viewportHeight: 700,
        align: 'auto' as const,
        gap: 6,
        margin: 8
    };

    test('top sits above the anchor, centred', () => {
        expect(placeSide({ ...base, side: 'top' })).toMatchObject({ side: 'top', left: 130, top: 214 });
    });

    test('bottom sits below the anchor', () => {
        expect(placeSide({ ...base, side: 'bottom' })).toMatchObject({ side: 'bottom', top: 346 });
    });

    test('right flips to left when the right side is too tight', () => {
        const result = placeSide({ ...base, anchor: { left: 250, top: 300, right: 310, bottom: 340 }, side: 'right' });
        expect(result.side).toBe('left');
        expect(result.left).toBe(144);
    });

    test('left stays when it fits, and centres vertically', () => {
        const result = placeSide({ ...base, anchor: { left: 200, top: 300, right: 260, bottom: 340 }, side: 'left' });
        expect(result).toMatchObject({ side: 'left', left: 94, top: 280 });
    });

    test('top flips to bottom near the top edge', () => {
        const result = placeSide({ ...base, anchor: { left: 150, top: 20, right: 210, bottom: 60 }, side: 'top' });
        expect(result.side).toBe('bottom');
        expect(result.top).toBe(66);
    });

    test('a tight side with no better opposite does not flip', () => {
        const result = placeSide({ ...base, viewportHeight: 100, anchor: { left: 150, top: 60, right: 210, bottom: 80 }, side: 'top' });
        expect(result.side).toBe('top');
    });

    test('shifts along the edge to stay on screen', () => {
        expect(placeSide({ ...base, anchor: { left: 0, top: 300, right: 20, bottom: 340 }, side: 'bottom' }).left).toBe(8);
        expect(placeSide({ ...base, anchor: { left: 340, top: 300, right: 360, bottom: 340 }, side: 'bottom' }).left).toBe(252);
    });

    test('start and end line up with the anchor edges', () => {
        expect(placeSide({ ...base, side: 'bottom', align: 'start' }).left).toBe(150);
        expect(placeSide({ ...base, side: 'bottom', align: 'end' }).left).toBe(110);
    });
});
