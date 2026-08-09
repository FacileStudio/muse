<script lang="ts">
    import { Badge, Card, Inline, Section, Stack, Toaster } from '@facile/muse';
    import docs from '$lib/generated/components.json';
    import Layout from '$lib/demos/Layout.svelte';
    import Atoms from '$lib/demos/Atoms.svelte';
    import Molecules from '$lib/demos/Molecules.svelte';
    import Organisms from '$lib/demos/Organisms.svelte';
    import Charts from '$lib/demos/Charts.svelte';

    const DEMOS = [
        { tier: 'Mise en page', component: Layout },
        { tier: 'Atomes', component: Atoms },
        { tier: 'Molécules', component: Molecules },
        { tier: 'Organismes', component: Organisms },
        { tier: 'Graphiques', component: Charts }
    ];

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
        Les {docs.length} composants, rendus. Le catalogue est lu depuis le barrel au moment du
        build et les props viennent des interfaces <code class="font-fc-mono text-fc-xs">Props</code>
        exportées — pas d'une liste recopiée, parce que le README de muse a affiché trois décomptes
        différents en même temps pour avoir voulu faire autrement.
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
        {#if !needle}
            {@const Demo = DEMOS.find((d) => d.tier === group.tier)?.component}
            {#if Demo}
                <Stack gap="content">
                    <Demo />
                </Stack>
            {/if}
        {/if}

        <details>
            <summary
                class="inline-flex min-h-11 cursor-pointer items-center rounded-fc-sm text-fc-sm text-fc-fg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fc-ring"
            >
                Référence des props — {group.items.length} composants
            </summary>
            <div class="grid gap-4 pt-3 lg:grid-cols-2">
                {#each group.items as c (c.name)}
                    <Card class="flex flex-col gap-3">
                        <Inline gap="tight">
                            <code class="font-fc-mono text-fc-sm font-semibold text-fc-fg">{c.name}</code>
                            <Badge tone="neutral">{c.props.length} props</Badge>
                        </Inline>

                        {#if c.lead}<p class="text-fc-sm text-fc-fg-muted">{c.lead}</p>{/if}

                        {#if c.extends.length}
                            <p class="text-fc-xs text-fc-fg-muted">
                                étend <code class="font-fc-mono text-fc-xs">{c.extends.join(', ')}</code>
                            </p>
                        {/if}

                        {#if c.props.length}
                            <div class="overflow-x-auto">
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
                                                        <span class="block pt-0.5 font-sans text-fc-fg-muted">{p.doc}</span>
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
                        {/if}
                    </Card>
                {/each}
            </div>
        </details>
    </Section>
{:else}
    <p class="text-fc-sm text-fc-fg-muted">Aucun composant ne correspond à « {query} ».</p>
{/each}

<!-- The demos raise toasts, so the site needs the one Toaster an app would mount. -->
<Toaster />
