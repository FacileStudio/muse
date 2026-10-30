<script lang="ts">
    import { Badge, Button, Card, Inline, Section, Stack, Toaster, icons } from '@facile/muse';
    import Example from '$lib/prose/Example.svelte';
    import { examplesFor } from '$lib/examples/registry.js';
    import type { PageProps } from './$types';

    let { data }: PageProps = $props();
    const doc = $derived(data.doc);
    const examples = $derived(examplesFor(doc.name));
</script>

<svelte:head><title>{doc.name} — muse</title></svelte:head>

<Stack>
    <Inline>
        <h1 class="text-fc-title font-semibold text-fc-ink">{doc.name}</h1>
        <Badge tone="neutral">{doc.tier}</Badge>
    </Inline>
    {#if doc.lead}<p class="text-fc-p text-fc-muted">{doc.lead}</p>{/if}
</Stack>

<Inline>
    <Button href="/composants" variant="ghost" size="sm" icon={icons.chevronLeft} class="-ml-3">
        Tous les composants
    </Button>
</Inline>

{#if examples.length}
    <Section title="Exemples">
        {#each examples as ex (ex.id)}
            <Example component={ex.component} source={ex.source} />
        {/each}
    </Section>
{:else}
    <Section title="Exemples">
        <Card>
            <p class="text-fc-p text-fc-muted">
                Pas encore d'exemple dédié pour ce composant — il est rendu dans la galerie de
                <a href="/composants" class="underline underline-offset-2">son palier</a>.
            </p>
        </Card>
    </Section>
{/if}

<Section title="Props">
    {#if doc.extends.length}
        <p class="text-fc-p text-fc-muted">
            Étend <code class="font-fc-mono text-fc-subtext">{doc.extends.join(', ')}</code> — tous les
            attributs natifs passent à travers <code class="font-fc-mono text-fc-subtext">...rest</code>,
            et ne sont pas listés ici.
        </p>
    {/if}

    <Card>
        <div class="overflow-x-auto">
            <table class="w-full text-fc-p">
                <thead>
                    <tr class="border-b border-fc-border">
                        <th class="py-2 pr-4 text-left font-semibold text-fc-ink">Prop</th>
                        <th class="py-2 pr-4 text-left font-semibold text-fc-ink">Type</th>
                    </tr>
                </thead>
                <tbody>
                    {#each doc.props as p (p.name)}
                        <tr class="border-b border-fc-border/60 align-top">
                            <td class="py-2 pr-4 whitespace-nowrap">
                                <code class="font-fc-mono text-fc-subtext text-fc-ink">{p.name}</code>
                                {#if !p.optional}<span class="text-fc-danger" title="Requis">*</span>{/if}
                                {#if p.doc}
                                    <span class="block max-w-xs pt-1 text-fc-subtext text-fc-muted">{p.doc}</span>
                                {/if}
                            </td>
                            <td class="py-2 pr-4">
                                <code class="font-fc-mono text-fc-subtext text-fc-muted">{p.type}</code>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </Card>

    <p class="text-fc-subtext text-fc-muted">
        Importable : <code class="font-fc-mono text-fc-subtext"
            >{`import type { ${doc.name}Props } from '@facile/muse';`}</code
        >
    </p>
</Section>

<Toaster />
