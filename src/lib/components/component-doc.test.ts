import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/*
 * Every exported component says what it is for, in its own `<!-- @component -->` block.
 *
 * That block is Svelte's standard place for it — editors show it on hover, so the thirteen
 * consuming apps get it for free — and the docs site reads it as each page's lead. Before this,
 * the site fell back to the first block comment in the instance script, and those explain a
 * *decision* rather than a purpose: `Button`'s page opened on a note about `aria-disabled`.
 * Interesting content, wrong slot.
 */

const LIB = join(import.meta.dir, '..');

const exported = readFileSync(join(LIB, 'index.ts'), 'utf8')
    .split('\n')
    .map((l) => /^export \{ default as (\w+) \} from '\.\/(components\/[^']+)';/.exec(l))
    .filter((m): m is RegExpExecArray => Boolean(m));

describe('every component describes itself', () => {
    test('each has an @component block', () => {
        const missing = exported
            .filter(([, , path]) => !/<!--\s*\n?@component\s*\n[\s\S]*?-->/.test(readFileSync(join(LIB, path), 'utf8')))
            .map(([, name]) => name);
        expect(missing).toEqual([]);
    });

    test('the description is a sentence, not a placeholder', () => {
        const thin = exported
            .map(([, name, path]) => {
                const m = /<!--\s*\n?@component\s*\n([\s\S]*?)-->/.exec(readFileSync(join(LIB, path), 'utf8'));
                const text = (m?.[1] ?? '').trim();
                return { name, text };
            })
            .filter(({ text }) => text.length < 40 || !text.endsWith('.'))
            .map(({ name }) => name);
        expect(thin).toEqual([]);
    });

    test('the scan found the exports', () => {
        expect(exported.length).toBeGreaterThan(50);
    });
});
