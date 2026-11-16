<script module lang="ts">
    import type { Snippet } from 'svelte';
    import type { Locale } from '../../i18n/locale.js';
    import type { Theme } from '../../utils/theme.js';
    import type { UserMenuSubscription } from '../../utils/user-menu.js';
    import type { SettingsSectionProps } from './SettingsSection.svelte';

    export interface PreferencesSectionProps extends Omit<SettingsSectionProps, 'children'> {
        showLanguage?: boolean;
        onLocaleChange?: (locale: Locale) => void;
        /** The languages offered, in this order. Defaults to all four. */
        locales?: Locale[];
        showTheme?: boolean;
        theme?: Theme;
        /** Persist the choice. Without it muse only toggles the `.dark` and `.light` classes. */
        onThemeChange?: (theme: Theme) => void;
        /** Adds the plan row: the plan name and a link to manage it. Leave it out when the app has a Subscription section. */
        subscription?: UserMenuSubscription | null;
        /** App-specific rows after language and theme: density, timezone, start of week. */
        children?: Snippet;
    }
</script>

<script lang="ts">
    import { getI18n } from '../../i18n/context.svelte.js';
    import { icons } from '../../icons.js';
    import { isSafeHref } from '../../utils/href.js';
    import { applyTheme, readTheme } from '../../utils/theme.js';
    import Badge from '../atoms/Badge.svelte';
    import Button from '../atoms/Button.svelte';
    import OptionCards from './OptionCards.svelte';
    import LocaleSwitch from './LocaleSwitch.svelte';
    import SettingsRow from './SettingsRow.svelte';
    import SettingsSection from './SettingsSection.svelte';

    let {
        showLanguage = true,
        onLocaleChange,
        locales,
        showTheme = true,
        theme,
        onThemeChange,
        subscription = null,
        children,
        title,
        description,
        ...rest
    }: PreferencesSectionProps = $props();

    const i18n = getI18n();
    let chosen = $state('system');

    $effect(() => {
        chosen = theme ?? readTheme();
    });

    const options = $derived([
        { value: 'system', label: i18n.t('theme.system'), icon: icons.monitor },
        { value: 'light', label: i18n.t('theme.light'), icon: icons.sun },
        { value: 'dark', label: i18n.t('theme.dark'), icon: icons.moon }
    ]);

    function pick(value: string) {
        const next = value as Theme;
        if (onThemeChange) onThemeChange(next);
        else applyTheme(next);
    }
</script>

<!--
@component
La section Préférences : la langue de la suite, le thème de couleur et, si l'app la passe, la ligne de l'offre, puis les lignes propres à l'app.
-->

<SettingsSection
    title={title ?? i18n.t('settings.preferences.title')}
    description={description ?? i18n.t('settings.preferences.description')}
    {...rest}
>
    {#if showLanguage}
        <SettingsRow label={i18n.t('settings.preferences.language')} description={i18n.t('settings.preferences.languageHint')}>
            <LocaleSwitch {locales} onChange={onLocaleChange} />
        </SettingsRow>
    {/if}
    {#if showTheme}
        <SettingsRow label={i18n.t('settings.preferences.theme')} description={i18n.t('settings.preferences.themeHint')} stacked>
            <OptionCards {options} bind:value={chosen} name="muse-theme" label={i18n.t('settings.preferences.theme')} onSelect={pick} />
        </SettingsRow>
    {/if}
    {#if subscription}
        <SettingsRow label={i18n.t('settings.subscription.title')} description={i18n.t('settings.subscription.description')}>
            {#if subscription.plan}<Badge tone="accent">{subscription.plan}</Badge>{/if}
            {#if isSafeHref(subscription.href)}
                <Button href={subscription.href} variant="secondary" size="sm">
                    {subscription.label ?? i18n.t('userMenu.manageSubscription')}
                </Button>
            {/if}
        </SettingsRow>
    {/if}
    {@render children?.()}
</SettingsSection>
