<script lang="ts">
    import {
        BlockReveal,
        Card,
        Page,
        PageHeader,
        Section,
        Stack,
        Switch,
        TextElevate
    } from '@facile/muse';

    let heading = $state(true);
    let sweeping = $state(true);

    const manifesto = ['Un seul login,', 'zéro dépendance cloud.'];
</script>

<Page>
    <PageHeader
        title="Motion"
        description="Le palier animé. Tout ici honore prefers-reduced-motion et annule ses tweens au démontage."
    />

    <Section
        title="TextElevate"
        description="Une ligne qui monte en place. Utilisée pour le titre du rail et chaque libellé de nav, ce qui explique qu'elle se plafonne à la largeur du parent au lieu de s'ajuster à son texte."
    >
        <Card class="flex min-h-24 items-center">
            <TextElevate
                text="Un seul login, zéro dépendance cloud."
                visible={heading}
                class="text-fc-subtitle font-semibold text-fc-ink"
            />
        </Card>
        <Switch bind:checked={heading} label="Afficher la ligne" class="text-fc-p" />
    </Section>

    <Section
        title="BlockReveal"
        description="Un panneau plein balaie la copie et ne la découvre qu'avec son bord de fuite. Une ligne par panneau : un paragraphe qui se replie arriverait d'un seul bloc."
    >
        <Card class="flex min-h-32 items-center">
            <Stack>
                {#each manifesto as line, i (line)}
                    <BlockReveal
                        open={sweeping}
                        delay={i * 0.12}
                        class="text-fc-subtitle font-semibold text-fc-ink"
                    >
                        {line}
                    </BlockReveal>
                {/each}
            </Stack>
        </Card>
        <Switch bind:checked={sweeping} label="Balayer les lignes" class="text-fc-p" />
    </Section>

    <Section
        title="PageTransition"
        description="Vous la regardez déjà : chaque changement de route passe par elle, cadencée sur la route depuis la coquille."
    >
        <Card>
            <Stack>
                <p class="text-fc-p text-fc-muted">
                    Entrée seule, jamais un fondu croisé. Un vrai croisement demanderait de monter
                    les deux routes en même temps, donc de tenir deux fois l'état de la page.
                </p>
                <p class="text-fc-p text-fc-muted">
                    Le palier tenait aussi <code class="font-fc-mono text-fc-subtext">Carousel</code>,
                    <code class="font-fc-mono text-fc-subtext">Mosaique</code>,
                    <code class="font-fc-mono text-fc-subtext">Rideau</code> et
                    <code class="font-fc-mono text-fc-subtext">WordReveal</code>. Les trois premiers
                    n'avaient aucun consommateur dans la suite ; le dernier servait une seule
                    landing page et tirait à lui seul les deux plugins GSAP de la bibliothèque.
                    Partis en v1.0.
                </p>
            </Stack>
        </Card>
    </Section>
</Page>
