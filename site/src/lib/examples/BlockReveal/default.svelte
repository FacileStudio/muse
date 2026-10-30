<script lang="ts">
    import { BlockReveal, Button, Stack } from '@facile/muse';

    let run = $state(0);
</script>

<Stack>
    <Button variant="outline" size="sm" onclick={() => run++}>Rejouer</Button>
    {#key run}
        <BlockReveal class="text-fc-subtitle font-semibold text-fc-ink">
            Un seul login, zéro dépendance cloud.
        </BlockReveal>
    {/key}
</Stack>
