<script lang="ts">
    import { Checkbox } from '@facile/muse';

    let facturable = $state(true);
</script>

<Checkbox label="Heures facturables" bind:checked={facturable} />
