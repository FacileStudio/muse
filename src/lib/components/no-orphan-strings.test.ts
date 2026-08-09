import { describe, expect, test } from 'bun:test';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

/*
 * No component ships a user-visible string that no prop can reach.
 *
 * `Dropzone` rendered a hardcoded "Browse" and announced "Release to add files" to assistive
 * tech, and neither was reachable from the outside — in a suite that ships in French. It is the
 * same failure as the trial typeface: something in the library assumed an audience the products
 * do not have, and nothing in the build disagreed.
 *
 * The check is deliberately crude — it looks for literal text nodes in markup — because the
 * precise version needs a full template parse and the crude one already found the real case.
 */

const ROOT = import.meta.dir;

/* Text that is not user-facing prose: shortcut chips, separators, currency, single glyphs. */
const ALLOWED = /^[\s\d.,:;·—–\-+%/|⌘⌥⇧×✓•()[\]{}]*$/u;

function walk(dir: string): string[] {
    return readdirSync(dir).flatMap((entry) => {
        const path = join(dir, entry);
        if (statSync(path).isDirectory()) return walk(path);
        return path.endsWith('.svelte') ? [path] : [];
    });
}

describe('every visible string comes from a prop', () => {
    test('no literal prose is baked into markup', () => {
        const offenders: string[] = [];

        for (const file of walk(ROOT)) {
            const source = readFileSync(file, 'utf8');
            const markup = source
                .replace(/<script[\s\S]*?<\/script>/g, '')
                .replace(/<style[\s\S]*?<\/style>/g, '')
                .replace(/<!--[\s\S]*?-->/g, '');

            /* Text sitting directly between tags, with no `{` interpolation in it. */
            for (const m of markup.matchAll(/>([^<>{}]+)</g)) {
                const text = m[1].trim();
                if (!text || ALLOWED.test(text)) continue;
                if (!/[A-Za-zÀ-ÿ]{3}/.test(text)) continue;
                offenders.push(`${file.slice(ROOT.length + 1)}: "${text.slice(0, 40)}"`);
            }
        }

        expect(offenders).toEqual([]);
    });
});
