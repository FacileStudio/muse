/*
 * Serve `build/` the way the production nginx does.
 *
 * `vite preview` needs the SvelteKit server manifest, which `adapter-static` does not leave
 * behind, and `python3 -m http.server` has no `try_files` — so it 404s every extensionless deep
 * link and any check pointed at it silently measures error pages. This is the smallest thing
 * that matches the real vhost: `$uri`, then `$uri.html`, then `$uri/index.html`.
 */
import { file } from 'bun';
import { join } from 'node:path';

const ROOT = join(import.meta.dir, '../build');
const PORT = Number(process.argv[2] ?? 5185);

Bun.serve({
    port: PORT,
    async fetch(req) {
        const path = decodeURIComponent(new URL(req.url).pathname);
        for (const candidate of [path, `${path}.html`, join(path, 'index.html')]) {
            const f = file(join(ROOT, candidate));
            if (await f.exists()) {
                const type = candidate.endsWith('.md') || candidate.endsWith('.txt')
                    ? 'text/plain; charset=utf-8'
                    : undefined;
                return new Response(f, type ? { headers: { 'content-type': type } } : undefined);
            }
        }
        return new Response('Not found', { status: 404 });
    }
});

console.log(`serving build/ on http://127.0.0.1:${PORT}`);
