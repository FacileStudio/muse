<script lang="ts">
    import { twMerge } from '../../utils/cn.js';
    import {
        AREA_OPACITY,
        CHAR_W,
        PAD_BOTTOM,
        PAD_TOP,
        areaPath,
        axisPadLeft,
        formatCompact,
        labelStride,
        linePath,
        niceScale,
        resize,
        seriesColor,
        seriesCount,
        seriesEmpty,
        seriesLegend,
        seriesRows,
        seriesSummary,
        seriesTipRows,
        seriesValues,
        type ChartSeries
    } from '../../utils/chart.js';
    import { drawIn } from './entry.js';
    import ChartLegend from './ChartLegend.svelte';
    import ChartTable from './ChartTable.svelte';
    import ChartTooltip from './ChartTooltip.svelte';

    let {
        series,
        labels,
        height = 220,
        area = false,
        smooth = true,
        showGrid = true,
        showLegend,
        yFormat = formatCompact,
        xFormat = (label: string) => label,
        yTicks = 4,
        animate = true,
        emptyLabel = 'No data',
        class: className = ''
    }: {
        series: ChartSeries[];
        labels: string[];
        height?: number;
        area?: boolean;
        smooth?: boolean;
        showGrid?: boolean;
        showLegend?: boolean;
        yFormat?: (n: number) => string;
        xFormat?: (label: string, i: number) => string;
        yTicks?: number;
        animate?: boolean;
        emptyLabel?: string;
        class?: string;
    } = $props();

    let w = $state(0);
    let svgEl: SVGSVGElement | null = $state(null);
    let hover = $state(-1);
    let started = false;

    const classes = $derived(twMerge('relative w-full', className));

    const count = $derived(seriesCount(series, labels));
    const values = $derived(seriesValues(series));
    const isEmpty = $derived(seriesEmpty(series, labels));

    const scale = $derived(
        isEmpty
            ? { min: 0, max: 1, ticks: [0, 1] }
            : niceScale(Math.min(...values), Math.max(...values), yTicks, area)
    );

    const yLabels = $derived(scale.ticks.map((t) => yFormat(t)));
    const xLabels = $derived(
        Array.from({ length: count }, (_, i) => xFormat(labels[i] ?? String(i + 1), i))
    );

    const padBottom = $derived(labels.length ? PAD_BOTTOM : 8);
    const padLeft = $derived(axisPadLeft(yLabels));
    const padRight = $derived(
        Math.max(10, Math.min(44, (xLabels[xLabels.length - 1]?.length ?? 0) * CHAR_W * 0.5))
    );
    const plotW = $derived(Math.max(0, w - padLeft - padRight));
    const plotH = $derived(Math.max(0, height - PAD_TOP - padBottom));

    const xAt = (i: number): number =>
        count <= 1 ? padLeft + plotW / 2 : padLeft + (i / (count - 1)) * plotW;

    const yAt = (v: number): number => {
        const span = scale.max - scale.min;
        const t = span === 0 ? 0.5 : (v - scale.min) / span;
        return PAD_TOP + (1 - t) * plotH;
    };

    const colorAt = (i: number): string => seriesColor(series, i);

    const seriesPoints = $derived.by(() => {
        if (isEmpty || plotW <= 0) return [] as [number, number][][];
        return series.map((s) => {
            const pts: [number, number][] = [];
            for (let i = 0; i < count; i++) {
                const v = s.data[i];
                if (!Number.isFinite(v)) continue;
                pts.push([xAt(i), yAt(v)]);
            }
            return pts;
        });
    });

    const stride = $derived(labelStride(count, plotW, xLabels));

    const legendOn = $derived(showLegend ?? series.length > 1);
    const legendItems = $derived(seriesLegend(series));
    const summary = $derived(seriesSummary('Line', series, count, 'points'));
    const tableRows = $derived(seriesRows(series, labels, count, yFormat));
    const tipRows = $derived(seriesTipRows(series, hover, yFormat));

    const tipX = $derived(hover < 0 ? 0 : xAt(hover));
    const tipY = $derived.by(() => {
        if (hover < 0) return 0;
        const ys = series
            .map((s) => s.data[hover])
            .filter((v) => Number.isFinite(v))
            .map((v) => yAt(v));
        const y = ys.length ? Math.min(...ys) : PAD_TOP;
        return Math.max(14, Math.min(height - 14, y));
    });

    function locate(event: PointerEvent) {
        if (!svgEl || count === 0) return;
        if (count === 1) {
            hover = 0;
            return;
        }
        const box = svgEl.getBoundingClientRect();
        const px = event.clientX - box.left;
        const t = (px - padLeft) / (plotW || 1);
        hover = Math.max(0, Math.min(count - 1, Math.round(t * (count - 1))));
    }

    function clear() {
        hover = -1;
    }

    $effect(() => {
        if (started || isEmpty || plotW <= 0 || !svgEl) return;
        started = true;
        drawIn(svgEl, animate);
    });
