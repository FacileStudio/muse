<script module lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLAttributes } from 'svelte/elements';
    import type { Gap } from '../../utils/layout.js';

    export interface PageProps extends HTMLAttributes<HTMLDivElement> {
        gap?: Gap;
        /** Classes for the scrolling content, not the frame. */
        class?: string;
        children: Snippet;
    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';
    import { GAP } from '../../utils/layout.js';

    /*
     * Two boxes. The frame fills its parent, clips, and holds the 4px edge; the scroller inside
     * it is the only thing that moves, so the last element stops 4px above the frame's bottom
     * instead of running off the edge. The parent has to give the frame a height.
     */
    let { gap = 'default', class: className = '', children, ...rest }: PageProps = $props();
</script>

<!--
@component
Le cadre d'une page : toute la place disponible, 4px de bord, et le défilement à l'intérieur pour que le contenu s'arrête à 4px du bas.
-->

<div class="flex h-full min-h-0 w-full flex-col overflow-hidden p-1">
    <div
        class={twMerge('flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain rounded-fc', GAP[gap], className)}
        {...rest}
    >
        {@render children()}
    </div>
</div>
