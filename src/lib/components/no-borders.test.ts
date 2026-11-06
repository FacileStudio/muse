import { describe, expect, test } from 'bun:test';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

/*
 * muse draws no borders, anywhere (CHARTE section 5). Controls, cards, tables, dividers,
 * popovers and toasts separate by fill step, spacing and, on floating surfaces only, a shadow.
 * There is no allowlist: a component that wants an edge gets a fill instead.
 *
 * Allowed: the resets `border-0` and `border-none`, `border-collapse`, and the one focus
 * outline, which must sit behind a focus variant.
 */

const ROOT = import.meta.dir;
const RESETS = new Set(['border-0', 'border-none', 'border-collapse', 'border-separate', 'border-radius']);
const FOCUS_VARIANT = /focus/;
const FOCUS_OUTLINES = new Set(['outline-2', 'outline-offset-2', 'outline-fc-ring', 'outline-none', 'outline-hidden']);

function walk(dir: string): string[] {
    return readdirSync(dir).flatMap((entry) => {
        const path = join(dir, entry);
        if (statSync(path).isDirectory()) return walk(path);
        return path.endsWith('.svelte') ? [path] : [];
    });
}

function split(token: string): { variants: string; utility: string } {
    const at = token.lastIndexOf(':');
    return { variants: token.slice(0, at + 1), utility: token.slice(at + 1) };
}

function isBorder(utility: string): boolean {
    if (RESETS.has(utility)) return false;
    return /^(border|divide|ring)(-|$)/.test(utility);
}

function isStrayOutline(variants: string, utility: string): boolean {
    if (!utility.startsWith('outline') || utility === 'outline') return false;
    return !(FOCUS_VARIANT.test(variants) && FOCUS_OUTLINES.has(utility));
}

function violations(source: string): string[] {
    const code = source.replace(/<!--[\s\S]*?-->/g, '').replace(/\/\*[\s\S]*?\*\//g, '');
    return code
        .split(/[\s'"`{}(),;=]+/)
        .filter((token) => {
            const { variants, utility } = split(token);
            return isBorder(utility) || isStrayOutline(variants, utility);
        });
}

describe('no borders', () => {
    const files = walk(ROOT);

    test('the scan finds the components', () => {
        expect(files.length).toBeGreaterThan(60);
    });

    for (const path of files) {
        test(path.slice(ROOT.length + 1), () => {
            expect(violations(readFileSync(path, 'utf8'))).toEqual([]);
        });
    }

    test('no border-fc or divide class survives in src/lib/components', () => {
        const hits = files.filter((path) => /\b(border-fc-|divide-)/.test(readFileSync(path, 'utf8')));
        expect(hits).toEqual([]);
    });

    test('the scan catches borders, divides, rings and stray outlines', () => {
        expect(violations('<div class="border border-fc-border hover:divide-y ring-2 outline-2">')).toEqual([
            'border',
            'border-fc-border',
            'hover:divide-y',
            'ring-2',
            'outline-2'
        ]);
    });

    test('the scan lets resets and the focus outline through', () => {
        const ok = '<div class="border-0 border-none focus-visible:outline-2 peer-focus-visible:outline-fc-ring">';
        expect(violations(ok)).toEqual([]);
    });
});
