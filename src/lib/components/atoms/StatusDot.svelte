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
        neutral: 'bg-fc-muted',
        accent: 'bg-fc-brand',
        info: 'bg-fc-info',
        success: 'bg-fc-success',
        warning: 'bg-fc-warning',
        danger: 'bg-fc-danger',
        owner: 'bg-fc-owner',
        admin: 'bg-fc-admin'
    };

    const classes = $derived(
        twMerge('inline-flex items-center gap-1 text-fc-p text-fc-muted', className)
    );
</script>

<!--
@component
Un état de connexion ou de santé, en une pastille et son libellé.
-->

<span class={classes} {...rest}>
    <span class="relative inline-flex size-2 shrink-0">
        {#if pulse}
            <span
                class={twMerge(
                    'absolute inset-0 animate-ping rounded-fc opacity-60 motion-reduce:hidden',
                    dots[tone]
                )}
            ></span>
        {/if}
        <span class={twMerge('relative inline-flex size-2 rounded-fc', dots[tone])}></span>
    </span>
    {#if label}<span>{label}</span>{/if}
</span>
