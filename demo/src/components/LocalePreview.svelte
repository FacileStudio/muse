<script lang="ts">
    import { Card, LegalFooter, PlanLimit, SignInWithFacile, Stack, scopeLocale, type Locale } from '@facile/muse';

    let { locale }: { locale: Locale } = $props();

    scopeLocale(() => locale);

    const limit = { message: '10 / 10', upgrade_url: '/billing', key: 'projects', limit: 10 };
</script>

<Card lang={locale} class="flex flex-col gap-4 p-5">
    <span class="text-fc-xs font-semibold uppercase text-fc-fg-muted">{locale}</span>
    <Stack gap="tight" class="items-start">
        <SignInWithFacile href="#/launch" size="sm" />
        <SignInWithFacile href="#/launch" />
        <SignInWithFacile href="#/launch" size="lg" fullWidth />
        <SignInWithFacile href="#/launch" loading fullWidth />
    </Stack>
    <PlanLimit error={limit} />
    <LegalFooter hideLocaleSwitch />
</Card>
