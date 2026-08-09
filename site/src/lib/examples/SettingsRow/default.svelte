<script lang="ts">
    import { SettingsRow, Switch } from '@facile/muse';

    let rappels = $state(true);
</script>

<SettingsRow
    label="Rappel de fin de journée"
    description="Un e-mail à 18 h si un minuteur tourne encore."
>
    <Switch bind:checked={rappels} aria-label="Rappel de fin de journée" />
</SettingsRow>
