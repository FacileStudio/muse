<script lang="ts">
    import { Button, IconButton, Icon, Input, MediaCard, Page, PageHeader, SideBar, ToggleGroup, icons } from '@facile/muse';

    type Game = { name: string; installed: boolean };

    const games: Game[] = [
        'aseprite', 'Blender', 'Brawlhalla', 'Cities: Skylines II', 'Cuphead', 'Cyberpunk 2077', 'Deadlock',
        '#DRIVE Rally', 'Emily is Away', 'Fallout 4', 'FINAL FANTASY RESONANCE', 'Hades', 'Motor Town: Behind The Wheel',
        'MouthWashing', 'NFS: Underground 2', 'PAYDAY 2', 'Portal', 'Portal 2', 'Rainbow Six Siege', 'RDR2', 'R.E.P.O',
        'Straftat', 'Team Fortress 2'
    ].map((name, i) => ({ name, installed: i % 4 !== 0 }));

    const featured = ['Hades II', 'Cities: Skylines II', 'Cyberpunk 2077', 'NFS: Underground 2', 'Hades', 'Outer Wilds', 'Portal 2', 'Cuphead', 'RDR2'];

    let collapsed = $state(true);
    let query = $state('');
    let view = $state('grid');

    const shown = $derived(games.filter((g) => g.name.toLowerCase().includes(query.trim().toLowerCase())));

    const pages = [
        { label: 'Store', href: '#/store', icon: 'iconoir:shop' },
        { label: 'Library', href: '#/library', icon: 'iconoir:list', active: true },
        { label: 'Friends', href: '#/friends', icon: icons.usersGroup }
    ];
</script>

<div class="flex h-dvh w-full overflow-hidden bg-fc-bg">
    <SideBar icon="iconoir:gamepad" title="Steam" bind:collapsed {pages} user={{ name: 'Admin' }} userHref="#/profile" class="h-full" />

    <main class="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Page>
            <PageHeader title="Library" count={games.length} description="Get the game you need.">
                {#snippet actions()}
                    <ToggleGroup
                        label="View"
                        bind:value={view}
                        items={[
                            { value: 'grid', icon: icons.widget, label: 'Grid' },
                            { value: 'list', icon: 'iconoir:list', label: 'List' }
                        ]}
                    />
                {/snippet}
            </PageHeader>

            <div class="flex min-h-0 flex-1 gap-1">
                <aside class="flex w-60 shrink-0 flex-col gap-1">
                    <div class="flex gap-1">
                        <Input bind:value={query} placeholder="Search the store" aria-label="Search the store" icon={icons.search} shortcut="/" />
                        <IconButton aria-label="Add a game"><Icon icon={icons.plus} /></IconButton>
                    </div>
                    <nav class="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto">
                        {#each shown as game (game.name)}
                            <Button href="#/library" variant="ghost" icon={icons.widget} class={game.installed ? 'w-full justify-start text-fc-ink' : 'w-full justify-start'}>{game.name}</Button>
                        {/each}
                    </nav>
                </aside>

                <section class="grid min-h-0 flex-1 auto-rows-max grid-cols-1 gap-1 overflow-y-auto sm:grid-cols-2 xl:grid-cols-3">
                    {#each featured as name, i (name)}
                        <MediaCard image="https://picsum.photos/seed/steam{i}/800/500" alt={name} href="#/game/{i}">
                            <div class="flex items-center justify-between gap-1">
                                <Button icon="iconoir:gamepad">Start game</Button>
                                <div class="flex flex-col items-end text-fc-subtext">
                                    <span class="text-fc-muted">Last two weeks: 58 minutes</span>
                                    <span class="text-fc-ink">Total: 431 hrs</span>
                                </div>
                            </div>
                        </MediaCard>
                    {/each}
                </section>
            </div>
        </Page>
    </main>
</div>
