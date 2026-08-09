<script lang="ts">
    import { Select } from '@facile/muse';

    let statut = $state('en-cours');
</script>

<Select bind:value={statut}>
    <option value="brouillon">Brouillon</option>
    <option value="en-cours">En cours</option>
    <option value="en-revue">En revue</option>
    <option value="archive">Archivé</option>
</Select>
