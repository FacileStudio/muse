<script lang="ts">
    import { Button, Modal } from '@facile/muse';

    let open = $state(false);
</script>

<Button variant="outline" onclick={() => (open = true)}>Voir l'espace</Button>

<Modal bind:open title="Espace « Heranova »" showClose>
    <p class="text-fc-sm text-fc-fg-muted">
        7 membres, 4 projets actifs et 312 h pointées depuis janvier. L'espace est facturé au
        forfait mensuel.
    </p>
</Modal>
