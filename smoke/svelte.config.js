import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/*
 * adapter-node on purpose: the point of this app is that SSR genuinely runs, so a
 * server-only failure (a module that touches `localStorage` at import time, a component
 * that reaches for `window` outside an effect) fails the build instead of shipping.
 */

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: { adapter: adapter() }
};

export default config;
