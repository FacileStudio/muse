<script lang="ts">
    import { SignInWithFacile, scopeLocale, type Locale } from '@facile/muse';

    let { locale }: { locale: Locale } = $props();

    scopeLocale(() => locale);
</script>

<div lang={locale}><SignInWithFacile /></div>
