<script module lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLAttributes } from 'svelte/elements';

    export interface PageHeaderProps extends HTMLAttributes<HTMLElement> {
        title: string;
        description?: string;
        /** A count shown beside the title, such as the number of rows below. */
        count?: number | string | null;
        actions?: Snippet;
        back?: { href: string; label?: string };
        class?: string;
    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';
    import { icons } from '../../icons.js';
    import Button from '../atoms/Button.svelte';

    let {
        title,
        description,
        count,
        actions,
        back,
        class: className = '',
        ...rest
    }: PageHeaderProps = $props();
</script>

<!--
@component
L'en-tête d'une page : titre, compteur et description à gauche, actions à droite, alignés sur le bas.
-->

<header
    class={twMerge('flex flex-col gap-1 px-6 pt-12 pb-9 sm:flex-row sm:items-end sm:justify-between', className)}
    {...rest}
>
    <div class="flex min-w-0 flex-col gap-0.5">
        {#if back}
            <!-- `-ml-2.5` cancels the small button's own padding so the label starts on the title's edge -->
            <Button href={back.href} variant="ghost" size="sm" icon={icons.chevronLeft} class="-ml-2.5 w-fit">
                {back.label ?? 'Back'}
            </Button>
        {/if}
        <div class="flex min-w-0 items-center gap-3">
            <h1 class="truncate text-fc-title text-fc-ink">{title}</h1>
            {#if count != null}
                <span class="shrink-0 rounded-fc bg-fc-surface px-1.5 text-fc-subtext text-fc-muted tabular-nums">{count}</span>
            {/if}
        </div>
        {#if description}<p class="text-fc-subtext text-fc-muted">{description}</p>{/if}
    </div>

    {#if actions}
        <div class="flex shrink-0 flex-wrap items-center gap-1">{@render actions()}</div>
    {/if}
</header>
