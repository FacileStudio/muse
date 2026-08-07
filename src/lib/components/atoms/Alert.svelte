<script lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLAttributes } from 'svelte/elements';
    import { twMerge } from '../../utils/cn.js';

    type Tone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

    let {
        tone = 'info',
        title,
        class: className = '',
        children,
        ...rest
    }: HTMLAttributes<HTMLDivElement> & {
        tone?: Tone;
        title?: string;
        class?: string;
        children?: Snippet;
    } = $props();

    const tones: Record<Tone, string> = {
        neutral: 'border-fc-border bg-fc-surface text-fc-fg',
        info: 'border-fc-info/40 bg-fc-info/10 text-fc-fg',
        success: 'border-fc-success/40 bg-fc-success/10 text-fc-fg',
        warning: 'border-fc-warning/40 bg-fc-warning/10 text-fc-fg',
        danger: 'border-fc-danger/40 bg-fc-danger/10 text-fc-fg'
    };

    /* `alert` is an assertive live region: it interrupts whatever the screen reader
       is saying. Only earn that for tones the user must act on. */
    const role = $derived(tone === 'warning' || tone === 'danger' ? 'alert' : 'status');

    const classes = $derived(twMerge('rounded-fc-md border p-3 text-fc-sm', tones[tone], className));
</script>

<div class={classes} {role} {...rest}>
    {#if title}<p class="font-medium mb-1">{title}</p>{/if}
    {#if children}{@render children()}{/if}
</div>
