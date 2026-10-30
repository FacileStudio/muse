<script lang="ts">
    import { Avatar, IconButton, Icon, Topbar, icons } from '@facile/muse';
</script>

<div class="w-full overflow-hidden rounded-fc border border-fc-border">
    <Topbar>
        <span class="text-fc-lead font-semibold text-fc-ink">Sablier</span>
        <div class="flex items-center gap-1">
            <IconButton variant="ghost" aria-label="Notifications">
                <Icon icon={icons.notification} />
            </IconButton>
            <Avatar name="Camille Roux" size="sm" />
        </div>
    </Topbar>
    <div class="h-24 bg-fc-surface-hover"></div>
</div>
