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
    let tween: ReturnType<typeof gsap.fromTo> | null = null;

    $effect(() => {
        if (!el) return;
        tween?.kill();
        if (prefersReducedMotion()) {
            gsap.set(el, { opacity: 1, y: 0 });
            return;
        }
        tween = gsap.fromTo(
            el,
            { opacity: 0, y: distance },
            {
                opacity: 1,
                y: 0,
                duration,
                ease: 'power3.out',
                onComplete: () => (tween = null)
            }
        );
    });
</script>

{#key key}
    <div bind:this={el} class={twMerge('min-w-0', className)}>
        {@render children()}
    </div>
{/key}
