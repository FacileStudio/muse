<script lang="ts">
    import {
        Accordion, Button, Card, Checkbox, Collapsible, Combobox, DatePicker, Field, IconButton, InputOtp, Page,
        PageHeader, Popover, RadioGroup, Section, Select, Slider, Stack, Tooltip, Icon, icons, toast
    } from '@facile/muse';

    const cities = ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nantes', 'Strasbourg', 'Lille', 'Bordeaux', 'Évry'].map(
        (label) => ({ value: label.toLowerCase(), label })
    );

    const items = [
        { id: 'a', title: 'Qu’est-ce qu’un espace ?' },
        { id: 'b', title: 'Comment inviter quelqu’un ?' },
        { id: 'c', title: 'Puis-je changer de formule ?' }
    ];

    const pieces = $state([
        { id: 1, label: 'Facture 2026-014', checked: true },
        { id: 2, label: 'Devis Hugo', checked: false },
        { id: 3, label: 'Contrat Acme', checked: true }
    ]);

    const all = $derived(pieces.every((p) => p.checked));
    const some = $derived(pieces.some((p) => p.checked));

    let city = $state('');
    let plan = $state('pro');
    let level = $state(70);
    let span = $state<[number, number]>([20, 80]);
    let threshold = $state(0.75);
    let day = $state('');
    let bounded = $state('2026-11-12');
    let code = $state('');
    let panel = $state(false);
    let open = $state(['a']);
    let expanded = $state(false);

    function toggleAll(checked: boolean) {
        for (const piece of pieces) piece.checked = checked;
    }
</script>

