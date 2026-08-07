import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	/*
	 * This is the documented consumer requirement, not a workaround for the harness — every
	 * app that installs muse needs the same three lines, and both Vision and Jardin carry
	 * them.
	 *
	 * muse ships uncompiled source, including `.svelte.ts` rune modules. Vite's dev-only
	 * dependency optimizer hands those to esbuild without the TypeScript transform, so
	 * `utils/toast.svelte.ts` dies on its first type annotation and `vite dev` refuses to
	 * start — while `vite build`, which never runs the optimizer, is perfectly happy.
	 * Excluding the package leaves it to the svelte plugin, which is what compiles it.
	 *
	 * Deleting this block is the standing self-test: `mise run smoke` must fail at the
	 * "dev server" assertion if it goes.
	 */
	optimizeDeps: {
		exclude: ['@facile/muse']
	},
	server: { host: '127.0.0.1' }
});
