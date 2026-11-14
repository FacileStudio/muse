import { describe, expect, mock, test } from 'bun:test';
import { revealActive, revealOffset } from './rail.js';

const view = { top: 100, bottom: 500 };

describe('revealOffset', () => {
    test('an item already in view does not move the list', () => {
        expect(revealOffset(view, { top: 200, bottom: 244 }, 0)).toBeNull();
        expect(revealOffset(view, { top: 100, bottom: 500 }, 40)).toBeNull();
    });

    test('an item below the fold scrolls just enough to show its bottom edge', () => {
        expect(revealOffset(view, { top: 700, bottom: 744 }, 0)).toBe(252);
        expect(revealOffset(view, { top: 480, bottom: 524 }, 30)).toBe(62);
    });

    test('an item above the view scrolls up to its top edge, never past zero', () => {
        expect(revealOffset(view, { top: 60, bottom: 104 }, 300)).toBe(252);
        expect(revealOffset(view, { top: 95, bottom: 139 }, 2)).toBe(0);
    });

    test('an item taller than the view aligns its top', () => {
        expect(revealOffset(view, { top: 300, bottom: 900 }, 0)).toBe(192);
    });
});

function fakeContainer(itemTop: number, withScrollTo = true) {
    const item = { getBoundingClientRect: () => ({ top: itemTop, bottom: itemTop + 44 }) };
    const container = {
        scrollTop: 0,
        scrollTo: withScrollTo ? mock() : undefined,
        querySelector: mock(() => item),
        getBoundingClientRect: () => view
    };
    return container;
}

describe('revealActive', () => {
    test('scrolls the container, not the page, to the active link', () => {
        const container = fakeContainer(700);
        revealActive(container as unknown as HTMLElement, false);
        expect(container.querySelector).toHaveBeenCalledWith('[aria-current="page"]');
        expect(container.scrollTo).toHaveBeenCalledWith({ top: 252, behavior: 'auto' });
    });

    test('glides on a route change', () => {
        const container = fakeContainer(700);
        revealActive(container as unknown as HTMLElement, true);
        expect(container.scrollTo).toHaveBeenCalledWith({ top: 252, behavior: 'smooth' });
    });

    test('leaves a visible link alone', () => {
        const container = fakeContainer(200);
        revealActive(container as unknown as HTMLElement, true);
        expect(container.scrollTo).not.toHaveBeenCalled();
    });

    test('falls back to scrollTop where scrollTo is missing (jsdom)', () => {
        const container = fakeContainer(700, false);
        revealActive(container as unknown as HTMLElement, true);
        expect(container.scrollTop).toBe(252);
    });

    test('does nothing without an active link', () => {
        const container = { ...fakeContainer(700), querySelector: () => null };
        revealActive(container as unknown as HTMLElement, true);
        expect(container.scrollTo).not.toHaveBeenCalled();
    });
});
