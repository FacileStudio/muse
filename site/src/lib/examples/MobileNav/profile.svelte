<script lang="ts">
    import { MobileNav, icons } from '@facile/muse';

    const items = [
        { href: '/', label: 'Tableau de bord', icon: icons.dashboard },
        { href: '/fichiers', label: 'Fichiers', icon: icons.folder },
        { href: '/partages', label: 'Partages', icon: icons.usersGroup, active: true },
        { href: '/activite', label: 'Activité', icon: icons.history },
        { href: '/reglages', label: 'Réglages', icon: icons.settings }
    ];
</script>

<div class="flex w-full justify-center py-4">
    <MobileNav
        class="static md:flex"
        {items}
        user={{ name: 'Camille Roux' }}
        profileHref="/profil"
    />
</div>
