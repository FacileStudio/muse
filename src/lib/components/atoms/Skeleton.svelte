<script module lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';

    export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
        class?: string 
    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';

    let {
        class: className = '',
        ...rest
    }: SkeletonProps = $props();

    const classes = $derived(twMerge('animate-pulse motion-reduce:animate-none rounded-fc-sm bg-fc-surface/60', className));
</script>

<!--
@component
La silhouette d'un contenu qui va se remplir. Se cache franchement sous mouvement réduit : son absence se lit correctement.
-->

<div class={classes} {...rest}></div>
