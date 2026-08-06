<script lang="ts">
    import { gsap } from 'gsap';
    import { prefersReducedMotion } from '../../utils/motion.js';

    let {
        text,
        visible = true,
        delay = 0.2,
        stagger = 0.1,
        duration = 1
    }: {
        text: string;
        visible?: boolean;
        delay?: number;
        stagger?: number;
        duration?: number;
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

<span class="relative inline-block overflow-hidden align-middle leading-[1.15]">
    <span bind:this={inner} class="block will-change-[transform,opacity]">{text}</span>
</span>
