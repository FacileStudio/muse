<script lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLAttributes } from 'svelte/elements';
    import { twMerge } from '../../utils/cn.js';
    import Card from '../atoms/Card.svelte';

    let {
        title,
        description,
        actions,
        bare = false,
        bodyClass = '',
        class: className = '',
        children,
        ...rest
    }: HTMLAttributes<HTMLElement> & {
        title?: string;
        description?: string;
        actions?: Snippet;
        bare?: boolean;
        bodyClass?: string;
        class?: string;
        children?: Snippet;
    } = $props();

    const body = $derived(twMerge('flex flex-col gap-4', bodyClass));
</script>

<section class={twMerge('flex flex-col gap-4', className)} {...rest}>
    {#if title || description || actions}
        <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div class="flex min-w-0 flex-col gap-1">
                {#if title}<h2 class="text-fc-lg font-semibold text-fc-fg">{title}</h2>{/if}
                {#if description}<p class="text-fc-sm text-fc-fg-muted">{description}</p>{/if}
            </div>
            {#if actions}
                <div class="flex shrink-0 flex-wrap items-center gap-2">{@render actions()}</div>
            {/if}
        </div>
    {/if}

    {#if children}
        {#if bare}
            <div class={body}>{@render children()}</div>
        {:else}
            <Card class={body}>{@render children()}</Card>
        {/if}
    {/if}
</section>
