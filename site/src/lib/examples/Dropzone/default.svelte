<script lang="ts">
    import { Dropzone, Stack } from '@facile/muse';

    let recus = $state<string[]>([]);
</script>

<Stack gap="content">
    <Dropzone
        label="Déposez vos justificatifs ici"
        hint="PDF, PNG ou JPG"
        onFiles={(fichiers) => (recus = fichiers.map((f) => f.name))}
    />
    {#if recus.length > 0}
        <p class="text-fc-sm text-fc-fg-muted">Reçu : {recus.join(', ')}</p>
    {/if}
</Stack>
