<script lang="ts">
    import { Badge, icons, NavButton, Stack } from '@facile/muse';
</script>

<Stack gap="none" class="w-64">
    <NavButton href="#invitations" icon={icons.mail} label="Invitations">
        {#snippet right()}
            <Badge tone="info">3</Badge>
        {/snippet}
    </NavButton>
    <NavButton href="#factures" icon={icons.card} label="Factures">
        {#snippet right()}
            <Badge tone="warning">2 en retard</Badge>
        {/snippet}
    </NavButton>
</Stack>
