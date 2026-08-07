<script lang="ts">
    import { MobileNav, PageTransition, SideBar, SpaceSwitcher, Topbar, icons } from '@facile/lib';
    import Dashboard from './pages/Dashboard.svelte';
    import Motion from './pages/Motion.svelte';
    import Projects from './pages/Projects.svelte';
    import Spaces from './pages/Spaces.svelte';
    import Settings from './pages/Settings.svelte';
    import { spaces } from './data.js';
    import { HOME, router, segment } from './router.svelte.js';
    import { setTheme, theme } from './theme.svelte.js';

    const routes: Record<string, typeof Dashboard> = {
        '#/dashboard': Dashboard,
        '#/projects': Projects,
        '#/spaces': Spaces,
        '#/motion': Motion,
        '#/settings': Settings
    };

    let collapsed = $state(false);
    let activeSpaceId = $state<string | null>('acme');
    let scroller: HTMLElement | null = $state(null);

    /*
     * Routes match on the first segment only, so #/settings/pool still resolves to Settings and
     * the page keeps its own state across section changes. Keying PageTransition on the same
     * root is what stops every settings tab from remounting the whole page.
     */
    const root = $derived('#/' + segment(router.hash, 1));
    const known = $derived(root in routes);
    const Page = $derived(routes[known ? root : HOME]);

    $effect(() => {
        const onHash = () => (router.hash = window.location.hash || HOME);
        window.addEventListener('hashchange', onHash);
        return () => window.removeEventListener('hashchange', onHash);
    });

    /*
     * An empty or unknown hash is corrected rather than quietly rendering the home page under
     * a URL that describes something else. `replaceState` and not an assignment to
     * `location.hash`: the latter pushes an entry, so booting the app already left one press
     * of Back landing back on the blank hash instead of leaving the app.
     */
    $effect(() => {
        if (known) return;
        history.replaceState(null, '', HOME);
        router.hash = HOME;
    });

    /* <main> is the scroll container and sits outside PageTransition, so its scrollTop
       survives a route change unless someone puts it back. */
    $effect(() => {
        if (router.hash) scroller?.scrollTo({ top: 0 });
    });

    /* Apply the stored preference to <html> on boot; the store already read it. */
    setTheme(theme.mode);

    /*
     * No Settings row here, by design — the user card at the bottom of the rail is the only way
     * in. See the comment in SideBar.svelte.
     */
    const links = [
        { href: '#/dashboard', label: 'Dashboard', icon: icons.dashboard },
        { href: '#/projects', label: 'Projects', icon: icons.folder },
        { href: '#/spaces', label: 'Spaces', icon: icons.usersGroup },
        { href: '#/motion', label: 'Motion', icon: icons.bolt }
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

    <main bind:this={scroller} class="min-w-0 flex-1 overflow-auto pb-28 md:pb-0">
        <!-- Spaces live in the rail, and the rail is desktop-only — without this header there
             is no way to switch space on a phone at all. -->
        <Topbar class="md:hidden">
            <span class="text-fc-md font-semibold text-fc-fg">Muse</span>
            <div class="min-w-0 max-w-56 flex-1">
                <SpaceSwitcher
                    {spaces}
                    activeId={activeSpaceId}
                    onSelect={(id) => (activeSpaceId = id)}
                    manageHref="#/spaces"
                />
            </div>
        </Topbar>

        <div class="mx-auto flex max-w-fc-lg flex-col gap-8 px-6 py-10 md:px-10">
            <!-- No theme toggle here: the colour scheme lives in Settings › Appearance, like
                 every other preference. A control floating over every page is one more thing
                 competing with the page's own actions. -->
            <PageTransition key={root}>
                <Page />
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
