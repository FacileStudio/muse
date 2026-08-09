<script module lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';

    export type Size = 'sm' | 'md' | 'lg';

    export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
        size?: Size;
        label?: string;
        class?: string;

    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';

    let {
        size = 'md',
        label = 'Chargement',
        class: className = '',
        ...rest
    }: SpinnerProps = $props();

    const sizes: Record<Size, string> = {
        sm: 'h-4 w-4 border-2',
        md: 'h-6 w-6 border-2',
        lg: 'h-10 w-10 border-[3px]'
    };

    /*
     * Under reduced motion the spin slows, it does not stop. `motion-reduce:animate-none` froze
     * it into a static ring — a busy indicator that indicates nothing, which is worse than the
     * motion it was avoiding. Vestibular guidance is about large, fast or parallax movement; a
     * 24px ring turning once every three seconds is a legible status, and `Skeleton` and
     * `StatusDot` can keep hiding outright because their absence still reads correctly.
     */
    const classes = $derived(twMerge('inline-block rounded-fc-pill border-fc-border border-t-fc-fg animate-spin motion-reduce:[animation-duration:3s]', sizes[size], className));
</script>

<span role="status" aria-label={label} class={classes} {...rest}></span>
