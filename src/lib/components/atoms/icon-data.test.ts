import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ICON_DATA } from '../../icons-data.js';
import { icons } from '../../icons.js';

/*
 * The bundled paths and the icon map have to stay in step. Adding a key to `icons.ts` without
 * re-running `scripts/build-icons.ts` leaves `Icon` falling through to `<iconify-icon>`, which
 * puts the network request back — silently, because the icon still draws for anyone whose app
 * happens to register the custom element.
 */
describe('the bundled icon data covers the map', () => {
    test('every name in `icons` has its paths frozen into the package', () => {
        const missing = Object.entries(icons)
            .filter(([, name]) => !ICON_DATA[name])
            .map(([key, name]) => `${key} (${name}) — re-run scripts/build-icons.ts`);
        expect(missing).toEqual([]);
    });

    test('nothing is bundled that the map does not name', () => {
        const used = new Set<string>(Object.values(icons));
        expect(Object.keys(ICON_DATA).filter((n) => !used.has(n))).toEqual([]);
    });

    test('every body is real path data, not an empty shell', () => {
        const empty = Object.entries(ICON_DATA)
            .filter(([, d]) => d.body.trim().length < 20 || !d.width || !d.height)
            .map(([n]) => n);
        expect(empty).toEqual([]);
    });

    /* Bundling artwork means redistributing it. The shipped trial font already cost this repo
       a licence problem once; the attribution for these collections is not optional. */
    test('the collections are credited in LICENSE', () => {
        const licence = readFileSync(join(import.meta.dir, '../../../../LICENSE'), 'utf8');
        const prefixes = new Set(Object.keys(ICON_DATA).map((n) => n.split(':')[0]));
        for (const prefix of prefixes) {
            expect(licence.toLowerCase()).toContain(prefix === 'mdi' ? 'material design icons' : prefix);
        }
        expect(licence).toContain('CC-BY-4.0');
        expect(licence).toContain('Apache-2.0');
    });
});
