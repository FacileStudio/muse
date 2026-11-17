import { afterEach, describe, expect, mock, test } from 'bun:test';
import { MenuState, opensOnKey, submenuKeydown } from './menu.svelte.js';

function key(name: string) {
    return { key: name, preventDefault: mock(), stopPropagation: mock() };
}

function level(labels: string[]) {
    const items = labels.map(() => ({ focus: mock(), scrollIntoView: mock() }));
    const anchor = { focus: mock() };
    const menu = new MenuState({
        labels: () => labels,
        disabled: () => labels.map(() => false),
        trigger: () => anchor as unknown as HTMLElement,
        items: () => items as unknown as HTMLElement[]
    });
    menu.open = true;
    menu.active = 0;
    return { menu, anchor };
}

describe('opening a submenu from its row', () => {
    test('ArrowRight opens a row with entries and is consumed', () => {
        const event = key('ArrowRight');
        expect(opensOnKey(event, { items: [{ label: 'PDF' }] })).toBe(true);
        expect(event.preventDefault).toHaveBeenCalled();
        expect(event.stopPropagation).toHaveBeenCalled();
    });

    test('ArrowRight on a plain or disabled row, or another key, does nothing', () => {
        for (const [name, entry] of [
            ['ArrowRight', {}],
            ['ArrowRight', { items: [], disabled: true }],
            ['ArrowDown', { items: [] }]
        ] as const) {
            const event = key(name);
            expect(opensOnKey(event, entry)).toBe(false);
            expect(event.preventDefault).not.toHaveBeenCalled();
        }
    });
});

describe('keys inside a submenu', () => {
    test('arrows wrap and type-ahead jumps inside the submenu, and the parent never sees them', () => {
        const { menu } = level(['PDF', 'CSV', 'JSON']);
        const close = mock();
        for (const name of ['ArrowDown', 'ArrowDown', 'ArrowDown']) {
            const event = key(name);
            submenuKeydown(event, menu, close);
            expect(event.stopPropagation).toHaveBeenCalled();
        }
        expect(menu.active).toBe(0);
        submenuKeydown(key('j'), menu, close);
        expect(menu.active).toBe(2);
        expect(close).not.toHaveBeenCalled();
    });

    test('ArrowLeft and Escape close back to the parent row', () => {
        for (const name of ['ArrowLeft', 'Escape']) {
            const { menu } = level(['PDF', 'CSV']);
            const close = mock();
            const event = key(name);
            submenuKeydown(event, menu, close);
            expect(close).toHaveBeenCalledTimes(1);
            expect(event.preventDefault).toHaveBeenCalled();
            expect(event.stopPropagation).toHaveBeenCalled();
        }
    });

    test('Tab bubbles to the root menu, which closes everything', () => {
        const { menu } = level(['PDF']);
        const close = mock();
        const event = key('Tab');
        submenuKeydown(event, menu, close);
        expect(event.stopPropagation).not.toHaveBeenCalled();
        expect(close).not.toHaveBeenCalled();
        expect(menu.open).toBe(true);
    });

    test('Enter is left to the row, so the browser clicks it', () => {
        const { menu } = level(['PDF']);
        const event = key('Enter');
        submenuKeydown(event, menu, mock());
        expect(event.preventDefault).not.toHaveBeenCalled();
    });
});

describe('where a submenu opens', () => {
    const saved = { window: globalThis.window, document: globalThis.document };

    afterEach(() => {
        Object.assign(globalThis, saved);
    });

    function placed(rowLeft: number, rowRight: number) {
        Object.assign(globalThis, {
            window: { innerHeight: 800 },
            document: { documentElement: { clientWidth: 1000 } }
        });
        const row = { getBoundingClientRect: () => ({ left: rowLeft, right: rowRight, top: 100, bottom: 144 }) };
        const menu = new MenuState({
            labels: () => [],
            disabled: () => [],
            trigger: () => row as unknown as HTMLElement,
            items: () => [],
            across: { side: () => 'right', align: () => 'start', width: () => 200, height: () => 120 }
        });
        menu.place();
        return menu;
    }

    test('to the right of its row, top edges aligned', () => {
        const menu = placed(100, 300);
        expect(menu.side).toBe('right');
        expect(menu.left).toBeGreaterThan(300);
        expect(menu.top).toBe(100);
    });

    test('to the left near the right edge of the viewport', () => {
        const menu = placed(700, 900);
        expect(menu.side).toBe('left');
        expect(menu.left + 200).toBeLessThan(700);
    });
});
