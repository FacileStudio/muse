<script lang="ts">
    import { Button, Card, Inline, Section, Stack } from '@facile/muse';
    import Row from './Row.svelte';
</script>

<Row name="Stack" lead="Une colonne, à l'un des quatre barreaux. C'est le parent qui possède l'espace.">
    <div class="grid w-full gap-4 sm:grid-cols-4">
        {#each [['bound', 'bound'], ['tight', 'tight'], ['content', 'content'], ['section', 'section']] as [gap, name] (name)}
            <Stack gap="bound">
                <code class="font-fc-mono text-fc-xs text-fc-fg-muted">{name}</code>
                <Stack gap={gap as 'bound'}>
                    <div class="h-5 rounded-fc-sm bg-fc-accent/15"></div>
                    <div class="h-5 rounded-fc-sm bg-fc-accent/15"></div>
                </Stack>
            </Stack>
        {/each}
    </div>
</Row>

<Row name="Inline" lead="Une ligne qui passe à la ligne par défaut — sinon elle déborde ou écrase ses cibles tactiles.">
    <Inline>
        <Button size="sm" variant="outline">Annuler</Button>
        <Button size="sm">Enregistrer</Button>
    </Inline>
</Row>

<Row name="Section" lead="Un bloc titré. `card` optionnel : une section qui contient une grille de cartes n'en est pas une.">
    <div class="w-full">
        <Section title="Stockage" description="Sur tous vos espaces.">
            <div class="grid gap-4 sm:grid-cols-2">
                <Card>12,4 Go utilisés</Card>
                <Card>87,6 Go restants</Card>
            </div>
        </Section>
    </div>
</Row>

<Row name="Page · PageHeader" lead="La colonne de page : centrage, largeur maximale, padding extérieur, rythme entre sections. Cette page en est une.">
    <p class="text-fc-sm text-fc-fg-muted">
        Tout ce que vous lisez est dans un <code class="font-fc-mono text-fc-xs">&lt;Page&gt;</code>,
        et chaque titre de section est un <code class="font-fc-mono text-fc-xs">&lt;Section&gt;</code>.
    </p>
</Row>
