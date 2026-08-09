<script lang="ts">
    import { Card, SettingsRow, Stack, Switch } from '@facile/muse';

    let mentions = $state(true);
    let assignations = $state(true);
    let digest = $state(false);
</script>

<Card>
    <Stack gap="none">
        <SettingsRow label="Mentions" description="Quand quelqu'un vous cite dans un commentaire.">
            <Switch bind:checked={mentions} aria-label="Mentions" />
        </SettingsRow>
        <SettingsRow label="Assignations" description="Quand une tâche vous est attribuée.">
            <Switch bind:checked={assignations} aria-label="Assignations" />
        </SettingsRow>
        <SettingsRow label="Récapitulatif hebdomadaire" description="Chaque lundi à 9 h.">
            <Switch bind:checked={digest} aria-label="Récapitulatif hebdomadaire" />
        </SettingsRow>
    </Stack>
</Card>
