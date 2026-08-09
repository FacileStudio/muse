<script lang="ts">
    import { Badge, Button, icons, SettingsRow, SettingsSection } from '@facile/muse';
</script>

<SettingsSection title="Jetons d'API" description="Un jeton par machine, avec une expiration obligatoire.">
    {#snippet actions()}
        <Button size="sm" icon={icons.plus}>Nouveau jeton</Button>
    {/snippet}

    <SettingsRow label="sablier-ci" description="fc_rw_8f31 · expire le 12 novembre 2026">
        <Badge tone="success">Actif</Badge>
    </SettingsRow>
    <SettingsRow label="portable-camille" description="fc_ro_2b7a · dernier appel il y a 3 jours">
        <Badge tone="success">Actif</Badge>
    </SettingsRow>
</SettingsSection>
