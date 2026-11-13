<script lang="ts">
    import { Card, DownloadCta, DownloadSection, Inline, LOCALES, LocaleSwitch, Page, PageHeader, PricingPlans, Section, Select } from '@facile/muse';
    import Scoped from '../components/Scoped.svelte';
    import { demoCatalog } from '../catalog.js';
    import { setTheme, theme, type ThemeMode } from '../theme.svelte.js';

    let mode = $state<ThemeMode>(theme.mode);
</script>

<Page width="xl">
    <PageHeader
        title="Tarifs"
        description="PricingPlans lit le catalogue public d'Ardoise et DownloadCta mène aux téléchargements. Changez la langue et le thème ici."
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

    <Section title="Dans la langue choisie" description="Catalogue fourni côté serveur ; une entrée invalide est ignorée.">
        <PricingPlans catalog={demoCatalog} highlight={['echo.max_participants']} ctaHref="/billing" />
        <DownloadCta href="/downloads" />
    </Section>

    <Section title="Page de téléchargement" description="DownloadSection : une carte par plateforme, celle du visiteur en premier, et les commandes du terminal à copier.">
        <DownloadSection
            downloads={[
                { platform: 'macos', href: '/dl/app-arm64.dmg', label: 'Apple Silicon', arch: 'arm64', version: 'v1.4.0', size: 18_400_000 },
                { platform: 'windows', href: '/dl/app-setup.exe', label: 'Installer', arch: 'x64', size: 12_700_000 },
                { platform: 'linux', href: '/dl/app.deb', label: '.deb', checksumHref: '/dl/app.deb.sha256' },
                { platform: 'android', href: '/dl/app.apk', label: 'APK', size: 4_200_000 }
            ]}
            commands={[{ label: 'Homebrew', command: 'brew install facilestudio/tap/app' }]}
            releasesHref="/releases"
        />
    </Section>

    <Section title="Catalogue vide ou injoignable" description="Rien n'est rendu : pas de section cassée.">
        <Card class="p-5">
            <PricingPlans catalog={{ plans: [] }} />
            <PricingPlans catalogUrl="https://catalog.invalid/api/catalog" timeoutMs={1500} />
            <p class="text-fc-sm text-fc-fg-muted">Deux PricingPlans au-dessus, aucun ne s'affiche.</p>
        </Card>
    </Section>

    <Section title="Titre personnalisé" description="headingClass se fusionne sur le titre de section ; une offre nommée comme son prix (Gratuit) ne l'affiche qu'une fois.">
        <PricingPlans
            catalog={{ plans: [{ key: 'free', name: 'Gratuit', features: { 'nuage.storage_gb': 5 }, prices: [] }] }}
            title="Nos offres"
            headingClass="text-fc-2xl text-fc-accent"
        />
    </Section>

    {#each LOCALES as locale (locale)}
        <Section title={locale.toUpperCase()}>
            <Scoped {locale}>
                <PricingPlans catalog={demoCatalog} headingLevel={3} ctaHref="/billing" />
                <DownloadCta href="/downloads" platforms={['macos', 'windows', 'linux', 'android', 'ios']} />
            </Scoped>
        </Section>
    {/each}
</Page>
