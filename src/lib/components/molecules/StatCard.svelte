<script lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLAttributes } from 'svelte/elements';
    import { twMerge } from '../../utils/cn.js';
    import Card from '../atoms/Card.svelte';

    let {
        label,
        value,
        delta,
        children,
        class: className = '',
        ...rest
    }: HTMLAttributes<HTMLDivElement> & {
        label: string;
        value: string | number;
        delta?: string;
        children?: Snippet;
        class?: string;
    } = $props();

    const classes = $derived(twMerge('flex flex-col gap-1', className));
</script>

<Card class={classes} {...rest}>
    <span class="text-fc-xs text-fc-fg-muted uppercase tracking-wide">{label}</span>
    <span class="text-fc-2xl text-fc-fg font-semibold">{value}</span>
    {#if delta}<span class="text-fc-xs text-fc-fg-muted">{delta}</span>{/if}
    {#if children}{@render children()}{/if}
</Card>
