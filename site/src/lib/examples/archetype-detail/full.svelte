<script lang="ts">
    import { Avatar, Button, Divider, Inline, Page, PageHeader, Section, Sparkline, Stack, icons } from '@facile/muse';

    const details = [
        ['Client', 'Heranova'],
        ['Espace', 'Studio'],
        ['Démarré le', '3 mars 2026'],
        ['Taux', '520 € / jour']
    ];

    const entrees = [
        { qui: 'Yann Ravenel', quoi: 'Maquettes du tunnel de contact', duree: '3 h 15' },
        { qui: 'Laura Hervé', quoi: 'Intégration de la page équipe', duree: '2 h 00' },
        { qui: 'Yann Ravenel', quoi: 'Revue client', duree: '0 h 45' }
    ];

    const equipe = ['Yann Ravenel', 'Laura Hervé', 'Marion Masson'];
</script>

<Page>
    <PageHeader
        back={{ href: '#', label: 'Projets' }}
        title="Refonte Heranova"
        description="Site vitrine et espace client · démarré le 3 mars 2026."
    >
        {#snippet actions()}
            <Button variant="outline" size="sm" icon={icons.edit}>Modifier</Button>
            <Button size="sm" icon={icons.clock}>Pointer du temps</Button>
        {/snippet}
    </PageHeader>

    <div class="grid gap-1 lg:grid-cols-3">
        <Stack class="lg:col-span-2">
            <Section card title="Avancement" description="38 h pointées sur les 60 h estimées.">
                <Sparkline data={[2, 4, 3, 6, 5, 7, 8, 6, 9]} height={56} area smooth showLast />
            </Section>

            <Section card title="Dernières entrées">
                <Stack>
                    {#each entrees as entree (entree.quoi)}
                        <Inline class="justify-between">
                            <Stack>
                                <span class="text-fc-p text-fc-ink">{entree.quoi}</span>
                                <span class="text-fc-subtext text-fc-muted">{entree.qui}</span>
                            </Stack>
                            <span class="font-fc-mono text-fc-subtext text-fc-muted">{entree.duree}</span>
                        </Inline>
                    {/each}
                    <Divider />
                    <Button variant="ghost" size="sm" class="w-fit">Voir tout le pointage</Button>
                </Stack>
            </Section>
        </Stack>

        <Stack>
            <Section card title="Détails">
                <Stack>
                    {#each details as [libelle, valeur] (libelle)}
                        <Inline align="baseline" class="justify-between">
                            <span class="text-fc-p text-fc-muted">{libelle}</span>
                            <span class="text-fc-p text-fc-ink">{valeur}</span>
                        </Inline>
                    {/each}
                </Stack>
            </Section>

            <Section card title="Équipe">
                <Stack>
                    {#each equipe as membre (membre)}
                        <Inline>
                            <Avatar name={membre} size="sm" />
                            <span class="text-fc-p text-fc-ink">{membre}</span>
                        </Inline>
                    {/each}
                </Stack>
            </Section>
        </Stack>
    </div>
</Page>
