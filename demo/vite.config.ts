import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [svelte(), tailwindcss()],
    optimizeDeps: { exclude: ['@facile/lib'] },
    resolve: { preserveSymlinks: true },
    server: { host: '127.0.0.1' }
});
