<script module lang="ts">
    import type { ChartMarker, ChartMarkerPoint } from '../../utils/chart.js';

    export interface LineMarkersProps {
        marks: ChartMarkerPoint[];
        xLabels: string[];
        xAt: (i: number) => number;
        yAt: (v: number) => number;
        onHover: (index: number) => void;
        onMarkerClick?: (marker: ChartMarker) => void;
    }
</script>

<script lang="ts">
    let { marks, xLabels, xAt, yAt, onHover, onMarkerClick }: LineMarkersProps = $props();
</script>

<!--
@component
Les points remarquables d'une `LineChart` : un rond par marqueur, cliquable avec `onMarkerClick`.
-->

{#each marks as m, i (i)}
    {#if onMarkerClick}
        <button
            type="button"
            class="absolute flex size-11 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-fc-pill bg-transparent p-0 focus-visible:outline-2 focus-visible:outline-fc-ring"
            style:left="{xAt(m.index)}px"
            style:top="{yAt(m.value)}px"
            aria-label="{xLabels[m.index]}: {m.marker.label}"
            onpointerenter={() => onHover(m.index)}
            onpointerleave={() => onHover(-1)}
            onfocus={() => onHover(m.index)}
            onblur={() => onHover(-1)}
            onclick={() => onMarkerClick(m.marker)}
        >
            <span class="size-3 rounded-fc-pill" style:background-color={m.color}></span>
        </button>
    {:else}
        <span
            class="pointer-events-none absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-fc-pill"
            style:left="{xAt(m.index)}px"
            style:top="{yAt(m.value)}px"
            style:background-color={m.color}
            aria-hidden="true"
        ></span>
        <span class="sr-only">{xLabels[m.index]}: {m.marker.label}</span>
    {/if}
{/each}
