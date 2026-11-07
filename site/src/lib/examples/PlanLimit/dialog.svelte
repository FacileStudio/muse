<script lang="ts">
    import { Button, PlanLimit, type PlanLimitError } from '@facile/muse';

    let error = $state<PlanLimitError | null>(null);
</script>

<Button variant="secondary" onclick={() => (error = { message: '5 Go sur 5 Go.', upgrade_url: '/billing', limit: '5 Go' })}>
    Envoyer un fichier
</Button>
<PlanLimit variant="dialog" {error} onClose={() => (error = null)} />
