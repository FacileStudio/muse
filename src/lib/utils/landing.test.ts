import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { SCROLL_ENTER, SCROLL_LEAVE, landingHref, nextScrolled, safeLinks } from './landing.js';

describe('nextScrolled', () => {
    test('enters past the upper threshold and leaves below the lower one', () => {
        expect(nextScrolled(SCROLL_ENTER, false)).toBe(false);
        expect(nextScrolled(SCROLL_ENTER + 1, false)).toBe(true);
        expect(nextScrolled(SCROLL_LEAVE + 1, true)).toBe(true);
        expect(nextScrolled(SCROLL_LEAVE, true)).toBe(false);
    });

    test('holds its state between the thresholds so the bar cannot flicker', () => {
        const between = (SCROLL_ENTER + SCROLL_LEAVE) / 2;
        expect(nextScrolled(between, false)).toBe(false);
        expect(nextScrolled(between, true)).toBe(true);
    });
});

describe('landingHref', () => {
    test('accepts paths, https, anchors, mailto and tel', () => {
        for (const ok of ['/pricing', 'https://facile.studio/x', '#features', 'mailto:a@b.fr', 'tel:+33768888818']) {
            expect(landingHref(ok)).toBe(ok);
        }
    });

    test('rejects script, data, http, protocol-relative and whitespace forms', () => {
        for (const bad of ['javascript:alert(1)', 'data:text/html,x', 'http://x.fr', '//evil.example', '# x', 'mailto:', '', 3]) {
            expect(landingHref(bad)).toBeNull();
        }
    });

    test('rejects case, whitespace, control-character and slash tricks', () => {
        const bad = ['JAVASCRIPT:alert(1)', ' javascript:1', 'java\tscript:1', 'java\u0000script:1', 'vbscript:x', '\u200bjavascript:1', '/\\evil.com', '/\t/evil.com', 'https:evil.com', '#a b'];
        for (const raw of bad) expect(landingHref(raw)).toBeNull();
    });

    test('safeLinks drops unsafe entries and keeps the rest in order', () => {
        const out = safeLinks([{ href: '/a' }, { href: 'javascript:1' }, { href: '#b' }]);
        expect(out.map((l) => l.href)).toEqual(['/a', '#b']);
    });
});

describe('concentric rule', () => {
    const css = readFileSync(join(import.meta.dir, '../styles/tokens.css'), 'utf8');

    test('tokens.css derives the inner radius from the outer radius and the padding, once', () => {
        expect(css).toContain('--fc-r-in: max(0px, calc(var(--fc-r) - var(--fc-pad)));');
        expect(css.match(/--fc-r-in:/g)).toHaveLength(1);
    });

    test('the control height is the bar height minus the padding on both sides', () => {
        expect(css).toContain('--fc-ctl: calc(var(--fc-h) - 2 * var(--fc-pad));');
    });
});
