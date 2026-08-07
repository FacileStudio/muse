<script lang="ts">
    import { gsap } from 'gsap';
    import { twMerge } from '../../utils/cn.js';
    import { prefersReducedMotion } from '../../utils/motion.js';
    import {
        chartColor,
        formatCompact,
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
        stacked = false,
        horizontal = false,
        showGrid = true,
        showLegend,
        yFormat = formatCompact,
        yTicks = 4,
        animate = true,
        emptyLabel = 'No data',
        class: className = ''
    }: {
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
    } = $props();

    type Corner = 'top' | 'bottom' | 'left' | 'right' | 'none';
    type Bar = { x: number; y: number; w: number; h: number; corner: Corner; color: string };
    type Band = { x: number; y: number; w: number; h: number };
    type Line = { x1: number; y1: number; x2: number; y2: number };
    type Tick = { x: number; y: number; anchor: 'start' | 'middle' | 'end'; text: string };

    const CHAR_W = 6.4;
    const MAX_THICK = 24;
    const GAP = 2;

    let w = $state(0);
    let hover = $state(-1);
    let progress = $state(0);
    let started = false;

    const classes = $derived(twMerge('relative w-full', className));

    const count = $derived(Math.max(labels.length, ...series.map((s) => s.data.length), 0));
    const values = $derived(series.flatMap((s) => s.data.filter((v) => Number.isFinite(v))));
    const isEmpty = $derived(series.length === 0 || count === 0 || values.length === 0 || values.every((v) => v === 0));

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

    const valueLabels = $derived(scale.ticks.map((t) => yFormat(t)));
    const catLabels = $derived(Array.from({ length: count }, (_, i) => labels[i] ?? String(i + 1)));
    const colorAt = (i: number): string => series[i]?.color ?? chartColor(i);

    const layout = $derived.by(() => {
        const bars: Bar[] = [];
        const bands: Band[] = [];
        const grid: Line[] = [];
        const valueTicks: Tick[] = [];
        const catTicks: Tick[] = [];
        const anchors: { x: number; y: number }[] = [];
        if (isEmpty || w <= 0) return { bars, bands, grid, valueTicks, catTicks, anchors };

        const padTop = 10;
        const padBottom = 24;
        const padLeft = horizontal
            ? Math.min(Math.max(56, w * 0.36), Math.max(56, Math.max(0, ...catLabels.map((l) => l.length)) * CHAR_W + 12))
            : Math.min(96, Math.max(30, Math.max(0, ...valueLabels.map((l) => l.length)) * CHAR_W + 10));
        const padRight = horizontal
            ? Math.max(12, ((valueLabels[valueLabels.length - 1]?.length ?? 0) * CHAR_W) / 2)
            : 10;
        const plotW = Math.max(0, w - padLeft - padRight);
        const plotH = Math.max(0, height - padTop - padBottom);
        if (plotW <= 0 || plotH <= 0) return { bars, bands, grid, valueTicks, catTicks, anchors };

        const span = scale.max - scale.min || 1;
        const vAt = (v: number): number =>
            horizontal
                ? padLeft + ((v - scale.min) / span) * plotW
                : padTop + (1 - (v - scale.min) / span) * plotH;
        const base = vAt(0);
        const bandSize = (horizontal ? plotH : plotW) / count;
        const bandOrigin = horizontal ? padTop : padLeft;
        const slots = stacked ? 1 : Math.max(1, series.length);
        const groupSize = Math.min(bandSize * 0.72, slots * MAX_THICK + (slots - 1) * GAP);
        const thick = Math.max(1, (groupSize - GAP * (slots - 1)) / slots);

        for (const tick of scale.ticks) {
            const p = vAt(tick);
            if (horizontal) grid.push({ x1: p, y1: padTop, x2: p, y2: padTop + plotH });
            else grid.push({ x1: padLeft, y1: p, x2: padLeft + plotW, y2: p });
            valueTicks.push(
                horizontal
                    ? { x: p, y: padTop + plotH + 16, anchor: 'middle', text: yFormat(tick) }
                    : { x: padLeft - 8, y: p + 4, anchor: 'end', text: yFormat(tick) }
            );
        }

        const catStride = horizontal
            ? tickStride(count, plotH, 18)
            : tickStride(count, plotW, Math.max(28, Math.max(0, ...catLabels.map((l) => l.length)) * CHAR_W + 12));

        for (let i = 0; i < count; i++) {
            const start = bandOrigin + i * bandSize + (bandSize - groupSize) / 2;

            if (horizontal) {
                bands.push({ x: padLeft, y: bandOrigin + i * bandSize, w: plotW, h: bandSize });
                if (i % catStride === 0) {
                    catTicks.push({
                        x: padLeft - 10,
                        y: bandOrigin + i * bandSize + bandSize / 2 + 4,
                        anchor: 'end',
                        text: catLabels[i]
                    });
                }
            } else {
                bands.push({ x: bandOrigin + i * bandSize, y: padTop, w: bandSize, h: plotH });
                if (i % catStride === 0) {
                    catTicks.push({
                        x: bandOrigin + i * bandSize + bandSize / 2,
                        y: padTop + plotH + 16,
                        anchor: 'middle',
                        text: catLabels[i]
                    });
                }
            }

            let extreme = base;
            let pos = 0;
            let neg = 0;
            let lastPos = -1;
            let lastNeg = -1;
            if (stacked) {
                for (let j = 0; j < series.length; j++) {
                    const v = series[j].data[i];
                    if (!Number.isFinite(v) || v === 0) continue;
                    if (v > 0) lastPos = j;
                    else lastNeg = j;
                }
            }

            for (let j = 0; j < series.length; j++) {
                const v = series[j].data[i];
                if (!Number.isFinite(v) || v === 0) continue;

                const from = stacked ? (v > 0 ? pos : neg) : 0;
                const to = from + v;
                if (stacked) {
                    if (v > 0) pos = to;
                    else neg = to;
                }

                const a = vAt(from);
                const b = vAt(to);
                let near = Math.min(a, b);
                let size = Math.abs(b - a);
                if (stacked && from !== 0) {
                    if ((v > 0) === horizontal) near += GAP;
                    size = Math.max(0, size - GAP);
                }
                if (size <= 0) continue;

                const rounded = !stacked || (v > 0 ? j === lastPos : j === lastNeg);
                const offset = stacked ? start : start + j * (thick + GAP);

                if (horizontal) {
                    const animX = base + (near - base) * progress;
                    const animW = size * progress;
                    const corner: Corner = rounded ? (v > 0 ? 'right' : 'left') : 'none';
                    bars.push({ x: animX, y: offset, w: animW, h: thick, corner, color: colorAt(j) });
                    const edge = v > 0 ? animX + animW : animX;
                    if (v > 0 ? edge > extreme : edge < extreme) extreme = edge;
                } else {
                    const animY = base + (near - base) * progress;
                    const animH = size * progress;
                    const corner: Corner = rounded ? (v > 0 ? 'top' : 'bottom') : 'none';
                    bars.push({ x: offset, y: animY, w: thick, h: animH, corner, color: colorAt(j) });
                    const edge = v > 0 ? animY : animY + animH;
                    if (v > 0 ? edge < extreme : edge > extreme) extreme = edge;
                }
            }

            anchors.push(
                horizontal
                    ? { x: extreme, y: bandOrigin + i * bandSize + bandSize / 2 }
                    : { x: bandOrigin + i * bandSize + bandSize / 2, y: extreme }
            );
        }

        return { bars, bands, grid, valueTicks, catTicks, anchors };
    });

    function barPath(bar: Bar): string {
        const bw = Math.max(0, bar.w);
        const bh = Math.max(0, bar.h);
        if (bw <= 0 || bh <= 0) return '';
        const x = Math.round(bar.x * 100) / 100;
        const y = Math.round(bar.y * 100) / 100;
        const rv = Math.min(4, bw / 2, bh);
        const rh = Math.min(4, bh / 2, bw);
        if (bar.corner === 'top') {
            return `M${x} ${y + bh}L${x} ${y + rv}Q${x} ${y} ${x + rv} ${y}L${x + bw - rv} ${y}Q${x + bw} ${y} ${x + bw} ${y + rv}L${x + bw} ${y + bh}Z`;
        }
        if (bar.corner === 'bottom') {
            return `M${x} ${y}L${x} ${y + bh - rv}Q${x} ${y + bh} ${x + rv} ${y + bh}L${x + bw - rv} ${y + bh}Q${x + bw} ${y + bh} ${x + bw} ${y + bh - rv}L${x + bw} ${y}Z`;
        }
        if (bar.corner === 'right') {
            return `M${x} ${y}L${x + bw - rh} ${y}Q${x + bw} ${y} ${x + bw} ${y + rh}L${x + bw} ${y + bh - rh}Q${x + bw} ${y + bh} ${x + bw - rh} ${y + bh}L${x} ${y + bh}Z`;
        }
        if (bar.corner === 'left') {
            return `M${x + bw} ${y}L${x + rh} ${y}Q${x} ${y} ${x} ${y + rh}L${x} ${y + bh - rh}Q${x} ${y + bh} ${x + rh} ${y + bh}L${x + bw} ${y + bh}Z`;
        }
        return `M${x} ${y}h${bw}v${bh}h${-bw}Z`;
    }

    const legendOn = $derived(showLegend ?? series.length > 1);
    const legendItems = $derived(series.map((s, i) => ({ name: s.name, color: colorAt(i) })));

    const summary = $derived(
        `${stacked ? 'Stacked bar' : 'Bar'} chart of ${series.length} series across ${count} categories: ${series
            .map((s) => s.name)
            .join(', ')}`
    );

    const tableRows = $derived(
        Array.from({ length: count }, (_, i) => ({
            label: catLabels[i],
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

    const tip = $derived.by(() => {
        const point = hover >= 0 ? layout.anchors[hover] : undefined;
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
        if (!animate || prefersReducedMotion()) {
            progress = 1;
            return;
        }
        const proxy = { t: 0 };
        gsap.to(proxy, {
            t: 1,
            duration: 0.6,
            ease: 'power3.out',
            onUpdate: () => (progress = proxy.t)
        });
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
                width={w}
                height={height}
                viewBox="0 0 {w} {height}"
                role="img"
                aria-label={summary}
                focusable="false"
                class="block"
                onpointerleave={clear}
                onpointercancel={clear}
            >
                {#if hover >= 0 && layout.bands[hover]}
                    <rect
                        x={layout.bands[hover].x}
                        y={layout.bands[hover].y}
                        width={layout.bands[hover].w}
                        height={layout.bands[hover].h}
                        fill="var(--color-fc-surface)"
                        aria-hidden="true"
                    />
                {/if}

                {#if showGrid}
                    <g aria-hidden="true" shape-rendering="crispEdges">
                        {#each layout.grid as line, i (i)}
                            <line
                                x1={line.x1}
                                y1={line.y1}
                                x2={line.x2}
                                y2={line.y2}
                                stroke="var(--color-fc-border)"
                                stroke-width="1"
                            />
                        {/each}
                    </g>
                {/if}

                <g aria-hidden="true">
                    {#each layout.valueTicks as tick, i (i)}
                        <text
                            x={tick.x}
                            y={tick.y}
                            text-anchor={tick.anchor}
                            class="fill-fc-fg-muted text-fc-xs tabular-nums">{tick.text}</text
                        >
                    {/each}
                </g>

                <g aria-hidden="true">
                    {#each layout.catTicks as tick, i (i)}
                        <text x={tick.x} y={tick.y} text-anchor={tick.anchor} class="fill-fc-fg-muted text-fc-xs"
                            >{tick.text}</text
                        >
                    {/each}
                </g>

                <g aria-hidden="true">
                    {#each layout.bars as bar, i (i)}
                        <path d={barPath(bar)} fill={bar.color} />
                    {/each}
                </g>

                {#each layout.bands as band, i (i)}
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

        <div class="sr-only">
            <table>
                <caption>{summary}</caption>
                <thead>
                    <tr>
                        <th scope="col">Category</th>
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
