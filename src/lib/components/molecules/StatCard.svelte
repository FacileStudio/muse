<script module lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLAttributes } from 'svelte/elements';

    export interface StatCardProps extends HTMLAttributes<HTMLDivElement> {
        label: string;
        value: string | number;
        delta?: string;
        children?: Snippet;
        class?: string;

    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';
    import Card from '../atoms/Card.svelte';

    let {
        label,
        value,
        delta,
        children,
        class: className = '',
        ...rest
    }: StatCardProps = $props();

    const classes = $derived(twMerge('flex flex-col gap-1', className));
</script>

<!--
@component
Un chiffre et son libellé. La gouttière entre les cartes ne descend jamais sous leur propre padding.
-->

<Card class={classes} {...rest}>
    <span class="text-fc-xs text-fc-fg-muted uppercase tracking-wide">{label}</span>
    <span class="text-fc-2xl text-fc-fg font-semibold">{value}</span>
    {#if delta}<span class="text-fc-xs text-fc-fg-muted">{delta}</span>{/if}
    {#if children}{@render children()}{/if}
</Card>
