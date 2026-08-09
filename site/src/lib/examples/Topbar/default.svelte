<script lang="ts">
    import { Avatar, IconButton, Icon, Topbar, icons } from '@facile/muse';
</script>

<div class="w-full overflow-hidden rounded-fc-md border border-fc-border">
    <Topbar>
        <span class="text-fc-md font-semibold text-fc-fg">Sablier</span>
        <div class="flex items-center gap-2">
            <IconButton variant="ghost" aria-label="Notifications">
                <Icon icon={icons.notification} />
            </IconButton>
            <Avatar name="Camille Roux" size="sm" />
        </div>
    </Topbar>
    <div class="h-24 bg-fc-surface"></div>
</div>
