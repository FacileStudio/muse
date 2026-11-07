<script lang="ts">
    import { Checkbox } from '@facile/muse';

    const pieces = $state([
        { id: 1, label: 'Facture 2026-014', checked: true },
        { id: 2, label: 'Devis Hugo', checked: false },
        { id: 3, label: 'Contrat Acme', checked: true }
    ]);

    const all = $derived(pieces.every((p) => p.checked));
    const some = $derived(pieces.some((p) => p.checked));
</script>

<div class="flex flex-col gap-1">
    <Checkbox
        label="Tout sélectionner"
        checked={all}
        indeterminate={some && !all}
        onchange={(event) => pieces.forEach((p) => (p.checked = event.currentTarget.checked))}
    />
    {#each pieces as piece (piece.id)}
        <Checkbox label={piece.label} bind:checked={piece.checked} class="ml-6" />
    {/each}
</div>
