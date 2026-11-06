<script module lang="ts">
    import type { BillingInterval, CatalogPlan } from '../../utils/catalog.js';

    export interface PricingCardProps {
        plan: CatalogPlan;
        interval: BillingInterval;
        highlight?: readonly string[];
        href: string;
        heading?: 'h3' | 'h4';
    }
</script>

<script lang="ts">
    import { getI18n } from '../../i18n/context.svelte.js';
    import { withParam } from '../../utils/href.js';
    import { featureRows, isFreePlan, priceFor, yearlySaving } from '../../utils/pricing.js';
    import { formatPercent, formatPrice } from '../../utils/money.js';
    import Badge from '../atoms/Badge.svelte';
    import Button from '../atoms/Button.svelte';
    import Icon from '../atoms/Icon.svelte';
    import { icons } from '../../icons.js';

    let { plan, interval, highlight = [], href, heading = 'h3' }: PricingCardProps = $props();

    const i18n = getI18n();
    const free = $derived(isFreePlan(plan));
    const name = $derived(plan.name || i18n.t('pricing.free'));
    const price = $derived(free ? undefined : priceFor(plan, interval));
    const saving = $derived(price?.interval === 'year' ? yearlySaving(plan) : 0);
    const rows = $derived(featureRows(plan, highlight));
    const cta = $derived(
        free || !price ? href : withParam(withParam(href, 'plan', plan.key), 'interval', price.interval)
    );
    const headingId = $props.id();
</script>

<!--
@component
Une offre du catalogue : nom, prix dans la période choisie, fonctionnalités connues et bouton d'action. Interne à `PricingPlans`.
-->

<article aria-labelledby={headingId} class="flex flex-col gap-4 rounded-fc-lg bg-fc-component p-5">
    <div class="flex flex-col gap-1">
        <svelte:element this={heading} id={headingId} class="text-fc-md font-semibold text-fc-fg">{name}</svelte:element>
        {#if price}
            <p class="flex flex-wrap items-baseline gap-x-1">
                <span class="text-fc-2xl font-semibold text-fc-fg">
                    {formatPrice(price.amount, price.currency, i18n.locale)}
                </span>
                <span class="text-fc-sm text-fc-fg-muted">
                    {i18n.t(price.interval === 'year' ? 'pricing.perYear' : 'pricing.perMonth')}
                </span>
            </p>
            {#if price.interval === 'year'}
                <p class="text-fc-xs text-fc-fg-muted">
                    {i18n.t('pricing.billedYearly', {
                        amount: formatPrice(Math.round(price.amount / 12), price.currency, i18n.locale)
                    })}
                </p>
            {/if}
        {:else}
            <p class="text-fc-2xl font-semibold text-fc-fg">{i18n.t('pricing.free')}</p>
        {/if}
        {#if saving}
            <Badge tone="success" class="self-start">
                {i18n.t('pricing.save', { percent: formatPercent(saving, i18n.locale) })}
            </Badge>
        {/if}
    </div>

    {#if rows.length}
        <ul aria-label={i18n.t('pricing.includes', { name })} class="flex flex-col gap-2 text-fc-sm text-fc-fg">
            {#each rows as row (row.key)}
                <li class="flex items-start gap-2">
                    <Icon icon={icons.check} size={18} class="mt-px shrink-0 text-fc-success" />
                    <span>{i18n.t(row.message, row.count === undefined ? undefined : { count: row.count })}</span>
                </li>
            {/each}
        </ul>
    {/if}

    <Button href={cta} rel="external" size="lg" variant={free ? 'outline' : 'primary'} class="mt-auto w-full">
        {free ? i18n.t('pricing.startFree') : i18n.t('pricing.choose', { name })}
    </Button>
</article>
