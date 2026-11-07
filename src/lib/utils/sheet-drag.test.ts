import { expect, test } from 'bun:test';
import { SheetDrag } from './sheet-drag.js';

test('a pull past a quarter of the height closes the sheet', () => {
    const drag = new SheetDrag();
    drag.begin(1, 100, 0);
    expect(drag.move(260, 1000)).toBe(160);
    expect(drag.end(1000, 400)).toBe(true);
});

test('a short, slow pull settles back', () => {
    const drag = new SheetDrag();
    drag.begin(1, 100, 0);
    drag.move(130, 1000);
    expect(drag.end(1000, 400)).toBe(false);
});

test('a fast flick closes even when short, a stale one does not', () => {
    const fast = new SheetDrag();
    fast.begin(1, 0, 0);
    fast.move(40, 20);
    expect(fast.end(30, 400)).toBe(true);
    const stale = new SheetDrag();
    stale.begin(1, 0, 0);
    stale.move(40, 20);
    expect(stale.end(400, 400)).toBe(false);
});

test('pulling up never moves the sheet above its resting place', () => {
    const drag = new SheetDrag();
    drag.begin(1, 100, 0);
    expect(drag.move(40, 10)).toBe(0);
});
