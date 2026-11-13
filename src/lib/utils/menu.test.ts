import { describe, expect, mock, test } from 'bun:test';
import { MenuState } from './menu.svelte.js';

type FakeItem = { focus: ReturnType<typeof mock>; scrollIntoView: ReturnType<typeof mock> };

function setup(labels: string[], disabled: boolean[] = labels.map(() => false)) {
    const items: FakeItem[] = labels.map(() => ({ focus: mock(), scrollIntoView: mock() }));
    const trigger = { focus: mock() };
    const menu = new MenuState({
        labels: () => labels,
        disabled: () => disabled,
        trigger: () => trigger as unknown as HTMLElement,
        items: () => items as unknown as HTMLElement[]
    });
    menu.open = true;
    menu.active = 0;
    return { menu, items, trigger };
}

function press(menu: MenuState, key: string) {
    menu.keydown({ key, preventDefault: () => {} } as KeyboardEvent);
}

describe('MenuState keyboard', () => {
    test('arrows wrap and skip disabled items', () => {
        const { menu } = setup(['Copier', 'Coller', 'Couper', 'Supprimer'], [false, true, false, false]);
        press(menu, 'ArrowDown');
        expect(menu.active).toBe(2);
        press(menu, 'ArrowDown');
        press(menu, 'ArrowDown');
        expect(menu.active).toBe(0);
        press(menu, 'ArrowUp');
        expect(menu.active).toBe(3);
    });

    test('Home and End jump to the ends, type-ahead jumps by first letter', () => {
        const { menu } = setup(['Alpha', 'Bravo', 'Charlie', 'Delta']);
        press(menu, 'End');
        expect(menu.active).toBe(3);
        press(menu, 'Home');
        expect(menu.active).toBe(0);
        press(menu, 'c');
        expect(menu.active).toBe(2);
    });

    test('Escape and Tab close and return focus to the trigger', () => {
        for (const key of ['Escape', 'Tab']) {
            const { menu, trigger } = setup(['Alpha', 'Bravo']);
            press(menu, key);
            expect(menu.open).toBe(false);
            expect(trigger.focus).toHaveBeenCalled();
        }
    });

    test('the keyboard-active item is focused without a jump and scrolled to the nearest edge', () => {
        const { menu, items } = setup(Array.from({ length: 30 }, (_, i) => `Entrée ${i}`));
        press(menu, 'End');
        menu.focusActive();
        expect(items[29].focus).toHaveBeenCalledWith({ preventScroll: true });
        expect(items[29].scrollIntoView).toHaveBeenCalledWith({ block: 'nearest' });
    });

    test('a pointer hover neither focuses nor scrolls', () => {
        const { menu, items } = setup(['Alpha', 'Bravo', 'Charlie']);
        menu.point(2);
        menu.focusActive();
        expect(items[2].focus).not.toHaveBeenCalled();
        expect(items[2].scrollIntoView).not.toHaveBeenCalled();
    });

    test('an item without scrollIntoView (jsdom) is still focused', () => {
        const { menu, items } = setup(['Alpha', 'Bravo']);
        const bare = items[1] as Partial<FakeItem>;
        delete bare.scrollIntoView;
        press(menu, 'ArrowDown');
        expect(() => menu.focusActive()).not.toThrow();
        expect(items[1].focus).toHaveBeenCalled();
    });
});
