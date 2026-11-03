import { describe, expect, test } from 'bun:test';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, join } from 'node:path';

/*
 * The rule this enforces: muse draws no decorative lines (CHARTE §5). Cards, sections, panels,
 * list rows, overlays and page chrome separate by fill and spacing, never by a border, a divide
 * or a ring. A border is allowed only where it carries meaning, and those components are named
 * here so adding one is a reviewed decision rather than a habit: form controls need an edge to
 * read as editable, `Dropzone`'s dashed outline is the affordance, `Divider` is the explicit
 * rule a caller asks for, `Table` keeps its row rules for reading, the outline `Button` and
 * `IconButton` variants are controls, `Badge` carries a transparent border for sizing, and the
 * swatch pickers ring the selected swatch.
 *
 * Focus rings use `outline-*`, which this does not match.
 */

const ROOT = import.meta.dir;
const FORBIDDEN = /^(border(-[xytrbl])?|divide-[xy]|ring(-1)?)$/;
const MEANINGFUL = new Set([
    'Badge.svelte',
    'Button.svelte',
    'ColorPicker.svelte',
    'Divider.svelte',
    'Dropzone.svelte',
    'IconButton.svelte',
    'Input.svelte',
    'SecretField.svelte',
    'Select.svelte',
    'Switch.svelte',
    'SwatchPicker.svelte',
    'Table.svelte',
    'Textarea.svelte'
]);

function walkFiles(dir: string): string[] {
    return readdirSync(dir).flatMap((entry) => {
        const path = join(dir, entry);
        if (statSync(path).isDirectory()) return walkFiles(path);
        return path.endsWith('.svelte') ? [path] : [];
    });
}

function decorativeBorders(source: string): string[] {
    const code = source
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/^\s*\/\/.*$/gm, '');
    return code
        .split(/[\s'"`{}(),]+/)
        .filter((token) => FORBIDDEN.test(token.split(':').pop() ?? ''));
}

describe('no decorative borders', () => {
    const files = walkFiles(ROOT).filter((path) => !MEANINGFUL.has(basename(path)));

    test('the scan finds the components', () => {
        expect(files.length).toBeGreaterThan(30);
    });

    for (const path of files) {
        test(path.slice(ROOT.length + 1), () => {
            expect(decorativeBorders(readFileSync(path, 'utf8'))).toEqual([]);
        });
    }

    test('the scan catches a bordered card', () => {
        expect(decorativeBorders('<div class="rounded-fc-md border border-fc-border hover:divide-y">')).toEqual([
            'border',
            'hover:divide-y'
        ]);
    });
});
