<script module lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLAttributes } from 'svelte/elements';
    import type { Align, Gap } from '../../utils/layout.js';

    export interface InlineProps extends HTMLAttributes<HTMLDivElement> {
        gap?: Gap;
        align?: Align;
        wrap?: boolean;
        class?: string;
        children: Snippet;

    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';
    import { ALIGN, GAP } from '../../utils/layout.js';

    let {
        gap = 'tight',
        align = 'center',
        wrap = true,
        class: className = '',
        children,
        ...rest
    }: InlineProps = $props();
</script>

<!--
@component
Une ligne qui passe à la ligne par défaut, à l'un des quatre barreaux. Sans retour, une barre d'actions déborde ou écrase ses cibles tactiles.
-->

<div
    class={twMerge('flex', wrap && 'flex-wrap', ALIGN[align], GAP[gap], className)}
    {...rest}
>
    {@render children()}
</div>
