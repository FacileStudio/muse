<script lang="ts">
    import { Alert, Button } from '@facile/muse';

    let open = $state(true);
</script>

<Alert tone="info" title="Nouveau" dismissible bind:open>
    {#snippet action()}
        <Button size="sm" variant="secondary" href="#">Voir</Button>
    {/snippet}
    Les raccourcis clavier sont disponibles dans tout l'espace de travail.
</Alert>
{#if !open}<Button size="sm" variant="ghost" onclick={() => (open = true)}>Réafficher</Button>{/if}
