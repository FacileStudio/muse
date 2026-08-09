<script lang="ts">
    import { Divider, icons, Stack, Tabs } from '@facile/muse';

    const section = 'apparence';
</script>

<Stack gap="content">
    <Tabs
        value={section}
        items={[
            { id: 'profil', label: 'Profil', icon: icons.userCircle, href: '#' },
            { id: 'apparence', label: 'Apparence', icon: icons.palette, href: '#' },
            { id: 'pool', label: 'Pool', icon: icons.plug, href: '#' },
            { id: 'avance', label: 'Avancé', icon: icons.settings, href: '#' }
        ]}
    />
    <Divider />
</Stack>
