<script lang="ts">
    import { SideBar, icons } from '@facile/muse';

    const pages = [
        { label: 'Tableau de bord', href: '/', icon: icons.dashboard, active: true },
        { label: 'Projets', href: '/projets', icon: icons.folder },
        { label: 'Pointage', href: '/pointage', icon: icons.clock },
        { label: 'Équipe', href: '/equipe', icon: icons.usersGroup },
        { label: 'Réglages', href: '/reglages', icon: icons.settings }
    ];
</script>

<div class="h-[420px] overflow-hidden rounded-fc-md border border-fc-border">
    <SideBar
        class="h-full"
        title="Sablier"
        icon={icons.clock}
        {pages}
        user={{ name: 'Camille Roux' }}
        userHref="/profil"
    />
</div>
