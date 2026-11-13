<script lang="ts">
    import { Button, Icon, IconButton, Tooltip, icons } from '@facile/muse';
</script>

<div class="flex items-center gap-4">
    <Tooltip text="Les 30 derniers jours, en CSV">
        <Button variant="secondary">Exporter</Button>
    </Tooltip>
    <IconButton variant="ghost-danger" aria-label="Supprimer le projet" tooltip="Supprimer le projet, définitivement">
        <Icon icon={icons.remove} size={18} />
    </IconButton>
</div>
