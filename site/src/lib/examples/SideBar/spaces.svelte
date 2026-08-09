<script lang="ts">
    import { SideBar, icons } from '@facile/muse';

    let activeSpaceId = $state<string | null>('heranova');

    const spaces = [
        { id: 'studio', name: 'Studio Facile' },
        { id: 'heranova', name: 'Heranova' },
        { id: 'lpb', name: 'LPB' }
    ];

    const pages = [
        { label: 'Factures', href: '/factures', icon: icons.card, active: true },
        { label: 'Clients', href: '/clients', icon: icons.usersGroup },
        { label: 'Modèles', href: '/modeles', icon: icons.text }
    ];
</script>

<div class="h-[420px] overflow-hidden rounded-fc-md border border-fc-border">
    <SideBar
        class="h-full"
        title="Ardoise"
        icon={icons.card}
        {pages}
        {spaces}
        {activeSpaceId}
        onSpaceSelect={(id) => (activeSpaceId = id)}
        personalSpaceLabel="Espace personnel"
        manageSpacesLabel="Gérer les espaces"
        manageSpacesHref="/espaces"
        user={{ name: 'Camille Roux' }}
    />
</div>
