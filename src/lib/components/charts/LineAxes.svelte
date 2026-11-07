<script module lang="ts">
    export interface LineAxesProps {
        ticks: number[];
        yLabels: string[];
        xLabels: string[];
        stride: number;
        padLeft: number;
        plotW: number;
        plotH: number;
        showGrid: boolean;
        showX: boolean;
        xAt: (index: number) => number;
        yAt: (value: number) => number;
    }
</script>

<script lang="ts">
    import { PAD_TOP } from '../../utils/chart.js';

    let { ticks, yLabels, xLabels, stride, padLeft, plotW, plotH, showGrid, showX, xAt, yAt }: LineAxesProps = $props();
</script>

<!--
@component
Les axes internes d'un `LineChart` : la grille, les repères de l'axe vertical et les étiquettes de l'axe horizontal.
-->

{#if showGrid}
    <g shape-rendering="crispEdges">
        {#each ticks as tick, i (i)}
            <line
                x1={padLeft}
                y1={yAt(tick)}
                x2={padLeft + plotW}
                y2={yAt(tick)}
                stroke="var(--color-fc-surface)"
                stroke-width="1"
            />
        {/each}
    </g>
{/if}

<g>
    {#each ticks as tick, i (i)}
        <text
            x={padLeft - 8}
            y={yAt(tick) + 4}
            text-anchor="end"
            class="fill-fc-fg-muted text-fc-xs tabular-nums">{yLabels[i]}</text
        >
    {/each}
</g>

{#if showX}
    <g>
        {#each xLabels as label, i (i)}
            {#if i % stride === 0}
                <text
                    x={xAt(i)}
                    y={PAD_TOP + plotH + 16}
                    text-anchor="middle"
                    class="fill-fc-fg-muted text-fc-xs">{label}</text
                >
            {/if}
        {/each}
    </g>
{/if}
