<script lang="ts">
    import { Button, Checkbox, Divider, Field, Inline, Input, Page, PageHeader, Section, Select, Stack, Textarea } from '@facile/muse';

    let nom = $state('Refonte Heranova');
    let client = $state('heranova');
    let budget = $state('');
    let brief = $state('');
    let facturable = $state(true);
</script>

<Page width="md">
    <PageHeader
        back={{ href: '/projets', label: 'Projets' }}
        title="Nouveau projet"
        description="Il pourra être modifié à tout moment."
    />

    <Section title="Identité" description="Ce que l'équipe verra dans la liste.">
        <Stack gap="content">
            <Field label="Nom du projet" helper="Visible par tous les membres de l'espace.">
                <Input bind:value={nom} placeholder="Refonte du site vitrine" />
            </Field>

            <Field label="Client">
                <Select bind:value={client}>
                    <option value="heranova">Heranova</option>
                    <option value="lpb">LPB</option>
                    <option value="gf">GF Conseil</option>
                </Select>
            </Field>

            <Field label="Brief" helper="Deux ou trois phrases suffisent.">
                <Textarea bind:value={brief} rows={4} placeholder="Ce que le projet doit livrer…" />
            </Field>
        </Stack>
    </Section>

    <Section title="Facturation">
        <Stack gap="content">
            <Field
                label="Budget estimé"
                error={budget !== '' && Number.isNaN(Number(budget)) ? 'Saisissez un montant en euros.' : undefined}
            >
                <Input bind:value={budget} inputmode="decimal" placeholder="12 000" />
            </Field>

            <Checkbox bind:checked={facturable} label="Le temps pointé sur ce projet est facturable" />
        </Stack>
    </Section>

    <Stack gap="content">
        <Divider />
        <Inline gap="tight" class="justify-end">
            <Button variant="ghost" size="lg">Annuler</Button>
            <Button type="submit" size="lg">Créer le projet</Button>
        </Inline>
    </Stack>
</Page>
