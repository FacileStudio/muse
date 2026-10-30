<script lang="ts">
    import { Button, SideBar, icons } from '@facile/muse';

    let collapsed = $state(true);

    const pages = [
        { label: 'Fichiers', href: '/fichiers', icon: icons.folder, active: true, group: 'Stockage' },
        { label: 'Envois', href: '/envois', icon: icons.upload, group: 'Stockage' },
        { label: 'Partages', href: '/partages', icon: icons.usersGroup, group: 'Équipe' },
        { label: 'Activité', href: '/activite', icon: icons.history, group: 'Équipe' }
    ];
</script>

<div class="flex h-[420px] gap-1">
    <div class="overflow-hidden rounded-fc border border-fc-border">
        <SideBar class="h-full" title="Nuage" icon={icons.server} {pages} bind:collapsed showSearch />
    </div>
    <Button variant="outline" size="sm" icon={icons.collapse} onclick={() => (collapsed = !collapsed)}>
        {collapsed ? 'Déplier le rail' : 'Replier le rail'}
    </Button>
</div>
