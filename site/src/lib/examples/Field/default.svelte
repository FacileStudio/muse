<script lang="ts">
    import { Field, Input } from '@facile/muse';

    let nom = $state('Refonte du site Heranova');
</script>

<Field label="Nom du projet" helper="Visible par tous les membres de l'espace.">
    <Input bind:value={nom} placeholder="Nom du projet" />
</Field>
