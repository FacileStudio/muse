<script lang="ts">
    import { Button, icons, Section } from '@facile/muse';
</script>

<Section title="Invitations en attente" description="Elles expirent au bout de sept jours." card>
    {#snippet actions()}
        <Button size="sm" variant="outline" icon={icons.refresh}>Tout relancer</Button>
    {/snippet}

    <p class="text-fc-sm text-fc-fg-muted">lucas@gfconseil.fr · envoyée il y a 2 jours</p>
    <p class="text-fc-sm text-fc-fg-muted">sarah@lpb.fr · envoyée il y a 5 jours</p>
</Section>
