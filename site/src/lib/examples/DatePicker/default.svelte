<script lang="ts">
    import { DatePicker, Field } from '@facile/muse';

    let echeance = $state('');
</script>

<Field label="Échéance" helper="Valeur ISO : {echeance || '—'}">
    <DatePicker bind:value={echeance} name="echeance" />
</Field>
