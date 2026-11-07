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

    const classes = $derived(twMerge('sticky top-0 z-30 flex h-14 items-center justify-between gap-3 bg-fc-bg/80 backdrop-blur px-4', className));
</script>

<!--
@component
Un bandeau collant, utilisé là où le rail n'existe pas.
-->

<header class={classes} {...rest}>
    {@render children()}
</header>
