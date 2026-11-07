<script lang="ts">
    import { DatePicker, Field } from '@facile/muse';

    let rdv = $state('2026-11-12');
</script>

<Field label="Rendez-vous (du 5 au 20 novembre 2026)">
    <DatePicker bind:value={rdv} min="2026-11-05" max="2026-11-20" />
</Field>
