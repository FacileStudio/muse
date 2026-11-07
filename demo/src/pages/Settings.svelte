<script lang="ts">
    import { icons, Page, PageTransition, SettingsLayout, sectionHref, settingsRoute } from '@facile/muse';
    import Profile from './settings/Profile.svelte';
    import Preferences from './settings/Preferences.svelte';
    import Notifications from './settings/Notifications.svelte';
    import Tokens from './settings/Tokens.svelte';
    import Pool from './settings/Pool.svelte';
    import Members from './settings/Members.svelte';
    import Subscription from './settings/Subscription.svelte';
    import Advanced from './settings/Advanced.svelte';
    import { router, segment } from '../router.svelte.js';

    const panels = [
        { id: 'profile', label: 'Profile', icon: icons.userCircle, Panel: Profile },
        { id: 'preferences', label: 'Preferences', icon: icons.palette, Panel: Preferences },
        { id: 'notifications', label: 'Notifications', icon: icons.notification, Panel: Notifications },
        { id: 'pool', label: 'Pool', icon: icons.plug, Panel: Pool },
        { id: 'members', label: 'Members', icon: icons.usersGroup, Panel: Members },
        { id: 'tokens', label: 'API tokens', icon: icons.key, Panel: Tokens },
        { id: 'subscription', label: 'Subscription', icon: icons.card, Panel: Subscription },
        { id: 'advanced', label: 'Advanced', icon: icons.shield, Panel: Advanced }
    ];

    const sections = panels.map(({ id, label, icon }) => ({ id, label, icon, href: sectionHref('#/settings', id) }));
    const requested = $derived(segment(router.hash, 2) || undefined);
    const route = $derived(settingsRoute(requested, sections));

    $effect(() => {
        if (route.known) return;
        history.replaceState(null, '', '#/settings');
        router.hash = '#/settings';
    });
</script>

<Page>
    <SettingsLayout {sections} active={requested} backHref="#/settings" description="Your identity, this workspace, and everything wired to it.">
        {#snippet children(current)}
            {@const Panel = panels.find((p) => p.id === current)!.Panel}
            <PageTransition key={current} distance={8} duration={0.25}>
                <Panel />
            </PageTransition>
        {/snippet}
    </SettingsLayout>
</Page>
