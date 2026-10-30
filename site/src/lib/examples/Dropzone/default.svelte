<script lang="ts">
    import { Dropzone, Stack } from '@facile/muse';

    let recus = $state<string[]>([]);
</script>

<Stack>
    <Dropzone
        label="Déposez vos justificatifs ici"
        hint="PDF, PNG ou JPG"
        onFiles={(fichiers) => (recus = fichiers.map((f) => f.name))}
    />
    {#if recus.length > 0}
        <p class="text-fc-p text-fc-muted">Reçu : {recus.join(', ')}</p>
    {/if}
</Stack>
