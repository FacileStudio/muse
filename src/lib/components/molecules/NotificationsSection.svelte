<script module lang="ts">
    import type { SettingsSectionProps } from './SettingsSection.svelte';

    export interface NotificationsSectionProps extends SettingsSectionProps {}
</script>

<script lang="ts">
    import { getI18n } from '../../i18n/context.svelte.js';
    import SettingsSection from './SettingsSection.svelte';

    let { title, description, children, ...rest }: NotificationsSectionProps = $props();

    const i18n = getI18n();
</script>

<!--
@component
La section Notifications : le titre et la description canoniques autour des lignes de l'app, un interrupteur général puis un interrupteur par évènement.
-->

<SettingsSection
    title={title ?? i18n.t('settings.notifications.title')}
    description={description ?? i18n.t('settings.notifications.description')}
    {children}
    {...rest}
/>
