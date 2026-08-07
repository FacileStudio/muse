<script lang="ts">
    import { MobileNav, PageTransition, SideBar, icons } from '@facile/lib';
    import Dashboard from './pages/Dashboard.svelte';
    import Projects from './pages/Projects.svelte';
    import Spaces from './pages/Spaces.svelte';
    import Settings from './pages/Settings.svelte';
    import { setTheme, theme } from './theme.svelte.js';

    const HOME = '#/dashboard';

    const routes: Record<string, typeof Dashboard> = {
        '#/dashboard': Dashboard,
        '#/projects': Projects,
        '#/spaces': Spaces,
        '#/settings': Settings
    };

    let collapsed = $state(false);
    let activeSpaceId = $state<string | null>('acme');
    let current = $state(window.location.hash || HOME);

    /*
     * Routes match on the first segment only, so #/settings/pool still resolves to Settings and
     * the page keeps its own state across section changes. Keying PageTransition on the same
     * root is what stops every settings tab from remounting the whole page.
     */
    const root = $derived('#/' + (current.split('/')[1] ?? ''));
    const Page = $derived(routes[root] ?? Dashboard);

    $effect(() => {
        if (!window.location.hash) window.location.hash = HOME;
        const onHash = () => (current = window.location.hash || HOME);
        window.addEventListener('hashchange', onHash);
        return () => window.removeEventListener('hashchange', onHash);
    });

    /* Apply the stored preference to <html> on boot; the store already read it. */
    setTheme(theme.mode);

    const spaces = [
        { id: 'acme', name: 'Acme Studio' },
        { id: 'nova', name: 'Nova Collective' }
    ];

    /*
     * No Settings row here, by design — the user card at the bottom of the rail is the only way
     * in. See the comment in SideBar.svelte.
     */
    const links = [
        { href: '#/dashboard', label: 'Dashboard', icon: icons.dashboard },
        { href: '#/projects', label: 'Projects', icon: icons.folder },
        { href: '#/spaces', label: 'Spaces', icon: icons.usersGroup }
    ];

    const navPages = $derived(links.map((l) => ({ ...l, active: l.href === root })));
    const onSettings = $derived(root === '#/settings');
    const user = { name: 'Camille' };
</script>

<div class="flex h-dvh w-full overflow-hidden bg-fc-page">
    <div class="hidden h-full shrink-0 p-3 md:block">
        <SideBar
            icon="solar:pallete-2-bold-duotone"
            title="Muse"
            bind:collapsed
            showSearch
            pages={navPages}
            {spaces}
            {activeSpaceId}
            onSpaceSelect={(id) => (activeSpaceId = id)}
            manageSpacesHref="#/spaces"
            {user}
            userHref="#/settings"
            userActive={onSettings}
            class="h-full"
        />
    </div>

    <main class="min-w-0 flex-1 overflow-auto pb-28 md:pb-0">
        <div class="mx-auto flex max-w-fc-lg flex-col gap-8 px-6 py-10 md:px-10">
            <!-- No theme toggle here: the colour scheme lives in Settings › Appearance, like
                 every other preference. A control floating over every page is one more thing
                 competing with the page's own actions. -->
            <PageTransition key={root}>
                <Page route={current} />
            </PageTransition>
        </div>
    </main>

    <MobileNav
        items={navPages}
        {user}
        profileHref="#/settings"
        profileActive={onSettings}
    />
</div>
