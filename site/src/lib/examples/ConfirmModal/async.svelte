<script lang="ts">
    import { Button, ConfirmModal, icons, toast } from '@facile/muse';

    let open = $state(false);

    async function revoke() {
        await new Promise((resolve) => setTimeout(resolve, 1600));
        toast.success('Clé API « déploiement-ci » révoquée.');
    }
</script>

<Button variant="danger" icon={icons.revoke} onclick={() => (open = true)}>
    Révoquer la clé API
</Button>

<ConfirmModal
    bind:open
    tone="danger"
    icon={icons.key}
    title="Révoquer « déploiement-ci » ?"
    description="Les 3 pipelines qui utilisent cette clé échoueront à leur prochain déploiement."
    confirmLabel="Révoquer"
    cancelLabel="Garder la clé"
    onConfirm={revoke}
/>
