import { describe, expect, test } from 'bun:test';
import { pageRange } from './pagination.js';

describe('pageRange', () => {
    test('a short list shows every page', () => {
        expect(pageRange(1, 5)).toEqual([1, 2, 3, 4, 5]);
    });

    test('a long list hides the middle behind gaps', () => {
        expect(pageRange(10, 20)).toEqual([1, 'gap', 9, 10, 11, 'gap', 20]);
    });

    test('near the start there is one gap', () => {
        expect(pageRange(1, 20)).toEqual([1, 2, 'gap', 20]);
        expect(pageRange(3, 20)).toEqual([1, 2, 3, 4, 'gap', 20]);
    });

    test('a gap of one page shows that page instead', () => {
        expect(pageRange(4, 20)).toEqual([1, 2, 3, 4, 5, 'gap', 20]);
    });

    test('out-of-range pages are clamped and an empty list is empty', () => {
        expect(pageRange(99, 3)).toEqual([1, 2, 3]);
        expect(pageRange(1, 0)).toEqual([]);
    });
});
