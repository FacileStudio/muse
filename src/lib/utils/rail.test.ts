import { describe, expect, mock, test } from 'bun:test';
import { revealActive, revealChild, revealOffset } from './rail.js';
import { edgeMask, hiddenEdges, watchScrollArea } from './scroll-area.js';

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
        expect(container.scrollTo).toHaveBeenCalledWith({ top: 268, behavior: 'auto' });
    });

    test('glides on a route change', () => {
        const container = fakeContainer(700);
        revealActive(container as unknown as HTMLElement, true);
        expect(container.scrollTo).toHaveBeenCalledWith({ top: 268, behavior: 'smooth' });
    });

    test('leaves a visible link alone', () => {
        const container = fakeContainer(200);
        revealActive(container as unknown as HTMLElement, true);
        expect(container.scrollTo).not.toHaveBeenCalled();
    });

    test('falls back to scrollTop where scrollTo is missing (jsdom)', () => {
        const container = fakeContainer(700, false);
        revealActive(container as unknown as HTMLElement, true);
        expect(container.scrollTop).toBe(268);
    });

    test('does nothing without an active link', () => {
        const container = { ...fakeContainer(700), querySelector: () => null };
        revealActive(container as unknown as HTMLElement, true);
        expect(container.scrollTo).not.toHaveBeenCalled();
    });
});

describe('revealChild', () => {
    test('scrolls a row sideways by its left and right edges', () => {
        const container = {
            scrollLeft: 0,
            scrollTo: mock(),
            getBoundingClientRect: () => ({ top: 0, bottom: 44, left: 0, right: 358 })
        };
        const tab = { getBoundingClientRect: () => ({ top: 0, bottom: 44, left: 280, right: 372 }) };
        revealChild(container as unknown as HTMLElement, tab as unknown as HTMLElement, 'x', false);
        expect(container.scrollTo).toHaveBeenCalledWith({ left: 38, behavior: 'auto' });
    });
});

describe('hiddenEdges and edgeMask', () => {
    const area = (scrollTop: number, scrollHeight: number) =>
        ({ scrollTop, scrollHeight, clientHeight: 400, scrollLeft: 0, scrollWidth: 300, clientWidth: 300 }) as unknown as HTMLElement;

    test('a column that fits hides nothing and gets no mask', () => {
        expect(hiddenEdges(area(0, 400), 'y')).toEqual({ start: false, end: false });
        expect(edgeMask({ start: false, end: false }, 'y')).toBe('');
    });

    test('a column scrolled to the middle hides both ends', () => {
        expect(hiddenEdges(area(100, 900), 'y')).toEqual({ start: true, end: true });
    });

    test('a column at its end hides only the start', () => {
        expect(hiddenEdges(area(500, 900), 'y')).toEqual({ start: true, end: false });
    });

    test('the mask fades only the hidden end, in both spellings', () => {
        const mask = edgeMask({ start: false, end: true }, 'x');
        expect(mask).toContain('linear-gradient(to right, black 0, black 24px, black calc(100% - 24px), transparent 100%)');
        expect(mask).toContain('-webkit-mask-image');
    });
});

describe('watchScrollArea', () => {
    test('reports a person scrolling and stops after cleanup', () => {
        const target = new EventTarget() as unknown as HTMLElement;
        Object.defineProperty(target, 'children', { value: [] });
        const onUser = mock();
        const onScroll = mock();
        const stop = watchScrollArea(target, { onUser, onScroll });
        target.dispatchEvent(new Event('wheel'));
        target.dispatchEvent(new Event('scroll'));
        expect(onUser).toHaveBeenCalledTimes(1);
        expect(onScroll).toHaveBeenCalledTimes(1);
        stop();
        target.dispatchEvent(new Event('touchmove'));
        expect(onUser).toHaveBeenCalledTimes(1);
    });
});
