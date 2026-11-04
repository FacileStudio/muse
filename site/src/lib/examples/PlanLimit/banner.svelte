<script lang="ts">
    import { PlanLimit, planLimitFrom } from '@facile/muse';

    const error = planLimitFrom({
        error: { code: 'payment_required', message: '10 projets sur 10.', upgrade_url: '/billing', key: 'projects', limit: 10 }
    });
</script>

<PlanLimit {error} />
