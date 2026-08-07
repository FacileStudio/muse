<script lang="ts">
    import type { Snippet } from 'svelte';
    import { gsap } from 'gsap';
    import { twMerge } from '../../utils/cn.js';
    import { prefersReducedMotion } from '../../utils/motion.js';

    let {
        key,
        duration = 0.35,
        distance = 12,
        children,
        class: className = ''
    }: {
        key: string | number;
        duration?: number;
        distance?: number;
        children: Snippet;
        class?: string;
    } = $props();

    let el: HTMLDivElement | null = $state(null);

    /*
        Two things this effect has to get right.

        {#key} swaps the node out from under an in-flight tween, so the teardown has to kill
        it — otherwise the old, detached div keeps being animated to completion.

        And `clearProps` is not cosmetic. gsap leaves `transform: translate(0px, 0px)` on the
        node when the tween lands, and *any* transform makes an element the containing block
        for `position: fixed` descendants. A fixed overlay rendered inside the routed page —
        `Rideau`, a fixed toolbar, anything full-bleed — then anchors to this wrapper instead
        of the viewport and starts overflowing its scroll container. Wiping the transform at
        the end costs nothing and keeps the wrapper transparent to layout.
    */
    $effect(() => {
        const node = el;
        if (!node) return;
        gsap.killTweensOf(node);
        if (prefersReducedMotion()) {
            gsap.set(node, { opacity: 1, clearProps: 'transform' });
        } else {
            gsap.fromTo(
                node,
                { opacity: 0, y: distance },
                {
                    opacity: 1,
                    y: 0,
                    duration,
                    ease: 'power3.out',
                    onComplete: () => gsap.set(node, { clearProps: 'transform' })
                }
            );
        }
        return () => gsap.killTweensOf(node);
    });
</script>

{#key key}
    <div bind:this={el} class={twMerge('min-w-0', className)}>
        {@render children()}
    </div>
{/key}
