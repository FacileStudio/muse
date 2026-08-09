<script lang="ts">
    import { Badge, Card, Inline, Section, Stack } from '@facile/muse';
    import docs from '$lib/generated/components.json';

    /* Grouped in the order a page is built, not alphabetically across tiers: layout first,
       because that is the decision that comes first. */
    const ORDER = ['Mise en page', 'Atomes', 'Molécules', 'Organismes', 'Graphiques', 'Motion'];
    const groups = $derived(
        ORDER.map((tier) => ({ tier, items: docs.filter((d) => d.tier === tier) })).filter(
            (g) => g.items.length > 0
        )
    );

    let query = $state('');
    const needle = $derived(query.trim().toLowerCase());
    const shown = $derived(
        groups
            .map((g) => ({
                ...g,
                items: g.items.filter(
                    (d) =>
                        !needle ||
                        d.name.toLowerCase().includes(needle) ||
                        (d.lead ?? '').toLowerCase().includes(needle)
                )
            }))
            .filter((g) => g.items.length > 0)
    );
</script>

<svelte:head><title>Composants — muse</title></svelte:head>

<Stack gap="bound">
    <h1 class="text-fc-2xl font-semibold text-fc-fg">Composants</h1>
    <p class="text-fc-sm text-fc-fg-muted">
        {docs.length} composants, lus depuis le barrel de la bibliothèque au moment du build. Les
        props viennent des interfaces <code class="font-fc-mono text-fc-xs">Props</code> exportées,
        pas d'une liste recopiée — le README de muse a affiché trois décomptes différents en même
        temps pour avoir voulu faire autrement.
    </p>
</Stack>

<label class="flex flex-col gap-1">
    <span class="text-fc-sm text-fc-fg">Filtrer</span>
    <input
        bind:value={query}
        type="search"
        placeholder="Stack, secret, graphique…"
        class="h-11 w-full max-w-sm rounded-fc-md border border-fc-border bg-fc-bg px-3 text-fc-md text-fc-fg placeholder:text-fc-fg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fc-ring"
    />
</label>

{#each shown as group (group.tier)}
    <Section title={group.tier}>
        <div class="grid gap-4 lg:grid-cols-2">
            {#each group.items as c (c.name)}
                <Card class="flex flex-col gap-3">
                    <Inline gap="tight">
                        <code class="font-fc-mono text-fc-sm font-semibold text-fc-fg">{c.name}</code>
                        <Badge tone="neutral">{c.props.length} props</Badge>
                    </Inline>

                    {#if c.lead}
                        <p class="text-fc-sm text-fc-fg-muted">{c.lead}</p>
                    {/if}

                    {#if c.extends.length}
                        <p class="text-fc-xs text-fc-fg-muted">
                            étend <code class="font-fc-mono text-fc-xs">{c.extends.join(', ')}</code>
                        </p>
                    {/if}

                    {#if c.props.length}
                        <details class="group">
                            <summary
                                class="cursor-pointer rounded-fc-sm text-fc-xs text-fc-fg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fc-ring"
                            >
                                Voir les props
                            </summary>
                            <div class="mt-3 overflow-x-auto">
                                <table class="w-full text-fc-xs">
                                    <thead>
                                        <tr class="border-b border-fc-border">
                                            <th class="py-1.5 pr-3 text-left font-semibold text-fc-fg">Prop</th>
                                            <th class="py-1.5 pr-3 text-left font-semibold text-fc-fg">Type</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {#each c.props as p (p.name)}
                                            <tr class="border-b border-fc-border/60 align-top">
                                                <td class="py-1.5 pr-3 whitespace-nowrap">
                                                    <code class="font-fc-mono text-fc-fg">{p.name}</code>
                                                    {#if !p.optional}<span class="text-fc-danger">*</span>{/if}
                                                    {#if p.doc}
                                                        <span class="block pt-0.5 font-sans text-fc-fg-muted"
                                                            >{p.doc}</span
                                                        >
                                                    {/if}
                                                </td>
                                                <td class="py-1.5 pr-3">
                                                    <code class="font-fc-mono text-fc-fg-muted">{p.type}</code>
                                                </td>
                                            </tr>
                                        {/each}
                                    </tbody>
                                </table>
                            </div>
                        </details>
                    {/if}
                </Card>
            {/each}
        </div>
    </Section>
{:else}
    <p class="text-fc-sm text-fc-fg-muted">Aucun composant ne correspond à « {query} ».</p>
{/each}
