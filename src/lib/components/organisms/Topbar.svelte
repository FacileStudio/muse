<script lang="ts">
    import type { Snippet } from 'svelte';
    import { twMerge } from 'tailwind-merge';

    let {
        children,
        class: className = ''
    }: { children: Snippet; class?: string } = $props();

    const classes = $derived(twMerge('sticky top-0 z-40 flex h-14 items-center justify-between gap-3 border-b border-fc-fg/10 bg-fc-bg/80 backdrop-blur px-4', className));
</script>

<header class={classes}>
    {@render children()}
</header>
