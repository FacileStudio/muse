import { describe, expect, test } from 'bun:test';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

/*
 * Every `<iconify-icon>` reserves its box in CSS, not only in attributes.
 *
 * The custom element has no intrinsic size, and its `width`/`height` *attributes* only take
 * effect once the glyph data arrives from the network. Until then it is a 0×0 box — so a
 * button renders at label width and jumps when the icon lands, a nav row collapses, and
 * anything measuring a node that contains an icon measures it one icon too narrow.
 *
 * `Tabs` hit this first (its sliding pill was placed once on mount, against a width that was
 * missing every glyph, and stayed clipped forever) and fixed it locally. Twenty-eight other
 * call sites across fourteen components did not, which is a rule that clearly needed a test
 * rather than a comment.
 */

const ROOT = join(import.meta.dir);
const SIZE_FOR: Record<string, string> = {
    '14': '3.5',
    '16': '4',
    '18': '4.5',
    '20': '5',
    '22': '5.5',
    '24': '6',
    '28': '7'
};

function walk(dir: string): string[] {
    return readdirSync(dir).flatMap((entry) => {
        const path = join(dir, entry);
        if (statSync(path).isDirectory()) return walk(path);
        return path.endsWith('.svelte') ? [path] : [];
    });
}

const files = walk(ROOT);

describe('an icon reserves its box before the network answers', () => {
    const offences: string[] = [];
    let checked = 0;

    for (const file of files) {
        /* Comments are stripped first: several of these components explain this very rule and
           name the element while doing it, and a prose mention is not a call site. */
        const source = readFileSync(file, 'utf8')
            .replace(/\/\*[\s\S]*?\*\//g, '')
            .replace(/<!--[\s\S]*?-->/g, '');
        const short = file.slice(ROOT.length + 1);

        for (const match of source.matchAll(/<iconify-icon[\s\S]*?>/g)) {
            const tag = match[0];
            checked++;

            if (!/class=/.test(tag)) {
                offences.push(`${short}: an icon with no class at all`);
                continue;
            }
            if (!/\bsize-[\d.]+\b/.test(tag) && !/\{glyphClass\[/.test(tag)) {
                const w = /width="(\d+)"/.exec(tag)?.[1];
                const want = w ? `size-${SIZE_FOR[w] ?? '?'}` : 'a size-* class';
                offences.push(`${short}: icon needs ${want}`);
                continue;
            }

            /* A reserved box that disagrees with the attribute is worse than none: the element
               is laid out at one size and paints at another. */
            const w = /width="(\d+)"/.exec(tag)?.[1];
            const cls = /\bsize-([\d.]+)\b/.exec(tag)?.[1];
            if (w && cls && SIZE_FOR[w] && SIZE_FOR[w] !== cls) {
                offences.push(`${short}: width="${w}" but size-${cls} (expected size-${SIZE_FOR[w]})`);
            }
        }
    }

    test('every icon carries a size class matching its width attribute', () => {
        expect(offences).toEqual([]);
    });

    test('the scan actually found the icons', () => {
        expect(checked).toBeGreaterThan(25);
    });
});
