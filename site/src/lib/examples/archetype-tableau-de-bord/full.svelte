<script lang="ts">
    import {
        BarChart,
        Button,
        Card,
        DonutChart,
        LineChart,
        Page,
        PageHeader,
        Section,
        StatCard,
        icons
    } from '@facile/muse';

    const jours = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    const pointage = [{ name: 'Heures pointées', data: [6.5, 7.25, 8, 5.5, 7.25, 0, 0] }];

    const mois = ['Mars', 'Avril', 'Mai', 'Juin', 'Juillet'];
    const facturation = [
        { name: 'Facturé', data: [12400, 9800, 15200, 11100, 16800] },
        { name: 'Encaissé', data: [12400, 9800, 12200, 6400, 3200] }
    ];

    const repartition = [
        { label: 'Refonte Heranova', value: 14 },
        { label: 'Vitrine LPB', value: 9.5 },
        { label: 'Suivi GF Conseil', value: 7 },
        { label: 'Interne', value: 4 }
    ];
</script>

<Page width="xl">
    <PageHeader title="Tableau de bord" description="Espace Studio · semaine du 3 août.">
        {#snippet actions()}
            <Button variant="outline" size="sm" icon={icons.download}>Exporter</Button>
            <Button size="sm" icon={icons.plus}>Nouveau projet</Button>
        {/snippet}
    </PageHeader>

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Heures pointées" value="34,5 h" delta="+4,2 h vs semaine dernière" />
        <StatCard label="Projets actifs" value="7" delta="2 démarrés ce mois-ci" />
        <StatCard label="À facturer" value="4 820 €" delta="sur 3 clients" />
        <StatCard label="Stockage" value="18,4 Go" delta="sur 50 Go" />
    </div>

    <Section title="Activité" description="Heures pointées sur les sept derniers jours.">
        <div class="grid gap-4 xl:grid-cols-3">
            <Card class="xl:col-span-2">
                <LineChart series={pointage} labels={jours} height={220} area smooth />
            </Card>
            <Card>
                <DonutChart data={repartition} centerLabel="Heures" centerValue="34,5" showLegend />
            </Card>
        </div>
    </Section>

    <Section title="Facturation" description="Émis et encaissé, par mois.">
        <Card>
            <BarChart series={facturation} labels={mois} height={220} showLegend />
        </Card>
    </Section>
</Page>
