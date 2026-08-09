<script lang="ts">
    import {
        Alert, Avatar, Badge, Button, Card, Checkbox, Divider, Icon, IconButton, Input,
        Radio, Select, Skeleton, Spinner, StatusDot, Switch, Textarea, icons
    } from '@facile/muse';
    import Row from './Row.svelte';

    let checked = $state(true);
    let toggled = $state(true);
    let group = $state('b');
    let text = $state('Camille');
</script>

<Row name="Button" lead="Cinq variantes sur un axe d'emphase, trois tailles. `lg` dès qu'il partage une ligne avec un champ.">
    <Button>Primaire</Button>
    <Button variant="outline">Outline</Button>
    <Button variant="ghost">Ghost</Button>
    <Button variant="danger" icon={icons.remove}>Danger</Button>
    <Button variant="ghost-danger">Ghost danger</Button>
    <Button disabled>Désactivé</Button>
    <Button size="sm">sm</Button>
    <Button size="lg" iconRight={icons.arrow}>lg</Button>
</Row>

<Row name="IconButton" lead="Rond, 44px, avec le press de la maison. Toujours un aria-label.">
    <IconButton aria-label="Réglages"><Icon icon={icons.settings} size={18} /></IconButton>
    <IconButton variant="ghost" aria-label="Copier"><Icon icon={icons.copy} size={18} /></IconButton>
    <IconButton variant="danger" aria-label="Supprimer"><Icon icon={icons.remove} size={18} /></IconButton>
</Row>

<Row name="Badge" lead="Le vocabulaire de tons, en huit valeurs. Se dimensionne sur son texte, jamais sur sa colonne.">
    <Badge>neutral</Badge>
    <Badge tone="accent">accent</Badge>
    <Badge tone="info">info</Badge>
    <Badge tone="success">success</Badge>
    <Badge tone="warning">warning</Badge>
    <Badge tone="danger">danger</Badge>
    <Badge tone="owner">owner</Badge>
    <Badge tone="admin">admin</Badge>
</Row>

<Row name="Alert" lead="Ce qui reste à l'écran. Un retour qui passe est un toast.">
    <div class="flex w-full flex-col gap-3">
        <Alert tone="info" title="Synchronisation en cours">Trois espaces restants.</Alert>
        <Alert tone="warning" title="Jeton bientôt expiré">Renouvelez-le avant le 3 septembre.</Alert>
        <Alert tone="danger" title="Échec de l'envoi">Le serveur a refusé le fichier.</Alert>
    </div>
</Row>

<Row name="Input · Textarea · Select" lead="Tous en h-11. Dans un Field ils adoptent son id.">
    <div class="grid w-full gap-3 sm:grid-cols-3">
        <Input bind:value={text} placeholder="Nom" aria-label="Nom" />
        <Select aria-label="Rôle">
            <option>Membre</option>
            <option>Admin</option>
        </Select>
        <Textarea rows={2} placeholder="Notes" aria-label="Notes" />
    </div>
</Row>

<Row name="Checkbox · Radio · Switch" lead="Les trois contrôles qui s'enveloppent dans leur propre label.">
    <Checkbox bind:checked label="M'envoyer un résumé" />
    <Radio bind:group value="a" label="Mensuel" />
    <Radio bind:group value="b" label="Hebdomadaire" />
    <Switch bind:checked={toggled} label="Notifications" />
</Row>

<Row name="Avatar" lead="Retombe sur l'initiale quand l'image échoue — pas sur son alt.">
    <Avatar name="Camille" size="sm" />
    <Avatar name="Yann" />
    <Avatar name="Zoé" size="lg" />
</Row>

<Row name="StatusDot · Spinner · Skeleton" lead="État de connexion, attente courte, forme à remplir.">
    <StatusDot tone="success" label="Connecté" />
    <StatusDot tone="warning" label="Dégradé" />
    <StatusDot tone="danger" label="Hors ligne" />
    <Spinner size="sm" />
    <Spinner />
    <Skeleton class="h-6 w-32" />
</Row>

<Row name="Card · Divider" lead="Surface sans bordure : le remplissage sépare. Le trait ne porte aucune marge.">
    <div class="w-full">
        <Card class="flex flex-col gap-4">
            <span class="text-fc-sm text-fc-fg">Au-dessus du trait</span>
            <Divider />
            <span class="text-fc-sm text-fc-fg-muted">En dessous</span>
        </Card>
    </div>
</Row>

<Row name="Icon" lead="SVG inline, rendu côté serveur, sans requête réseau.">
    {#each ['dashboard', 'folder', 'usersGroup', 'settings', 'key', 'bolt', 'clock', 'shield'] as key (key)}
        <Icon icon={icons[key as keyof typeof icons]} size={22} class="text-fc-fg" />
    {/each}
</Row>
