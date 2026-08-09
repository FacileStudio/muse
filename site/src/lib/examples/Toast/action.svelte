<script lang="ts">
    import { Button, Toast } from '@facile/muse';

    let visible = $state(true);
    let restaure = $state(false);
</script>

{#if visible}
    <Toast
        tone="danger"
        title="Projet archivé"
        action={{ label: 'Annuler', onClick: () => (restaure = true) }}
        onDismiss={() => (visible = false)}
    >
        {restaure ? 'Restauration en cours…' : 'Refonte du site Heranova a quitté la liste active.'}
    </Toast>
{:else}
    <Button variant="outline" onclick={() => ((visible = true), (restaure = false))}>
        Rejouer la notification
    </Button>
{/if}