</script>

<div class={classes} use:resize={(width) => (w = width)}>
    {#if isEmpty}
        <div
            class="flex items-center justify-center text-fc-sm text-fc-fg-muted"
            style:min-height="{height}px"
        >
            {emptyLabel}
        </div>
    {:else if w > 0}
        <div class="relative">
            <svg
                bind:this={svgEl}
                width={w}
                height={height}
                viewBox="0 0 {w} {height}"
                aria-hidden="true"
                focusable="false"
                class="block"
                onpointermove={locate}
                onpointerdown={locate}
                onpointerleave={clear}
                onpointercancel={clear}
            >
                {#if showGrid}
                    <g shape-rendering="crispEdges">
                        {#each scale.ticks as tick, i (i)}
                            <line
                                x1={padLeft}
                                y1={yAt(tick)}
                                x2={padLeft + plotW}
                                y2={yAt(tick)}
                                stroke="var(--color-fc-border)"
                                stroke-width="1"
                            />
                        {/each}
                    </g>
                {/if}

                <g>
                    {#each scale.ticks as tick, i (i)}
                        <text
                            x={padLeft - 8}
                            y={yAt(tick) + 4}
                            text-anchor="end"
                            class="fill-fc-fg-muted text-fc-xs tabular-nums">{yLabels[i]}</text
                        >
                    {/each}
                </g>

                {#if labels.length}
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

                {#if area}
                    <g>
                        {#each seriesPoints as pts, i (i)}
                            <path
                                d={areaPath(pts, PAD_TOP + plotH, smooth)}
                                fill={colorAt(i)}
                                opacity={AREA_OPACITY}
                                data-area
                            />
                        {/each}
                    </g>
                {/if}

                <g>
                    {#each seriesPoints as pts, i (i)}
                        <path
                            d={linePath(pts, smooth)}
                            fill="none"
                            stroke={colorAt(i)}
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            data-line
                        />
                    {/each}
                </g>

                {#if hover >= 0}
                    <g>
                        <line
                            x1={xAt(hover)}
                            y1={PAD_TOP}
                            x2={xAt(hover)}
                            y2={PAD_TOP + plotH}
                            stroke="var(--color-fc-ring)"
                            stroke-width="1"
                        />
                        {#each series as s, i (i)}
                            {#if Number.isFinite(s.data[hover])}
                                <circle
                                    cx={xAt(hover)}
                                    cy={yAt(s.data[hover])}
                                    r="4"
                                    fill={colorAt(i)}
                                    stroke="var(--color-fc-component)"
                                    stroke-width="2"
                                />
                            {/if}
                        {/each}
                    </g>
                {/if}

                <rect x="0" y="0" width={w} height={height} fill="transparent" />
            </svg>

            <ChartTooltip
                x={tipX}
                y={tipY}
                title={hover >= 0 ? xLabels[hover] : ''}
                rows={tipRows}
                visible={hover >= 0}
            />
        </div>

        {#if legendOn}
            <div class="mt-3">
                <ChartLegend items={legendItems} />
            </div>
        {/if}

        <ChartTable caption={summary} head="Label" columns={series.map((s) => s.name)} rows={tableRows} />
    {:else}
        <div style:height="{height}px"></div>
    {/if}
</div>
