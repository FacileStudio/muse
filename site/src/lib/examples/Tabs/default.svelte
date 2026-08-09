<script lang="ts">
    import { Tabs } from '@facile/muse';

    let section = $state('profil');
</script>

<Tabs
    bind:value={section}
    label="Réglages"
    items={[
        { id: 'profil', label: 'Profil' },
        { id: 'apparence', label: 'Apparence' },
        { id: 'notifications', label: 'Notifications' },
        { id: 'avance', label: 'Avancé' }
    ]}
/>
