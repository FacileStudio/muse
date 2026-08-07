<script lang="ts">
    import {
        MobileNav,
        PageTransition,
        Rideau,
        SideBar,
        SpaceSwitcher,
        Toaster,
        Topbar,
        icons
    } from '@facile/muse';
    import Dashboard from './pages/Dashboard.svelte';
    import Motion from './pages/Motion.svelte';
    import Projects from './pages/Projects.svelte';
    import Spaces from './pages/Spaces.svelte';
    import Settings from './pages/Settings.svelte';
    import { spaces } from './data.js';
    import { CURTAIN_ROUTE, curtain } from './curtain.svelte.js';
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

    /*
     * Motion is the page that demos the curtain, so it is the page you arrive at behind one.
     * The link is caught here rather than special-cased in the nav data: SideBar and MobileNav
     * both render plain anchors, so one delegated listener covers every route into the page,
     * including whatever a future nav adds. Modified clicks and middle-clicks fall through to
     * the browser — the href is real, and a curtain has no business hijacking a new tab.
     */
    function curtainNav(e: MouseEvent) {
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        const href = (e.target as Element | null)?.closest?.('a')?.getAttribute('href');
        if (href !== CURTAIN_ROUTE || root === CURTAIN_ROUTE) return;
        e.preventDefault();
        curtain.el?.close(href);
    }

    /* The other half: `close()` navigates once it has covered the screen, and the route change
       that follows is what asks for the reveal. Arriving by typed URL is a no-op — the curtain
       is already open, so this tweens 0 to 0. */
    $effect(() => {
        if (root === CURTAIN_ROUTE) curtain.el?.open();
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

<svelte:window onclickcapture={curtainNav} />

<Rideau bind:this={curtain.el} duration={0.6} start="open" />

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

    <!-- `overscroll-contain`: <main> is the only scroller, so a flick past either end has
         nowhere useful to chain to. Without it the gesture keeps going into the document and
         the whole shell rubber-bands off the top of the window. -->
    <main bind:this={scroller} class="min-w-0 flex-1 overflow-auto overscroll-contain pb-28 md:pb-0">
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

<!-- One Toaster for the whole app, mounted next to the shell rather than inside a page, so a
     route change cannot unmount a toast mid-flight. The extra bottom padding is the escape
     hatch doing its job: without it the stack would sit under MobileNav on a phone. -->
<Toaster class="pb-28 md:pb-6" />
