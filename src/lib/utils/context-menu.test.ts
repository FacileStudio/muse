import { expect, test } from 'bun:test';
import { driftedTooFar, opensContextMenu, placeAtPoint } from './context-menu.js';

const viewport = { viewportWidth: 1000, viewportHeight: 800, margin: 8 };

test('opens at the pointer when it fits', () => {
    expect(placeAtPoint({ x: 100, y: 200, width: 180, height: 240, ...viewport })).toEqual({ left: 100, top: 200, maxHeight: 784 });
});

test('flips left and up near the bottom-right corner', () => {
    expect(placeAtPoint({ x: 950, y: 700, width: 180, height: 240, ...viewport })).toEqual({ left: 770, top: 460, maxHeight: 784 });
});

test('stays inside the margins on a tiny viewport', () => {
    const spot = placeAtPoint({ x: 10, y: 10, width: 300, height: 900, viewportWidth: 360, viewportHeight: 600, margin: 8 });
    expect(spot.left).toBe(10);
    expect(spot.top).toBe(8);
    expect(spot.maxHeight).toBe(584);
});

test('never leaves the left margin when flipping', () => {
    expect(placeAtPoint({ x: 100, y: 100, width: 350, height: 100, viewportWidth: 360, viewportHeight: 600, margin: 8 }).left).toBe(8);
});

test('the ContextMenu key and Shift+F10 open the menu', () => {
    expect(opensContextMenu({ key: 'ContextMenu' })).toBe(true);
    expect(opensContextMenu({ key: 'F10', shiftKey: true })).toBe(true);
    expect(opensContextMenu({ key: 'F10' })).toBe(false);
    expect(opensContextMenu({ key: 'Enter', shiftKey: true })).toBe(false);
});

test('a touch that drifts is a scroll', () => {
    expect(driftedTooFar(0, 0, 3, 4)).toBe(false);
    expect(driftedTooFar(0, 0, 8, 8)).toBe(true);
});
