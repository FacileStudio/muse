<script lang="ts">
    import { Button, Inline, toast } from '@facile/muse';
</script>

<Inline gap="tight">
    <Button variant="secondary" onclick={() => toast.success('Feuille de temps envoyée pour validation.')}>
        Succès
    </Button>
    <Button variant="secondary" onclick={() => toast.info('3 espaces restants sur votre forfait.')}>
        Info
    </Button>
    <Button variant="secondary" onclick={() => toast.warning('Budget dépassé de 4 h sur « Site vitrine LPB ».')}>
        Avertissement
    </Button>
    <Button variant="secondary" onclick={() => toast.danger('Synchronisation Nuage échouée.')}>
        Erreur
    </Button>
</Inline>
