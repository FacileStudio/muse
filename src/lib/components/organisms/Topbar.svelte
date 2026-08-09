<script module lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLAttributes } from 'svelte/elements';

    export interface TopbarProps extends HTMLAttributes<HTMLElement> {
        children: Snippet; class?: string 
    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';

    let {
        children,
        class: className = '',
        ...rest
    }: TopbarProps = $props();

    /* z-30 is the sticky page-chrome rung: above content and floating surfaces anchored to
       it, below anything fixed to the viewport. */
    const classes = $derived(twMerge('sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-fc-border bg-fc-bg/80 backdrop-blur px-4', className));
</script>

<header class={classes} {...rest}>
    {@render children()}
</header>
