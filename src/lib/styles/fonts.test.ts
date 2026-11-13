import { describe, expect, test } from 'bun:test';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { brotliDecompressSync } from 'node:zlib';

const FONT_DIR = join(import.meta.dir, '../fonts');

/**
 * Characters the suite types every day. A face that cannot render these is not a text face:
 * it falls back mid-string to a different family, weight and x-height, which is worse than
 * never having been loaded. The v0.5.0 Goga trial cut covered 68 codepoints and none of these.
 */
const REQUIRED = [
    ...'abcdefghijklmnopqrstuvwxyz',
    ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    ...'0123456789',
    ...'éèêëàâäçùûüîïôöÿœæ',
    ...'ÉÈÊËÀÂÄÇÙÛÜÎÏÔÖŸŒÆ',
    ...'\'"«»‘’“”',
    ...'.,:;!?…-–—',
    ...'()[]{}/\\|@#%&*+=<>_~',
    ...'€$£•·°'
];

type Tables = Map<string, { offset: number; length: number }>;
type Located = { data: Buffer; offset: number };

/** The sfnt table directory of an otf/ttf: tag to offset and length. */
function readTables(buf: Buffer): Tables {
    const count = buf.readUInt16BE(4);
    const tables: Tables = new Map();
    for (let i = 0; i < count; i++) {
        const rec = 12 + i * 16;
        tables.set(buf.toString('latin1', rec, rec + 4), {
            offset: buf.readUInt32BE(rec + 8),
            length: buf.readUInt32BE(rec + 12)
        });
    }
    return tables;
}

/** A WOFF2 UIntBase128 at `at`: the value and the offset just past it. */
function readBase128(buf: Buffer, at: number): [number, number] {
    let value = 0;
    for (let i = 0; i < 5; i++) {
        const byte = buf[at + i];
        value = value * 128 + (byte & 0x7f);
        if (!(byte & 0x80)) return [value, at + i + 1];
    }
    throw new Error('invalid UIntBase128');
}

/**
 * Where cmap sits in a WOFF2's brotli stream, and where that stream starts. WOFF2 only ever
 * transforms glyf, loca and hmtx, so cmap is stored byte for byte; the walk only has to size
 * the tables before it. Known-tag index 0 is cmap, 10 and 11 are glyf and loca, 63 a literal tag.
 */
function walkWoff2(buf: Buffer): { cmap: number; streamAt: number } {
    if (buf.toString('latin1', 4, 8) === 'ttcf') throw new Error('WOFF2 collections are not supported');
    let at = 48;
    let offset = 0;
    let cmap = -1;
    for (let i = 0; i < buf.readUInt16BE(12); i++) {
        const flags = buf[at++];
        const index = flags & 0x3f;
        if (index === 63) at += 4;
        let length: number;
        [length, at] = readBase128(buf, at);
        const glyphTable = index === 10 || index === 11;
        if (glyphTable ? flags >> 6 === 0 : flags >> 6 !== 0) [length, at] = readBase128(buf, at);
        if (index === 0) cmap = offset;
        offset += length;
    }
    if (cmap < 0) throw new Error('font has no cmap table');
    return { cmap, streamAt: at };
}

/** Where the cmap table starts, in the raw sfnt or in a WOFF2's decompressed stream. */
function locateCmap(buf: Buffer): Located {
    if (buf.toString('latin1', 0, 4) !== 'wOF2') {
        const cmap = readTables(buf).get('cmap');
        if (!cmap) throw new Error('font has no cmap table');
        return { data: buf, offset: cmap.offset };
    }
    const { cmap, streamAt } = walkWoff2(buf);
    const stream = brotliDecompressSync(buf.subarray(streamAt, streamAt + buf.readUInt32BE(20)));
    return { data: stream, offset: cmap };
}

/** Every codepoint a face maps, from its cmap format 4 and 12 subtables. */
function readCodepoints(file: Buffer): Set<number> {
    const { data: buf, offset } = locateCmap(file);
    const codepoints = new Set<number>();
    const subtables = buf.readUInt16BE(offset + 2);

    for (let i = 0; i < subtables; i++) {
        const record = offset + 4 + i * 8;
        const start = offset + buf.readUInt32BE(record + 4);
        const format = buf.readUInt16BE(start);
        if (format === 4) addFormat4(buf, start, codepoints);
        else if (format === 12) addFormat12(buf, start, codepoints);
    }
    return codepoints;
}

/** Adds the segments of a cmap format 4 subtable. */
function addFormat4(buf: Buffer, start: number, codepoints: Set<number>): void {
    const segX2 = buf.readUInt16BE(start + 6);
    const endsAt = start + 14;
    const startsAt = endsAt + segX2 + 2;
    for (let s = 0; s < segX2 / 2; s++) {
        const end = buf.readUInt16BE(endsAt + s * 2);
        const begin = buf.readUInt16BE(startsAt + s * 2);
        if (begin === 0xffff) continue;
        for (let cp = begin; cp <= end; cp++) codepoints.add(cp);
    }
}

/** Adds the groups of a cmap format 12 subtable. */
function addFormat12(buf: Buffer, start: number, codepoints: Set<number>): void {
    const groups = buf.readUInt32BE(start + 12);
    for (let g = 0; g < groups; g++) {
        const at = start + 16 + g * 12;
        const begin = buf.readUInt32BE(at);
        const end = buf.readUInt32BE(at + 4);
        for (let cp = begin; cp <= end; cp++) codepoints.add(cp);
    }
}

const fontFiles = existsSync(FONT_DIR)
    ? readdirSync(FONT_DIR).filter((f) => /\.(otf|ttf|woff2?)$/i.test(f))
    : [];

describe('bundled fonts', () => {
    test('every bundled face covers the characters the suite types', () => {
        for (const file of fontFiles) {
            if (/\.woff$/i.test(file)) {
                throw new Error(`${file}: WOFF 1 is not parsed here. Ship woff2, otf or ttf.`);
            }
            const covered = readCodepoints(readFileSync(join(FONT_DIR, file)));
            const missing = REQUIRED.filter((c) => !covered.has(c.codePointAt(0)!));
            expect(`${file}: ${missing.join('')}`).toBe(`${file}: `);
        }
    });

    test('a face is only bundled if tokens.css actually declares it', () => {
        const tokens = readFileSync(join(import.meta.dir, 'tokens.css'), 'utf8');
        const declared = /@font-face/.test(tokens);
        expect(declared).toBe(fontFiles.length > 0);
    });

    test('every url() in tokens.css points at a bundled file', () => {
        const tokens = readFileSync(join(import.meta.dir, 'tokens.css'), 'utf8');
        const urls = [...tokens.matchAll(/url\('\.\.\/fonts\/([^']+)'\)/g)].map((m) => m[1]);
        expect(urls.sort()).toEqual([...fontFiles].sort());
    });

    test('semibold lands on Medium, never on Bold', () => {
        const tokens = readFileSync(join(import.meta.dir, 'tokens.css'), 'utf8');
        const faces = [...tokens.matchAll(/@font-face\s*\{([^}]*)\}/g)].map((m) => ({
            file: /url\('[^']*\/([^'/]+)'\)/.exec(m[1])?.[1],
            weight: /font-weight:\s*([^;]+);/.exec(m[1])?.[1].trim()
        }));
        expect(faces).toContainEqual({ file: 'Magnetik-Medium.woff2', weight: '500 600' });
        expect(faces).toContainEqual({ file: 'Magnetik-Bold.woff2', weight: '700' });
        expect(faces).toContainEqual({ file: 'Magnetik-Regular.woff2', weight: '400' });
    });
});
