<script lang="ts">
    import { Stack, SubscriptionSection } from '@facile/muse';
</script>

<Stack gap="section">
    <SubscriptionSection
        plan="Pro"
        manageHref="https://sso.facile.studio/account"
        upgradeHref="https://facile.studio/pricing"
        usage={[
            { label: 'Storage', used: 41, limit: 100 },
            { label: 'Seats', used: 5, limit: 5 }
        ]}
    />
</Stack>
