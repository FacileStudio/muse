<script lang="ts">
    import { BullePanel, Button } from '@facile/muse';

    let busy = $state(false);
</script>

<BullePanel name="Nova" {busy} class="max-w-xl">
    <Button variant="secondary" size="sm" onclick={() => (busy = !busy)}>Planifier ma semaine</Button>
</BullePanel>
