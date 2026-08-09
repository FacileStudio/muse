<script lang="ts">
    import '../app.css';
    import type { Snippet } from 'svelte';
    import { browser } from '$app/environment';
    import { page } from '$app/state';
    import { Icon, IconButton, Page, SideBar, icons } from '@facile/muse';
    import { RAIL } from '$lib/nav.js';


    let { children }: { children: Snippet } = $props();

    /* Both classes, never just `dark`. The token file paints dark from a media query scoped
       `:root:not(.light)`, so an app that only ever adds `.dark` cannot show light mode on a
       dark-preferring OS — the media block still wins. */
    let theme = $state<'light' | 'dark' | 'system'>('system');

    $effect(() => {
        if (!browser) return;
        const root = document.documentElement;
        root.classList.toggle('dark', theme === 'dark');
        root.classList.toggle('light', theme === 'light');
        localStorage.setItem('muse-theme', theme);
    });

    if (browser) {
        const saved = localStorage.getItem('muse-theme');
        if (saved === 'light' || saved === 'dark') theme = saved;
    }

    let open = $state(false);
    let collapsed = $state(false);
    const here = $derived(page.url.pathname.replace(/\/$/, '') || '/');
    const rail = $derived(RAIL.map((l) => ({ ...l, active: l.href === here })));
</script>

<svelte:head>
    <title>muse — le système de design de Facile Studio</title>
    <meta
        name="description"
        content="Pas seulement une bibliothèque de composants : comment concevoir et structurer une app Facile."
    />
</svelte:head>

<div class="flex min-h-dvh w-full bg-fc-page">
    <!-- muse's own rail, not a hand-rolled nav. Building the design system's site out of
         anything else would be an argument against the design system, and it is how the
         grouped-navigation gap got found: `SideBar` took a flat `pages` array, so the section
         headings that carry this site's argument had nowhere to go. It takes `group` now. -->
    <div class="hidden h-dvh shrink-0 p-3 md:block md:sticky md:top-0">
        <SideBar
            icon={icons.paletteMark}
            title="muse"
            bind:collapsed
            pages={rail}
            class="h-full"
        />
    </div>

    <!-- The rail is desktop-only, exactly as in a Facile app. On a phone the same array is a
         sheet rather than `MobileNav`, which is a four-item pill bar — this site has twelve
         links across five sections and would overflow it at the 360px floor. -->
    {#if open}
        <button
            type="button"
            class="fixed inset-0 z-40 bg-fc-scrim md:hidden"
            aria-label="Fermer la navigation"
            onclick={() => (open = false)}
        ></button>
        <div class="fixed inset-y-0 left-0 z-50 w-72 p-3 md:hidden">
            <SideBar
                icon={icons.paletteMark}
                title="muse"
                pages={rail}
                showCollapse={false}
                class="h-full"
            />
        </div>
    {/if}

    <div class="flex min-w-0 flex-1 flex-col">
        <header
            class="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-fc-border bg-fc-page/90 px-4 py-3 backdrop-blur md:justify-end md:border-0 md:bg-transparent md:px-10"
        >
            <IconButton
                variant="ghost"
                class="md:hidden"
                aria-label="Ouvrir la navigation"
                onclick={() => (open = true)}
            >
                <Icon icon={icons.collapse} size={20} />
            </IconButton>

            <div class="flex items-center gap-1">
                {#each [['light', icons.sun, 'Clair'], ['system', icons.monitor, 'Système'], ['dark', icons.moon, 'Sombre']] as [mode, icon, label] (mode)}
                    <IconButton
                        variant={theme === mode ? 'default' : 'ghost'}
                        aria-label={label}
                        aria-pressed={theme === mode}
                        onclick={() => (theme = mode as typeof theme)}
                    >
                        <Icon {icon} size={18} />
                    </IconButton>
                {/each}
            </div>
        </header>

        <main class="min-w-0 flex-1">
            <Page>
                {@render children()}
            </Page>
        </main>
    </div>
</div>
