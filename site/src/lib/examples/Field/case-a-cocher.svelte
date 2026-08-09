<script lang="ts">
    import { Checkbox, Field } from '@facile/muse';

    let facturable = $state(true);
</script>

<Field label="Projet facturable" helper="Les heures suivies apparaîtront sur la prochaine facture.">
    <Checkbox bind:checked={facturable} />
</Field>
