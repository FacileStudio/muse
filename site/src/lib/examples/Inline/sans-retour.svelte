<script lang="ts">
    import { Button, Inline, Input } from '@facile/muse';

    let recherche = $state('');
</script>

<Inline wrap={false}>
    <Input bind:value={recherche} class="min-w-0 flex-1" placeholder="Rechercher un projet" />
    <Button size="lg">Rechercher</Button>
</Inline>
