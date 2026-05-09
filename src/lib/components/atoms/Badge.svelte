<script lang="ts">
    import type { Snippet } from 'svelte';
    import { twMerge } from 'tailwind-merge';

    type Tone = 'neutral' | 'accent' | 'success' | 'danger';

    let {
        tone = 'neutral',
        class: className = '',
        children
    }: { tone?: Tone; class?: string; children: Snippet } = $props();

    const tones: Record<Tone, string> = {
        neutral: 'bg-fc-surface text-fc-fg-muted border-transparent',
        accent: 'bg-fc-accent text-fc-accent-fg border-transparent',
        success: 'bg-fc-success text-white border-transparent',
        danger: 'bg-fc-danger text-white border-transparent'
    };

    const classes = $derived(twMerge('inline-flex items-center gap-1 rounded-fc-pill border px-2 py-0.5 text-fc-xs font-medium', tones[tone], className));
</script>

<span class={classes}>
    {@render children()}
</span>
