<script module lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLAttributes } from 'svelte/elements';

    export interface TableProps extends HTMLAttributes<HTMLDivElement> {
        children: Snippet; class?: string
    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';
    import { edgeMask, hiddenEdges, watchScrollArea } from '../../utils/scroll-area.js';

    let {
        children,
        class: className = '',
        ...rest
    }: TableProps = $props();

    const classes = $derived(twMerge('w-full overflow-hidden rounded-fc-md bg-fc-component', className));

    let scroller: HTMLElement | null = $state(null);
    let fade = $state('');

    $effect(() => {
        const el = scroller;
        if (!el) return;
        const edges = () => (fade = edgeMask(hiddenEdges(el, 'x'), 'x'));
        edges();
        return watchScrollArea(el, { onScroll: edges, onResize: edges }, 0);
    });
</script>

<!--
@component
La surface d'un tableau de données. Le tri et la sélection appartiennent encore au consommateur.
-->

<!--
    The surface holds the fill and the corners; the inner box scrolls. A table wider than its column
    scrolls sideways inside the card and fades at the end that hides columns, so a phone shows that
    there is more to the right without a scrollbar or a hint line.
-->
<div class={classes} {...rest}>
    <div bind:this={scroller} class="w-full overflow-x-auto overscroll-x-contain" style={fade || undefined}>
        <table class="w-full border-collapse text-fc-sm text-fc-fg [&_th]:bg-fc-surface [&_th]:text-fc-fg-muted [&_th]:font-medium [&_th]:text-left [&_th]:px-3 [&_th]:py-2 [&_td]:px-3 [&_td]:py-2 [&_tbody_tr:nth-child(even)]:bg-fc-surface/40 [&_tbody_tr:hover]:bg-fc-surface">
            {@render children()}
        </table>
    </div>
</div>
