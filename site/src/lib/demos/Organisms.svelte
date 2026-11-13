<script lang="ts">
    import {
        Button, ConfirmModal, ConnectionHint, Drawer, Modal, Presence, ProfileCard, Table, Topbar, toast
    } from '@facile/muse';
    import Row from './Row.svelte';

    let modal = $state(false);
    let drawer = $state(false);
    let confirm = $state(false);
    let following = $state<string | number | null>(null);
    const peers = [
        { id: 1, name: 'Léa Martin', color: '#AD9EF0' },
        { id: 2, name: 'Marc Dubois', color: '#EE7E89' },
        { id: 3, name: 'Inès Haddad', color: '#7EEEDB' },
        { id: 4, name: 'Paul Girard', color: '#EEB47E' },
        { id: 5, name: 'Zoé Laurent', color: '#A9EE7E' }
    ];
</script>

<Row name="Presence · ConnectionHint" lead="Qui d'autre est sur le document, et l'état du lien temps réel. Les deux s'effacent quand il n'y a rien à dire.">
    <ConnectionHint state="offline" />
    <Presence {peers} {following} onfollow={(id) => (following = id)} />
</Row>

<Row name="Modal · Drawer · ConfirmModal" lead="Un <dialog> natif : le navigateur les met dans sa couche supérieure, au-dessus de tout z-index.">
    <Button variant="secondary" onclick={() => (modal = true)}>Ouvrir une modale</Button>
    <Button variant="secondary" onclick={() => (drawer = true)}>Ouvrir un tiroir</Button>
    <Button variant="danger" onclick={() => (confirm = true)}>Confirmer une suppression</Button>
</Row>

<Modal bind:open={modal} title="Renommer l'espace" showClose>
    <p class="text-fc-sm text-fc-fg-muted">Le nom est visible par tous les membres.</p>
</Modal>

<Drawer bind:open={drawer} title="Filtres">
    <p class="text-fc-sm text-fc-fg-muted">Une feuille du bas, qui se referme au glissement.</p>
</Drawer>

<ConfirmModal
    bind:open={confirm}
    tone="danger"
    title="Supprimer cet espace ?"
    description="Les projets qu'il contient partent avec lui. C'est définitif."
    confirmLabel="Supprimer"
    onConfirm={async () => {
        await new Promise((r) => setTimeout(r, 700));
        toast.success('Espace supprimé');
    }}
/>

<Row name="Table" lead="Surface de données. Le tri et la sélection appartiennent encore au consommateur.">
    <div class="w-full">
        <Table>
            <thead>
                <tr>
                    <th class="px-4 py-2 text-left text-fc-sm font-semibold text-fc-fg">Projet</th>
                    <th class="px-4 py-2 text-left text-fc-sm font-semibold text-fc-fg">Heures</th>
                </tr>
            </thead>
            <tbody>
                {#each [['Refonte du site', '42,5'], ['Application mobile', '18,0']] as [name, hours] (name)}
                    <tr>
                        <td class="px-4 py-2 text-fc-sm text-fc-fg-muted">{name}</td>
                        <td class="px-4 py-2 text-fc-sm text-fc-fg-muted">{hours}</td>
                    </tr>
                {/each}
            </tbody>
        </Table>
    </div>
</Row>

<Row name="ProfileCard" lead="Le bloc d'identité : avatar, nom, et les actions de session.">
    <div class="w-full max-w-sm">
        <ProfileCard name="Camille Roux" email="camille@studio.com" />
    </div>
</Row>

<Row name="Topbar" lead="Chrome collant, utilisé sur mobile là où le rail n'existe pas.">
    <div class="w-full">
        <Topbar><span class="text-fc-md font-semibold text-fc-fg">Facile</span></Topbar>
    </div>
</Row>

<Row name="Toaster" lead="Un retour sans question dedans. Se met en pause au survol, ne peut pas couvrir un <dialog>.">
    <Button variant="secondary" onclick={() => toast.success('Enregistré')}>Succès</Button>
    <Button variant="secondary" onclick={() => toast.danger('Sync échouée')}>Erreur</Button>
    <Button variant="secondary" onclick={() => toast.info('Trois espaces restants')}>Info</Button>
</Row>
