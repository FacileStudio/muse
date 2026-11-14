<!--
    Une note commune à toutes les offres (`notes={{ '*': … }}`) s'affiche une seule fois, sous les
    cartes. Une app dont la fonction principale est payante, ou qui ne demande pas de compte,
    change le bouton de l'offre gratuite avec `freeLabel` et `freeHref`.
-->
<script lang="ts">
    import { PricingPlans } from '@facile/muse';

    const catalog = {
        plans: [
            { key: 'solo', name: 'Solo', features: { 'ai.access': false }, prices: [] },
            {
                key: 'pro',
                name: 'Pro',
                features: { 'ai.access': true },
                prices: [{ interval: 'month', amount: 900, currency: 'eur', lookup_key: 'plan_pro_month' }]
            }
        ]
    };
</script>

<PricingPlans
    {catalog}
    highlight={['ai.access']}
    highlightOnly
    notes={{ '*': 'Inclus dans toutes les offres' }}
    freeLabel="Créer un compte"
    freeHref="https://sso.facile.studio/signup"
    recommended="pro"
/>
