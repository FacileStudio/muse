<script lang="ts">
    import type { Snippet } from 'svelte';
    import { twMerge } from 'tailwind-merge';

    let {
        children,
        class: className = ''
    }: { children: Snippet; class?: string } = $props();

    const classes = $derived(twMerge('flex flex-col gap-1 h-dvh w-60 shrink-0 border-r border-fc-fg/10 bg-fc-surface p-4', className));
</script>

<aside class={classes}>
    {@render children()}
</aside>
