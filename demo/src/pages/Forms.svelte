<script lang="ts">
    import {
        Breadcrumb, Button, Card, Checkbox, ColorPicker, Dropzone, Field, Input, Menu, Modal, Page, PageHeader,
        Pagination, Progress, Radio, SecretField, Section, Select, Stack, Switch, Textarea, icons, toast
    } from '@facile/muse';

    let name = $state('');
    let note = $state('');
    let role = $state('membre');
    let plan = $state('');
    let zone = $state('paris');
    let checked = $state(true);
    let group = $state('b');
    let toggled = $state(true);
    let page = $state(3);
    let submitted = $state('');
    let open = $state(false);
    let colour = $state('#6366f1');
</script>

<Page>
    <PageHeader title="Formulaires" description="Des aplats sans bordure : champs, listes, cases, interrupteurs, et leurs états." />

    <Section title="Champs" description="Un aplat léger, une marche au-dessus de la surface. Le libellé, le placeholder et l'anneau de focus identifient le champ.">
        <Card>
            <Stack>
                <Field label="Nom" helper="Visible par votre équipe.">
                    <Input bind:value={name} placeholder="Camille Durand" />
                </Field>
                <Field label="Courriel" error="Adresse invalide.">
                    <Input value="camille@" />
                </Field>
                <Field label="Notes">
                    <Textarea bind:value={note} placeholder="Notes libres" />
                </Field>
                <Input disabled value="Désactivé" aria-label="Désactivé" />
                <SecretField label="Jeton" value="sk_live_abcdef123456" copyable />
                <ColorPicker bind:value={colour} />
            </Stack>
        </Card>
    </Section>

    <Section title="Select" description="Une liste à nous : combobox + listbox, clavier complet, jamais la liste du système.">
        <Card>
            <form
                onsubmit={(event) => {
                    event.preventDefault();
                    submitted = JSON.stringify(Object.fromEntries(new FormData(event.currentTarget)));
                }}
            >
                <Stack>
                    <Field label="Rôle">
                        <Select name="role" bind:value={role}>
                            <option value="membre">Membre</option>
                            <option value="admin">Admin</option>
                            <option value="proprio" disabled>Propriétaire</option>
                        </Select>
                    </Field>
                    <Field label="Plan" error={plan === '' ? 'Choisissez un plan.' : undefined}>
                        <Select
                            name="plan"
                            bind:value={plan}
                            placeholder="Choisir un plan"
                            options={[
                                { value: 'free', label: 'Gratuit' },
                                { value: 'pro', label: 'Pro' },
                                { value: 'team', label: 'Équipe' }
                            ]}
                        />
                    </Field>
                    <Field label="Fuseau">
                        <Select name="zone" bind:value={zone}>
                            <optgroup label="Europe">
                                <option value="paris">Paris</option>
                                <option value="berlin">Berlin</option>
                            </optgroup>
                            <optgroup label="Amériques">
                                <option value="montreal">Montréal</option>
                                <option value="lima">Lima</option>
                            </optgroup>
                        </Select>
                    </Field>
                    <Select disabled value="b" aria-label="Désactivé" options={[{ value: 'b', label: 'Désactivé' }]} />
                    <Select
                        class="h-9 w-36 text-fc-sm"
                        aria-label="Compact"
                        value="a"
                        options={[{ value: 'a', label: 'Compact' }, { value: 'b', label: 'Autre' }]}
                    />
                    <Button type="button" variant="outline" class="self-start" onclick={() => (document.querySelector<HTMLSelectElement>('select[name=role]')!.value = 'admin')}>Écrire le select natif</Button>
                    <Button type="submit" class="self-start">Envoyer</Button>
                    <output data-testid="submitted" class="font-fc-mono text-fc-xs text-fc-fg-muted">{submitted}</output>
                    <Button type="button" variant="outline" class="self-start" onclick={() => (open = true)}>Dans une modale</Button>
                </Stack>
            </form>
        </Card>
    </Section>

    <Section title="Cases, radios, interrupteurs">
        <Card>
            <Stack>
                <Checkbox bind:checked label="Résumé hebdomadaire" />
                <Checkbox label="Désactivée" disabled />
                <Radio bind:group value="a" label="Mensuel" />
                <Radio bind:group value="b" label="Annuel" />
                <Switch bind:checked={toggled} label="Notifications" />
                <Switch label="Désactivé" disabled />
                <Dropzone label="Déposez vos fichiers" />
            </Stack>
        </Card>
    </Section>

    <Section title="Navigation et retour">
        <Card>
            <Stack>
                <Breadcrumb items={[{ label: 'Fichiers', href: '#/forms' }, { label: 'Clients', href: '#/forms' }, { label: 'Contrat' }]} />
                <Pagination bind:page pageCount={18} />
                <Progress value={64} label="Stockage" />
                <Progress label="Sync" />
                <Menu
                    label="Compte"
                    items={[
                        { label: 'Réglages', href: '#/settings', icon: icons.settings },
                        { label: 'Notifications', onselect: () => toast.info('Notifications'), icon: icons.notification },
                        { separator: true },
                        { label: 'Se déconnecter', onselect: () => toast.info('Au revoir'), icon: icons.logout, tone: 'danger' }
                    ]}
                />
            </Stack>
        </Card>
    </Section>
</Page>

<Modal bind:open title="Select dans une modale">
    <Field label="Rôle">
        <Select bind:value={role} options={[{ value: 'membre', label: 'Membre' }, { value: 'admin', label: 'Admin' }]} />
    </Field>
</Modal>
