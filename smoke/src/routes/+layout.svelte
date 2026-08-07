<script lang="ts">
	import '../app.css';
	import { browser } from '$app/environment';
	import { Toaster } from '@facile/muse';

	let { children } = $props();

	/*
	 * How a real consumer registers the custom element: browser-side only, because
	 * `iconify-icon` calls `customElements.define` at import time and this app server-renders.
	 * muse's `<iconify-icon>` elements are inert until this lands.
	 */
	if (browser) void import('iconify-icon');
</script>

{@render children()}

<Toaster class="pb-28 md:pb-6" />
