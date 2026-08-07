<script lang="ts">
    import { twMerge } from '../../utils/cn.js';
    import type { ChartLegendItem } from '../../utils/chart.js';

    let {
        items = [],
        class: className = ''
    }: {
        items: ChartLegendItem[];
        class?: string;
    } = $props();

    const classes = $derived(twMerge('flex flex-wrap items-center gap-x-3 gap-y-1 text-fc-xs', className));
</script>

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
