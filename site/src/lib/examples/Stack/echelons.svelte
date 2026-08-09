<script lang="ts">
    import { Stack } from '@facile/muse';

    const echelons = [
        { gap: 'bound', propos: 'un titre et sa description' },
        { gap: 'tight', propos: 'des contrôles utilisés ensemble' },
        { gap: 'content', propos: 'des frères dans un bloc' },
        { gap: 'section', propos: 'deux sujets distincts' }
    ] as const;
</script>

<div class="grid gap-4 sm:grid-cols-4">
    {#each echelons as echelon (echelon.gap)}
        <Stack gap="tight">
            <span class="font-fc-mono text-fc-xs text-fc-fg-muted">gap="{echelon.gap}"</span>
            <Stack gap={echelon.gap}>
                <div class="h-8 rounded-fc-sm bg-fc-surface"></div>
                <div class="h-8 rounded-fc-sm bg-fc-surface"></div>
            </Stack>
            <span class="text-fc-xs text-fc-fg-muted">{echelon.propos}</span>
        </Stack>
    {/each}
</div>
