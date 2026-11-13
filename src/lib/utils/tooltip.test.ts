import { describe, expect, test } from 'bun:test';
import { TOOLTIP_DELAY, TooltipGroup, describes, iconTooltip } from './tooltip.js';

function group() {
    const clock = { now: 0 };
    return { clock, tips: new TooltipGroup(500, () => clock.now) };
}

describe('TooltipGroup', () => {
    test('a cold page waits the full delay', () => {
        const { tips } = group();
        expect(tips.delayFor(TOOLTIP_DELAY)).toBe(300);
    });

    test('while one is open, the next opens at once and closes the first', () => {
        const { tips } = group();
        const closedA: string[] = [];
        const a = () => {
            closedA.push('a');
            tips.closed(a);
        };
        tips.opened(a);
        expect(tips.delayFor(300)).toBe(0);
        tips.opened(() => {});
        expect(closedA).toEqual(['a']);
    });

    test('within the skip window the next opens at once, after it the delay is back', () => {
        const { clock, tips } = group();
        const a = () => tips.closed(a);
        tips.opened(a);
        clock.now = 1000;
        a();
        clock.now = 1499;
        expect(tips.delayFor(300)).toBe(0);
        clock.now = 1500;
        expect(tips.delayFor(300)).toBe(300);
    });

    test('a stale close from another tooltip does not end the open one', () => {
        const { clock, tips } = group();
        const a = () => {};
        tips.opened(a);
        clock.now = 5000;
        tips.closed(() => {});
        expect(tips.delayFor(300)).toBe(0);
    });

    test('an explicit delay is still skipped while warm', () => {
        const { tips } = group();
        expect(tips.delayFor(1200)).toBe(1200);
        tips.opened(() => {});
        expect(tips.delayFor(1200)).toBe(0);
    });
});

describe('iconTooltip', () => {
    test('defaults to the aria-label', () => {
        expect(iconTooltip(undefined, 'Copier')).toBe('Copier');
    });

    test('a string overrides it, false opts out', () => {
        expect(iconTooltip('Copier le lien', 'Copier')).toBe('Copier le lien');
        expect(iconTooltip(false, 'Copier')).toBeNull();
    });

    test('nothing to show without a label', () => {
        expect(iconTooltip(undefined, undefined)).toBeNull();
        expect(iconTooltip('  ', 'Copier')).toBeNull();
    });
});

describe('describes', () => {
    test('a hint the name already says is not a description', () => {
        expect(describes('Copier', 'Copier')).toBe(false);
        expect(describes('Afficher', 'Afficher le secret')).toBe(false);
        expect(describes('copier', 'Copier le secret')).toBe(false);
    });

    test('a hint that adds something is', () => {
        expect(describes('Supprimer le projet, définitivement', 'Supprimer')).toBe(true);
        expect(describes('Copier', undefined)).toBe(true);
    });
});
