<script lang="ts">
    import { gsap } from 'gsap';
    import { twMerge } from '../../utils/cn.js';
    import { prefersReducedMotion } from '../../utils/motion.js';

    let {
        text,
        visible = true,
        delay = 0.2,
        stagger = 0.1,
        duration = 1,
        class: className = ''
    }: {
        text: string;
        visible?: boolean;
        delay?: number;
        stagger?: number;
        duration?: number;
        class?: string;
    } = $props();

    let inner: HTMLDivElement | null = $state(null);
    let mounted = false;

    $effect(() => {
        const node = inner;
        const shown = visible;
        if (!node) return;

        if (prefersReducedMotion()) {
            gsap.set(node, { y: 0, opacity: shown ? 1 : 0 });
            mounted = true;
            return;
        }

        gsap.killTweensOf(node);
        if (!shown) {
            gsap.to(node, { y: '100%', opacity: 0, duration: 0.25, ease: 'power3.in' });
            return;
        }
        gsap.fromTo(
            node,
            { y: '100%', opacity: 0 },
            { y: 0, opacity: 1, duration, stagger, delay: mounted ? 0.05 : delay, ease: 'power3.out' }
        );
        mounted = true;
    });
</script>

<!--
    `max-w-full` is what makes `class="truncate"` usable from the outside. The outer span is
    inline-block, so it shrink-wraps its text and would happily run past a narrow parent —
    capping it at the parent's width is what gives the inner span an edge to put an ellipsis
    against. Without it a long label silently overflows or wraps to a second line.
-->
<span class="relative inline-block max-w-full overflow-hidden align-middle leading-[1.15]">
    <span bind:this={inner} class={twMerge('block will-change-[transform,opacity]', className)}
        >{text}</span
    >
</span>
