<script lang="ts">
    import { Button, MobileNav, PageTransition, SideBar, icons } from '@facile/lib';
    import Dashboard from './pages/Dashboard.svelte';
    import Projects from './pages/Projects.svelte';
    import Spaces from './pages/Spaces.svelte';
    import Settings from './pages/Settings.svelte';

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

    const Page = $derived(routes[current] ?? Dashboard);

    $effect(() => {
        if (!window.location.hash) window.location.hash = HOME;
        const onHash = () => (current = window.location.hash || HOME);
        window.addEventListener('hashchange', onHash);
        return () => window.removeEventListener('hashchange', onHash);
    });

    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    let theme = $state<'light' | 'dark'>(
        (localStorage.getItem('muse-theme') as 'light' | 'dark') ?? (systemDark ? 'dark' : 'light')
    );

    $effect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
        document.documentElement.classList.toggle('light', theme === 'light');
        localStorage.setItem('muse-theme', theme);
    });

    const spaces = [
        { id: 'acme', name: 'Acme Studio' },
        { id: 'nova', name: 'Nova Collective' }
    ];

    const links = [
        { href: '#/dashboard', label: 'Dashboard', icon: icons.dashboard },
        { href: '#/projects', label: 'Projects', icon: icons.folder },
        { href: '#/spaces', label: 'Spaces', icon: icons.usersGroup },
        { href: '#/settings', label: 'Settings', icon: icons.settings }
    ];

    const navPages = $derived(links.map((l) => ({ ...l, active: l.href === current })));
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
            user={{ name: 'Camille' }}
            class="h-full"
        />
    </div>

    <main class="min-w-0 flex-1 overflow-auto pb-28 md:pb-0">
        <div class="mx-auto flex max-w-fc-lg flex-col gap-8 px-6 py-10 md:px-10">
            <div class="flex items-center justify-end">
                <Button
                    variant="outline"
                    size="sm"
                    icon={theme === 'dark' ? 'solar:sun-linear' : 'solar:moon-linear'}
                    onclick={() => (theme = theme === 'dark' ? 'light' : 'dark')}
                    aria-label="Toggle colour scheme"
                >
                    {theme === 'dark' ? 'Light' : 'Dark'}
                </Button>
            </div>

            <PageTransition key={current}>
                <Page />
            </PageTransition>
        </div>
    </main>

    <MobileNav
        items={navPages}
        user={{ name: 'Camille' }}
        profileHref="#/settings"
        profileActive={current === '#/settings'}
    />
</div>
