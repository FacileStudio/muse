<script lang="ts">
    import { Divider, icons, Stack, Tabs } from '@facile/muse';

    const section = 'apparence';
</script>

<Stack gap="content">
    <Tabs
        value={section}
        items={[
            { id: 'profil', label: 'Profil', icon: icons.userCircle, href: '#profil' },
            { id: 'apparence', label: 'Apparence', icon: icons.palette, href: '#apparence' },
            { id: 'pool', label: 'Pool', icon: icons.plug, href: '#pool' },
            { id: 'avance', label: 'Avancé', icon: icons.settings, href: '#avance' }
        ]}
    />
    <Divider />
</Stack>
