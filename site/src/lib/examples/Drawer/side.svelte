<script lang="ts">
    import { Button, Drawer, Stack } from '@facile/muse';

    let open = $state(false);
</script>

<Button variant="secondary" onclick={() => (open = true)}>Ouvrir le panneau</Button>

<Drawer bind:open side showClose title="Analyse du 6 novembre">
    <Stack gap="tight">
        <p class="text-fc-sm text-fc-fg-muted">
            Sur un écran large, le panneau glisse depuis la droite et prend toute la hauteur. Sur
            mobile, il reste une feuille qui monte du bas.
        </p>
    </Stack>
</Drawer>
