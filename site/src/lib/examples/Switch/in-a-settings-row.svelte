<script lang="ts">
    import { SettingsRow, Switch } from '@facile/muse';

    let compact = $state(false);
</script>

<SettingsRow label="Mode compact" description="Des lignes plus denses — plus de contenu à l'écran.">
    <Switch bind:checked={compact} aria-label="Mode compact" />
</SettingsRow>
