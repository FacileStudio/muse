<script lang="ts">
    import { onMount } from 'svelte';
    import { gsap } from 'gsap';
    import { twMerge } from '../../utils/cn.js';
    import { prefersReducedMotion } from '../../utils/motion.js';

    let {
        duration = 1.5,
        color = 'var(--color-fc-bg)',
        start = 'covered',
        class: className = ''
    }: {
        duration?: number;
        color?: string;
        start?: 'covered' | 'open';
        class?: string;
    } = $props();

    let rideau: HTMLDivElement | null = $state(null);

    const classes = $derived(
        twMerge('fixed inset-x-0 top-0 w-screen h-dvh z-[100] pointer-events-none', className)
    );

    onMount(() => {
        const node = rideau;
        if (!node) return;
        /*
            `start="open"` is for a curtain that outlives the page it covers — one mounted at
            the app root and driven by navigation. Mounting it covered would wipe the screen
            once on boot, which is a transition away from nothing.
        */
        if (start === 'open' || prefersReducedMotion()) {
            node.style.height = '0';
            return;
        }
        const ctx = gsap.context(() => {
            gsap.to(node, { height: 0, duration, ease: 'power3.inOut' });
        }, node);
        return () => ctx.revert();
    });

    /*
        Neither tween is wrapped in the mount context: `close` owns the navigation that
        follows it, so reverting it on destroy would cancel the very thing it was started
        for, and `open` runs on a curtain the route change did not remount.
    */
    export function close(href?: string) {
        if (!rideau) return;
        const done = () => {
            if (href) window.location.href = href;
        };
        if (prefersReducedMotion()) {
            rideau.style.height = '100dvh';
            done();
            return;
        }
        gsap.to(rideau, { height: '100dvh', duration, ease: 'power3.inOut', onComplete: done });
    }

    export function open() {
        if (!rideau) return;
        if (prefersReducedMotion()) {
            rideau.style.height = '0';
            return;
        }
        gsap.to(rideau, { height: 0, duration, ease: 'power3.inOut' });
    }
</script>

<div bind:this={rideau} class={classes} style:background={color} aria-hidden="true"></div>
