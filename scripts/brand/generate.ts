import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { APPS, type SuiteApp } from './apps.ts';
import { resolveGlyph } from './glyphs.ts';
import { headHtml, webManifest } from './head.ts';
import { encodeIco } from './ico.ts';
import { ogSvg } from './og.ts';
import { renderPng } from './raster.ts';
import { faviconSvg, iconSvg } from './svg.ts';

const USAGE = 'usage: bun scripts/brand/generate.ts <id> <outDir> | --all <dir>';

/** Writes an app's favicons, touch and manifest icons, link preview and manifest into `dir`. */
export function writeAssets(app: SuiteApp, dir: string): void {
    const glyph = resolveGlyph(app.icon);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, 'favicon.svg'), faviconSvg(glyph));
    const tab = iconSvg(glyph, 48, { color: '#737373', ratio: 1 });
    writeFileSync(join(dir, 'favicon.ico'), encodeIco([16, 32, 48].map((size) => ({ size, png: renderPng(tab, size) }))));
    const tile = iconSvg(glyph, 512, { color: '#0a0a0a', ratio: 0.62, background: '#fafafa' });
    writeFileSync(join(dir, 'apple-touch-icon.png'), renderPng(tile, 180));
    writeFileSync(join(dir, 'icon-192.png'), renderPng(tile, 192));
    writeFileSync(join(dir, 'icon-512.png'), renderPng(tile, 512));
    writeFileSync(join(dir, 'og-image.png'), renderPng(ogSvg(app, glyph), 1200));
    writeFileSync(join(dir, 'site.webmanifest'), webManifest(app));
}

/** Writes every asset plus `head.html` for one app, and returns the head block. */
export function generate(app: SuiteApp, dir: string): string {
    writeAssets(app, dir);
    const head = headHtml(app);
    writeFileSync(join(dir, 'head.html'), head);
    return head;
}

/** Looks an app up by id. Throws with the known ids when it is not in the catalog. */
export function findApp(id: string): SuiteApp {
    const app = APPS.find((candidate) => candidate.id === id);
    if (!app) throw new Error(`unknown app "${id}". Known: ${APPS.map((known) => known.id).join(', ')}`);
    return app;
}

function main(args: string[]): void {
    const [first, dir] = args;
    if (!first || !dir) throw new Error(USAGE);
    if (first === '--all') {
        APPS.forEach((app) => generate(app, join(dir, app.id)));
        console.error(`brand: wrote ${APPS.length} apps into ${dir}`);
        return;
    }
    process.stdout.write(generate(findApp(first), dir));
}

if (import.meta.main) main(process.argv.slice(2));
