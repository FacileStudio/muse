<script module lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLAttributes } from 'svelte/elements';

    export interface PageHeaderProps extends HTMLAttributes<HTMLElement> {
        title: string;
        description?: string;
        actions?: Snippet;
        back?: { href: string; label?: string };
        class?: string;

    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';
    import { icons } from '../../icons.js';
    import Button from '../atoms/Button.svelte';

    /*
     * Three consumer repos hand-wrote this component, each citing CHARTE §4 in a comment, and
     * all three disagreed: `text-fc-2xl` against `text-fc-lg`, `gap-4` against `gap-3`, one with
     * a border-bottom the others do not have. The title block is `gap-1` — a heading and its
     * description are two parts of one thing, not two siblings of the header's own gap.
     */

    let {
        title,
        description,
        actions,
        back,
        class: className = '',
        ...rest
    }: PageHeaderProps = $props();
</script>

<!--
@component
Le bloc de titre d'une page : h1, description, actions et lien retour, avec le titre et sa description liés par le barreau `bound`.
-->

<header class={twMerge('flex flex-col gap-4', className)} {...rest}>
    {#if back}
        <!--
          `-ml-3` cancels the ghost button's own horizontal padding so the label starts on the
          page's left edge rather than three pixels inside it. Four apps each discovered this
          and each picked a different number (-ml-3, -ml-3.5, -ml-4, and one with `self-start`
          instead); it belongs here once. `w-fit` stops the button stretching in the column.
        -->
        <Button href={back.href} variant="ghost" size="sm" icon={icons.chevronLeft} class="-ml-3 w-fit">
            {back.label ?? 'Back'}
        </Button>
    {/if}

    <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div class="flex min-w-0 flex-col gap-1">
            <h1 class="text-fc-2xl font-semibold text-fc-fg">{title}</h1>
            {#if description}<p class="text-fc-sm text-fc-fg-muted">{description}</p>{/if}
        </div>
        {#if actions}
            <div class="flex shrink-0 flex-wrap items-center gap-2">{@render actions()}</div>
        {/if}
    </div>
</header>
