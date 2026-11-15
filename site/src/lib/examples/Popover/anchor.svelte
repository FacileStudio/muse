<script lang="ts">
    import { Button, Popover } from '@facile/muse';

    let target: HTMLElement | null = $state(null);
    let open = $state(false);
</script>

<div bind:this={target} class="inline-block">
    <Button variant="secondary" onclick={() => (open = !open)}>Élément ciblé</Button>
</div>
<Popover label="Astuce" anchor={target} side="bottom" bind:open>
    <p class="text-fc-sm text-fc-fg-muted">Ancré à n'importe quel élément passé par référence, sans bouton propre.</p>
</Popover>
