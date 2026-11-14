<!--
    Sur la page d'une app : seulement ce que l'app donne dans chaque offre (`highlight` +
    `highlightOnly`, ou une ligne par offre dans `notes`), l'offre payante recommandée, et le
    rappel qu'un abonnement couvre toutes les apps, avec un lien vers les tarifs de la suite. Une
    app sans droit propre passe `notes={{ '*': 'Inclus dans toutes les offres' }}`.
-->
<script lang="ts">
    import { PricingPlans } from '@facile/muse';

    const catalog = {
        plans: [
            { key: 'solo', name: 'Solo', features: { 'nuage.storage_gb': 5, 'echo.max_participants': 4 }, prices: [] },
            {
                key: 'pro',
                name: 'Pro',
                features: { 'nuage.storage_gb': 100, 'echo.max_participants': 25 },
                prices: [
                    { interval: 'month', amount: 900, currency: 'eur', lookup_key: 'plan_pro_month' },
                    { interval: 'year', amount: 9000, currency: 'eur', lookup_key: 'plan_pro_year' }
                ]
            }
        ]
    };
</script>

<PricingPlans
    {catalog}
    highlight={['nuage.storage_gb']}
    highlightOnly
    notes={{ pro: 'Liens de partage protégés' }}
    recommended="pro"
    suiteHref="https://suite.facile.studio/#tarifs"
/>
