<script module lang="ts">
    import type { ChartSeries } from '../../utils/chart.js';

    export interface LineHoverProps {
        series: ChartSeries[];
        index: number;
        plotH: number;
        xAt: (index: number) => number;
        yAt: (value: number) => number;
        colorAt: (index: number) => string;
    }
</script>

<script lang="ts">
    import { PAD_TOP } from '../../utils/chart.js';

    let { series, index, plotH, xAt, yAt, colorAt }: LineHoverProps = $props();
</script>

<!--
@component
Le repère de survol d'un `LineChart` : un trait vertical et un point par série qui a une valeur à cet index.
-->

<g>
    <line
        x1={xAt(index)}
        y1={PAD_TOP}
        x2={xAt(index)}
        y2={PAD_TOP + plotH}
        stroke="var(--color-fc-ring)"
        stroke-width="1"
    />
    {#each series as s, i (i)}
        {#if Number.isFinite(s.data[index])}
            <circle
                cx={xAt(index)}
                cy={yAt(s.data[index])}
                r="4"
                fill={colorAt(i)}
                stroke="var(--color-fc-component)"
                stroke-width="2"
            />
        {/if}
    {/each}
</g>
