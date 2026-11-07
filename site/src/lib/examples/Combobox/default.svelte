<script lang="ts">
    import { Combobox, Field } from '@facile/muse';

    let ville = $state('');
    const villes = ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nantes', 'Évry'].map((label) => ({
        value: label.toLowerCase(),
        label
    }));
</script>

<Field label="Ville" helper="Essayez « ev » : la recherche ignore casse et accents.">
    <Combobox bind:value={ville} options={villes} placeholder="Tapez une ville" />
</Field>
