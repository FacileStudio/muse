<script lang="ts">
    import { Button, Input, icons } from '@facile/muse';

    let email = $state('');
    let invites = $state<string[]>([]);

    function inviter() {
        if (!email) return;
        invites = [...invites, email];
        email = '';
    }
</script>

<div class="flex flex-col gap-1">
    <div class="flex items-center gap-1">
        <Input type="email" bind:value={email} placeholder="prenom@facile.studio" />
        <Button size="lg" icon={icons.plus} onclick={inviter}>Inviter</Button>
    </div>
    {#each invites as invite (invite)}
        <p class="text-fc-p text-fc-muted">Invitation envoyée à {invite}</p>
    {/each}
</div>
