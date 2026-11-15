import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const read = (name: string) => readFileSync(join(import.meta.dir, name), 'utf8');
const button = read('BulleButton.svelte');
const panel = read('BullePanel.svelte');

describe('BulleButton', () => {
    test('every variant keeps a 44px hit target', () => {
        const shapes = /const shapes[^{]*\{([\s\S]*?)\n    \};/.exec(button)?.[1] ?? '';
        const rows = shapes.split('\n').filter((l) => l.includes(':'));
        expect(rows).toHaveLength(3);
        for (const row of rows) expect(row).toMatch(/min-h-11|size-11/);
    });

    test('declares a button type, a focus ring and no hover-only state', () => {
        expect(button).toContain("type = 'button'");
        expect(button).toContain('focus-visible:outline-fc-ring');
        expect(button).toContain('disabled:opacity-50');
    });

    test('puts rest on the button so a consumer attribute wins', () => {
        expect(button).toMatch(/\{\.\.\.rest\}\s+aria-label/);
    });
});

describe('BullePanel', () => {
    test('reuses IdeasUpsell for the plan upsell', () => {
        expect(panel).toContain("import IdeasUpsell from './IdeasUpsell.svelte'");
    });

    test('hides the body and the busy line behind the upsell', () => {
        expect(panel).toContain('busy && !gated');
        expect(panel).toContain('error && !gated');
    });
});
