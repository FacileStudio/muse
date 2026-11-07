import { expect, test } from 'bun:test';
import { moveThumb, nearestThumb, ratioOf, snap, valueAt, valueForKey } from './slider.js';

const unit = { min: 0, max: 100, step: 1 };
const fine = { min: 0.5, max: 1, step: 0.05 };

test('snap clamps and rounds to the step from min', () => {
    expect(snap(37.4, unit)).toBe(37);
    expect(snap(-5, unit)).toBe(0);
    expect(snap(500, unit)).toBe(100);
    expect(snap(0.72, fine)).toBe(0.7);
    expect(snap(0.5 + 0.05 * 3, fine)).toBe(0.65);
    expect(snap(Number.NaN, fine)).toBe(0.5);
});

test('a step that does not divide the range never overshoots the max', () => {
    expect(snap(10, { min: 0, max: 10, step: 3 })).toBe(9);
});

test('ratio and valueAt are inverse across the track', () => {
    expect(ratioOf(25, unit)).toBe(0.25);
    expect(valueAt(0.25, unit)).toBe(25);
    expect(valueAt(2, unit)).toBe(100);
    expect(ratioOf(5, { min: 5, max: 5, step: 1 })).toBe(0);
});

test('keys follow the APG slider pattern', () => {
    expect(valueForKey('ArrowRight', 10, unit)).toBe(11);
    expect(valueForKey('ArrowUp', 10, unit)).toBe(11);
    expect(valueForKey('ArrowLeft', 10, unit)).toBe(9);
    expect(valueForKey('ArrowDown', 0, unit)).toBe(0);
    expect(valueForKey('PageUp', 10, unit)).toBe(20);
    expect(valueForKey('PageDown', 10, unit)).toBe(0);
    expect(valueForKey('Home', 10, unit)).toBe(0);
    expect(valueForKey('End', 10, unit)).toBe(100);
    expect(valueForKey('a', 10, unit)).toBeNull();
    expect(valueForKey('PageUp', 0.5, fine)).toBe(0.55);
});

test('a range press grabs the nearer thumb', () => {
    expect(nearestThumb([20, 80], 30)).toBe(0);
    expect(nearestThumb([20, 80], 70)).toBe(1);
    expect(nearestThumb([50, 50], 60)).toBe(1);
    expect(nearestThumb([50, 50], 40)).toBe(0);
});

test('range thumbs never cross and keep their gap', () => {
    expect(moveThumb([20, 80], 0, 90)).toEqual([80, 80]);
    expect(moveThumb([20, 80], 1, 10)).toEqual([20, 20]);
    expect(moveThumb([20, 80], 0, 90, 5)).toEqual([75, 80]);
    expect(moveThumb([20, 80], 1, 50)).toEqual([20, 50]);
});
