<script lang="ts">
    import { Button, ConfirmModal, icons, toast } from '@facile/muse';

    let open = $state(false);
</script>

<Button variant="danger" icon={icons.remove} onclick={() => (open = true)}>
    Supprimer le projet
</Button>

<ConfirmModal
    bind:open
    tone="danger"
    title="Supprimer « Refonte Sablier » ?"
    description="Les 42 tâches et les 128 h pointées sur ce projet seront définitivement perdues."
    confirmLabel="Supprimer"
    cancelLabel="Annuler"
    onConfirm={() => { toast.success('Projet « Refonte Sablier » supprimé.'); }}
/>
