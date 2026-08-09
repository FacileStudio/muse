<script lang="ts">
    import { icons, Tabs } from '@facile/muse';

    let section = $state('membres');
</script>

<Tabs
    bind:value={section}
    label="Espace Heranova"
    items={[
        { id: 'membres', label: 'Membres', icon: icons.usersGroup, badge: 12 },
        { id: 'invitations', label: 'Invitations', icon: icons.mail, badge: 3 },
        { id: 'api', label: 'API', icon: icons.key },
        { id: 'facturation', label: 'Facturation', icon: icons.card, disabled: true }
    ]}
/>
