<script module lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';
    export interface SparklineProps extends HTMLAttributes<HTMLDivElement> {
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
        class: className = '',
        ...rest
    }: SparklineProps = $props();

    let w = $state(0);
    let svgEl: SVGSVGElement | null = $state(null);
    let started = false;

    const classes = $derived(twMerge('block w-full', className));

    const values = $derived(data.filter((v) => Number.isFinite(v)));
    const isEmpty = $derived(values.length === 0);

    const low = $derived(isEmpty ? 0 : Math.min(...values));
    const high = $derived(isEmpty ? 1 : Math.max(...values));

    /*
     * Padding is derived from the stroke, not picked. `padX` was 1 against a 2px stroke with
     * round caps: half the stroke sits outside the path, so the first and last cap landed
     * exactly on the viewBox edge and antialiasing shaved them flat — the line read as cut off
     * at both ends. A cap needs its full half-width plus a hair, and the end dot needs its
     * radius. Same reasoning vertically, where 3 already cleared it.
     */
    const STROKE = 2;
    const DOT_R = 3;
    const padY = STROKE / 2 + 2;
    const padX = $derived(showLast ? DOT_R + STROKE / 2 : STROKE / 2 + 1);
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

<div class={classes} use:resize={(width) => (w = width)} {...rest}>
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
                stroke-width={STROKE}
                stroke-linecap="round"
                stroke-linejoin="round"
                data-line
            />
            {#if showLast && last}
                <circle
                    cx={last[0]}
                    cy={last[1]}
                    r={DOT_R}
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
