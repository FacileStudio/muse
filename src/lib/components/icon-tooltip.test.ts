import { describe, expect, test } from 'bun:test';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { createRawSnippet } from 'svelte';
import { render } from 'svelte/server';
import IconButton from './atoms/IconButton.svelte';

/*
 * An icon-only control always shows a muse Tooltip, and nothing uses the native `title`
 * attribute as one: it waits about a second, cannot be hovered, never shows on keyboard focus
 * and looks like the operating system, not like muse.
 */

const REPO = join(import.meta.dir, '../../..');
const SCANNED = ['src/lib', 'demo/src', 'site/src'];
const icon = createRawSnippet(() => ({ render: () => '<svg aria-hidden="true"></svg>' }));

function walk(dir: string): string[] {
    return readdirSync(dir).flatMap((entry) => {
        if (entry === 'node_modules' || entry.startsWith('.')) return [];
        const path = join(dir, entry);
        if (statSync(path).isDirectory()) return walk(path);
        return path.endsWith('.svelte') ? [path] : [];
    });
}

function tagEnd(source: string, from: number): number {
    let depth = 0;
    let quote = '';
    for (let i = from; i < source.length; i++) {
        const char = source[i];
        if (quote) quote = char === quote ? '' : quote;
        else if (char === '"' || char === "'" || char === '`') quote = char;
        else if (char === '{') depth++;
        else if (char === '}') depth--;
        else if (char === '>' && depth === 0) return i;
    }
    return source.length;
}

function openingTags(source: string, pattern: RegExp): string[] {
    const code = source.replace(/<!--[\s\S]*?-->/g, '');
    return [...code.matchAll(pattern)].map((match) => code.slice(match.index, tagEnd(code, match.index + 1) + 1));
}

const files = SCANNED.flatMap((dir) => walk(join(REPO, dir)));

describe('IconButton tooltip', () => {
    test('renders a tooltip from its aria-label', () => {
        const body = render(IconButton, { props: { 'aria-label': 'Copier', children: icon } }).body;
        expect(body).toContain('data-muse-tooltip');
    });

    test('renders none only with tooltip={false}', () => {
        const body = render(IconButton, { props: { 'aria-label': 'Copier', tooltip: false, children: icon } }).body;
        expect(body).not.toContain('data-muse-tooltip');
        expect(body).toContain('aria-label="Copier"');
    });

    test('every IconButton in muse, the demo and the site names itself', () => {
        expect(files.length).toBeGreaterThan(80);
        const unnamed = files.flatMap((file) =>
            openingTags(readFileSync(file, 'utf8'), /<IconButton\b/g)
                .filter((tag) => !/\saria-label=|\stooltip=|\{\.\.\.[^}]*\}/.test(tag))
                .map((tag) => `${file}: ${tag.slice(0, 80)}`)
        );
        expect(unnamed).toEqual([]);
    });

    test('no Tooltip wraps an IconButton, which already shows one', () => {
        const doubled = files.filter((file) => /<Tooltip\b[^>]*>\s*<IconButton\b(?![^>]*tooltip=\{false\})/.test(readFileSync(file, 'utf8')));
        expect(doubled).toEqual([]);
    });
});

describe('no native title tooltips', () => {
    test('no HTML element in a component carries a title attribute', () => {
        const offenders = walk(join(REPO, 'src/lib/components')).flatMap((file) =>
            openingTags(readFileSync(file, 'utf8'), /<[a-z][\w-]*\b/g)
                .filter((tag) => /\stitle=/.test(tag))
                .map((tag) => `${file}: ${tag.slice(0, 80)}`)
        );
        expect(offenders).toEqual([]);
    });
});
