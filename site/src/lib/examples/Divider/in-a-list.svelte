<script lang="ts">
    import { Divider } from '@facile/muse';

    const entrees = [
        { tache: 'Revue de la maquette', duree: '1 h 45' },
        { tache: 'Intégration du portail', duree: '3 h 10' },
        { tache: 'Point client', duree: '0 h 30' }
    ];
</script>

<div class="flex flex-col">
    {#each entrees as entree, i (entree.tache)}
        {#if i > 0}<Divider class="my-3" />{/if}
        <div class="flex items-center justify-between text-fc-sm">
            <span class="text-fc-fg">{entree.tache}</span>
            <span class="text-fc-fg-muted">{entree.duree}</span>
        </div>
    {/each}
</div>
