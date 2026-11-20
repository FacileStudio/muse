<script module lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';
    import type { ChartSeries } from '../../utils/chart.js';

    export interface BarChartProps extends HTMLAttributes<HTMLDivElement> {
        series: ChartSeries[];
        labels: string[];
        height?: number;
        stacked?: boolean;
        horizontal?: boolean;
        showGrid?: boolean;
        showLegend?: boolean;
        yFormat?: (n: number) => string;
        yTicks?: number;
        animate?: boolean;
        emptyLabel?: string;
        class?: string;

    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';
    import { barGeometry, barPath, categoryLabels, formatCompact, labelScale, niceScale, resize, seriesCount, seriesEmpty, seriesLegend, seriesRows, seriesSummary, seriesTipRows, seriesValues, type ChartBox } from '../../utils/chart.js';
    import { focusMarks, tweenProgress } from './entry.js';
    import ChartLegend from './ChartLegend.svelte';
    import ChartTable from './ChartTable.svelte';
    import ChartTooltip from './ChartTooltip.svelte';

    let {
        series,
        labels,
        height = 220,
        stacked = false,
        horizontal = false,
        showGrid = true,
        showLegend,
        yFormat = formatCompact,
        yTicks = 4,
        animate = true,
        emptyLabel = 'No data',
        class: className = '',
        ...rest
    }: BarChartProps = $props();

    let w = $state(0);
    let hover = $state(-1);
    let progress = $state(0);
    let marks = $state<SVGGElement>();
    let textScale = $state(1);
    let started = false;

    const classes = $derived(twMerge('relative w-full', className));

    const count = $derived(seriesCount(series, labels));
    const values = $derived(seriesValues(series));
    const isEmpty = $derived(seriesEmpty(series, labels));

    const totals = $derived.by(() => {
        const out: number[] = [];
        if (!stacked) return out;
        for (let i = 0; i < count; i++) {
            let pos = 0;
            let neg = 0;
            for (const s of series) {
                const v = s.data[i];
                if (!Number.isFinite(v)) continue;
                if (v > 0) pos += v;
                else neg += v;
            }
            out.push(pos, neg);
        }
        return out;
    });

    const scale = $derived.by(() => {
        if (isEmpty) return { min: 0, max: 1, ticks: [0, 1] };
        const pool = stacked ? totals : values;
        return niceScale(Math.min(...pool, 0), Math.max(...pool, 0), yTicks, true);
    });

    const catLabels = $derived(categoryLabels(labels, count));

    /* Geometry is independent of the entry tween, so only `bars` re-derives per frame. */
    const geometry = $derived(
        barGeometry({
            series,
            labels,
            count,
            scale,
            width: w,
            height,
            stacked,
            horizontal,
            format: yFormat,
            labelScale: textScale
        })
    );

    const bars = $derived.by(() =>
        geometry.specs.map((spec) => {
            const at = geometry.base + (spec.near - geometry.base) * progress;
            const grown = spec.size * progress;
            const box: ChartBox = horizontal
                ? { x: at, y: spec.offset, w: grown, h: spec.thick }
                : { x: spec.offset, y: at, w: spec.thick, h: grown };
            return { d: barPath({ ...box, corner: spec.corner }), color: spec.color, band: spec.band };
        })
    );

    const legendOn = $derived(showLegend ?? series.length > 1);
    const legendItems = $derived(seriesLegend(series));
    const summary = $derived(seriesSummary(stacked ? 'Stacked bar' : 'Bar', series, count, 'categories'));
    const tableRows = $derived(seriesRows(series, labels, count, yFormat));
    const tipRows = $derived(seriesTipRows(series, hover, yFormat));

    const tip = $derived.by(() => {
        const point = hover >= 0 ? geometry.anchors[hover] : undefined;
        if (!point) return { x: 0, y: 0 };
        return {
            x: Math.max(0, Math.min(w, point.x)),
            y: Math.max(14, Math.min(height - 14, point.y))
        };
    });

    function pick(index: number) {
        hover = index;
    }

    function clear() {
        hover = -1;
    }

    $effect(() => {
        if (started || isEmpty || w <= 0) return;
        started = true;
        tweenProgress(animate, (t) => (progress = t));
    });

    $effect(() => {
        const active = hover;

        if (marks)
            focusMarks(marks, active, animate);
    });
</script>

<!--
@component
Un graphique en barres, empilable. Chaque barre est arrondie à ses quatre coins, ligne de base comprise.
-->

<div class={classes} use:resize={(width) => (w = width)} use:labelScale={(s) => (textScale = s)} {...rest}>
    {#if isEmpty}
        <div
            class="flex items-center justify-center text-fc-p text-fc-muted"
            style:min-height="{height}px"
        >
            {emptyLabel}
        </div>
    {:else if w > 0}
        <div class="relative">
            <svg
                width={w}
                height={height}
                viewBox="0 0 {w} {height}"
                aria-hidden="true"
                focusable="false"
                class="block"
                onpointerleave={clear}
                onpointercancel={clear}
            >
                {#if showGrid}
                    <g shape-rendering="crispEdges">
                        {#each geometry.grid as line, i (i)}
                            <line
                                x1={line.x1}
                                y1={line.y1}
                                x2={line.x2}
                                y2={line.y2}
                                stroke="var(--color-fc-surface-hover)"
                                stroke-width="1"
                            />
                        {/each}
                    </g>
                {/if}

                <g>
                    {#each geometry.valueTicks as tick, i (i)}
                        <text
                            x={tick.x}
                            y={tick.y}
                            text-anchor={tick.anchor}
                            class="fill-fc-muted text-fc-subtext tabular-nums">{tick.text}</text
                        >
                    {/each}
                </g>

                <g>
                    {#each geometry.catTicks as tick, i (i)}
                        <text x={tick.x} y={tick.y} text-anchor={tick.anchor} class="fill-fc-muted text-fc-subtext"
                            >{tick.text}</text
                        >
                    {/each}
                </g>

                <g bind:this={marks}>
                    {#each bars as bar, i (i)}
                        <path d={bar.d} fill={bar.color} data-mark={bar.band} />
                    {/each}
                </g>

                {#each geometry.bands as band, i (i)}
                    <rect
                        x={band.x}
                        y={band.y}
                        width={band.w}
                        height={band.h}
                        fill="transparent"
                        aria-hidden="true"
                        onpointerenter={() => pick(i)}
                        onpointermove={() => pick(i)}
                        onpointerdown={() => pick(i)}
                    />
                {/each}
            </svg>

            <ChartTooltip
                x={tip.x}
                y={tip.y}
                title={hover >= 0 ? catLabels[hover] : ''}
                rows={tipRows}
                visible={hover >= 0}
            />
        </div>

        {#if legendOn}
            <div class="mt-3">
                <ChartLegend items={legendItems} />
            </div>
        {/if}

        <ChartTable caption={summary} head="Category" columns={series.map((s) => s.name)} rows={tableRows} />
    {:else}
        <div style:height="{height}px"></div>
    {/if}
</div>
