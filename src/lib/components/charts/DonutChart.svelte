<script lang="ts">
    import { gsap } from 'gsap';
    import { twMerge } from '../../utils/cn.js';
    import { prefersReducedMotion } from '../../utils/motion.js';
    import { arcPath, chartColor, formatCompact, type ChartSlice } from '../../utils/chart.js';
    import ChartLegend from './ChartLegend.svelte';
    import ChartTooltip from './ChartTooltip.svelte';

    let {
        data,
        size = 180,
        thickness = 22,
        showLegend = true,
        centerLabel,
        centerValue,
        valueFormat = formatCompact,
        animate = true,
        emptyLabel = 'No data',
        class: className = ''
    }: {
        data: ChartSlice[];
        size?: number;
        thickness?: number;
        showLegend?: boolean;
        centerLabel?: string;
        centerValue?: string | number;
        valueFormat?: (n: number) => string;
        animate?: boolean;
        emptyLabel?: string;
        class?: string;
    } = $props();

    const TAU = Math.PI * 2;
    const LIFT = 4;

    let hover = $state(-1);
    let sweep = $state(0);
    let started = false;

    const classes = $derived(twMerge('relative flex flex-col items-center gap-3', className));

    const slices = $derived(data.filter((d) => Number.isFinite(d.value) && d.value > 0));
    const total = $derived(slices.reduce((sum, d) => sum + d.value, 0));
    const isEmpty = $derived(slices.length === 0 || total <= 0);

    const cx = $derived(size / 2);
    const rOuter = $derived(Math.max(6, size / 2 - LIFT));
    const rInner = $derived(Math.max(0, rOuter - Math.max(2, thickness)));
    const gap = $derived(slices.length > 1 ? Math.min(0.12, 2 / Math.max(1, rOuter)) : 0);

    const segments = $derived.by(() => {
        const out: { label: string; value: number; frac: number; color: string; a0: number; a1: number; mid: number }[] = [];
        if (isEmpty) return out;
        let acc = 0;
        for (let i = 0; i < slices.length; i++) {
            const slice = slices[i];
            const frac = slice.value / total;
            const start = acc * TAU;
            const end = (acc + frac) * TAU;
            acc += frac;
            const a0 = start + gap / 2;
            const a1 = Math.max(a0, end - gap / 2);
            out.push({
                label: slice.label,
                value: slice.value,
                frac,
                color: slice.color ?? chartColor(i),
                a0,
                a1,
                mid: (start + end) / 2
            });
        }
        return out;
    });

    const wedges = $derived.by(() => {
        const limit = TAU * sweep;
        return segments.map((seg, i) => {
            const a0 = Math.min(seg.a0, limit);
            const a1 = Math.min(seg.a1, limit);
            const lifted = hover === i;
            return {
                d: a1 - a0 > 0.0005 ? arcPath(cx, cx, lifted ? rOuter + LIFT : rOuter, rInner, a0, a1) : '',
                color: seg.color
            };
        });
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

    const tip = $derived.by(() => {
        const seg = hover >= 0 ? segments[hover] : undefined;
        if (!seg) return { x: 0, y: 0, rows: [] as { name: string; value: string; color?: string }[], title: '' };
        const r = (rOuter + rInner) / 2;
        return {
            x: cx + r * Math.sin(seg.mid),
            y: Math.max(14, Math.min(size - 14, cx - r * Math.cos(seg.mid))),
            title: seg.label,
            rows: [{ name: percent(seg.frac), value: valueFormat(seg.value), color: seg.color }]
        };
    });

    $effect(() => {
        if (started || isEmpty) return;
        started = true;
        if (!animate || prefersReducedMotion()) {
            sweep = 1;
            return;
        }
        const proxy = { t: 0 };
        gsap.to(proxy, {
            t: 1,
            duration: 0.6,
            ease: 'power3.out',
            onUpdate: () => (sweep = proxy.t)
        });
    });
</script>

<div class={classes}>
    {#if isEmpty}
        <div
            class="flex w-full items-center justify-center text-fc-sm text-fc-fg-muted"
            style:min-height="{size}px"
        >
            {emptyLabel}
        </div>
    {:else}
        <div class="relative" style:width="{size}px" style:height="{size}px">
            <svg
                width={size}
                height={size}
                viewBox="0 0 {size} {size}"
                role="img"
                aria-label={summary}
                focusable="false"
                class="block"
                onpointerleave={() => (hover = -1)}
                onpointercancel={() => (hover = -1)}
            >
                {#each wedges as wedge, i (i)}
                    {#if wedge.d}
                        <path
                            d={wedge.d}
                            fill={wedge.color}
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

        <div class="sr-only">
            <table>
                <caption>{summary}</caption>
                <thead>
                    <tr>
                        <th scope="col">Slice</th>
                        <th scope="col">Value</th>
                        <th scope="col">Share</th>
                    </tr>
                </thead>
                <tbody>
                    {#each segments as seg, i (i)}
                        <tr>
                            <th scope="row">{seg.label}</th>
                            <td>{valueFormat(seg.value)}</td>
                            <td>{percent(seg.frac)}</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    {/if}
</div>
