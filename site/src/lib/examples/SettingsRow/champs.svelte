<script lang="ts">
    import { Field, Input, SettingsRow, Textarea } from '@facile/muse';

    let nom = $state('Heranova');
    let description = $state('');
</script>

<SettingsRow stacked label="Espace" description="Le nom et la description restent sur toute la largeur de la ligne.">
    <Field label="Nom">
        <Input bind:value={nom} />
    </Field>
    <Field label="Description">
        <Textarea bind:value={description} />
    </Field>
</SettingsRow>
