import { describe, expect, test } from 'bun:test';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { APPS } from './apps.ts';
import banned from './false-claims.json';
import { resolveGlyph } from './glyphs.ts';
import { findApp, generate } from './generate.ts';
import { encodeIco } from './ico.ts';
import { faviconSvg } from './svg.ts';

describe('encodeIco', () => {
    test('writes the icon header, one entry per image and each PNG at its offset', () => {
        const pngs = [16, 32, 48].map((size) => ({ size, png: new Uint8Array(size).fill(size) }));
        const ico = encodeIco(pngs);
        const view = new DataView(ico.buffer);
        expect([view.getUint16(0, true), view.getUint16(2, true), view.getUint16(4, true)]).toEqual([0, 1, 3]);
        expect(ico.length).toBe(6 + 16 * 3 + 16 + 32 + 48);
        const last = 6 + 16 * 2;
        expect([ico[last], ico[last + 1], view.getUint16(last + 6, true)]).toEqual([48, 48, 32]);
        expect(ico[view.getUint32(last + 12, true)]).toBe(48);
    });
});

describe('APPS', () => {
    test('ids are unique', () => {
        expect(new Set(APPS.map((app) => app.id)).size).toBe(APPS.length);
    });

    test.each(APPS)('$id has an https url, plain copy and a known icon', (app) => {
        expect(new URL(app.url).protocol).toBe('https:');
        expect(app.description.length).toBeGreaterThanOrEqual(80);
        expect(app.description.length).toBeLessThanOrEqual(155);
        expect(app.title.split(' ').length).toBeGreaterThanOrEqual(3);
        expect(app.title.split(' ').length).toBeLessThanOrEqual(8);
        expect(`${app.title} ${app.description}`).not.toContain('—');
        expect(resolveGlyph(app.icon).body).toContain('currentColor');
    });

    test.each(APPS)('$id carries no claim the landing review struck', (app) => {
        const copy = `${app.title} ${app.description}`.toLocaleLowerCase();
        const found = banned.falseClaims.filter((claim) => copy.includes(claim.toLocaleLowerCase()));
        expect(found).toEqual([]);
    });
});

test('the muse site favicon is the generated one', () => {
    const muse = APPS.find((app) => app.id === 'muse');
    const shipped = readFileSync(join(import.meta.dir, '../../site/static/favicon.svg'), 'utf8');
    expect(shipped).toBe(faviconSvg(resolveGlyph(muse!.icon)));
});

test('generate keeps the head block out of the asset dir unless --head names a file', () => {
    const dir = mkdtempSync(join(tmpdir(), 'brand-'));
    try {
        const head = generate(findApp('muse'), dir);
        expect(head).toContain('<title>');
        expect(existsSync(join(dir, 'head.html'))).toBe(false);
        expect(existsSync(join(dir, 'favicon.svg'))).toBe(true);
        const file = join(dir, 'block.html');
        generate(findApp('muse'), dir, file);
        expect(readFileSync(file, 'utf8')).toBe(head);
    } finally {
        rmSync(dir, { recursive: true, force: true });
    }
});
