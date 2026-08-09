<script lang="ts">
    import { SettingsRow, SettingsSection, Switch } from '@facile/muse';

    let compact = $state(false);
    let semaine = $state(true);
    let animations = $state(true);
</script>

<SettingsSection title="Affichage" description="Appliqué à ce navigateur uniquement.">
    <SettingsRow label="Mode compact" description="Lignes plus serrées, plus de projets à l'écran.">
        <Switch bind:checked={compact} aria-label="Mode compact" />
    </SettingsRow>
    <SettingsRow label="Semaine commençant le lundi" description="Sinon la semaine démarre le dimanche.">
        <Switch bind:checked={semaine} aria-label="Semaine commençant le lundi" />
    </SettingsRow>
    <SettingsRow label="Animations" description="Désactivez-les si l'interface vous semble agitée.">
        <Switch bind:checked={animations} aria-label="Animations" />
    </SettingsRow>
</SettingsSection>
