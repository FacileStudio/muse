/*
 * `llms.txt`, `llms-full.txt` and a `.md` twin per page — generated from the same markdown the
 * site renders, so the machine-readable corpus cannot drift from the documentation. It *is*
 * the documentation.
 *
 * Runs after `vite build` and writes into the built output, because prerendered pages are what
 * ship; writing into `static/` before the build would work too but would leave the repo full
 * of generated files.
 */
import { readFileSync, readdirSync, statSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROUTES = join(HERE, '../src/routes');
const OUT = join(HERE, '../build');

const BASE = 'https://muse.facile.studio';

function walk(dir: string): string[] {
    return readdirSync(dir).flatMap((entry) => {
        const path = join(dir, entry);
        if (statSync(path).isDirectory()) return walk(path);
        return entry === '+page.md' ? [path] : [];
    });
}

const pages = walk(ROUTES)
    .map((file) => {
        const route = '/' + relative(ROUTES, dirname(file)).replace(/\\/g, '/');
        const body = readFileSync(file, 'utf8');
        const title = /^#\s+(.+)$/m.exec(body)?.[1] ?? route;

        /*
         * The lead is the first line of actual prose. Pages that open with a `<script>` block
         * (mdsvex lets markdown import components) or a fenced example would otherwise be
         * indexed as "<script lang=ts>" or "```sh", which is exactly the sort of index that
         * teaches an agent nothing.
         */
        const prose = body
            .replace(/^---[\s\S]*?---/, '')
            .replace(/<script[\s\S]*?<\/script>/g, '')
            .replace(/```[\s\S]*?```/g, '')
            .split('\n')
            .map((l) => l.trim())
            .find((l) => l && !l.startsWith('#') && !l.startsWith('<') && !l.startsWith('|'));
        const lead = prose?.replace(/\*\*/g, '').replace(/`/g, '');

        return { route: route === '/.' ? '/' : route, title, lead, body };
    })
    .sort((a, b) => a.route.localeCompare(b.route));

for (const p of pages) {
    const target = p.route === '/' ? join(OUT, 'index.md') : join(OUT, `${p.route.slice(1)}.md`);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, p.body);
}

const index = [
    '# muse',
    '',
    '> The design system of Facile Studio: not only a Svelte 5 component library but the rules',
    '> for how a Facile app is designed and structured. Written in French.',
    '',
    '## Pages',
    '',
    ...pages.map((p) => {
        /* `/` maps to index.md on disk; `${BASE}/.md` is not a URL anything serves. */
        const md = p.route === '/' ? '/index.md' : `${p.route}.md`;
        return `- [${p.title}](${BASE}${md})${p.lead ? `: ${p.lead}` : ''}`;
    }),
    '',
    '## Aussi',
    '',
    `- [Composants](${BASE}/composants): les 53 composants exportés, props comprises`,
    '- [MIGRATION.md](https://github.com/FacileStudio/muse/blob/main/MIGRATION.md)',
    ''
].join('\n');

writeFileSync(join(OUT, 'llms.txt'), index);

writeFileSync(
    join(OUT, 'llms-full.txt'),
    [
        '<SYSTEM>Documentation complète de muse, le système de design de Facile Studio.',
        'Svelte 5 + Tailwind v4. Ne produisez pas de React.</SYSTEM>',
        '',
        ...pages.map((p) => `${p.body}\n\n---\n`)
    ].join('\n')
);

console.log(`llms.txt + ${pages.length} .md twins`);
