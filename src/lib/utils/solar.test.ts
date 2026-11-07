import { expect, test } from 'bun:test';
import { solarIconId, solarIconNames } from './solar.js';

test('every linear Solar icon is offered once', () => {
    expect(solarIconNames.length).toBe(1451);
    expect(new Set(solarIconNames).size).toBe(solarIconNames.length);
});

test('a name maps to its exact Solar id', () => {
    expect(solarIconId('AddCircle')).toBe('solar:add-circle-linear');
    expect(solarIconId('Grid2x2')).toBe('solar:grid-2x2-linear');
    expect(solarIconId('Magnifier')).toBe('solar:magnifier-linear');
});

test('a renamed name and an empty one still resolve', () => {
    expect(solarIconId('Accumulator')).toBe('solar:accumulator-linear');
    expect(solarIconId('')).toBe('solar:widget-2-linear');
});
