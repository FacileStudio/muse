<script module lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';
    import type { ChartSlice } from '../../utils/chart.js';

    export interface DonutChartProps extends HTMLAttributes<HTMLDivElement> {
        data: ChartSlice[];
        size?: number;
        thickness?: number;
        corner?: number;
        showLegend?: boolean;
        /** Shows the hovered slice in a panel beside the ring instead of a tooltip at the cursor. */
        detail?: boolean;
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
    import { TAU, arcPath, donutSegments, formatCompact, liftArc, resize } from '../../utils/chart.js';
    import { focusMarks, swapIn, tweenProgress, valueTween } from './entry.js';
    import ChartLegend from './ChartLegend.svelte';
    import ChartTable from './ChartTable.svelte';
    import ChartTooltip from './ChartTooltip.svelte';

    let {
        data,
        size = 180,
        thickness = 22,
        corner = 4,
        showLegend = true,
        detail = false,
        centerLabel,
        centerValue,
        valueFormat = formatCompact,
        animate = true,
        emptyLabel = 'No data',
        class: className = '',
        ...rest
    }: DonutChartProps = $props();

    const LIFT = 6;
    const GAP = 4;

    let w = $state(0);
    let hover = $state(-1);
    let top = $state(-1);
    let sweep = $state(0);
    let lifts = $state<number[]>([]);
    let ring = $state<SVGSVGElement>();
    let panelEl = $state<HTMLDivElement>();
    let started = false;

    const tweenLifts = valueTween((values) => (lifts = values));

    /* `justify-center` matters when the card stretches to a taller neighbour in a grid row:
       the ring then sits in the middle of the space it was given instead of hanging off the
       title with the legend stranded at the bottom. */
    const classes = $derived(
        twMerge('relative flex flex-col items-center justify-center gap-1', className)
    );

    // ring diameter: the requested size, capped by the width left once the detail panel has its share
    const box = $derived(w > 0 ? Math.max(48, Math.min(size, detail ? w * 0.65 : w)) : size);

    const slices = $derived(data.filter((d) => Number.isFinite(d.value) && d.value > 0));
    const total = $derived(slices.reduce((sum, d) => sum + d.value, 0));
    const isEmpty = $derived(slices.length === 0 || total <= 0);

    const cx = $derived(box / 2);
    const rOuter = $derived(Math.max(6, box / 2 - LIFT));
    const rInner = $derived(Math.max(0, rOuter - Math.max(2, thickness)));
    // half the 4px gap, taken from each side of every slice
    const pad = $derived(slices.length > 1 ? GAP / 2 : 0);

    const segments = $derived(donutSegments(slices, 0));

    const arcs = $derived.by(() => {
        const limit = TAU * sweep;
        return segments.map((seg, i) => {
            const a0 = Math.min(seg.a0, limit);
            const a1 = Math.min(seg.a1, limit);
            const drawn = a1 - a0 > 0.0005;
            const lifted = liftArc({ a0, a1, rOuter, rInner }, lifts[i] ?? 0, segments.length > 1);
            return {
                drawn,
                d: drawn ? arcPath(cx, cx, lifted.rOuter, lifted.rInner, lifted.a0, lifted.a1, corner, pad) : '',
                color: seg.color
            };
        });
    });

    /* SVG paints in document order, so the slice overlapping its neighbours has to come last. */
    const paintOrder = $derived.by(() => {
        const rest = arcs.map((_, i) => i).filter((i) => i !== top);
        return top >= 0 && top < arcs.length ? [...rest, top] : rest;
    });

    const percent = (frac: number): string => `${Math.round(frac * 1000) / 10}%`;

    const legendItems = $derived(
        segments.map((seg) => ({
            name: seg.label,
            color: seg.color
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

    const panel = $derived.by(() => {
        const seg = hover >= 0 ? segments[hover] : undefined;
        return seg
            ? { name: seg.label, value: valueFormat(seg.value), share: percent(seg.frac) }
            : { name: centerLabel ?? '', value: centerValue ?? valueFormat(total), share: '' };
    });

    $effect(() => {
        if (started || isEmpty) return;
        started = true;
        tweenProgress(animate, (t) => (sweep = t));
    });

    $effect(() => {
        void hover;

        if (panelEl)
            swapIn(panelEl, animate);
    });

    $effect(() => {
        const active = hover;

        if (active >= 0)
            top = active;
        const targets = segments.map((_, i) => (i === active ? LIFT : 0));

        tweenLifts(targets, animate);
        if (ring)
            focusMarks(ring, active, animate);
    });
</script>

<!--
@component
Un anneau de proportions. Jamais arrondi au `stroke-linecap` : ça pousse chaque part au-delà de l'angle qu'elle représente.
-->

<div class={classes} use:resize={(width) => (w = width)} {...rest}>
    {#if isEmpty}
        <div
            class="flex w-full items-center justify-center text-fc-p text-fc-muted"
            style:min-height="{box}px"
        >
            {emptyLabel}
        </div>
    {:else}
        <div class={detail ? 'flex w-full items-center gap-1' : 'contents'}>
        <div class="relative shrink-0" style:width="{box}px" style:height="{box}px">
            <svg
                bind:this={ring}
                width={box}
                height={box}
                viewBox="0 0 {box} {box}"
                aria-hidden="true"
                focusable="false"
                class="block"
                onpointerleave={() => (hover = -1)}
                onpointercancel={() => (hover = -1)}
            >
                {#each paintOrder as i (i)}
                    {@const arc = arcs[i]}
                    {#if arc.drawn}
                        <path
                            d={arc.d}
                            fill={arc.color}
                            data-mark={i}
                            aria-hidden="true"
                            onpointerenter={() => (hover = i)}
                            onpointermove={() => (hover = i)}
                            onpointerdown={() => (hover = i)}
                        />
                    {/if}
                {/each}
            </svg>

            {#if !detail}
                <div
                    class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-0.5 text-center"
                >
                    <span class="text-fc-lead text-fc-ink font-semibold">{centerValue ?? valueFormat(total)}</span>
                    {#if centerLabel}
                        <span class="text-fc-subtext text-fc-muted">{centerLabel}</span>
                    {/if}
                </div>
            {/if}

            {#if !detail}
                <ChartTooltip x={tip.x} y={tip.y} title={tip.title} rows={tip.rows} visible={hover >= 0} />
            {/if}
        </div>

        {#if detail}
            <!-- 60% of the ring, so the panel sits centred against it rather than spanning it -->
            <div
                bind:this={panelEl}
                class="flex min-w-0 flex-1 flex-col justify-between pl-4 text-end"
                style:height="{box * 0.6}px"
                aria-hidden="true"
            >
                <div class="flex flex-col gap-1">
                    <span data-swap class="truncate text-fc-p text-fc-muted">{panel.name}</span>
                    <span data-swap class="text-fc-title text-fc-ink tabular-nums">{panel.value}</span>
                </div>
                <span data-swap class="text-fc-p text-fc-muted tabular-nums">{panel.share}</span>
            </div>
        {/if}
        </div>

        {#if showLegend}
            <ChartLegend items={legendItems} class="justify-center" />
        {/if}

        <ChartTable caption={summary} head="Slice" columns={['Value', 'Share']} rows={tableRows} />
    {/if}
</div>
