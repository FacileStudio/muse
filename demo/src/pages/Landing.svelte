<script lang="ts">
    import { Card, LandingFooter, LandingHeader, LocaleSwitch, icons } from '@facile/muse';

    const links = $derived([
        { href: '#/landing', label: 'Fonctions', icon: icons.layers, active: true },
        { href: '#/pricing', label: 'Tarifs', icon: icons.card },
        { href: '#/launch', label: 'Lancement', icon: icons.key }
    ]);

    const columns = [
        {
            title: 'Produit',
            links: [
                { href: '#/pricing', label: 'Tarifs' },
                { href: '#/launch', label: 'Lancement' }
            ]
        },
        {
            title: 'Suite',
            links: [
                { href: 'https://facile.studio', label: 'Facile Studio', external: true },
                { href: 'https://github.com/FacileStudio', label: 'GitHub', external: true },
                { href: 'javascript:alert(1)', label: 'Dropped: unsafe href' }
            ]
        }
    ];
</script>

<LandingHeader appName="Muse" icon={icons.paletteMark} {links} skipHref="#landing-main" />

<main id="landing-main" tabindex="-1" class="mx-auto flex w-full max-w-fc-xl flex-col gap-6 px-4 py-10 sm:px-6 md:px-10">
    <div class="flex justify-end"><LocaleSwitch /></div>
    {#each [1, 2, 3] as n (n)}
        <Card class="h-96">Faites défiler : la barre se resserre en pilule flottante sans décaler la page.</Card>
    {/each}
</main>

<LandingFooter appName="Muse" icon={icons.paletteMark} tagline="Le système de design des outils Facile." {columns} />
