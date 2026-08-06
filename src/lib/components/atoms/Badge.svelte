<script lang="ts">
    import type { Snippet } from 'svelte';
    import { twMerge } from '../../utils/cn.js';

    type Tone = 'neutral' | 'accent' | 'success' | 'danger' | 'owner' | 'admin';

    let {
        tone = 'neutral',
        class: className = '',
        children
    }: { tone?: Tone; class?: string; children: Snippet } = $props();

    const tones: Record<Tone, string> = {
        neutral: 'bg-fc-surface text-fc-fg-muted border-transparent',
        accent: 'bg-fc-accent text-fc-accent-fg border-transparent',
        success: 'bg-fc-success/10 text-fc-success border-transparent',
        danger: 'bg-fc-danger/10 text-fc-danger border-transparent',
        owner: 'bg-fc-owner/10 text-fc-owner border-transparent',
        admin: 'bg-fc-admin/10 text-fc-admin border-transparent'
    };

    const classes = $derived(twMerge('inline-flex items-center gap-1 rounded-fc-pill border px-2.5 py-0.5 text-fc-xs font-medium', tones[tone], className));
</script>

<span class={classes}>
    {@render children()}
</span>
