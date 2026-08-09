<script module lang="ts">
    import type { ChartLegendItem } from '../../utils/chart.js';

    export interface ChartLegendProps {
        items: ChartLegendItem[];
        class?: string;

    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';

    let {
        items = [],
        class: className = ''
    }: ChartLegendProps = $props();

    /* The gap between two entries has to beat the 6px inside one, or "412 GB · 46%" and the
       swatch of the next series read as a single run of text. */
    const classes = $derived(twMerge('flex flex-wrap items-center gap-x-4 gap-y-2 text-fc-xs', className));
</script>

<!--
@component
La légende d'un graphique. L'écart entre deux entrées bat toujours celui qui les compose.
-->

{#if items.length}
    <ul class={classes}>
        {#each items as item, i (item.name + i)}
            <li class="flex items-center gap-1.5">
                <span
                    class="h-2 w-2 shrink-0 rounded-fc-xs"
                    style:background-color={item.color}
                    aria-hidden="true"
                ></span>
                <span class="text-fc-fg-muted">{item.name}</span>
                {#if item.value !== undefined}
                    <span class="text-fc-fg font-medium tabular-nums">{item.value}</span>
                {/if}
            </li>
        {/each}
    </ul>
{/if}
