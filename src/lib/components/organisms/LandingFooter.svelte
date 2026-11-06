<script module lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLAttributes } from 'svelte/elements';
    import type { LandingLink } from '../../utils/landing.js';
    import type { LegalFooterProps } from '../molecules/LegalFooter.svelte';

    export interface LandingFooterColumn {
        title: string;
        links: Pick<LandingLink, 'href' | 'label' | 'external'>[];
    }

    export interface LandingFooterProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
        /** Shown next to the icon, and as the home link's name. */
        appName?: string;
        /** Iconify name drawn before `appName`. */
        icon?: string;
        /** Replaces the icon and the name. */
        brand?: Snippet;
        /** Where the brand points. Anything unsafe falls back to `/`. */
        homeHref?: string;
        /** One line under the brand. */
        tagline?: string;
        /** Link groups. They sit in a row on wide screens and stack on a phone. */
        columns?: LandingFooterColumn[];
        /** Passed to the `LegalFooter` inside: `cgu`, `base`, `hideLocaleSwitch`... */
        legal?: LegalFooterProps;
        /** Overrides the default "(c) year appName" line. */
        copyright?: string;
        class?: string;
    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';
    import { getI18n } from '../../i18n/context.svelte.js';
    import { landingHref } from '../../utils/landing.js';
    import Icon from '../atoms/Icon.svelte';
    import LegalFooter from '../molecules/LegalFooter.svelte';

    let {
        appName,
        icon,
        brand,
        homeHref,
        tagline,
        columns = [],
        legal = {},
        copyright,
        class: className = '',
        ...rest
    }: LandingFooterProps = $props();

    const i18n = getI18n();
    const uid = $props.id();
    const home = $derived(landingHref(homeHref) ?? '/');
    const line = $derived(
        copyright ?? (appName ? i18n.t('landing.copyright', { year: String(new Date().getFullYear()), name: appName }) : '')
    );
    const groups = $derived(
        columns
            .map((column) => ({
                title: column.title,
                links: column.links.flatMap((link) => {
                    const href = landingHref(link.href);
                    return href === null ? [] : [{ ...link, href }];
                })
            }))
            .filter((column) => column.links.length > 0)
    );

    const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fc-ring';
    const classes = $derived(twMerge('mx-auto w-full max-w-fc-xl px-4 pt-8 pb-10 sm:px-6 md:px-10', className));
    const linkClasses = `inline-flex min-h-11 items-center gap-1.5 rounded-fc-md px-3 -mx-3 text-fc-sm text-fc-fg-muted transition-colors hover:bg-fc-surface hover:text-fc-fg ${FOCUS}`;
</script>

<!--
@component
Le pied de page d'une page d'atterrissage : la marque, des colonnes de liens qui s'empilent sur mobile, puis une bande avec le copyright et le pied légal.
-->

<div class={classes} {...rest}>
    <div class="fc-chrome flex flex-col rounded-fc-outer bg-fc-component p-(--fc-pad)">
        <div class="flex flex-col gap-8 px-6 py-8 md:flex-row md:justify-between md:px-8">
            <div class="flex min-w-0 flex-col gap-3">
                <a
                    href={home}
                    aria-label={appName ? undefined : i18n.t('landing.home')}
                    class="inline-flex min-h-11 items-center gap-2 self-start rounded-fc-md text-fc-md font-semibold text-fc-fg {FOCUS}"
                >
                    {#if brand}
                        {@render brand()}
                    {:else}
                        {#if icon}<Icon {icon} size={22} />{/if}
                        {#if appName}<span>{appName}</span>{/if}
                    {/if}
                </a>
                {#if tagline}<p class="max-w-xs text-fc-sm text-fc-fg-muted">{tagline}</p>{/if}
            </div>

            {#if groups.length}
                <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 md:flex md:gap-12">
                    {#each groups as group, i (group.title)}
                        <nav aria-labelledby="{uid}-{i}" class="flex min-w-0 flex-col gap-1">
                            <h2 id="{uid}-{i}" class="text-fc-sm font-semibold text-fc-fg">{group.title}</h2>
                            <ul class="flex flex-col">
                                {#each group.links as link (link.href + link.label)}
                                    <li>
                                        <a
                                            href={link.href}
                                            target={link.external ? '_blank' : undefined}
                                            rel={link.external ? 'noopener noreferrer' : undefined}
                                            class={linkClasses}
                                        >
                                            {link.label}
                                            {#if link.external}<span class="sr-only">{i18n.t('landing.newTab')}</span>{/if}
                                        </a>
                                    </li>
                                {/each}
                            </ul>
                        </nav>
                    {/each}
                </div>
            {/if}
        </div>

        <div
            class="flex flex-col gap-1 rounded-fc-inner bg-fc-surface px-6 py-2 text-fc-xs text-fc-fg-muted lg:flex-row lg:items-center lg:justify-between lg:gap-6"
        >
            {#if line}<p>{line}</p>{/if}
            <LegalFooter {...legal} />
        </div>
    </div>
</div>
