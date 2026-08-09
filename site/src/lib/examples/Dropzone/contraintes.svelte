<script lang="ts">
    import { Alert, Dropzone, Stack } from '@facile/muse';

    const motifs = { type: 'format refusé', size: 'trop lourd', count: 'trop de fichiers' };

    let refus = $state<string[]>([]);
</script>

<Stack gap="content">
    <Dropzone
        multiple
        accept="application/pdf,.png,.jpg"
        maxSize={2 * 1024 * 1024}
        maxFiles={3}
        label="Pièces jointes de la facture"
        hint="3 fichiers maximum, 2 Mo chacun"
        onReject={(rejets) => (refus = rejets.map((r) => `${r.file.name} — ${motifs[r.reason]}`))}
    />
    {#if refus.length > 0}
        <Alert tone="warning" title="Fichiers refusés">
            {refus.join(' · ')}
        </Alert>
    {/if}
</Stack>
