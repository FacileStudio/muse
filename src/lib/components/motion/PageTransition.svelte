<script module lang="ts">
    import type { Snippet } from 'svelte';

    export interface PageTransitionProps {
        key: string | number;
        duration?: number;
        distance?: number;
        children: Snippet;
        class?: string;

    }
</script>

<script lang="ts">
    import { gsap } from 'gsap';
    import { twMerge } from '../../utils/cn.js';
    import { prefersReducedMotion } from '../../utils/motion.js';

    let {
        key,
        duration = 0.35,
        distance = 12,
        children,
        class: className = ''
    }: PageTransitionProps = $props();

    let el: HTMLDivElement | null = $state(null);

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

<!--
@component
L'animation d'un changement de route, cadencée sur la route. Entrée seule : un vrai fondu croisé demanderait de monter les deux pages.
-->

{#key key}
    <div bind:this={el} class={twMerge('min-w-0', className)}>
        {@render children()}
    </div>
{/key}
