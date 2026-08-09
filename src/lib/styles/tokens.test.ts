import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('./tokens.css', import.meta.url), 'utf8');

function block(selector: string): Record<string, string> {
    const start = css.indexOf(selector);
    if (start < 0) throw new Error(`no block for ${selector}`);
    const open = css.indexOf('{', start);
    const end = css.indexOf('}', open);
    const out: Record<string, string> = {};
    for (const line of css.slice(open + 1, end).split('\n')) {
        const match = line.match(/^\s*(--[\w-]+)\s*:\s*(.+?);\s*$/);
        if (match) out[match[1]] = match[2];
    }
    return out;
}

/*
 * The dark palette is written twice — once under `prefers-color-scheme` and once under an
 * explicit `.dark` class — because plain CSS cannot share a declaration block between a
 * media query and a class selector. A comment asking the next person to "edit both or
 * neither" is not a mechanism; this is.
 */
describe('dark mode blocks', () => {
    const media = block(':root:not(.light)');
    const explicit = block(':root.dark');

    test('define the same tokens', () => {
        expect(Object.keys(explicit).sort()).toEqual(Object.keys(media).sort());
    });

    test('define the same values', () => {
        expect(explicit).toEqual(media);
    });
});

/*
 * `color-scheme` is not a custom property, so `block()` above does not see it and the
 * "edit both or neither" test cannot cover it. It gets its own check, because it is the
 * one declaration that controls everything the *browser* paints — native select popups,
 * form internals, autofill, caret, the canvas past the page background — and losing it
 * looks exactly like "dark mode is broken" while every token is correct.
 */
describe('color-scheme', () => {
    function scheme(selector: string): string | undefined {
        const start = css.indexOf(selector);
        const open = css.indexOf('{', start);
        const end = css.indexOf('}', open);
        return css.slice(open + 1, end).match(/color-scheme\s*:\s*(\w+)\s*;/)?.[1];
    }

    test('the light default is declared on html', () => {
        expect(css.match(/html\s*\{[\s\S]*?color-scheme:\s*light;/)).not.toBeNull();
    });

    test('both dark blocks flip it', () => {
        expect(scheme(':root:not(.light)')).toBe('dark');
        expect(scheme(':root.dark')).toBe('dark');
    });
});

describe('token surface', () => {
    const light = block('@theme {');

    test('every dark token overrides a token declared in the light theme', () => {
        const declared = new Set(Object.keys(light));
        const chart = block('@theme static {');
        for (const key of Object.keys(chart)) declared.add(key);

        const orphans = Object.keys(block(':root.dark')).filter((key) => !declared.has(key));
        expect(orphans).toEqual([]);
    });

    test('semantic tokens that carry chroma are the only ones that do', () => {
        const chromatic = Object.entries(light)
            .filter(([key]) => key.startsWith('--color-'))
            .filter(([, value]) => {
                const match = value.match(/oklch\(\s*[\d.]+\s+([\d.]+)/);
                return match ? Number(match[1]) > 0 : false;
            })
            .map(([key]) => key.replace('--color-fc-', ''));

        expect(chromatic.sort()).toEqual(['admin', 'danger', 'info', 'owner', 'success', 'warning']);
    });
});

describe('the stock palette is deleted', () => {
    const light = block('@theme {');

    /*
     * `--color-*: initial` is what makes an off-system colour impossible rather than merely
     * discouraged, so it is worth a test: someone adding a token block above it, or reordering
     * the file, would silently hand every consumer `bg-red-500` back.
     */
    test('the namespace reset is declared before any colour', () => {
        const reset = css.indexOf('--color-*: initial');
        const firstColor = css.indexOf('--color-fc-');
        expect(reset).toBeGreaterThan(-1);
        expect(reset).toBeLessThan(firstColor);
    });

    test('only the four theme-neutral primitives survive the reset', () => {
        const kept = Object.keys(light)
            .filter((key) => key.startsWith('--color-') && !key.startsWith('--color-fc-'))
            .filter((key) => key !== '--color-*')
            .map((key) => key.replace('--color-', ''));

        expect(kept.sort()).toEqual(['black', 'current', 'transparent', 'white']);
    });
});
