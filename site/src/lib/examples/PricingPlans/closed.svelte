<!--
    Sans `ctaHref`, chaque bouton ouvre l'inscription Registre dans la langue de la page
    (`signUpUrl`) : un visiteur d'une page d'accueil n'a pas encore de compte. Une app pas encore
    ouverte renvoie vers les tarifs de la suite et change tous les boutons : `ctaLabel` pour les
    offres payantes (une chaîne, ou une par offre avec `'*'` pour les autres), `freeLabel` pour
    l'offre gratuite.
-->
<script lang="ts">
    import { PricingPlans } from '@facile/muse';

    const catalog = {
        plans: [
            { key: 'solo', name: 'Solo', features: { 'nuage.storage_gb': 5 }, prices: [] },
            {
                key: 'pro',
                name: 'Pro',
                features: { 'nuage.storage_gb': 100 },
                prices: [{ interval: 'month', amount: 900, currency: 'eur', lookup_key: 'plan_pro_month' }]
            }
        ]
    };
</script>

<PricingPlans
    {catalog}
    highlight={['nuage.storage_gb']}
    highlightOnly
    ctaHref="https://suite.facile.studio/#tarifs"
    ctaLabel="Voir les offres"
    freeLabel="Voir les offres"
    recommended="pro"
/>
