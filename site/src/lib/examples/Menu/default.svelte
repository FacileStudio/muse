<script lang="ts">
    import { Menu, icons } from '@facile/muse';
</script>

<Menu
    label="Compte"
    items={[
        { label: 'Réglages', href: '/reglages', icon: icons.settings },
        { label: 'Notifications', onselect: () => {}, icon: icons.notification },
        { separator: true },
        { label: 'Se déconnecter', onselect: () => {}, icon: icons.logout, tone: 'danger' }
    ]}
/>
