<script module lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';

    export type Tone = 'neutral' | 'accent' | 'info' | 'success' | 'warning' | 'danger' | 'owner' | 'admin';

    export interface StatusDotProps extends HTMLAttributes<HTMLSpanElement> {
        tone?: Tone;
        label?: string;
        pulse?: boolean;
        class?: string;

    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';

    let {
        tone = 'neutral',
        label,
        pulse = false,
        class: className = '',
        ...rest
    }: StatusDotProps = $props();

    const dots: Record<Tone, string> = {
        neutral: 'bg-fc-fg-muted',
        accent: 'bg-fc-accent',
        info: 'bg-fc-info',
        success: 'bg-fc-success',
        warning: 'bg-fc-warning',
        danger: 'bg-fc-danger',
        owner: 'bg-fc-owner',
        admin: 'bg-fc-admin'
    };

    const classes = $derived(
        twMerge('inline-flex items-center gap-2 text-fc-sm text-fc-fg-muted', className)
    );
</script>

<span class={classes} {...rest}>
    <span class="relative inline-flex size-2 shrink-0">
        {#if pulse}
            <span
                class={twMerge(
                    'absolute inset-0 animate-ping rounded-fc-pill opacity-60 motion-reduce:hidden',
                    dots[tone]
                )}
            ></span>
        {/if}
        <span class={twMerge('relative inline-flex size-2 rounded-fc-pill', dots[tone])}></span>
    </span>
    {#if label}<span>{label}</span>{/if}
</span>
