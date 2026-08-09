<script lang="ts">
    import { Page, PageHeader, Section, StatCard } from '@facile/muse';
</script>

<Page width="xl">
    <PageHeader title="Stockage" description="Tous les espaces dont vous êtes propriétaire." />

    <Section title="Répartition">
        <div class="grid gap-4 lg:grid-cols-3">
            <StatCard label="Heranova" value="4,2 Go" delta="42 % du quota" />
            <StatCard label="GF Conseil" value="1,8 Go" delta="18 % du quota" />
            <StatCard label="Laura Hervé" value="0,6 Go" delta="6 % du quota" />
        </div>
    </Section>
</Page>
