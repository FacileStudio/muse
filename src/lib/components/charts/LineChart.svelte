<script lang="ts">
    import { gsap } from 'gsap';
    import { twMerge } from '../../utils/cn.js';
    import { prefersReducedMotion } from '../../utils/motion.js';
    import {
        areaPath,
        chartColor,
        formatCompact,
        linePath,
        niceScale,
        resize,
        tickStride,
        type ChartSeries
    } from '../../utils/chart.js';
    import ChartLegend from './ChartLegend.svelte';
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

    const CHAR_W = 6.4;

    let w = $state(0);
    let svgEl: SVGSVGElement | null = $state(null);
    let hover = $state(-1);
    let started = false;

    const classes = $derived(twMerge('relative w-full', className));

    const count = $derived(Math.max(labels.length, ...series.map((s) => s.data.length), 0));
    const values = $derived(series.flatMap((s) => s.data.filter((v) => Number.isFinite(v))));
    const isEmpty = $derived(series.length === 0 || count === 0 || values.length === 0 || values.every((v) => v === 0));

    const scale = $derived(
        isEmpty
            ? { min: 0, max: 1, ticks: [0, 1] }
            : niceScale(Math.min(...values), Math.max(...values), yTicks, area)
    );

    const yLabels = $derived(scale.ticks.map((t) => yFormat(t)));
    const xLabels = $derived(
        Array.from({ length: count }, (_, i) => xFormat(labels[i] ?? String(i + 1), i))
    );

    const padTop = 10;
    const padBottom = $derived(labels.length ? 24 : 8);
    const padLeft = $derived(
        Math.min(96, Math.max(30, Math.max(0, ...yLabels.map((t) => t.length)) * CHAR_W + 10))
    );
    const padRight = $derived(
        Math.max(10, Math.min(44, (xLabels[xLabels.length - 1]?.length ?? 0) * CHAR_W * 0.5))
    );
    const plotW = $derived(Math.max(0, w - padLeft - padRight));
    const plotH = $derived(Math.max(0, height - padTop - padBottom));

    const xAt = (i: number): number =>
        count <= 1 ? padLeft + plotW / 2 : padLeft + (i / (count - 1)) * plotW;

    const yAt = (v: number): number => {
        const span = scale.max - scale.min;
        const t = span === 0 ? 0.5 : (v - scale.min) / span;
        return padTop + (1 - t) * plotH;
    };

    const colorAt = (i: number): string => series[i]?.color ?? chartColor(i);

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

    const stride = $derived(
        tickStride(count, plotW, Math.max(28, Math.max(0, ...xLabels.map((l) => l.length)) * CHAR_W + 12))
    );

    const legendOn = $derived(showLegend ?? series.length > 1);
    const legendItems = $derived(series.map((s, i) => ({ name: s.name, color: colorAt(i) })));

    const summary = $derived(
        `Line chart of ${series.length} series across ${count} points: ${series.map((s) => s.name).join(', ')}`
    );

    const tableRows = $derived(
        Array.from({ length: count }, (_, i) => ({
            label: labels[i] ?? String(i + 1),
            cells: series.map((s) => (Number.isFinite(s.data[i]) ? yFormat(s.data[i]) : ''))
        }))
    );

    const tipRows = $derived(
        hover < 0
            ? []
            : series.map((s, i) => ({
                  name: s.name,
                  value: Number.isFinite(s.data[hover]) ? yFormat(s.data[hover]) : '—',
                  color: colorAt(i)
              }))
    );

    const tipX = $derived(hover < 0 ? 0 : xAt(hover));
    const tipY = $derived.by(() => {
        if (hover < 0) return 0;
        const ys = series
            .map((s) => s.data[hover])
            .filter((v) => Number.isFinite(v))
            .map((v) => yAt(v));
        const y = ys.length ? Math.min(...ys) : padTop;
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
        if (!animate || prefersReducedMotion()) return;
        const paths = Array.from(svgEl.querySelectorAll<SVGPathElement>('[data-line]'));
        paths.forEach((path) => {
            const len = path.getTotalLength();
            if (!len) return;
            gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
            gsap.to(path, {
                strokeDashoffset: 0,
                duration: 0.6,
                ease: 'power3.out',
                onComplete: () => {
                    path.style.removeProperty('stroke-dasharray');
                    path.style.removeProperty('stroke-dashoffset');
                }
            });
        });
        const fills = Array.from(svgEl.querySelectorAll<SVGPathElement>('[data-area]'));
        if (fills.length) gsap.fromTo(fills, { opacity: 0 }, { opacity: 0.12, duration: 0.6, ease: 'power3.out' });
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
                role="img"
                aria-label={summary}
                focusable="false"
                class="block"
                onpointermove={locate}
                onpointerdown={locate}
                onpointerleave={clear}
                onpointercancel={clear}
            >
                {#if showGrid}
                    <g aria-hidden="true" shape-rendering="crispEdges">
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

                <g aria-hidden="true">
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
                    <g aria-hidden="true">
                        {#each xLabels as label, i (i)}
                            {#if i % stride === 0}
                                <text
                                    x={xAt(i)}
                                    y={padTop + plotH + 16}
                                    text-anchor="middle"
                                    class="fill-fc-fg-muted text-fc-xs">{label}</text
                                >
                            {/if}
                        {/each}
                    </g>
                {/if}

                {#if area}
                    <g aria-hidden="true">
                        {#each seriesPoints as pts, i (i)}
                            <path
                                d={areaPath(pts, padTop + plotH, smooth)}
                                fill={colorAt(i)}
                                opacity="0.12"
                                data-area
                            />
                        {/each}
                    </g>
                {/if}

                <g aria-hidden="true">
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
                    <g aria-hidden="true">
                        <line
                            x1={xAt(hover)}
                            y1={padTop}
                            x2={xAt(hover)}
                            y2={padTop + plotH}
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

                <rect x="0" y="0" width={w} height={height} fill="transparent" aria-hidden="true" />
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

        <div class="sr-only">
            <table>
                <caption>{summary}</caption>
                <thead>
                    <tr>
                        <th scope="col">Label</th>
                        {#each series as s, i (i)}
                            <th scope="col">{s.name}</th>
                        {/each}
                    </tr>
                </thead>
                <tbody>
                    {#each tableRows as row, i (i)}
                        <tr>
                            <th scope="row">{row.label}</th>
                            {#each row.cells as cell, j (j)}
                                <td>{cell}</td>
                            {/each}
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    {:else}
        <div style:height="{height}px"></div>
    {/if}
</div>
