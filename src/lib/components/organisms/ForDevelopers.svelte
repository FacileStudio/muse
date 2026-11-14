<script module lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';
    import type { DeveloperKind, DeveloperRow } from '../../utils/landing-blocks.js';

    export type { DeveloperKind, DeveloperRow };

    export interface ForDevelopersProps extends HTMLAttributes<HTMLElement> {
        /** CLI, API, MCP and source rows. `kind` brings the icon and the title; a row may carry a command to copy. */
        rows: DeveloperRow[];
        /** The Suite self-hosting page. Set, a link to it sits beside the heading. */
        selfHostHref?: string;
        /** Overrides the "For developers" heading. */
        title?: string;
        /** One line under the heading. */
        description?: string;
        /** @default 2 */
        headingLevel?: 2 | 3;
        /** Classes merged onto the section heading, to match the host page's own headings. */
        headingClass?: string;
        class?: string;
    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';
    import { getI18n } from '../../i18n/context.svelte.js';
    import type { MuseKey } from '../../i18n/messages/index.js';
    import { isSafeHref } from '../../utils/href.js';
    import { LANDING_HEADING, developerRows } from '../../utils/landing-blocks.js';
    import { icons } from '../../icons.js';
    import Button from '../atoms/Button.svelte';
    import Icon from '../atoms/Icon.svelte';
    import CommandLine from '../molecules/CommandLine.svelte';

    let {
        rows,
        selfHostHref,
        title,
        description,
        headingLevel = 2,
        headingClass = '',
        class: className = '',
        ...rest
    }: ForDevelopersProps = $props();

    const i18n = getI18n();
    const uid = $props.id();
    const heading = $derived(`h${headingLevel}` as 'h2' | 'h3');
    const rowHeading = $derived(headingLevel === 2 ? 'h3' : 'h4');
    const items = $derived(
        developerRows(rows).map((row) => ({ ...row, label: row.fromKey ? i18n.t(row.title as MuseKey) : row.title }))
    );
    const selfHost = $derived(isSafeHref(selfHostHref) ? selfHostHref : null);
    const link = 'rounded-fc-xs underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fc-ring';
</script>

<!--
@component
Le bloc du bas de page pour les développeurs : une ligne par ressource (CLI, API, MCP, code source) avec une phrase, un lien et, si besoin, une commande à copier, plus un lien vers la page d'auto-hébergement de la suite.
-->

<section
    aria-labelledby="{uid}-title"
    class={twMerge('@container flex min-w-0 flex-col gap-8 rounded-fc-lg bg-fc-component p-6 sm:p-8', className)}
    {...rest}
>
    <div class="flex flex-col gap-4 @xl:flex-row @xl:items-end @xl:justify-between">
        <div class="flex min-w-0 flex-col gap-3">
            <svelte:element this={heading} id="{uid}-title" class={twMerge(LANDING_HEADING, headingClass)}>
                {title ?? i18n.t('developers.title')}
            </svelte:element>
            {#if description}<p class="text-fc-md text-fc-fg-muted">{description}</p>{/if}
        </div>
        {#if selfHost}
            <Button href={selfHost} variant="secondary" icon={icons.server} class="h-11 self-start @xl:self-auto">
                {i18n.t('developers.selfHost')}
            </Button>
        {/if}
    </div>
    <ul class="grid min-w-0 gap-x-10 gap-y-8 @4xl:grid-cols-2">
        {#each items as row (row.label)}
            <li class="flex min-w-0 gap-4">
                <span class="flex size-10 shrink-0 items-center justify-center rounded-fc-md bg-fc-surface text-fc-fg">
                    <Icon icon={row.icon} size={20} />
                </span>
                <div class="flex min-w-0 flex-1 flex-col gap-2">
                    <div class="flex flex-col gap-1">
                        <svelte:element this={rowHeading} class="text-fc-md font-semibold text-fc-fg">
                            {#if row.href}<a href={row.href} class={link}>{row.label}</a>{:else}{row.label}{/if}
                        </svelte:element>
                        {#if row.text}<p class="text-fc-sm text-fc-fg-muted">{row.text}</p>{/if}
                    </div>
                    {#if row.command}<CommandLine command={row.command} label={row.label} />{/if}
                </div>
            </li>
        {/each}
    </ul>
</section>
