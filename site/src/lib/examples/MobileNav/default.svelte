<script lang="ts">
    import { MobileNav, icons } from '@facile/muse';

    const items = [
        { href: '/', label: 'Accueil', icon: icons.home, active: true },
        { href: '/projets', label: 'Projets', icon: icons.folder },
        { href: '/pointage', label: 'Pointage', icon: icons.clock },
        { href: '/equipe', label: 'Équipe', icon: icons.usersGroup }
    ];
</script>

<div class="flex w-full justify-center py-4">
    <MobileNav class="static md:flex" {items} />
</div>
