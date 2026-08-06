<script lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLButtonAttributes } from 'svelte/elements';
    import { gsap } from 'gsap';
    import { twMerge } from '../../utils/cn.js';
    import { prefersReducedMotion } from '../../utils/motion.js';

    let {
        class: className = '',
        children,
        ...rest
    }: HTMLButtonAttributes & {
        class?: string;
        children: Snippet;
    } = $props();

    const classes = $derived(twMerge(
        'inline-flex size-11 shrink-0 items-center justify-center rounded-fc-pill border border-fc-border text-fc-fg [&_svg]:size-4.5 [&_iconify-icon]:block transition-colors hover:bg-fc-surface disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fc-ring',
        className
    ));

    function press(e: PointerEvent) {
        if (prefersReducedMotion()) return;
        const el = e.currentTarget as HTMLElement;
        gsap.killTweensOf(el, 'scale');
        gsap.to(el, {
            scale: 0.88,
            duration: 0.08,
            ease: 'power2.in',
            onComplete: () => gsap.to(el, { scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.4)' })
        });
    }
</script>

<button class={classes} onpointerdown={press} {...rest}>
    {@render children()}
</button>
