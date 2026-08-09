<script lang="ts">
    import { Field, Input } from '@facile/muse';

    let nom = $state('Refonte du portail');
</script>

<Field label="Nom du projet" helper="Visible par tous les membres de l'espace.">
    <Input bind:value={nom} placeholder="Refonte du portail" />
</Field>
