<script lang="ts">
    import { Button, icons, Page, PageHeader, Section, StatCard } from '@facile/muse';
</script>

<Page>
    <PageHeader title="Projets" description="Tout ce que votre équipe suit en ce moment.">
        {#snippet actions()}
            <Button icon={icons.plus}>Nouveau projet</Button>
        {/snippet}
    </PageHeader>

    <Section title="Cette semaine" description="Mis à jour toutes les cinq minutes.">
        <div class="grid gap-1 sm:grid-cols-2">
            <StatCard label="Heures suivies" value="31 h 45" delta="+4 h 10" />
            <StatCard label="Projets actifs" value={7} delta="2 livrés ce mois-ci" />
        </div>
    </Section>

    <Section title="Facturation" description="Ce qui part chez le client lundi." card>
        <p class="text-fc-p text-fc-muted">3 240 € en attente, dont une facture en retard.</p>
    </Section>
</Page>
