import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';

/*
 * The site eats its own cooking: it is built with muse, aliased at the source rather than
 * installed. A `file:..` dependency makes bun copy the whole repo into site/node_modules —
 * including site/node_modules itself — which recurses and dies. The packaged install is
 * covered by scripts/smoke.sh, which is the harness that exists for that question.
 */
export default defineConfig({
    plugins: [tailwindcss(), sveltekit()],
    resolve: {
        alias: {
            '@facile/muse': fileURLToPath(new URL('../src/lib/index.ts', import.meta.url))
        },
        dedupe: ['svelte', 'gsap', 'tailwind-merge']
    },
    server: { host: '127.0.0.1', fs: { allow: ['..'] } }
});
