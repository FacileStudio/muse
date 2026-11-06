<script module lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';

    export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, 'onchange'> {
        /** The current page, starting at 1. */
        page?: number;
        pageCount: number;
        /** Pages shown on each side of the current one. @default 1 */
        siblings?: number;
        onChange?: (page: number) => void;
        /** Accessible name of the landmark. Defaults to the translated "Pagination". */
        label?: string;
        class?: string;
    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';
    import { getI18n } from '../../i18n/context.svelte.js';
    import { icons } from '../../icons.js';
    import { pageRange } from '../../utils/pagination.js';
    import Icon from '../atoms/Icon.svelte';

    let {
        page = $bindable(1),
        pageCount,
        siblings = 1,
        onChange,
        label,
        class: className = '',
        ...rest
    }: PaginationProps = $props();

    const i18n = getI18n();

    const current = $derived(Math.min(Math.max(1, page), Math.max(1, pageCount)));
    const items = $derived(pageRange(current, pageCount, siblings));

    const cell =
        'inline-flex h-11 min-w-11 items-center justify-center rounded-fc-md px-2 text-fc-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fc-ring disabled:cursor-not-allowed disabled:opacity-50';

    function go(next: number) {
        if (next < 1 || next > pageCount || next === current) return;
        page = next;
        onChange?.(next);
    }
</script>

<!--
@component
La pagination d'une liste : précédent, suivant et une plage de pages avec des trous. La page courante porte `aria-current="page"` et chaque cible fait 44px.
-->

{#if pageCount > 1}
    <nav aria-label={label ?? i18n.t('pagination.label')} class={twMerge('flex flex-wrap items-center gap-1', className)} {...rest}>
        <button
            type="button"
            class={twMerge(cell, 'bg-fc-surface text-fc-fg hover:bg-fc-surface/60')}
            aria-label={i18n.t('pagination.previous')}
            disabled={current <= 1}
            onclick={() => go(current - 1)}
        >
            <Icon icon={icons.chevronLeft} size={18} />
        </button>

        {#each items as item, i (i)}
            {#if item === 'gap'}
                <span aria-hidden="true" class="inline-flex h-11 min-w-8 items-center justify-center text-fc-fg-muted">&hellip;</span>
            {:else}
                <button
                    type="button"
                    class={twMerge(cell, item === current ? 'bg-fc-accent font-medium text-fc-accent-fg' : 'text-fc-fg hover:bg-fc-surface')}
                    aria-label={i18n.t('pagination.page', { page: String(item) })}
                    aria-current={item === current ? 'page' : undefined}
                    onclick={() => go(item)}
                >
                    {item}
                </button>
            {/if}
        {/each}

        <button
            type="button"
            class={twMerge(cell, 'bg-fc-surface text-fc-fg hover:bg-fc-surface/60')}
            aria-label={i18n.t('pagination.next')}
            disabled={current >= pageCount}
            onclick={() => go(current + 1)}
        >
            <Icon icon={icons.arrow} size={18} />
        </button>
    </nav>
{/if}
