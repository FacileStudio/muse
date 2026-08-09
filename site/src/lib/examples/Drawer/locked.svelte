<script lang="ts">
    import { Button, Drawer, Stack, UploadProgress } from '@facile/muse';

    let open = $state(false);
</script>

<Button variant="outline" onclick={() => (open = true)}>Import en cours</Button>

<Drawer bind:open title="Import de l'archive Nuage" dismissible={false} showHandle={false}>
    <Stack gap="tight">
        <p class="text-fc-sm text-fc-fg-muted">
            1 248 fichiers sur 3 100 transférés. Ne fermez pas cette fenêtre.
        </p>
        <UploadProgress name="archive-2026.zip" progress={40} />
    </Stack>

    {#snippet footer()}
        <Button variant="ghost" class="w-full" onclick={() => (open = false)}>Interrompre l'import</Button>
    {/snippet}
</Drawer>
