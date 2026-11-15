import { describe, expect, test } from 'bun:test';
import { BULLE_NAME, BULLE_SIZES, bulleAccessibleName, bulleLook, bulleName } from './bulle.js';

describe('bulleLook', () => {
    test('thinking moves the blob and gives it the thinking face', () => {
        expect(bulleLook('thinking', false)).toEqual({ animate: 'always', face: 'thinking', muted: false });
    });

    test('reduced motion keeps the face and stops the motion', () => {
        expect(bulleLook('thinking', true)).toEqual({ animate: null, face: 'thinking', muted: false });
    });

    test('done smiles, unavailable greys out, idle is plain', () => {
        expect(bulleLook('done', false).face).toBe('happy');
        expect(bulleLook('unavailable', false)).toEqual({ animate: null, face: null, muted: true });
        expect(bulleLook('idle', false)).toEqual({ animate: null, face: null, muted: false });
    });
});

describe('bulleName', () => {
    test('a blank or missing name falls back to Bulle', () => {
        expect(bulleName(undefined)).toBe(BULLE_NAME);
        expect(bulleName('   ')).toBe(BULLE_NAME);
        expect(bulleName(' Nova ')).toBe('Nova');
    });
});

describe('bulleAccessibleName', () => {
    test('explicit label wins, then the visible label, then the fallback', () => {
        expect(bulleAccessibleName('Plan', 'Ask', 'Open Nova')).toBe('Plan');
        expect(bulleAccessibleName(undefined, ' Ask ', 'Open Nova')).toBe('Ask');
        expect(bulleAccessibleName(undefined, undefined, 'Open Nova')).toBe('Open Nova');
        expect(bulleAccessibleName(' ', ' ', ' ')).toBe(BULLE_NAME);
    });
});

describe('sizes', () => {
    test('every variant has a blob size', () => {
        expect(Object.keys(BULLE_SIZES).sort()).toEqual(['chip', 'header', 'icon']);
    });
});
