<script lang="ts">
    import { Icon, IconButton, icons } from '@facile/muse';
</script>

<div class="flex items-center gap-3">
    <IconButton aria-label="Rafraîchir la liste">
        <Icon icon={icons.refresh} />
    </IconButton>
    <IconButton variant="ghost" aria-label="Filtrer les projets">
        <Icon icon={icons.filter} />
    </IconButton>
    <IconButton variant="danger" aria-label="Supprimer le projet">
        <Icon icon={icons.remove} />
    </IconButton>
</div>
