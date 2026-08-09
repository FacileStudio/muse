<script lang="ts">
    import { Button, Inline, toast } from '@facile/muse';

    function archive() {
        toast.neutral('Projet « Migration Nuage » archivé.', {
            duration: 0,
            action: { label: 'Annuler', onClick: () => toast.success('Archivage annulé.') }
        });
    }
</script>

<Inline gap="tight">
    <Button variant="outline" onclick={archive}>Archiver le projet</Button>
    <Button variant="ghost" onclick={() => toast.clear()}>Tout masquer</Button>
</Inline>
