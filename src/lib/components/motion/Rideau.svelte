<script lang="ts">
    import { onMount } from 'svelte';
    import { gsap } from 'gsap';
    import { twMerge } from '../../utils/cn.js';
    import { prefersReducedMotion } from '../../utils/motion.js';

    let {
        duration = 1.5,
        color = 'var(--color-fc-bg)',
        class: className = ''
    }: { duration?: number; color?: string; class?: string } = $props();

    let rideau: HTMLDivElement | null = $state(null);

    const classes = $derived(
        twMerge('fixed inset-x-0 top-0 w-screen h-dvh z-[100] pointer-events-none', className)
    );

    onMount(() => {
        const node = rideau;
        if (!node) return;
        if (prefersReducedMotion()) {
            node.style.height = '0';
            return;
        }
        const ctx = gsap.context(() => {
            gsap.to(node, { height: 0, duration, ease: 'power3.inOut' });
        }, node);
        return () => ctx.revert();
    });

    /*
        Not wrapped in the mount context: this tween owns the navigation that follows it,
        so reverting it on destroy would cancel the very thing it was started for.
    */
    export function close(href: string) {
        if (!rideau) return;
        if (prefersReducedMotion()) {
            window.location.href = href;
            return;
        }
        gsap.to(rideau, {
            height: '100dvh',
            duration,
            ease: 'power3.inOut',
            onComplete: () => (window.location.href = href)
        });
    }
</script>

<div bind:this={rideau} class={classes} style:background={color} aria-hidden="true"></div>
