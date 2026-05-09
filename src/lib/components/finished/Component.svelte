<script lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLAttributes } from 'svelte/elements';
    import { twMerge } from 'tailwind-merge';

    let {
        class: className = '',
        children,
        ...rest
    }: HTMLAttributes<HTMLDivElement> & {
        children?: Snippet;
    } = $props();

    const classes = $derived(twMerge('relative min-h-fit w-full bg-fc-component rounded-fc-md px-8 py-6', className));
</script>

<div class={classes} {...rest}>
    {#if children}
        {@render children()}
    {/if}
</div>
