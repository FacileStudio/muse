<script module lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';
    import type { BillingInterval } from '../../utils/catalog.js';

    export interface PricingPlansProps extends HTMLAttributes<HTMLElement> {
        /** Public catalog endpoint, fetched once on the client when `catalog` is not given. */
        catalogUrl?: string;
        /**
         * A catalog body (`{ plans: [...] }`) loaded server side. Skips the fetch and renders in SSR.
         * The browser fetch needs Ardoise v0.14.1+ (CORS `*`) and, under tronc's CSP,
         * `connect-src https://api-ardoise.facile.studio`.
         */
        catalog?: unknown;
        /** Feature keys this app cares about, shown first on every card. */
        highlight?: string[];
        /** Show only the `highlight` rows and `notes`, for an app page that prices its own part of the suite. */
        highlightOnly?: boolean;
        /**
         * One line per plan key on what this app gives on that plan, shown first on its card.
         * The `'*'` key applies to every plan without its own line, e.g. "Included in every plan".
         */
        notes?: Record<string, string>;
        /** The plan key to mark as recommended. Its button stays primary and the other paid plans go secondary. */
        recommended?: string;
        /** The Suite pricing page. Set, a line under the cards says one subscription covers every app and links to it. */
        suiteHref?: string;
        /** Overrides the "one subscription covers every app" line. */
        suiteNote?: string;
        /** Where each card's button goes; `plan` and `interval` are added for a paid plan. */
        ctaHref?: string;
        interval?: BillingInterval;
        /** Add a bare free card when the catalog lists no free plan. Off: muse never invents one. */
        synthesizeFree?: boolean;
        title?: string;
        /** The section heading level; cards take the next one. */
        headingLevel?: 2 | 3;
        /** Classes merged onto the section heading, to match the host page's own headings. */
        headingClass?: string;
        timeoutMs?: number;
        class?: string;
    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';
    import { getI18n } from '../../i18n/context.svelte.js';
    import { CATALOG_URL, fetchCatalog, parseCatalog, type CatalogPlan } from '../../utils/catalog.js';
    import { isSafeHref, safeHref } from '../../utils/href.js';
    import { withFreePlan, yearlySaving } from '../../utils/pricing.js';
    import { formatPercent } from '../../utils/money.js';
    import PricingCard from './PricingCard.svelte';

    let {
        catalogUrl = CATALOG_URL,
        catalog,
        highlight = [],
        highlightOnly = false,
        notes = {},
        recommended,
        suiteHref,
        suiteNote,
        ctaHref,
        interval = $bindable('month'),
        synthesizeFree = false,
        title,
        headingLevel = 2,
        headingClass = '',
        timeoutMs,
        class: className = '',
        ...rest
    }: PricingPlansProps = $props();

    const i18n = getI18n();
    const uid = $props.id();
    let fetched = $state<CatalogPlan[]>([]);

    const source = $derived(Array.isArray(catalog) ? { plans: catalog } : catalog);
    const plans = $derived(withFreePlan(catalog === undefined ? fetched : parseCatalog(source), synthesizeFree));
    const href = $derived(safeHref(ctaHref, 'https://sso.facile.studio/spaces'));
    const suite = $derived(isSafeHref(suiteHref) ? suiteHref : null);
    const yearly = $derived(plans.some((p) => p.prices.some((q) => q.interval === 'year')));
    const monthly = $derived(plans.some((p) => p.prices.some((q) => q.interval === 'month')));
    const best = $derived(Math.max(0, ...plans.map(yearlySaving)));
    const heading = $derived(`h${headingLevel}` as 'h2' | 'h3');
    const cardHeading = $derived(headingLevel === 2 ? 'h3' : 'h4');
    const options = $derived([
        { value: 'month' as const, label: i18n.t('pricing.monthly') },
        { value: 'year' as const, label: i18n.t('pricing.yearly') }
    ]);

    $effect(() => {
        fetched = [];
        if (catalog !== undefined) return;
        const controller = new AbortController();
        fetchCatalog(catalogUrl, { signal: controller.signal, timeoutMs }).then((result) => {
            if (!controller.signal.aborted) fetched = result;
        });
        return () => controller.abort();
    });
</script>

<!--
@component
Les offres Facile lues depuis le catalogue public d'Ardoise : une carte par offre, les offres gratuites en premier, bascule mensuel / annuel. Sur la page d'une app, `notes`, `highlightOnly`, `recommended` et `suiteHref` disent ce que l'app donne dans chaque offre, mettent l'offre payante en avant et rappellent qu'un abonnement couvre toutes les apps. Ne rend rien si le catalogue est vide ou injoignable.
-->

{#if plans.length}
    <section aria-labelledby="{uid}-title" class={twMerge('flex flex-col gap-6', className)} {...rest}>
        <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <svelte:element this={heading} id="{uid}-title" class={twMerge('text-fc-xl font-semibold text-fc-fg', headingClass)}>
                {title ?? i18n.t('pricing.title')}
            </svelte:element>
            {#if yearly && monthly}
                <fieldset class="flex flex-col gap-1 sm:items-end">
                    <legend class="sr-only">{i18n.t('pricing.interval')}</legend>
                    <div class="inline-flex self-start rounded-fc-pill bg-fc-surface p-1 sm:self-end">
                        {#each options as option (option.value)}
                            <label
                                class={twMerge(
                                    'relative inline-flex h-11 cursor-pointer items-center rounded-fc-pill px-4 text-fc-sm font-medium transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-fc-ring',
                                    interval === option.value ? 'bg-fc-accent text-fc-accent-fg' : 'text-fc-fg-muted hover:text-fc-fg'
                                )}
                            >
                                <input type="radio" name="{uid}-interval" value={option.value} bind:group={interval} class="sr-only" />
                                {option.label}
                            </label>
                        {/each}
                    </div>
                    {#if best}
                        <p class="text-fc-xs text-fc-success">
                            {i18n.t('pricing.saveUpTo', { percent: formatPercent(best, i18n.locale) })}
                        </p>
                    {/if}
                </fieldset>
            {/if}
        </div>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(15rem,1fr))]">
            {#each plans as plan (plan.key)}
                <PricingCard
                    {plan}
                    {interval}
                    {highlight}
                    {highlightOnly}
                    note={notes[plan.key] ?? notes['*']}
                    {recommended}
                    {href}
                    heading={cardHeading}
                />
            {/each}
        </div>
        {#if suite}
            <p class="flex flex-wrap items-center gap-x-3 gap-y-1 text-fc-sm text-fc-fg-muted">
                <span>{suiteNote ?? i18n.t('pricing.oneSubscription')}</span>
                <a
                    href={suite}
                    class="rounded-fc-xs font-medium text-fc-fg underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fc-ring"
                >
                    {i18n.t('pricing.allPlans')}
                </a>
            </p>
        {/if}
    </section>
{/if}
