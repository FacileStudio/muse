<script lang="ts">
    import { Badge, Button, EmptyState, Input, Page, PageHeader, Select, Stack, Table, icons } from '@facile/muse';

    let recherche = $state('');
    let statut = $state('tous');

    const projets = [
        { nom: 'Refonte Heranova', client: 'Heranova', statut: 'actif', tone: 'success', heures: '38 h' },
        { nom: 'Vitrine LPB', client: 'LPB', statut: 'actif', tone: 'success', heures: '21 h' },
        { nom: 'Suivi GF Conseil', client: 'GF Conseil', statut: 'pause', tone: 'warning', heures: '64 h' },
        { nom: 'Identité M. Masson', client: 'Marion Masson', statut: 'archivé', tone: 'neutral', heures: '112 h' }
    ] as const;

    const visibles = $derived(
        projets.filter(
            (p) =>
                (statut === 'tous' || p.statut === statut) &&
                p.nom.toLowerCase().includes(recherche.trim().toLowerCase())
        )
    );
</script>

<Page>
    <PageHeader title="Projets" description="Tous les projets de l'espace Studio.">
        {#snippet actions()}
            <Button icon={icons.plus}>Nouveau projet</Button>
        {/snippet}
    </PageHeader>

    <Stack gap="content">
        <div class="flex flex-col gap-2 sm:flex-row">
            <Input class="sm:flex-1" placeholder="Rechercher un projet" bind:value={recherche} />
            <Select bind:value={statut} class="sm:w-52">
                <option value="tous">Tous les statuts</option>
                <option value="actif">Actifs</option>
                <option value="pause">En pause</option>
                <option value="archivé">Archivés</option>
            </Select>
            <Button size="lg" variant="outline" icon={icons.download}>Exporter</Button>
        </div>

        {#if visibles.length}
            <Table>
                <thead>
                    <tr><th>Projet</th><th>Client</th><th>Statut</th><th>Temps</th></tr>
                </thead>
                <tbody>
                    {#each visibles as projet (projet.nom)}
                        <tr>
                            <td>{projet.nom}</td>
                            <td class="text-fc-fg-muted">{projet.client}</td>
                            <td><Badge tone={projet.tone}>{projet.statut}</Badge></td>
                            <td class="text-fc-fg-muted">{projet.heures}</td>
                        </tr>
                    {/each}
                </tbody>
            </Table>
        {:else}
            <EmptyState
                icon={icons.folder}
                title="Aucun projet ne correspond"
                description="Aucun projet de cet espace ne répond à ce filtre."
            >
                <Button variant="outline" onclick={() => ((recherche = ''), (statut = 'tous'))}>
                    Réinitialiser les filtres
                </Button>
            </EmptyState>
        {/if}
    </Stack>
</Page>
