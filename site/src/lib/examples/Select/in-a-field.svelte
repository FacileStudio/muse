<script lang="ts">
    import { Field, Select } from '@facile/muse';

    let espace = $state('studio');
</script>

<Field label="Espace de destination" helper="Le projet et ses feuilles de temps seront déplacés.">
    <Select bind:value={espace}>
        <option value="studio">Studio</option>
        <option value="clients">Clients</option>
        <option value="interne">Interne</option>
    </Select>
</Field>
