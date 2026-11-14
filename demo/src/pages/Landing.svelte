<script lang="ts">
    import {
        FeatureSplit,
        ForDevelopers,
        LandingCta,
        LandingFooter,
        LandingHeader,
        LANDING_HEADING,
        LocaleSwitch,
        PricingPlans,
        SignUpWithFacile,
        WorksWith,
        icons
    } from '@facile/muse';
    import { demoCatalog } from '../catalog.js';
    import { apps, features, notes, rows } from './landing-blocks.js';

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

    const block = 'mx-auto w-full max-w-5xl px-4 sm:px-6';
</script>

<LandingHeader appName="Muse" icon={icons.paletteMark} {links} skipHref="#landing-main">
    {#snippet actions()}<SignUpWithFacile size="sm" />{/snippet}
</LandingHeader>

<main id="landing-main" tabindex="-1" class="flex w-full flex-col gap-20 py-12 sm:gap-28 sm:py-16">
    <section class="{block} flex flex-col gap-6" data-preview="hero">
        <div class="flex justify-end"><LocaleSwitch /></div>
        <h1 class="max-w-2xl font-fc-title text-fc-3xl font-bold tracking-tight text-fc-fg sm:text-[3rem] sm:leading-[1.05]">
            Vos fichiers, partout, sans y penser.
        </h1>
        <p class="max-w-xl text-fc-md text-fc-fg-muted">Nuage garde vos dossiers à jour sur chaque appareil.</p>
        <LandingCta signInHref="/auth/oidc" />
    </section>

    <FeatureSplit
        id="features"
        class={block}
        title="Tout ce qu'il faut pour vos fichiers"
        description="Quatre choses, bien faites."
        {features}
        data-preview="features"
    />

    <WorksWith
        class={block}
        {apps}
        description="Nuage sert de disque aux autres apps Facile."
        data-preview="works-with"
    />

    <PricingPlans
        class={block}
        catalog={demoCatalog}
        highlight={['nuage.storage_gb']}
        highlightOnly
        {notes}
        recommended="pro"
        suiteHref="https://suite.facile.studio/#tarifs"
        title="Ce que Nuage vous donne"
        headingClass={LANDING_HEADING}
        data-preview="pricing"
    />

    <PricingPlans
        class={block}
        catalog={demoCatalog}
        highlight={['ai.access']}
        highlightOnly
        notes={{ '*': 'Bulle demande une offre payante : Pro ou Studio.' }}
        freeLabel="Créer un compte"
        freeHref="https://sso.facile.studio/signup"
        recommended="pro"
        title="Une note pour toutes les offres"
        headingClass={LANDING_HEADING}
        data-preview="pricing-shared"
    />

    <div class={block} data-preview="developers">
        <ForDevelopers {rows} selfHostHref="https://suite.facile.studio/auto-hebergement" />
    </div>

    <section class="{block} flex flex-col items-center gap-6 text-center" data-preview="final">
        <h2 class="font-fc-title text-fc-2xl font-bold tracking-tight text-fc-fg sm:text-fc-3xl">Essayez Nuage aujourd'hui</h2>
        <LandingCta signInHref="/auth/oidc" align="center" class="w-full" />
    </section>
</main>

<LandingFooter appName="Muse" icon={icons.paletteMark} tagline="Le système de design des outils Facile." {columns} />
