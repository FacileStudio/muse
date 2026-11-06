<script lang="ts">
    import { PricingPlans } from '@facile/muse';

    const catalog = {
        plans: [
            {
                key: 'pro',
                name: 'Pro',
                features: { 'nuage.storage_gb': 200, 'courrier.mailboxes': 5, 'echo.recording': true },
                prices: [
                    { interval: 'month', amount: 900, currency: 'eur', lookup_key: 'pro_month' },
                    { interval: 'year', amount: 9000, currency: 'eur', lookup_key: 'pro_year' }
                ]
            }
        ]
    };
</script>

<PricingPlans {catalog} highlight={['nuage.storage_gb']} ctaHref="/billing" />
