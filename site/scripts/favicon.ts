/*
 * muse's own favicons, touch icons, link preview, manifest and <head>, from the suite brand
 * generator. Run `bun site/scripts/favicon.ts` after a change to scripts/brand; never edit the
 * files it writes by hand.
 */
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { findApp, writeAssets } from '../../scripts/brand/generate.ts';
import { headHtml } from '../../scripts/brand/head.ts';

const app = findApp('muse');
const site = join(import.meta.dir, '..');
writeAssets(app, join(site, 'static'));

const head = headHtml(app).trimEnd().split('\n').map((line) => `        ${line}`).join('\n');
const html = `<!doctype html>
<html lang="fr">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="color-scheme" content="light dark" />
${head}
        %sveltekit.head%
    </head>
    <body data-sveltekit-preload-data="hover">
        <div style="display: contents">%sveltekit.body%</div>
    </body>
</html>
`;
writeFileSync(join(site, 'src/app.html'), html);
console.log(`brand assets and src/app.html written for ${app.id}`);
