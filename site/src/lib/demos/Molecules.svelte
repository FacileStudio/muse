<script lang="ts">
    import {
        Breadcrumb, Button, ColorPicker, Dropzone, EmptyState, Field, Input, Menu, NavButton, OptionCards,
        Pagination,
        SecretField, SettingsRow, SettingsSection, SpaceSwitcher, StatCard, SwatchPicker,
        Switch, Tabs, icons, toast
    } from '@facile/muse';
    import Row from './Row.svelte';

    let email = $state('');
    let page = $state(4);
    let view = $state('board');
    let section = $state('profil');
    let colour = $state('#6366f1');
    let swatch = $state('violet');
    let space = $state<string | null>('acme');
    const spaces = [
        { id: 'acme', name: 'Acme' },
        { id: 'studio', name: 'Studio' }
    ];
</script>

<Row name="Field" lead="Rend un vrai <label for>, et les contrôles muse adoptent son id par contexte.">
    <div class="w-full max-w-sm">
        <Field label="Adresse e-mail" helper="Utilisée pour l'invitation.">
            {#snippet children()}
                <Input bind:value={email} type="email" placeholder="nom@studio.com" />
            {/snippet}
        </Field>
    </div>
</Row>

<Row name="Tabs" lead="Pastille inversée qui glisse. Avec des href, l'URL est la source de vérité.">
    <Tabs
        items={[
            { id: 'profil', label: 'Profil', icon: icons.userCircle },
            { id: 'api', label: 'API', icon: icons.key },
            { id: 'membres', label: 'Membres', icon: icons.usersGroup }
        ]}
        bind:value={section}
        label="Sections de démonstration"
    />
</Row>

<Row name="OptionCards" lead="Le contrôle « un parmi N » : thème, mode d'affichage, base de facturation.">
    <OptionCards
        options={[
            { value: 'board', label: 'Tableau', icon: icons.dashboard },
            { value: 'list', label: 'Liste', icon: icons.folder },
            { value: 'cal', label: 'Calendrier', icon: icons.calendar }
        ]}
        bind:value={view}
        label="Mode d'affichage"
    />
</Row>

<Row name="StatCard" lead="Un chiffre et son libellé. La gouttière entre eux ne descend jamais sous le padding.">
    <div class="grid w-full gap-4 sm:grid-cols-3">
        <StatCard label="Projets actifs" value="12" />
        <StatCard label="Heures ce mois" value="148,5" />
        <StatCard label="Membres" value="7" />
    </div>
</Row>

<Row name="SecretField" lead="Masque à longueur fixe, révélation qui se recache, copie avec accusé.">
    <div class="w-full max-w-md">
        <SecretField label="Clé d'API" value="fc_rw_9f3c2ab1d4e5f6a7" />
    </div>
</Row>

<Row name="SettingsSection · SettingsRow" lead="La forme standard d'une page de réglages, dans toute la suite.">
    <div class="w-full">
        <SettingsSection title="Notifications" description="Ce qui arrive dans votre boîte.">
            <SettingsRow label="Résumé hebdomadaire" description="Chaque lundi matin.">
                <Switch checked aria-label="Résumé hebdomadaire" />
            </SettingsRow>
            <SettingsRow label="Mentions" description="Quand quelqu'un vous cite.">
                <Switch aria-label="Mentions" />
            </SettingsRow>
        </SettingsSection>
    </div>
</Row>

<Row name="SwatchPicker · ColorPicker" lead="Choisir dans une palette fixe, ou choisir n'importe quelle couleur.">
    <SwatchPicker bind:value={swatch} />
    <ColorPicker bind:value={colour} />
</Row>

<Row name="Breadcrumb · Pagination · Menu" lead="Navigation dans une arborescence, dans une liste, et un menu d'actions.">
    <div class="flex w-full flex-col gap-3">
        <Breadcrumb items={[{ label: 'Fichiers', href: '#' }, { label: 'Clients', href: '#' }, { label: 'Contrat' }]} />
        <Pagination bind:page pageCount={18} />
        <Menu
            label="Compte"
            items={[
                { label: 'Réglages', href: '#', icon: icons.settings },
                { separator: true },
                { label: 'Se déconnecter', onselect: () => toast.info('Déconnecté'), icon: icons.logout, tone: 'danger' }
            ]}
        />
    </div>
</Row>

<Row name="SpaceSwitcher" lead="Le sélecteur d'espace du rail. Se retourne quand il manque de place sous lui.">
    <div class="w-full max-w-xs">
        <SpaceSwitcher {spaces} activeId={space} onSelect={(id: string | null) => (space = id)} />
    </div>
</Row>

<Row name="NavButton" lead="Une ligne de navigation. Se réduit à un carré de 44px dans le rail replié.">
    <div class="w-full max-w-xs">
        <NavButton href="#" icon={icons.dashboard} label="Tableau de bord" active />
        <NavButton href="#" icon={icons.folder} label="Projets" />
    </div>
</Row>

<Row name="EmptyState" lead="Une liste vide est un EmptyState, jamais un paragraphe. La hauteur est le sujet.">
    <div class="w-full">
        <EmptyState icon={icons.folder} title="Aucun projet" description="Créez-en un pour commencer à suivre le temps.">
            <Button icon={icons.plus}>Nouveau projet</Button>
        </EmptyState>
    </div>
</Row>

<Row name="Dropzone" lead="Valide aussi le dépôt, pas seulement le sélecteur — le navigateur ne filtre que le second.">
    <div class="w-full">
        <Dropzone accept="image/*" onFiles={() => toast.success('Fichier accepté')} />
    </div>
</Row>
