<script module lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLAttributes } from 'svelte/elements';

    export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
        icon?: string;
        title: string;
        description?: string;
        bare?: boolean;
        class?: string;
        children?: Snippet;

    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';
    import Card from '../atoms/Card.svelte';

    let {
        icon,
        title,
        description,
        bare = false,
        class: className = '',
        children,
        ...rest
    }: EmptyStateProps = $props();

    /* `py-12` rather than the card's own `p-5`: an empty state is mostly air by design, and
       the height is what stops a list that has nothing in it from reading as a broken layout
       — a two-line card looks like a rendering failure, a tall quiet one looks deliberate. */
    const classes = $derived(twMerge('flex flex-col items-center gap-4 py-12 text-center', className));
</script>

{#snippet body()}
    {#if icon}
        <iconify-icon {icon} width="24" height="24" class="block text-fc-fg-muted"></iconify-icon>
    {/if}
    <!-- Title and description are one block on `gap-1`, not two siblings of the outer
         `gap-4` — otherwise the description floats between the two and belongs to neither.
         Same rule as a section heading in CHARTE §4. -->
    <div class="flex flex-col gap-1">
        <p class="text-fc-sm font-medium text-fc-fg">{title}</p>
        {#if description}
            <p class="mx-auto max-w-sm text-fc-sm text-fc-fg-muted">{description}</p>
        {/if}
    </div>
    {#if children}{@render children()}{/if}
{/snippet}

{#if bare}
    <div class={classes} {...rest}>
        {@render body()}
    </div>
{:else}
    <Card class={classes} {...rest}>
        {@render body()}
    </Card>
{/if}
