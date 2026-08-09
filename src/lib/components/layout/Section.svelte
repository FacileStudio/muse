<script lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLAttributes } from 'svelte/elements';
    import { twMerge } from '../../utils/cn.js';
    import { GAP, type Gap } from '../../utils/layout.js';
    import Card from '../atoms/Card.svelte';

    /*
     * A titled block inside a page: the heading lockup, optional actions, and the body.
     *
     * This is `SettingsSection` with the settings taken out of the name — that component was
     * always structurally generic, and nine repos used it only under `/settings` because of what
     * it was called, hand-rolling the identical `<section class="flex flex-col gap-4"><div
     * class="flex flex-col gap-1">` everywhere else. `SettingsSection` now delegates here.
     *
     * The card is opt-in, and that is the one behavioural difference from the settings preset.
     * A settings block is a surface holding rows, so it wants one; a dashboard section holding a
     * grid of cards must not be a card itself, or the page grows a container inside a container.
     */
    let {
        title,
        description,
        actions,
        card = false,
        gap = 'content',
        bodyClass = '',
        class: className = '',
        children,
        ...rest
    }: HTMLAttributes<HTMLElement> & {
        title?: string;
        description?: string;
        actions?: Snippet;
        card?: boolean;
        gap?: Gap;
        bodyClass?: string;
        class?: string;
        children?: Snippet;
    } = $props();

    const body = $derived(twMerge('flex flex-col', GAP[gap], bodyClass));
</script>

<section class={twMerge('flex flex-col', GAP[gap], className)} {...rest}>
    {#if title || description || actions}
        <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
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
        {#if card}
            <Card class={body}>{@render children()}</Card>
        {:else}
            <div class={body}>{@render children()}</div>
        {/if}
    {/if}
</section>
