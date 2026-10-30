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

describe('dark only', () => {
    test('html declares the dark scheme and nothing switches it', () => {
        expect(css.match(/html\s*\{[\s\S]*?color-scheme:\s*dark;/)).not.toBeNull();
        expect(css).not.toMatch(/\.dark|\.light|prefers-color-scheme/);
    });

    test('the brand gradient and its solid share one source', () => {
        expect(block('@theme {')['--color-fc-brand']).toBe('var(--fc-brand-from)');
        expect(block(':root {')['--fc-brand-from']).toBe('#71ffc6');
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
