<script module lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLAttributes } from 'svelte/elements';

    export interface SettingsRowProps extends HTMLAttributes<HTMLDivElement> {
        label?: string;
        description?: string;
        for?: string;
        stacked?: boolean;
        class?: string;
        children?: Snippet;

    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';

    let {
        label,
        description,
        for: htmlFor,
        stacked = false,
        class: className = '',
        children,
        ...rest
    }: SettingsRowProps = $props();

    /*
     * Rows are separated by a rule they draw on their own top edge, so a section can hold any
     * number of them without the parent knowing how many — first:border-t-0 keeps the group
     * flush with the card padding at both ends.
     */
    const classes = $derived(
        twMerge(
            'flex flex-col gap-1 border-t border-fc-border py-4 first:border-t-0 first:pt-0 last:pb-0',
            !stacked && 'sm:flex-row sm:items-center sm:justify-between sm:gap-1',
            className
        )
    );
</script>

<!--
@component
Une ligne de réglage : libellé, description et contrôle. Le contrôle prend `aria-label`, jamais un libellé visible.
-->

<div class={classes} {...rest}>
    {#if label || description}
        <div class="flex min-w-0 flex-col gap-1">
            {#if label}
                {#if htmlFor}
                    <label for={htmlFor} class="text-fc-p font-medium text-fc-ink">{label}</label>
                {:else}
                    <span class="text-fc-p font-medium text-fc-ink">{label}</span>
                {/if}
            {/if}
            {#if description}
                <p class="text-fc-subtext text-fc-muted">{description}</p>
            {/if}
        </div>
    {/if}

    {#if children}
        <div class={twMerge('flex items-center gap-1', !stacked && 'sm:shrink-0 sm:justify-end')}>
            {@render children()}
        </div>
    {/if}
</div>
