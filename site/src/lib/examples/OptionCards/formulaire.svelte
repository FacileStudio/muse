<script lang="ts">
    import { OptionCards, Stack } from '@facile/muse';

    let cadence = $state('quotidien');
</script>

<Stack gap="content">
    <OptionCards
        name="cadence"
        label="Fréquence du récapitulatif"
        bind:value={cadence}
        onSelect={(valeur) => (cadence = valeur)}
        options={[
            { value: 'quotidien', label: 'Chaque jour' },
            { value: 'hebdomadaire', label: 'Chaque lundi' },
            { value: 'jamais', label: 'Jamais' }
        ]}
    />
    <p class="text-fc-sm text-fc-fg-muted">Envoyé à camille@heranova.fr : {cadence}</p>
</Stack>
