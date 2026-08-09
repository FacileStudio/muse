<script module lang="ts">
    export interface SparklineProps {
        data: number[];
        height?: number;
        area?: boolean;
        smooth?: boolean;
        color?: string;
        showLast?: boolean;
        valueFormat?: (n: number) => string;
        animate?: boolean;
        emptyLabel?: string;
        class?: string;

    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';
    import {
        AREA_OPACITY,
        areaPath,
        formatCompact,
        linePath,
        resize,
        type ChartRow
    } from '../../utils/chart.js';
    import { drawIn } from './entry.js';
    import ChartTable from './ChartTable.svelte';

    let {
        data = [],
        height = 32,
        area = true,
        smooth = true,
        color = 'var(--color-fc-chart-1)',
        showLast = false,
        valueFormat = formatCompact,
        animate = true,
        emptyLabel = 'No data',
        class: className = ''
    }: SparklineProps = $props();

    let w = $state(0);
    let svgEl: SVGSVGElement | null = $state(null);
    let started = false;

    const classes = $derived(twMerge('block w-full', className));

    const values = $derived(data.filter((v) => Number.isFinite(v)));
    const isEmpty = $derived(values.length === 0);

    const low = $derived(isEmpty ? 0 : Math.min(...values));
    const high = $derived(isEmpty ? 1 : Math.max(...values));

    const padY = 3;
    const padX = $derived(showLast ? 4 : 1);
    const plotW = $derived(Math.max(0, w - padX * 2));
    const plotH = $derived(Math.max(0, height - padY * 2));

    const points = $derived.by(() => {
        const pts: [number, number][] = [];
        if (isEmpty || plotW <= 0) return pts;
        const span = high - low;
        const n = data.length;
        for (let i = 0; i < n; i++) {
            const v = data[i];
            if (!Number.isFinite(v)) continue;
            const x = n <= 1 ? padX + plotW / 2 : padX + (i / (n - 1)) * plotW;
            const t = span === 0 ? 0.5 : (v - low) / span;
            pts.push([x, padY + (1 - t) * plotH]);
        }
        return pts;
    });

    const stroke = $derived(linePath(points, smooth));
    const fill = $derived(area ? areaPath(points, padY + plotH, smooth) : '');
    const last = $derived(points.length ? points[points.length - 1] : null);

    const summary = $derived(
        `Sparkline of ${values.length} values, from ${valueFormat(values[0] ?? 0)} to ${valueFormat(
            values[values.length - 1] ?? 0
        )}`
    );

    const tableRows = $derived.by((): ChartRow[] =>
        values.map((v, i) => ({ label: String(i + 1), cells: [valueFormat(v)] }))
    );

    $effect(() => {
        if (started || isEmpty || plotW <= 0 || !svgEl) return;
        started = true;
        drawIn(svgEl, animate);
    });
</script>

<div class={classes} use:resize={(width) => (w = width)}>
    {#if isEmpty}
        <div class="flex items-center justify-center text-fc-xs text-fc-fg-muted" style:min-height="{height}px">
            {emptyLabel}
        </div>
    {:else if w > 0}
        <svg
            bind:this={svgEl}
            width={w}
            height={height}
            viewBox="0 0 {w} {height}"
            aria-hidden="true"
            focusable="false"
            class="block"
        >
            {#if fill}
                <path d={fill} fill={color} opacity={AREA_OPACITY} data-area />
            {/if}
            <path
                d={stroke}
                fill="none"
                stroke={color}
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                data-line
            />
            {#if showLast && last}
                <circle
                    cx={last[0]}
                    cy={last[1]}
                    r="3"
                    fill={color}
                    stroke="var(--color-fc-component)"
                    stroke-width="2"
                    data-fade
                />
            {/if}
        </svg>

        <ChartTable caption={summary} head="Point" columns={['Value']} rows={tableRows} />
    {:else}
        <div style:height="{height}px"></div>
    {/if}
</div>
