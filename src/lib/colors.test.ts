import { describe, expect, test } from 'bun:test';
import { parseHex } from './colors.js';

describe('parseHex', () => {
    test('accepts every spelling a designer pastes', () => {
        expect(parseHex('fff')).toBe('#ffffff');
        expect(parseHex('#fff')).toBe('#ffffff');
        expect(parseHex('FFF')).toBe('#ffffff');
        expect(parseHex('#FFFFFF')).toBe('#ffffff');
        expect(parseHex('  #A1b2C3  ')).toBe('#a1b2c3');
        expect(parseHex('AD9EF0')).toBe('#ad9ef0');
    });

    test('expands a shorthand by doubling each digit, not by padding', () => {
        expect(parseHex('#1a2')).toBe('#11aa22');
    });

    /* The half-typed cases matter more than the garbage ones: this is what the text field
       sees on every keystroke, and `null` is what stops it writing to the bound value. */
    test('rejects anything that is not a full colour, without throwing', () => {
        for (const input of ['', '   ', '#', 'f', 'ff', '#ffff', '#fffff', '#fffffff', 'ggg', '#12345z', 'rebeccapurple', '#fff #fff', null, undefined]) {
            expect(parseHex(input)).toBeNull();
        }
    });
});
