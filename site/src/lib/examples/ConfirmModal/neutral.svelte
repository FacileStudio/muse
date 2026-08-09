<script lang="ts">
    import { Button, ConfirmModal, icons, toast } from '@facile/muse';

    let open = $state(false);
</script>

<Button variant="outline" icon={icons.mail} onclick={() => (open = true)}>
    Envoyer la facture
</Button>

<ConfirmModal
    bind:open
    icon={icons.mail}
    title="Envoyer la facture F-2026-0184 ?"
    description="Elle partira à compta@heranova.fr pour un montant de 4 250 € HT."
    confirmLabel="Envoyer"
    cancelLabel="Relire"
    onConfirm={() => { toast.success('Facture envoyée à compta@heranova.fr.'); }}
    onCancel={() => toast.info('Envoi annulé, la facture reste en brouillon.')}
/>