<Page>
    <PageHeader title="Contrôles" description="Les contrôles complets d’une bibliothèque : tous au clavier, sans bordure, en quatre langues." />

    <Section title="Case à cocher indéterminée" description="Le parent d’une sélection partielle : propriété indeterminate native et un tiret.">
        <Card>
            <Stack>
                <Checkbox
                    label="Tout sélectionner"
                    checked={all}
                    indeterminate={some && !all}
                    onchange={(e) => toggleAll(e.currentTarget.checked)}
                />
                {#each pieces as piece (piece.id)}
                    <Checkbox label={piece.label} bind:checked={piece.checked} class="ml-6" />
                {/each}
            </Stack>
        </Card>
    </Section>

    <Section title="Popover" description="Un panneau non modal. Échap le referme, le focus revient au bouton.">
        <Card>
            <Popover label="Filtres" bind:open={panel}>
                <Stack>
                    <Field label="Formule">
                        <Select
                            options={[
                                { value: 'pro', label: 'Pro' },
                                { value: 'team', label: 'Équipe' }
                            ]}
                            value="pro"
                        />
                    </Field>
                    <Button size="sm" onclick={() => (panel = false)}>Appliquer</Button>
                </Stack>
            </Popover>
        </Card>
    </Section>

    <Section title="Tooltip" description="Au survol et au focus clavier. Le bouton garde son nom : l’info-bulle ne le remplace pas.">
        <Card>
            <div class="flex flex-wrap items-center gap-4">
                <Tooltip text="Copier le lien">
                    <IconButton aria-label="Copier le lien"><Icon icon={icons.copy} size={18} /></IconButton>
                </Tooltip>
                <Tooltip text="Supprimer le projet, définitivement">
                    <IconButton variant="ghost-danger" aria-label="Supprimer"><Icon icon={icons.remove} size={18} /></IconButton>
                </Tooltip>
                <Tooltip text="Désactivé" disabled>
                    <Button variant="secondary">Sans info-bulle</Button>
                </Tooltip>
            </div>
        </Card>
    </Section>

    <Section title="RadioGroup" description="Radios natifs : un seul dans l’ordre de tabulation, les flèches déplacent et cochent.">
        <Card>
            <Stack>
                <Field label="Formule" helper="Modifiable à tout moment.">
                    <RadioGroup
                        bind:value={plan}
                        options={[
                            { value: 'free', label: 'Découverte' },
                            { value: 'pro', label: 'Pro' },
                            { value: 'team', label: 'Équipe' },
                            { value: 'old', label: 'Ancienne formule', disabled: true }
                        ]}
                    />
                </Field>
                <RadioGroup
                    aria-label="Densité"
                    orientation="horizontal"
                    value="m"
                    options={[
                        { value: 's', label: 'Compacte' },
                        { value: 'm', label: 'Normale' },
                        { value: 'l', label: 'Large' }
                    ]}
                />
            </Stack>
        </Card>
    </Section>

    <Section title="Slider" description="Une valeur ou deux bornes. Flèches, Pg préc./suiv., Début, Fin ; aria-valuetext lit « 75 % ».">
        <Card>
            <Stack>
                <Field label="Volume">
                    <Slider bind:value={level} valueText={(n) => `${n} %`} />
                </Field>
                <p class="text-fc-sm text-fc-fg-muted">{level} %</p>
                <Field label="Seuil de confiance">
                    <Slider bind:value={threshold} min={0.5} max={1} step={0.05} valueText={(n) => `${Math.round(n * 100)} %`} />
                </Field>
                <Slider range bind:values={span} aria-label="Fourchette" />
                <p class="text-fc-sm text-fc-fg-muted">{span[0]} à {span[1]}</p>
                <Slider value={40} disabled aria-label="Désactivé" />
            </Stack>
        </Card>
    </Section>

    <Section title="Accordion et Collapsible" description="Un seul panneau ouvert, ou plusieurs avec multiple. Flèches haut/bas, Début et Fin entre les en-têtes.">
        <Stack>
            <Accordion {items} bind:open>
                {#snippet panel(item)}
                    <p>Réponse à « {item.title} » : un texte court, lisible, qui explique la chose.</p>
                {/snippet}
            </Accordion>
            <Accordion {items} multiple level={4}>
                {#snippet panel(item)}
                    <p>Ouvert avec plusieurs : {item.id}.</p>
                {/snippet}
            </Accordion>
            <Card>
                <Collapsible title="Options avancées" bind:open={expanded}>
                    <p>Un seul panneau repliable, hors d’un accordéon.</p>
                </Collapsible>
            </Card>
        </Stack>
    </Section>

    <Section title="Combobox" description="Un champ avec suggestions. Le texte reste libre ; la recherche ignore casse et accents.">
        <Card>
            <Stack>
                <Field label="Ville" helper="Essayez « ev » ou « EVRY ».">
                    <Combobox bind:value={city} options={cities} placeholder="Tapez une ville" onSelect={(o) => toast.success(`Choisi : ${o.label}`)} />
                </Field>
                <p class="text-fc-sm text-fc-fg-muted">Texte : « {city} »</p>
            </Stack>
        </Card>
    </Section>

    <Section title="DatePicker" description="La grille suit la langue de l’app (Intl) : jours, mois et premier jour de la semaine. min et max grisent les jours exclus.">
        <Card>
            <Stack>
                <Field label="Échéance" helper="Valeur ISO : {day || '—'}">
                    <DatePicker bind:value={day} name="due" />
                </Field>
                <Field label="Rendez-vous (du 5 au 20 novembre 2026)">
                    <DatePicker bind:value={bounded} min="2026-11-05" max="2026-11-20" />
                </Field>
            </Stack>
        </Card>
    </Section>

    <Section title="InputOtp" description="Un seul vrai champ : le collage d’un code complet et la saisie automatique d’un SMS fonctionnent.">
        <Card>
            <Stack>
                <Field label="Code à six chiffres">
                    <InputOtp bind:value={code} onComplete={(v) => toast.success(`Code ${v}`)} />
                </Field>
                <Field label="Code d’invitation" error="Ce code a expiré.">
                    <InputOtp length={4} kind="alphanumeric" value="A1B" />
                </Field>
            </Stack>
        </Card>
    </Section>
</Page>
