<script module lang="ts">
    import type { ChartTipRow } from '../../utils/chart.js';

    export interface ChartTooltipProps {
        x: number;
        y: number;
        title?: string;
        rows: ChartTipRow[];
        visible: boolean;
        class?: string;

    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';

    let {
        x,
        y,
        title,
        rows = [],
        visible = false,
        class: className = ''
    }: ChartTooltipProps = $props();

    const OFFSET = 12;

    let el: HTMLDivElement | null = $state(null);
    let box = $state({ w: 0, h: 0, pw: 0, ph: 0, left: 0, view: 0 });

    /*
        No border. It floats over a chart that lives in a `bg-fc-component` card, so the
        separation comes from one step of fill — `fc-surface` is darker than the card in
        light mode and lighter in dark — plus the shadow. An outline on top of that was a
        third statement of the same thing, and it boxed in a surface that is 60px wide.
    */
    const classes = $derived(
        twMerge(
            'absolute z-10 pointer-events-none whitespace-nowrap rounded-fc-sm bg-fc-surface shadow-lg px-2.5 py-2 text-fc-xs',
            className
        )
    );

    /**
     * Measured once per open and again only when the tooltip or its plot actually resizes.
     * Reading `offsetWidth` per pointermove forced a synchronous layout on every frame.
     */
    $effect(() => {
        const node = el;
        if (!node || !visible) return;
        const parent = node.parentElement;
        if (!parent) return;
        const measure = () => {
            box = {
                w: node.offsetWidth,
                h: node.offsetHeight,
                pw: parent.clientWidth,
                ph: parent.clientHeight,
                left: parent.getBoundingClientRect().left,
                view: typeof window === 'undefined' ? 0 : window.innerWidth
            };
        };
        measure();
        if (typeof ResizeObserver === 'undefined') return;
        const observer = new ResizeObserver(measure);
        observer.observe(node);
        observer.observe(parent);
        return () => observer.disconnect();
    });

    /**
     * Bounds are the plot box intersected with the viewport, so a chart flush against a
     * card edge flips inward instead of spilling out of the card.
     */
    const place = $derived.by(() => {
        if (!box.w || !box.h) return { left: x + OFFSET, top: y, centred: true };
        const min = Math.max(0, -box.left);
        const max = Math.max(min, Math.min(box.pw, box.view - box.left) - box.w);
        const wanted = x + OFFSET > max ? x - OFFSET - box.w : x + OFFSET;
        return {
            left: Math.min(Math.max(wanted, min), max),
            top: Math.min(Math.max(y - box.h / 2, 0), Math.max(0, box.ph - box.h)),
            centred: false
        };
    });
</script>

<!--
@component
L'infobulle d'un graphique, ramenée dans les bornes de son conteneur et du viewport.
-->

{#if visible && rows.length}
    <div
        bind:this={el}
        class={classes}
        style:left="{place.left}px"
        style:top="{place.top}px"
        style:transform={place.centred ? 'translateY(-50%)' : 'none'}
    >
        {#if title}
            <div class="mb-1 text-fc-fg font-medium">{title}</div>
        {/if}
        <div class="flex flex-col gap-1">
            {#each rows as row, i (row.name + i)}
                <div class="flex items-center gap-1.5">
                    {#if row.color}
                        <span class="h-0.5 w-2.5 shrink-0 rounded-fc-pill" style:background-color={row.color}></span>
                    {/if}
                    <span class="text-fc-fg-muted">{row.name}</span>
                    <span class="ml-auto pl-3 text-fc-fg font-medium tabular-nums">{row.value}</span>
                </div>
            {/each}
        </div>
    </div>
{/if}
