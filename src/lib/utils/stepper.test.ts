import { describe, expect, test } from 'bun:test';
import { clampStep, stepState } from './stepper.js';

describe('stepState', () => {
    test('steps before the current one are done by default', () => {
        expect([0, 1, 2, 3].map((i) => stepState(i, 2))).toEqual(['done', 'done', 'current', 'upcoming']);
    });

    test('an explicit done list wins, even for later steps', () => {
        expect([0, 1, 2, 3].map((i) => stepState(i, 1, [3]))).toEqual(['upcoming', 'current', 'upcoming', 'done']);
    });
});

describe('clampStep', () => {
    test('keeps the index inside the list', () => {
        expect(clampStep(-3, 4)).toBe(0);
        expect(clampStep(9, 4)).toBe(3);
        expect(clampStep(2, 4)).toBe(2);
        expect(clampStep(1, 0)).toBe(0);
        expect(clampStep(Number.NaN, 4)).toBe(0);
    });
});
