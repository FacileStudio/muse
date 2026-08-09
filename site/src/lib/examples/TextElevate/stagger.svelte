<script lang="ts">
    import { Button, Stack, TextElevate } from '@facile/muse';

    let visible = $state(true);
</script>

<Stack gap="tight">
    <Button variant="outline" size="sm" onclick={() => (visible = !visible)}>Rejouer</Button>
    {#key visible}
        <TextElevate
            text="164 heures pointées ce mois"
            {visible}
            delay={0.1}
            stagger={0.06}
            duration={0.5}
            class="text-fc-lg font-semibold text-fc-fg"
        />
    {/key}
</Stack>
