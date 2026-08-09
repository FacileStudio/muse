import { describe, expect, test } from 'bun:test';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

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

function readCodepoints(buf: Buffer): Set<number> {
	const cmap = readTables(buf).get('cmap');
	if (!cmap) throw new Error('font has no cmap table');

	const codepoints = new Set<number>();
	const subtables = buf.readUInt16BE(cmap.offset + 2);

	for (let i = 0; i < subtables; i++) {
		const record = cmap.offset + 4 + i * 8;
		const start = cmap.offset + buf.readUInt32BE(record + 4);
		const format = buf.readUInt16BE(start);

		if (format === 4) {
			const segX2 = buf.readUInt16BE(start + 6);
			const endsAt = start + 14;
			const startsAt = endsAt + segX2 + 2;
			for (let s = 0; s < segX2 / 2; s++) {
				const end = buf.readUInt16BE(endsAt + s * 2);
				const begin = buf.readUInt16BE(startsAt + s * 2);
				if (begin === 0xffff) continue;
				for (let cp = begin; cp <= end; cp++) codepoints.add(cp);
			}
		} else if (format === 12) {
			const groups = buf.readUInt32BE(start + 12);
			for (let g = 0; g < groups; g++) {
				const at = start + 16 + g * 12;
				const begin = buf.readUInt32BE(at);
				const end = buf.readUInt32BE(at + 4);
				for (let cp = begin; cp <= end; cp++) codepoints.add(cp);
			}
		}
	}
	return codepoints;
}

const fontFiles = existsSync(FONT_DIR)
	? readdirSync(FONT_DIR).filter((f) => /\.(otf|ttf|woff2?)$/i.test(f))
	: [];

describe('bundled fonts', () => {
	test('every bundled face covers the characters the suite types', () => {
		for (const file of fontFiles) {
			if (/\.woff2?$/i.test(file)) {
				throw new Error(
					`${file}: woff is compressed and this check parses raw sfnt. Ship the otf/ttf alongside it, or extend this test.`
				);
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
});
