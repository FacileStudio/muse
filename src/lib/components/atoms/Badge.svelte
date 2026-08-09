<script module lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLAttributes } from 'svelte/elements';

    export type Tone = 'neutral' | 'accent' | 'info' | 'success' | 'warning' | 'danger' | 'owner' | 'admin';

    export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
        tone?: Tone;
        class?: string;
        children: Snippet;

    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';

    let {
        tone = 'neutral',
        class: className = '',
        children,
        ...rest
    }: BadgeProps = $props();

    const tones: Record<Tone, string> = {
        neutral: 'bg-fc-surface text-fc-fg-muted border-transparent',
        accent: 'bg-fc-accent text-fc-accent-fg border-transparent',
        info: 'bg-fc-info/10 text-fc-info border-transparent',
        success: 'bg-fc-success/10 text-fc-success border-transparent',
        warning: 'bg-fc-warning/10 text-fc-warning border-transparent',
        danger: 'bg-fc-danger/10 text-fc-danger border-transparent',
        owner: 'bg-fc-owner/10 text-fc-owner border-transparent',
        admin: 'bg-fc-admin/10 text-fc-admin border-transparent'
    };

    /*
        `w-fit` is load-bearing, not decoration. `inline-flex` stops mattering the moment the
        badge is a child of a flex column or a grid cell — it becomes a flex item and stretches
        to the full cross-axis width, so a pill in a `Card` renders as a full-width bar. A badge
        has no business ever being wider than its own text.
    */
    const classes = $derived(twMerge('inline-flex w-fit items-center gap-1 rounded-fc-pill border px-2.5 py-0.5 text-fc-xs font-medium', tones[tone], className));
</script>

<!--
@component
Une pastille d'état ou de rôle, dimensionnée sur son texte. Huit tons, un seul vocabulaire.
-->

<span class={classes} {...rest}>
    {@render children()}
</span>
