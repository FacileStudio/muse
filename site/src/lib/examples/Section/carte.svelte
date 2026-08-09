<script lang="ts">
    import { SettingsRow, Section, Switch } from '@facile/muse';

    let pool = $state(true);
</script>

<Section title="Nook Pool" description="Le bus d'événements partagé de la suite." card>
    <SettingsRow label="Connexion active" description="wss://pool.facile.studio/v1/events">
        <Switch bind:checked={pool} aria-label="Connexion active" />
    </SettingsRow>
</Section>
