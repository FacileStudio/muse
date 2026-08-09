<script lang="ts">
    import { Button, Icon, IconButton, Topbar, icons, toast } from '@facile/muse';
</script>

<div class="w-full overflow-hidden rounded-fc-md border border-fc-border">
    <Topbar>
        <div class="flex min-w-0 items-center gap-2">
            <IconButton variant="ghost" aria-label="Retour aux projets">
                <Icon icon={icons.chevronLeft} />
            </IconButton>
            <span class="truncate text-fc-sm font-medium text-fc-fg">Boutique Heranova</span>
        </div>
        <div class="flex items-center gap-2">
            <Button variant="ghost" size="sm" icon={icons.filter}>Filtrer</Button>
            <Button size="sm" icon={icons.plus} onclick={() => toast.success('Nouvelle tâche créée.')}>
                Tâche
            </Button>
        </div>
    </Topbar>
    <div class="h-24 bg-fc-surface"></div>
</div>
