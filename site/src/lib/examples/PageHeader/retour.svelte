<script lang="ts">
    import { Button, icons, PageHeader } from '@facile/muse';
</script>

<PageHeader
    title="Refonte du site Heranova"
    description="Client : Heranova · échéance le 30 septembre 2026"
    back={{ href: '#', label: 'Projets' }}
>
    {#snippet actions()}
        <Button variant="outline" icon={icons.edit}>Modifier</Button>
    {/snippet}
</PageHeader>
