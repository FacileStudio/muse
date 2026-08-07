<script lang="ts" generics="Item extends { id: string | number }">
    import type { Snippet } from 'svelte';
    import { gsap } from 'gsap';
    import Spinner from '../atoms/Spinner.svelte';
    import { twMerge } from '../../utils/cn.js';
    import { prefersReducedMotion, isMobile } from '../../utils/motion.js';

    let {
        items,
        children,
        minDistance,
        paddingX,
        paddingY,
        isLoading = false,
        loadError = '',
        class: className = ''
    }: {
        items: Item[];
        children: Snippet<[Item, number, (el: HTMLButtonElement) => void]>;
        minDistance?: number;
        paddingX?: number;
        paddingY?: number;
        isLoading?: boolean;
        loadError?: string;
        class?: string;
    } = $props();

    /*
        Deliberately not $state: nothing in the template reads it, and writing to a rune
        from inside the {#each} body is a mutation during render. The layout effect below
        depends on `items` instead, which is what causes the refs to be re-collected.
    */
    let cards: HTMLButtonElement[] = [];
    let stage: HTMLDivElement | null = $state(null);

    const classes = $derived(twMerge('relative w-full h-full overflow-hidden z-0', className));

    const MAX_ATTEMPTS = 50;

    function place(container: HTMLElement, nodes: HTMLButtonElement[], animate: boolean) {
        const mobile = isMobile();

        /*
            Padding is capped at a fifth of the box. The defaults were picked against a
            full-viewport stage, and on anything shorter they ate the whole placement range:
            a 448px stage minus 140px of padding either side leaves cards ±44px of travel,
            which is less than the minimum separation, so every candidate failed and every
            card collapsed onto the fallback position.
        */
        const px = Math.min(paddingX ?? (mobile ? 20 : 80), container.clientWidth * 0.2);
        const py = Math.min(paddingY ?? (mobile ? 60 : 140), container.clientHeight * 0.2);
        const minD = minDistance ?? (mobile ? 110 : 200);

        return gsap.context(() => {
            gsap.set(nodes, {
                position: 'absolute',
                top: '50%',
                left: '50%',
                xPercent: -50,
                yPercent: -50,
                x: 0,
                y: 0,
                scale: animate ? 0.2 : 1
            });

            const targets: { x: number; y: number }[] = [];
            for (const el of nodes) {
                const rect = el.getBoundingClientRect();
                const w = rect.width || 200;
                const h = rect.height || 280;
                const maxX = Math.max(0, container.clientWidth / 2 - w / 2 - px);
                const maxY = Math.max(0, container.clientHeight / 2 - h / 2 - py);

                /*
                    Keep the best candidate seen, not a fixed fallback. The old loop reset to
                    (0, 0) when no attempt cleared `minD`, so in a box too tight to satisfy the
                    separation *every* unplaced card landed on the exact same point — the one
                    outcome the whole function exists to avoid. Falling back to the most
                    separated candidate degrades gracefully instead: cards get closer than
                    requested, never stacked.
                */
                let bestX = 0;
                let bestY = 0;
                let bestGap = -1;
                for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
                    const tx = Math.random() * (maxX * 2) - maxX;
                    const ty = Math.random() * (maxY * 2) - maxY;
                    const gap = targets.length
                        ? Math.min(...targets.map((p) => Math.hypot(p.x - tx, p.y - ty)))
                        : Infinity;
                    if (gap >= minD) {
                        bestX = tx;
                        bestY = ty;
                        break;
                    }
                    if (gap > bestGap) {
                        bestGap = gap;
                        bestX = tx;
                        bestY = ty;
                    }
                }
                targets.push({ x: bestX, y: bestY });
            }

            const x = (i: number) => targets[i].x;
            const y = (i: number) => targets[i].y;

            if (!animate) {
                gsap.set(nodes, { x, y, scale: 1 });
                return;
            }
            gsap.to(nodes, {
                scale: 1,
                x,
                y,
                duration: 1,
                ease: 'power3.inOut',
                stagger: { each: 0.06, from: 'random' }
            });
        }, container);
    }

    /*
        Positions are derived from the container's measured size, so they are stale the
        moment either `items` or that size changes. The effect re-runs on `items`; a
        ResizeObserver covers the rest. Width is compared by hand because the observer
        also fires on height changes, and re-placing every card because a scrollbar-free
        viewport grew 3px is not worth the reflow. Resizes snap instead of animating —
        replaying a one-second entrance mid-drag looks broken.
    */
    $effect(() => {
        const container = stage;
        const count = items.length;
        if (!container || count === 0) return;

        cards.length = count;
        const nodes = cards.filter(Boolean);
        if (nodes.length === 0) return;

        let width = container.clientWidth;
        let ctx = place(container, nodes, !prefersReducedMotion());

        const observer = new ResizeObserver(() => {
            if (container.clientWidth === width) return;
            width = container.clientWidth;
            ctx.revert();
            ctx = place(container, nodes, false);
        });
        observer.observe(container);

        return () => {
            observer.disconnect();
            ctx.revert();
        };
    });
</script>

<div class={classes}>
    {#if isLoading}
        <div class="flex min-h-64 w-full items-center justify-center text-fc-fg-muted">
            <Spinner size="lg" />
        </div>
    {:else if loadError}
        <div class="flex min-h-64 w-full flex-col items-center justify-center p-6 text-center text-fc-fg-muted bg-fc-surface">
            <p>{loadError}</p>
        </div>
    {:else if !items || items.length === 0}
        <div class="flex min-h-64 w-full items-center justify-center text-fc-fg-muted"></div>
    {:else}
        <div bind:this={stage} class="relative h-full min-h-64 w-full">
            {#each items as item, index (item.id)}
                {@render children(item, index, (el) => (cards[index] = el))}
            {/each}
        </div>
    {/if}
</div>
