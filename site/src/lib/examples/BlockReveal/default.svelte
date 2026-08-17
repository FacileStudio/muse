<script lang="ts">
    import { BlockReveal, Button, Stack } from '@facile/muse';

    let run = $state(0);
</script>

<Stack gap="tight">
    <Button variant="outline" size="sm" onclick={() => run++}>Rejouer</Button>
    {#key run}
        <BlockReveal class="text-fc-xl font-semibold text-fc-fg">
            Un seul login, zéro dépendance cloud.
        </BlockReveal>
    {/key}
</Stack>
