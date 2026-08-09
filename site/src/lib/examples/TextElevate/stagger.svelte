<script lang="ts">
    import { Button, Stack, TextElevate } from '@facile/muse';

    let run = $state(0);
</script>

<Stack gap="tight">
    <Button variant="outline" size="sm" onclick={() => run++}>Rejouer</Button>
    {#key run}
        <TextElevate
            text="164 heures pointées ce mois"
            delay={0.1}
            stagger={0.06}
            duration={0.5}
            class="text-fc-lg font-semibold text-fc-fg"
        />
    {/key}
</Stack>
