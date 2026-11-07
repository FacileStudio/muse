<script module lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLAttributes } from 'svelte/elements';
    import type { Gap, PageWidth } from '../../utils/layout.js';

    export interface PageProps extends HTMLAttributes<HTMLDivElement> {
        width?: PageWidth;
        gap?: Gap;
        class?: string;
        children: Snippet;

    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';
    import { GAP, PAGE_WIDTH } from '../../utils/layout.js';

    let {
        width = 'lg',
        gap = 'section',
        class: className = '',
        children,
        ...rest
    }: PageProps = $props();

    const classes = $derived(
        twMerge(
            'mx-auto flex w-full flex-col px-4 py-8 sm:px-6 md:px-10 md:py-10',
            PAGE_WIDTH[width],
            GAP[gap],
            className
        )
    );
</script>

<!--
@component
La colonne de page : centrage, largeur maximale, padding extérieur et rythme entre les sections. Se place à l'intérieur du conteneur de défilement de la coquille.
-->

<div class={classes} {...rest}>
    {@render children()}
</div>
