<script lang="ts">
    import { Button, icons, PageHeader } from '@facile/muse';
</script>

<PageHeader title="Membres" description="12 personnes dans l'espace Heranova.">
    {#snippet actions()}
        <Button variant="secondary" icon={icons.download}>Exporter</Button>
        <Button icon={icons.plus}>Inviter</Button>
    {/snippet}
</PageHeader>
