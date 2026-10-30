<!-- This page holds no reactive state, so without an explicit opt-in svelte2tsx types it as a
     legacy component — and a legacy signature does not fit the router's
     `Record<string, typeof Dashboard>` map, which fails on the bindings type rather than on
     anything visible. Every other page happens to call `$state` and is inferred as runes. -->
<svelte:options runes={true} />

<script lang="ts">
    import {
        Button,
        Card,
        Divider,
        Inline,
        Page,
        PageHeader,
        Section,
        Stack,
        icons
    } from '@facile/muse';
    import Verdict from '../components/Verdict.svelte';

    /*
     * The reference page for spacing. It exists because the rhythm was prose in CHARTE §4 and
     * prose is what an agent skips: thirteen apps retyped the ladder by hand and drifted, and
     * the one component that carried its own margin taught every call site to cancel it.
     *
     * Every "wrong" panel below renders the real defect rather than describing it. A screenshot
     * would rot the first time a token moves; markup cannot.
     */
</script>

<Page width="xl">
    <PageHeader
        title="Rythme"
        description="L’espacement n’est pas un réglage par page. Un seul écart, 4px, entre deux éléments quels qu’ils soient, et une règle : un composant possède son padding, jamais sa marge."
    />

    <Section
        title="Le séparateur soudé"
        description="Le défaut le plus reproduit de la suite. À gauche ce que produit un flux de blocs sans conteneur ; à droite le même balisage dans un Stack."
    >
        <div class="grid gap-1 lg:grid-cols-2">
            <Card class="flex flex-col gap-1">
                <Verdict label='Aucun parent ne possède l’espace' />
                <div class="rounded-fc bg-fc-surface-hover p-4">
                    <h3 class="text-fc-lead font-semibold text-fc-ink">Zone de danger</h3>
                    <p class="text-fc-p text-fc-muted">Supprimer cet espace est définitif.</p>
                    <Divider />
                    <Button variant="danger" size="sm">Supprimer l’espace</Button>
                </div>
            </Card>

            <Card class="flex flex-col gap-1">
                <Verdict ok label='Stack' />
                <div class="rounded-fc bg-fc-surface-hover p-4">
                    <Stack>
                        <Stack>
                            <h3 class="text-fc-lead font-semibold text-fc-ink">Zone de danger</h3>
                            <p class="text-fc-p text-fc-muted">Supprimer cet espace est définitif.</p>
                        </Stack>
                        <Divider />
                        <Button variant="danger" size="sm" class="w-fit">Supprimer l’espace</Button>
                    </Stack>
                </div>
            </Card>
        </div>
        <p class="text-fc-p text-fc-muted">
            Le titre et sa description sont liés par <code class="font-fc-mono text-fc-subtext">bound</code>,
            pas par le gap de la section : ce sont deux morceaux d’une même chose, pas deux frères.
        </p>
    </Section>

    <Section
        title="La gouttière et le padding"
        description="Une gouttière ne peut jamais être plus serrée que le padding des cartes qu’elle sépare, sinon trois cartes lisent comme un seul panneau à coutures."
    >
        <Stack>
            <Verdict label='gap-1 (12px) entre des cartes en p-5 (20px)' />
            <div class="grid grid-cols-3 gap-1">
                {#each ['Actives', 'En pause', 'Archivées'] as label (label)}
                    <Card class="flex flex-col gap-1">
                        <span class="text-fc-subtext text-fc-muted">{label}</span>
                        <span class="text-fc-subtitle font-semibold text-fc-ink">12</span>
                    </Card>
                {/each}
            </div>

            <Verdict ok label='gap-1 (16px) — content' />
            <div class="grid grid-cols-3 gap-1">
                {#each ['Actives', 'En pause', 'Archivées'] as label (label)}
                    <Card class="flex flex-col gap-1">
                        <span class="text-fc-subtext text-fc-muted">{label}</span>
                        <span class="text-fc-subtitle font-semibold text-fc-ink">12</span>
                    </Card>
                {/each}
            </div>
        </Stack>
    </Section>

    <Section
        title="Ce que Page possède"
        description="Le centrage, la largeur maximale, le padding extérieur et le rythme entre les sections. La suite avait huit réponses différentes à ces quatre questions."
    >
        <Card class="flex flex-col gap-1">
            <Inline>
                <iconify-icon icon={icons.check} width="18" height="18" class="block text-fc-success"
                ></iconify-icon>
                <code class="font-fc-mono text-fc-subtext text-fc-ink">
                    mx-auto flex w-full flex-col px-4 py-8 sm:px-6 md:px-10 md:py-10
                </code>
            </Inline>
            <Divider />
            <Stack>
                <p class="text-fc-p text-fc-muted">
                    <code class="font-fc-mono text-fc-subtext">width</code> choisit le conteneur —
                    <code class="font-fc-mono text-fc-subtext">lg</code> (960px) pour une page de lecture,
                    <code class="font-fc-mono text-fc-subtext">xl</code> (1200px) pour un tableau de bord.
                </p>
                <p class="text-fc-p text-fc-muted">
                    La coquille de l’app ne possède plus la colonne : elle garde le rail, la nav
                    mobile et l’unique conteneur de défilement. Tout ce qui est en deçà du bord du
                    contenu appartient à <code class="font-fc-mono text-fc-subtext">Page</code>.
                </p>
            </Stack>
        </Card>
    </Section>
</Page>
