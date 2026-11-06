<script module lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';

    export type BreadcrumbItem = { label: string; href?: string };

    export interface BreadcrumbProps extends HTMLAttributes<HTMLElement> {
        items: BreadcrumbItem[];
        /** Accessible name of the landmark. Defaults to the translated "Breadcrumb". */
        label?: string;
        class?: string;
    }
</script>

<script lang="ts">
    import { getI18n } from '../../i18n/context.svelte.js';
    import { icons } from '../../icons.js';
    import Icon from '../atoms/Icon.svelte';

    let { items, label, class: className = '', ...rest }: BreadcrumbProps = $props();

    const i18n = getI18n();

    const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fc-ring';
    const link = `inline-flex min-h-11 items-center rounded-fc-sm px-1 text-fc-fg-muted transition-colors hover:text-fc-fg ${FOCUS}`;
</script>

<!--
@component
Le fil d'Ariane : un repère de navigation, le dernier élément est la page courante. Il passe à la ligne sur un écran étroit.
-->

<nav aria-label={label ?? i18n.t('breadcrumb.label')} class={className} {...rest}>
    <ol class="flex flex-wrap items-center gap-x-1 text-fc-sm">
        {#each items as item, i (i)}
            {@const last = i === items.length - 1}
            <li class="inline-flex items-center gap-1">
                {#if last || !item.href}
                    <span aria-current={last ? 'page' : undefined} class="px-1 font-medium text-fc-fg">{item.label}</span>
                {:else}
                    <a href={item.href} class={link}>{item.label}</a>
                {/if}
                {#if !last}<Icon icon={icons.arrow} size={14} class="text-fc-fg-muted" />{/if}
            </li>
        {/each}
    </ol>
</nav>
