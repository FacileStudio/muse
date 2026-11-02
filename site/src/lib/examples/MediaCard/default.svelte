<script lang="ts">
    import { Avatar, Icon, IconButton, MediaCard, icons } from '@facile/muse';
</script>

<div class="grid w-full max-w-md gap-1">
    <MediaCard image="https://picsum.photos/seed/muse-card/800/500" title="Refonte Sablier" aside="6 semaines" href="#">
        {#snippet overlay()}2026{/snippet}
        {#snippet actions()}
            <IconButton variant="ghost" class="bg-black/60 text-white/80 backdrop-blur-md hover:bg-black/80 hover:text-white" aria-label="Supprimer le projet"><Icon icon={icons.remove} /></IconButton>
        {/snippet}
        <div class="flex items-center justify-between gap-1">
            <span class="text-fc-subtext text-fc-muted">Svelte · Go · Postgres</span>
            <Avatar name="Camille" size="sm" />
        </div>
    </MediaCard>
</div>
