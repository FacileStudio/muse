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
        label = 'Loading',
        class: className = '',
        ...rest
    }: SpinnerProps = $props();

    const sizes: Record<Size, string> = {
        sm: 'h-4 w-4 border-2',
        md: 'h-6 w-6 border-2',
        lg: 'h-10 w-10 border-[3px]'
    };

    const classes = $derived(twMerge('inline-block rounded-fc-pill border-fc-border border-t-fc-fg animate-spin motion-reduce:animate-none', sizes[size], className));
</script>

<span role="status" aria-label={label} class={classes} {...rest}></span>
