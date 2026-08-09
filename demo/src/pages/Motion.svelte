<script lang="ts">
    import { Card, Page, PageHeader, Section, Stack, Switch, TextElevate } from '@facile/muse';

    let heading = $state(true);
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
                class="text-fc-xl font-semibold text-fc-fg"
            />
        </Card>
        <Switch bind:checked={heading} label="Afficher la ligne" class="text-fc-sm" />
    </Section>

    <Section
        title="PageTransition"
        description="Vous la regardez déjà : chaque changement de route passe par elle, cadencée sur la route depuis la coquille."
    >
        <Card>
            <Stack gap="bound">
                <p class="text-fc-sm text-fc-fg-muted">
                    Entrée seule, jamais un fondu croisé. Un vrai croisement demanderait de monter
                    les deux routes en même temps, donc de tenir deux fois l'état de la page.
                </p>
                <p class="text-fc-sm text-fc-fg-muted">
                    Le palier tenait aussi <code class="font-fc-mono text-fc-xs">Carousel</code>,
                    <code class="font-fc-mono text-fc-xs">Mosaique</code>,
                    <code class="font-fc-mono text-fc-xs">Rideau</code> et
                    <code class="font-fc-mono text-fc-xs">WordReveal</code>. Les trois premiers
                    n'avaient aucun consommateur dans la suite ; le dernier servait une seule
                    landing page et tirait à lui seul les deux plugins GSAP de la bibliothèque.
                    Partis en v1.0.
                </p>
            </Stack>
        </Card>
    </Section>
</Page>
