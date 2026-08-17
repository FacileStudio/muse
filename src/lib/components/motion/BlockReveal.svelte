<script module lang="ts">
    import type { Snippet } from 'svelte';

    export interface BlockRevealProps {
        children: Snippet;
        /** Drive the reveal from the parent. Left out, the element watches its own box. */
        open?: boolean;
        /** Panel colour: `accent` is the inverted slab, `page` the light one for dark surfaces. */
        panel?: 'accent' | 'page';
        /** Seconds for the whole pass — 55% covering, 45% uncovering. */
        duration?: number;
        /** Seconds before the panel moves. Stagger a group by handing each one a bigger delay. */
        delay?: number;
        /** The band it watches while self-observing (rootMargin syntax). */
        rootMargin?: string;
        class?: string;
    }
</script>

<script lang="ts">
    import { gsap } from 'gsap';
    import { twMerge } from '../../utils/cn.js';
    import { prefersReducedMotion } from '../../utils/motion.js';

    let {
        children,
        open,
        panel = 'accent',
        duration = 0.8,
        delay = 0,
        rootMargin = '0px 0px -12% 0px',
        class: className = ''
    }: BlockRevealProps = $props();

    let root: HTMLSpanElement | null = $state(null);
    let copy: HTMLSpanElement | null = $state(null);
    let cover: HTMLSpanElement | null = $state(null);

    let inView = $state(false);
    let played = false;

    const shown = $derived(open ?? inView);

    /* Self-observing is the fallback, not the default behaviour: a parent that already knows
       when its section arrives drives every child off one flag, and an observer per line would
       have them arrive on slightly different scroll positions. */
    $effect(() => {
        const node = root;
        if (open !== undefined || !node) return;

        const io = new IntersectionObserver(([e]) => (inView = e.isIntersecting), {
            rootMargin,
            threshold: 0
        });
        io.observe(node);
        return () => io.disconnect();
    });

    $effect(() => {
        const block = cover;
        const text = copy;
        const show = shown;
        if (!block || !text) return;

        gsap.killTweensOf([block, text]);

        if (prefersReducedMotion()) {
            gsap.set(block, { scaleX: 0 });
            gsap.set(text, { autoAlpha: show ? 1 : 0, yPercent: 0 });
            return;
        }

        let tl: gsap.core.Timeline;

        if (show) {
            played = true;
            tl = gsap
                .timeline({ delay })
                .set(block, { scaleX: 0, transformOrigin: '0% 50%' })
                .set(text, { autoAlpha: 0, yPercent: 0 })
                .to(block, { scaleX: 1, duration: duration * 0.55, ease: 'power3.out' })
                .set(block, { transformOrigin: '100% 50%' })
                .set(text, { autoAlpha: 1 })
                .to(block, { scaleX: 0, duration: duration * 0.45, ease: 'power3.in' });
        } else if (played && Number(gsap.getProperty(text, 'opacity')) > 0) {
            /* Leaving is not the sweep in reverse — sending the panel back across reads as a
               second arrival. The copy lifts out of its own line instead. Text the panel never
               got round to uncovering is simply parked: there is nothing to see off. */
            gsap.set(block, { scaleX: 0 });
            tl = gsap
                .timeline()
                .to(text, { yPercent: -40, autoAlpha: 0, duration: duration * 0.45, ease: 'power3.in' });
        } else {
            gsap.set(block, { scaleX: 0, transformOrigin: '0% 50%' });
            gsap.set(text, { autoAlpha: 0, yPercent: 0 });
            return;
        }

        /* A timeline left running against a detached node keeps ticking until it completes. */
        return () => tl.kill();
    });
</script>

<!--
@component
Un panneau plein balaie le texte : il entre par la gauche, sort par la droite, et ne découvre la copie qu'avec son bord de fuite. Rien ne glisse ni ne s'estompe.
-->

<!--
    Two spans, and the panel is the whole reveal: the copy starts invisible and is only ever
    uncovered by the panel's trailing edge.

    The inline `visibility: hidden` is what keeps it that way before the first effect runs —
    gsap's `autoAlpha` writes the same property, so it takes the element over cleanly, and
    server-rendered markup never flashes its copy ahead of its own panel.

    The panel overhangs the line box by a fraction of an em on every side, because descenders
    and tall ascenders hang out of it. In em so it tracks the font size, and vertically it only
    ever overlaps the next line rather than leaving a seam. One panel covers one element: a
    paragraph that wraps wants one BlockReveal per line, or it arrives as a single slab.
-->
<span bind:this={root} class={twMerge('relative block', className)}>
    <span bind:this={copy} class="block" style="visibility: hidden">
        {@render children()}
    </span>
    <span
        bind:this={cover}
        aria-hidden="true"
        style="top: -0.14em; bottom: -0.14em; left: -0.08em; right: -0.08em"
        class={twMerge(
            'pointer-events-none absolute will-change-transform',
            panel === 'page' ? 'bg-fc-page' : 'bg-fc-accent'
        )}
    ></span>
</span>
