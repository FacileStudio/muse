<script module lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';
    export interface ToasterProps extends HTMLAttributes<HTMLDivElement> {
        position?: 'top' | 'bottom';
        class?: string;

    }
</script>

<script lang="ts">
    import { flip } from 'svelte/animate';
    import { quartIn, quartInOut, quartOut } from 'svelte/easing';
    import { twMerge } from '../../utils/cn.js';
    import Toast from '../molecules/Toast.svelte';
    import { prefersReducedMotion } from '../../utils/motion.js';
    import { toast, toasts } from '../../utils/toast.svelte.js';

    let {
        position = 'bottom',
        class: className = '',
        ...rest
    }: ToasterProps = $props();

    const ENTER = 300;
    const EXIT = 200;

    /*
     * quartIn/Out are power3.in/out — the same curve GSAP would run, without pulling gsap in
     * for four properties, and asymmetric like every other overlay in §11: a toast arrives
     * decelerating and leaves accelerating. Duration 0 under reduced motion still runs the
     * transition, so `out:` still holds the node for its own removal; it just does it in a
     * frame instead of tweening.
     */
    const travel = $derived(position === 'top' ? -16 : 16);

    function enter(_node: HTMLElement) {
        return {
            duration: prefersReducedMotion() ? 0 : ENTER,
            easing: quartOut,
            css: (t: number, u: number) =>
                `opacity: ${t}; transform: translateY(${u * travel}px) scale(${0.96 + t * 0.04})`
        };
    }

    function leave(_node: HTMLElement) {
        return {
            duration: prefersReducedMotion() ? 0 : EXIT,
            easing: quartIn,
            css: (t: number, u: number) => `opacity: ${t}; transform: translateX(${u * 24}px)`
        };
    }

    /*
     * `pointer-events-none` on the region, `pointer-events-auto` on each toast: the strip
     * spans the viewport and would otherwise eat clicks on whatever sits behind it.
     * Full-bleed on a phone, a 384px column pinned right from `sm:` up.
     */
    const classes = $derived(
        twMerge(
            'pointer-events-none fixed inset-x-0 z-60 flex flex-col gap-3 px-4 sm:inset-x-auto sm:right-6 sm:w-full sm:max-w-sm sm:px-0',
            /* One padding utility per edge, no `sm:` variant: an app clearing a fixed bottom
               nav passes `pb-28 md:pb-6` and needs its own breakpoints to win. */
            position === 'top'
                ? 'top-0 flex-col-reverse pt-[max(1.25rem,env(safe-area-inset-top))]'
                : 'bottom-0 pb-[max(1.25rem,env(safe-area-inset-bottom))]',
            className
        )
    );
</script>

<!--
@component
La file de messages éphémères, montée une seule fois par application, à la racine.
-->

<!-- The region exists from first paint, empty or not: a live region injected at the same
     moment as its content is announced unreliably. -->
<div class={classes} aria-live="polite" aria-atomic="false" {...rest}>
    {#each toasts.items as item (item.id)}
        <div
            in:enter
            out:leave
            animate:flip={{ duration: prefersReducedMotion() ? 0 : ENTER, easing: quartInOut }}
        >
            <!-- Hover and focus freeze the countdown, and they belong on the toast itself:
                 the wrapper is a bare animation box with no role to hang them off. -->
            <Toast
                tone={item.tone}
                title={item.title}
                icon={item.icon}
                action={item.action}
                onDismiss={() => toast.dismiss(item.id)}
                onpointerenter={() => toasts.pause(item.id)}
                onpointerleave={() => toasts.resume(item.id)}
                onfocusin={() => toasts.pause(item.id)}
                onfocusout={() => toasts.resume(item.id)}
            >
                {item.message}
            </Toast>
        </div>
    {/each}
</div>
