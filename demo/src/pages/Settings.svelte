<script lang="ts">
    import { Divider, PageTransition, Tabs, icons } from '@facile/lib';
    import Profile from './settings/Profile.svelte';
    import Appearance from './settings/Appearance.svelte';
    import Notifications from './settings/Notifications.svelte';
    import Api from './settings/Api.svelte';
    import Pool from './settings/Pool.svelte';
    import Members from './settings/Members.svelte';
    import Advanced from './settings/Advanced.svelte';

    let { route = '#/settings' }: { route?: string } = $props();

    const sections = [
        { id: 'profile', label: 'Profile', icon: icons.userCircle, Panel: Profile },
        { id: 'appearance', label: 'Appearance', icon: icons.palette, Panel: Appearance },
        { id: 'notifications', label: 'Notifications', icon: icons.notification, Panel: Notifications },
        { id: 'api', label: 'API', icon: icons.key, Panel: Api },
        { id: 'pool', label: 'Pool', icon: icons.plug, Panel: Pool },
        { id: 'members', label: 'Members', icon: icons.usersGroup, Panel: Members },
        { id: 'advanced', label: 'Advanced', icon: icons.shield, Panel: Advanced }
    ];

    /*
     * The section lives in the URL rather than in a local `$state`, so a link to
     * #/settings/pool opens on Pool, reload keeps you there and browser-back walks the
     * sections. That is the whole reason Tabs accepts `href` items.
     */
    const active = $derived(
        sections.find((s) => s.id === route.split('/')[2])?.id ?? sections[0].id
    );
    const Panel = $derived(sections.find((s) => s.id === active)!.Panel);

    const items = $derived(
        sections.map(({ id, label, icon }) => ({ id, label, icon, href: `#/settings/${id}` }))
    );
</script>

<div class="flex flex-col gap-8">
    <div class="flex flex-col gap-2">
        <h1 class="text-fc-2xl font-semibold text-fc-fg">Settings</h1>
        <p class="text-fc-sm text-fc-fg-muted">
            Your identity, this workspace, and everything wired to it.
        </p>
    </div>

    <!--
        The rule needs air. At a 4px gap it reads as an underline welded to the active pill and
        fights its shape; the strip is a page header, so it separates like one.
    -->
    <div class="flex flex-col gap-4">
        <Tabs {items} value={active} label="Settings sections" />
        <Divider class="my-0" />
    </div>

    <PageTransition key={active} distance={8} duration={0.25}>
        <Panel />
    </PageTransition>
</div>
