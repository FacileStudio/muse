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
        neutral: 'bg-fc-surface text-fc-fg-muted',
        accent: 'bg-fc-accent text-fc-accent-fg',
        info: 'bg-fc-info/10 text-fc-info',
        success: 'bg-fc-success/10 text-fc-success',
        warning: 'bg-fc-warning/10 text-fc-warning',
        danger: 'bg-fc-danger/10 text-fc-danger',
        owner: 'bg-fc-owner/10 text-fc-owner',
        admin: 'bg-fc-admin/10 text-fc-admin'
    };

    const classes = $derived(twMerge('inline-flex w-fit max-w-full min-w-0 items-center gap-1 rounded-fc-pill px-2.5 py-0.5 text-fc-xs font-medium whitespace-nowrap', tones[tone], className));
</script>

<!--
@component
Une pastille d'état ou de rôle, dimensionnée sur son texte. Huit tons, un seul vocabulaire.
-->

<span class={classes} {...rest}>
    <span class="min-w-0 truncate">{@render children()}</span>
</span>
