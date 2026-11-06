export const demoCatalog = {
    plans: [
        {
            key: 'free',
            name: 'Découverte',
            features: { 'nuage.storage_gb': 5, 'courrier.mailboxes': 1, 'echo.max_participants': 4, 'echo.max_call_minutes': 40 },
            prices: []
        },
        {
            key: 'pro',
            name: 'Pro',
            features: {
                'nuage.storage_gb': 200,
                'courrier.mailboxes': 5,
                'echo.max_participants': 50,
                'echo.max_call_minutes': -1,
                'echo.recording': true,
                'glouton.access': true
            },
            prices: [
                { interval: 'month', amount: 900, currency: 'eur', lookup_key: 'pro_month' },
                { interval: 'year', amount: 9000, currency: 'eur', lookup_key: 'pro_year' }
            ]
        },
        {
            key: 'team',
            name: 'Équipe',
            features: {
                'nuage.storage_gb': -1,
                'courrier.mailboxes': -1,
                'echo.max_participants': -1,
                'echo.max_call_minutes': -1,
                'echo.recording': true,
                'glouton.access': true,
                'future.feature': 3
            },
            prices: [
                { interval: 'month', amount: 2499, currency: 'eur', lookup_key: 'team_month' },
                { interval: 'year', amount: 23990, currency: 'eur', lookup_key: 'team_year' }
            ]
        },
        { key: 'broken', prices: 'nope' }
    ]
};
