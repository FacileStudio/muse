<script lang="ts">
    import { Icon, IconButton, Tooltip, icons } from '@facile/muse';
</script>

<div class="flex items-center gap-4">
    <Tooltip text="Copier le lien">
        <IconButton aria-label="Copier le lien"><Icon icon={icons.copy} size={18} /></IconButton>
    </Tooltip>
    <Tooltip text="Supprimer le projet, définitivement">
        <IconButton variant="ghost-danger" aria-label="Supprimer le projet"><Icon icon={icons.remove} size={18} /></IconButton>
    </Tooltip>
</div>
