<script lang="ts">
    import { SearchField } from '@facile/muse';

    let query = $state('');
    let sent = $state('');
</script>

<div class="flex max-w-sm flex-col gap-2">
    <SearchField bind:value={query} placeholder="Rechercher des fichiers" shortcut="/" onSearch={(value) => (sent = value)} />
    <p class="text-fc-sm text-fc-fg-muted">Recherche envoyée : {sent || '—'}</p>
</div>
