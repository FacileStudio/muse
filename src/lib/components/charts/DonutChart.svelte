<script module lang="ts">
    import type { ChartSlice } from '../../utils/chart.js';

    export interface DonutChartProps {
        data: ChartSlice[];
        size?: number;
        thickness?: number;
        corner?: number;
        showLegend?: boolean;
        centerLabel?: string;
        centerValue?: string | number;
        valueFormat?: (n: number) => string;
        animate?: boolean;
        emptyLabel?: string;
        class?: string;

    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';
    import { TAU, arcPath, donutSegments, formatCompact, resize } from '../../utils/chart.js';
    import { tweenProgress } from './entry.js';
    import ChartLegend from './ChartLegend.svelte';
    import ChartTable from './ChartTable.svelte';
    import ChartTooltip from './ChartTooltip.svelte';

    let {
        data,
        size = 180,
        thickness = 22,
        corner = 4,
        showLegend = true,
        centerLabel,
        centerValue,
        valueFormat = formatCompact,
        animate = true,
        emptyLabel = 'No data',
        class: className = ''
    }: DonutChartProps = $props();

    const LIFT = 4;

    let w = $state(0);
    let hover = $state(-1);
    let sweep = $state(0);
    let started = false;

    /* `justify-center` matters when the card stretches to a taller neighbour in a grid row:
       the ring then sits in the middle of the space it was given instead of hanging off the
       title with the legend stranded at the bottom. */
    const classes = $derived(
        twMerge('relative flex flex-col items-center justify-center gap-4', className)
    );

    const box = $derived(w > 0 ? Math.max(48, Math.min(size, w)) : size);

    const slices = $derived(data.filter((d) => Number.isFinite(d.value) && d.value > 0));
    const total = $derived(slices.reduce((sum, d) => sum + d.value, 0));
    const isEmpty = $derived(slices.length === 0 || total <= 0);

    const cx = $derived(box / 2);
    const rOuter = $derived(Math.max(6, box / 2 - LIFT));
    const rInner = $derived(Math.max(0, rOuter - Math.max(2, thickness)));
    const gap = $derived(slices.length > 1 ? Math.min(0.12, 2 / Math.max(1, rOuter)) : 0);

    const segments = $derived(donutSegments(slices, gap));

    const arcs = $derived.by(() => {
        const limit = TAU * sweep;
        return segments.map((seg) => {
            const a0 = Math.min(seg.a0, limit);
            const a1 = Math.min(seg.a1, limit);
            const drawn = a1 - a0 > 0.0005;
            return {
                a0,
                a1,
                drawn,
                d: drawn ? arcPath(cx, cx, rOuter, rInner, a0, a1, corner) : '',
                color: seg.color
            };
        });
    });

    /* Only the hovered wedge is re-pathed on pointermove; `arcs` never reads `hover`. */
    const lifted = $derived.by(() => {
        const arc = hover >= 0 ? arcs[hover] : undefined;
        return arc?.drawn ? arcPath(cx, cx, rOuter + LIFT, rInner, arc.a0, arc.a1, corner) : '';
    });

    const percent = (frac: number): string => `${Math.round(frac * 1000) / 10}%`;

    const legendItems = $derived(
        segments.map((seg) => ({
            name: seg.label,
            color: seg.color,
            value: `${valueFormat(seg.value)} · ${percent(seg.frac)}`
        }))
    );

    const summary = $derived(
        `Donut chart of ${segments.length} slices totalling ${valueFormat(total)}: ${segments
            .map((seg) => `${seg.label} ${percent(seg.frac)}`)
            .join(', ')}`
    );

    const tableRows = $derived(
        segments.map((seg) => ({
            label: seg.label,
            cells: [valueFormat(seg.value), percent(seg.frac)]
        }))
    );

    const tip = $derived.by(() => {
        const seg = hover >= 0 ? segments[hover] : undefined;
        if (!seg) return { x: 0, y: 0, rows: [] as { name: string; value: string; color?: string }[], title: '' };
        const r = (rOuter + rInner) / 2;
        return {
            x: cx + r * Math.sin(seg.mid),
            y: Math.max(14, Math.min(box - 14, cx - r * Math.cos(seg.mid))),
            title: seg.label,
            rows: [{ name: percent(seg.frac), value: valueFormat(seg.value), color: seg.color }]
        };
    });

    $effect(() => {
        if (started || isEmpty) return;
        started = true;
        tweenProgress(animate, (t) => (sweep = t));
    });
</script>

<div class={classes} use:resize={(width) => (w = width)}>
    {#if isEmpty}
        <div
            class="flex w-full items-center justify-center text-fc-sm text-fc-fg-muted"
            style:min-height="{box}px"
        >
            {emptyLabel}
        </div>
    {:else}
        <div class="relative" style:width="{box}px" style:height="{box}px">
            <svg
                width={box}
                height={box}
                viewBox="0 0 {box} {box}"
                aria-hidden="true"
                focusable="false"
                class="block"
                onpointerleave={() => (hover = -1)}
                onpointercancel={() => (hover = -1)}
            >
                {#each arcs as arc, i (i)}
                    {#if arc.drawn}
                        <path
                            d={hover === i ? lifted : arc.d}
                            fill={arc.color}
                            aria-hidden="true"
                            onpointerenter={() => (hover = i)}
                            onpointermove={() => (hover = i)}
                            onpointerdown={() => (hover = i)}
                        />
                    {/if}
                {/each}
            </svg>

            <div
                class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-0.5 text-center"
            >
                <span class="text-fc-lg text-fc-fg font-semibold">{centerValue ?? valueFormat(total)}</span>
                {#if centerLabel}
                    <span class="text-fc-xs text-fc-fg-muted">{centerLabel}</span>
                {/if}
            </div>

            <ChartTooltip x={tip.x} y={tip.y} title={tip.title} rows={tip.rows} visible={hover >= 0} />
        </div>

        {#if showLegend}
            <ChartLegend items={legendItems} class="justify-center" />
        {/if}

        <ChartTable caption={summary} head="Slice" columns={['Value', 'Share']} rows={tableRows} />
    {/if}
</div>
