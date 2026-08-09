<script lang="ts">
    import { Button, Drawer, Stack } from '@facile/muse';

    let open = $state(false);
</script>

<Button variant="outline" onclick={() => (open = true)}>Détails de la tâche</Button>

<Drawer bind:open title="Maquettes du tunnel de paiement" description="Espace Boutique · échéance vendredi">
    <Stack gap="tight">
        <p class="text-fc-sm text-fc-fg-muted">
            Trois écrans à livrer : panier, adresse, confirmation. Les états d'erreur sont à
            reprendre depuis la charte.
        </p>
        <p class="text-fc-sm text-fc-fg-muted">6 h 30 pointées sur 12 h estimées.</p>
    </Stack>
</Drawer>
