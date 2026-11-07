<script module lang="ts">
    import type { Snippet } from 'svelte';
    import type { PlanLimitError } from '../../utils/plan-limit.js';
    import type { SettingsSectionProps } from './SettingsSection.svelte';

    export type PlanUsage = { label: string; used: number; limit: number };

    export interface SubscriptionSectionProps extends Omit<SettingsSectionProps, 'actions' | 'bare' | 'children'> {
        /** The plan name from the entitlements, shown as a badge. */
        plan: string;
        /** "Gérer l'abonnement": the billing portal. */
        manageHref?: string;
        manageLabel?: string;
        /** A higher plan. Shown as a primary link. */
        upgradeHref?: string;
        upgradeLabel?: string;
        usage?: PlanUsage[];
        /** A 402 body the app just hit. Renders the `PlanLimit` banner above the rows. */
        limit?: PlanLimitError | null;
        children?: Snippet;
    }
</script>

<script lang="ts">
    import { getI18n } from '../../i18n/context.svelte.js';
    import { isSafeHref } from '../../utils/href.js';
    import Badge from '../atoms/Badge.svelte';
    import Button from '../atoms/Button.svelte';
    import Progress from '../atoms/Progress.svelte';
    import PlanLimit from './PlanLimit.svelte';
    import SettingsRow from './SettingsRow.svelte';
    import SettingsSection from './SettingsSection.svelte';

    let {
        plan,
        manageHref,
        manageLabel,
        upgradeHref,
        upgradeLabel,
        usage = [],
        limit = null,
        children,
        title,
        description,
        ...rest
    }: SubscriptionSectionProps = $props();

    const i18n = getI18n();
    const tone = (row: PlanUsage) => (row.used >= row.limit ? 'danger' : row.used >= row.limit * 0.8 ? 'warning' : 'accent');
</script>

<!--
@component
La section Abonnement : l'offre issue des droits, le lien pour la gérer, un lien vers l'offre supérieure, la consommation et la bannière de limite atteinte.
-->

<SettingsSection
    title={title ?? i18n.t('settings.subscription.title')}
    description={description ?? i18n.t('settings.subscription.description')}
    {...rest}
>
    {#if limit}
        <PlanLimit error={limit} class="mb-4" />
    {/if}
    <SettingsRow label={i18n.t('settings.subscription.plan')}>
        <Badge tone="accent">{plan}</Badge>
        {#if isSafeHref(manageHref)}
            <Button href={manageHref} variant="secondary" size="sm">
                {manageLabel ?? i18n.t('userMenu.manageSubscription')}
            </Button>
        {/if}
        {#if isSafeHref(upgradeHref)}
            <Button href={upgradeHref} size="sm">{upgradeLabel ?? i18n.t('settings.subscription.upgrade')}</Button>
        {/if}
    </SettingsRow>
    {#each usage as row (row.label)}
        <SettingsRow label={row.label} description="{row.used} / {row.limit}">
            <Progress value={row.used} max={row.limit} tone={tone(row)} label={row.label} class="w-40" />
        </SettingsRow>
    {/each}
    {@render children?.()}
</SettingsSection>
