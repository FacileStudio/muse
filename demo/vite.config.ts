import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';

/*
 * The demo aliases `@facile/muse` straight at the source instead of installing it.
 * A `file:..` dependency makes bun copy the whole repo into demo/node_modules —
 * including demo/node_modules itself — which recurses and dies with ENOENT.
 */
export default defineConfig({
    plugins: [svelte(), tailwindcss()],
    resolve: {
        alias: {
            '@facile/muse': fileURLToPath(new URL('../src/lib/index.ts', import.meta.url))
        },
        dedupe: ['svelte', 'gsap', 'tailwind-merge']
    },
    server: { host: '127.0.0.1', fs: { allow: ['..'] } }
});
