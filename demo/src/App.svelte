<script lang="ts">
    import {
        SideBar,
        MobileNav,
        SpaceSwitcher,
        Badge,
        Button,
        Avatar,
        Card,
        Input,
        Field,
        Divider,
        Switch,
        Spinner,
        icons
    } from '@facile/lib';

    let collapsed = $state(false);
    let activeSpaceId = $state<string | null>('acme');
    let current = $state('/dashboard');
    let notify = $state(true);
    let email = $state('');

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
        { href: '/dashboard', label: 'Dashboard', icon: icons.dashboard },
        { href: '/projects', label: 'Projects', icon: icons.folder },
        { href: '/spaces', label: 'Spaces', icon: icons.usersGroup },
        { href: '/settings', label: 'Settings', icon: icons.settings }
    ];

    const pages = $derived(links.map((l) => ({ ...l, active: l.href === current })));

    const members = [
        { name: 'Camille', email: 'camille@facile.studio', role: 'owner' as const },
        { name: 'Noah', email: 'noah@facile.studio', role: 'admin' as const },
        { name: 'Mazouz', email: 'mazouz@facile.studio', role: 'neutral' as const },
        { name: 'Yann', email: 'yann@facile.studio', role: 'neutral' as const }
    ];

    const roleLabel = { owner: 'Owner', admin: 'Admin', neutral: 'Member' };
</script>

<div class="flex h-dvh w-full overflow-hidden bg-fc-page">
    <div class="hidden h-full shrink-0 p-3 md:block">
        <SideBar
            icon="solar:pallete-2-bold-duotone"
            title="Muse"
            bind:collapsed
            showSearch
            {pages}
            {spaces}
            {activeSpaceId}
            onSpaceSelect={(id) => (activeSpaceId = id)}
            manageSpacesHref="/spaces"
            user={{ name: 'Camille' }}
            class="h-full"
        />
    </div>

    <main class="min-w-0 flex-1 overflow-auto pb-28 md:pb-0">
        <div class="mx-auto flex max-w-fc-lg flex-col gap-12 px-6 py-10 md:px-10">
            <header class="flex items-start justify-between gap-6">
                <div class="flex flex-col gap-2">
                    <h1 class="text-fc-3xl font-semibold text-fc-fg">Muse</h1>
                    <p class="text-fc-md text-fc-fg-muted">
                        Facile Suite design system — chroma-zero OKLCH, Goga, Solar linear icons.
                    </p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onclick={() => (theme = theme === 'dark' ? 'light' : 'dark')}
                    aria-label="Toggle colour scheme"
                >
                    <iconify-icon
                        icon={theme === 'dark' ? 'solar:sun-linear' : 'solar:moon-linear'}
                        width="16"
                        height="16"
                        class="block"
                    ></iconify-icon>
                    {theme === 'dark' ? 'Light' : 'Dark'}
                </Button>
            </header>

            <section class="flex flex-col gap-4">
                <h2 class="text-fc-lg font-semibold text-fc-fg">Buttons</h2>
                <div class="flex flex-wrap items-center gap-3">
                    <Button variant="primary" size="sm">Primary sm</Button>
                    <Button variant="primary" size="md">Primary md</Button>
                    <Button variant="primary" size="lg">Primary lg</Button>
                </div>
                <div class="flex flex-wrap items-center gap-3">
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="danger">Delete</Button>
                    <Button variant="primary" disabled>Disabled</Button>
                </div>
            </section>

            <section class="flex flex-col gap-4">
                <h2 class="text-fc-lg font-semibold text-fc-fg">Badges</h2>
                <div class="flex flex-wrap items-center gap-2">
                    <Badge tone="neutral">Member</Badge>
                    <Badge tone="owner">Owner</Badge>
                    <Badge tone="admin">Admin</Badge>
                    <Badge tone="accent">Accent</Badge>
                    <Badge tone="success">Active</Badge>
                    <Badge tone="danger">Revoked</Badge>
                </div>
            </section>

            <section class="flex flex-col gap-4">
                <h2 class="text-fc-lg font-semibold text-fc-fg">Members list</h2>
                <Card class="flex flex-col gap-1 p-2">
                    {#each members as m, i (m.email)}
                        {#if i > 0}<Divider />{/if}
                        <div class="flex items-center justify-between gap-3 px-2 py-2.5">
                            <div class="flex min-w-0 items-center gap-3">
                                <Avatar name={m.name} size="sm" />
                                <div class="min-w-0">
                                    <p class="truncate text-fc-sm font-medium text-fc-fg">{m.name}</p>
                                    <p class="truncate text-fc-xs text-fc-fg-muted">{m.email}</p>
                                </div>
                            </div>
                            <Badge tone={m.role}>{roleLabel[m.role]}</Badge>
                        </div>
                    {/each}
                </Card>
            </section>

            <section class="flex flex-col gap-4">
                <h2 class="text-fc-lg font-semibold text-fc-fg">Form controls</h2>
                <div class="flex max-w-sm flex-col gap-4">
                    <Field label="Email" helper="Used for space invitations.">
                        <Input bind:value={email} placeholder="you@facile.studio" type="email" />
                    </Field>
                    <Switch bind:checked={notify} label="Email notifications" class="text-fc-sm" />
                    <div class="flex items-center gap-3 text-fc-sm text-fc-fg-muted">
                        <Spinner size="sm" /> Loading state
                    </div>
                </div>
            </section>

            <section class="flex flex-col gap-4">
                <h2 class="text-fc-lg font-semibold text-fc-fg">SpaceSwitcher (standalone)</h2>
                <div class="max-w-xs">
                    <SpaceSwitcher
                        {spaces}
                        activeId={activeSpaceId}
                        onSelect={(id) => (activeSpaceId = id)}
                        manageHref="/spaces"
                    />
                </div>
            </section>

            <section class="flex flex-col gap-3">
                <h2 class="text-fc-lg font-semibold text-fc-fg">MobileNav</h2>
                <p class="text-fc-sm text-fc-fg-muted">
                    Narrow the window below 768px — the sidebar hides and the floating pill bar takes over.
                </p>
            </section>
        </div>
    </main>

    <MobileNav
        items={pages}
        user={{ name: 'Camille' }}
        profileHref="/settings"
        profileActive={current === '/settings'}
    />
</div>
