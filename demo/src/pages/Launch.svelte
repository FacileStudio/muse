<script lang="ts">
    import { Alert, AuthScreen, Button, Card, Icon, Inline, LOCALES, LocaleSwitch, Page, PageHeader, PlanLimit, Section, Select, icons } from '@facile/muse';
    import LocalePreview from '../components/LocalePreview.svelte';
    import { setTheme, theme, type ThemeMode } from '../theme.svelte.js';

    let dialog = $state(false);
    let mode = $state<ThemeMode>(theme.mode);
    const limit = { message: '10 / 10', upgrade_url: '/billing', key: 'projects', limit: 10 };
</script>

<Page width="xl">
    <PageHeader
        title="Lancement"
        description="Connexion Facile, limite d'offre et pied légal, dans les quatre langues. Changez la langue et le thème ici : tout suit les jetons."
    >
        {#snippet actions()}
            <Inline gap="tight">
                <LocaleSwitch />
                <Select bind:value={mode} onchange={() => setTheme(mode)} aria-label="Thème" class="w-auto">
                    <option value="system">Système</option>
                    <option value="light">Clair</option>
                    <option value="dark">Sombre</option>
                </Select>
            </Inline>
        {/snippet}
    </PageHeader>

    <Section title="Les quatre langues" description="Chaque carte fixe sa langue avec scopeLocale.">
        <div class="grid gap-4 lg:grid-cols-2">
            {#each LOCALES as locale (locale)}
                <LocalePreview {locale} />
            {/each}
        </div>
    </Section>

    <Section title="PlanLimit en fenêtre" description="Répond à l'action qui a touché la limite, se ferme toujours.">
        <Inline>
            <Button variant="outline" onclick={() => (dialog = true)}>Créer un projet</Button>
        </Inline>
        <PlanLimit variant="dialog" error={limit} bind:open={dialog} />
    </Section>

    <Section title="AuthScreen" description="L'écran de connexion complet, dans la langue choisie en haut.">
        <Card class="overflow-hidden p-0">
            <AuthScreen appName="Sablier" class="min-h-0">
                {#snippet logo()}
                    <Icon icon={icons.clock} size={40} class="text-fc-fg" />
                {/snippet}
                {#snippet tagline()}Le temps passé, sans tableur.{/snippet}
                {#snippet notice()}
                    <Alert tone="warning">Votre session a expiré.</Alert>
                {/snippet}
            </AuthScreen>
        </Card>
    </Section>
</Page>
