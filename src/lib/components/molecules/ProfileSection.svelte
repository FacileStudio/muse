<script module lang="ts">
    import type { Snippet } from 'svelte';
    import type { SettingsSectionProps } from './SettingsSection.svelte';

    export interface ProfileSectionProps extends Omit<SettingsSectionProps, 'actions' | 'bare' | 'children'> {
        /** Read from Facile (Registre). The app never edits identity. */
        name: string;
        email?: string;
        avatar?: string;
        color?: string;
        role?: string;
        /** Where "Manage on Facile" goes. Defaults to the Facile account page. */
        manageHref?: string;
        manageLabel?: string;
        /** App-specific buttons next to "Manage on Facile". */
        actions?: Snippet;
        /** App-specific rows under the identity, for example an identity colour. */
        children?: Snippet;
    }
</script>

<script lang="ts">
    import { getI18n } from '../../i18n/context.svelte.js';
    import { icons } from '../../icons.js';
    import { safeHref } from '../../utils/href.js';
    import { ACCOUNT_URL } from '../../utils/user-menu.js';
    import Button from '../atoms/Button.svelte';
    import ProfileCard from '../organisms/ProfileCard.svelte';
    import SettingsSection from './SettingsSection.svelte';

    let {
        name,
        email,
        avatar,
        color,
        role,
        manageHref = ACCOUNT_URL,
        manageLabel,
        actions: extra,
        children,
        title,
        description,
        ...rest
    }: ProfileSectionProps = $props();

    const i18n = getI18n();
</script>

<!--
@component
La section Profil : nom, photo et e-mail lus depuis Facile, sans édition locale, avec le lien « Gérer sur Facile ». L'identité vit dans Registre.
-->

<SettingsSection
    bare
    title={title ?? i18n.t('settings.profile.title')}
    description={description ?? i18n.t('settings.profile.description')}
    {...rest}
>
    <ProfileCard {name} {email} {avatar} {color} {role}>
        {#snippet actions()}
            <Button
                href={safeHref(manageHref, ACCOUNT_URL)}
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
                iconRight={icons.external}
            >
                {manageLabel ?? i18n.t('settings.profile.manage')}
            </Button>
            {@render extra?.()}
        {/snippet}
        {@render children?.()}
    </ProfileCard>
</SettingsSection>
