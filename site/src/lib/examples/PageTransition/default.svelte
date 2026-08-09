<script lang="ts">
    import { Button, Inline, PageTransition, Stack } from '@facile/muse';

    const views = {
        semaine: '38 h pointées, dont 33 h facturables sur 4 projets.',
        mois: '164 h pointées, 89 % du budget consommé sur « Boutique Heranova ».',
        annee: '1 812 h pointées depuis janvier, 11 clients actifs.'
    };

    let key = $state<keyof typeof views>('semaine');
</script>

<Stack gap="tight">
    <Inline gap="tight">
        {#each Object.keys(views) as view (view)}
            <Button variant={key === view ? 'primary' : 'outline'} size="sm" onclick={() => (key = view as keyof typeof views)}>
                {view}
            </Button>
        {/each}
    </Inline>

    <PageTransition {key}>
        <p class="text-fc-sm text-fc-fg-muted">{views[key]}</p>
    </PageTransition>
</Stack>
