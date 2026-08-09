<script lang="ts">
    import { Field, Textarea } from '@facile/muse';

    let note = $state('Point client hebdomadaire, préparation du livrable.');
</script>

<Field label="Note d'entrée de temps" helper="Reprise telle quelle dans la facture Ardoise.">
    <Textarea bind:value={note} rows={3} />
</Field>
