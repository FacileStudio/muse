<script lang="ts">
    import type { Snippet } from 'svelte';
    import { scopeLocale, type Locale } from '@facile/muse';

    let { locale, children }: { locale: Locale; children: Snippet } = $props();

    scopeLocale(() => locale);
</script>

<div lang={locale} class="flex flex-col gap-4">
    {@render children()}
</div>
