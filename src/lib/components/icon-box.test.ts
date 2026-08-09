import { describe, expect, test } from 'bun:test';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

/*
 * The library draws icons with `<Icon>`, never with `<iconify-icon>` directly.
 *
 * This started as a narrower rule — every `<iconify-icon>` needs a `size-*` class, because the
 * custom element has no intrinsic size and its width/height *attributes* only take effect once
 * the glyph arrives over the network, leaving a 0×0 box for the first few hundred milliseconds.
 * Twenty-eight call sites across fourteen components were missing it.
 *
 * Bundling the paths made the whole class of bug go away: `<Icon>` renders a real `<svg>` with
 * its box from the first frame, during SSR, with no request. So the rule is now the stronger
 * one — do not reach for the custom element at all. `Icon.svelte` itself is the single
 * exception, where it is the documented fallback for a name muse does not carry.
 */

const ROOT = join(import.meta.dir);
const ALLOWED = 'atoms/Icon.svelte';

function walk(dir: string): string[] {
    return readdirSync(dir).flatMap((entry) => {
        const path = join(dir, entry);
        if (statSync(path).isDirectory()) return walk(path);
        return path.endsWith('.svelte') ? [path] : [];
    });
}

const files = walk(ROOT);

describe('icons are inline SVG, not a custom element', () => {
    test('nothing but Icon.svelte renders <iconify-icon>', () => {
        const offenders: string[] = [];

        for (const file of files) {
            const short = file.slice(ROOT.length + 1);
            if (short === ALLOWED) continue;

            /* Comments are stripped first: several components explain this rule and name the
               element while doing it, and a prose mention is not a call site. Getting this
               wrong once had a codemod swallow a comment's `-->` and break two files. */
            const source = readFileSync(file, 'utf8')
                .replace(/\/\*[\s\S]*?\*\//g, '')
                .replace(/<!--[\s\S]*?-->/g, '');

            if (/<iconify-icon/.test(source)) offenders.push(short);
        }

        expect(offenders).toEqual([]);
    });

    test('the scan sees the components', () => {
        expect(files.length).toBeGreaterThan(45);
    });
});
