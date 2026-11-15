<script lang="ts">
    import { Field, TagInput } from '@facile/muse';

    let tags = $state(['facture', 'client']);
</script>

<Field label="Étiquettes" helper="Entrée ou virgule pour valider, retour arrière pour retirer.">
    <TagInput bind:value={tags} suggestions={['facture', 'client', 'devis', 'urgent', 'relance']} />
</Field>
