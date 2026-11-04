<script lang="ts">
    import { LocaleSwitch, type Locale } from '@facile/muse';

    let saved = $state<Locale | null>(null);
</script>

<div class="flex items-center gap-3">
    <LocaleSwitch onChange={(locale) => (saved = locale)} />
    {#if saved}<span class="text-fc-sm text-fc-fg-muted">{saved}</span>{/if}
</div>
