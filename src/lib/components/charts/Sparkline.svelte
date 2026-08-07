<script lang="ts">
    import { gsap } from 'gsap';
    import { twMerge } from '../../utils/cn.js';
    import { prefersReducedMotion } from '../../utils/motion.js';
    import { areaPath, linePath, resize } from '../../utils/chart.js';

    let {
        data = [],
        height = 32,
        area = true,
        smooth = true,
        color = 'var(--color-fc-chart-1)',
        showLast = false,
        animate = true,
        emptyLabel = 'No data',
        class: className = ''
    }: {
        data: number[];
        height?: number;
        area?: boolean;
        smooth?: boolean;
        color?: string;
        showLast?: boolean;
        animate?: boolean;
        emptyLabel?: string;
        class?: string;
    } = $props();

    let w = $state(0);
    let svgEl: SVGSVGElement | null = $state(null);
    let started = false;

    const classes = $derived(twMerge('block w-full', className));

    const values = $derived(data.filter((v) => Number.isFinite(v)));
    const isEmpty = $derived(values.length === 0 || values.every((v) => v === 0));

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
    const summary = $derived(`Sparkline of ${values.length} values, from ${values[0] ?? 0} to ${values[values.length - 1] ?? 0}`);

    $effect(() => {
        if (started || isEmpty || plotW <= 0 || !svgEl) return;
        started = true;
        if (!animate || prefersReducedMotion()) return;
        const path = svgEl.querySelector<SVGPathElement>('[data-line]');
        if (path) {
            const len = path.getTotalLength();
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
        }
        const rest = svgEl.querySelectorAll<SVGElement>('[data-fade]');
        if (rest.length) gsap.fromTo(rest, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: 'power3.out' });
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
            role="img"
            aria-label={summary}
            focusable="false"
            class="block"
        >
            {#if fill}
                <path d={fill} fill={color} opacity="0.12" data-fade aria-hidden="true" />
            {/if}
            <path
                d={stroke}
                fill="none"
                stroke={color}
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                data-line
                aria-hidden="true"
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
                    aria-hidden="true"
                />
            {/if}
        </svg>
    {:else}
        <div style:height="{height}px"></div>
    {/if}
</div>
