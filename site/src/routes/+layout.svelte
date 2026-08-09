<script lang="ts">
    import '../app.css';
    import type { Snippet } from 'svelte';
    import { browser } from '$app/environment';
    import { page } from '$app/state';
    import { IconButton, Page, icons } from '@facile/muse';
    import { NAV } from '$lib/nav.js';

    /*
     * Registering the custom element is not optional, and this site shipped without it — every
     * `<iconify-icon>` was an unknown element with no box, so the mobile menu button and the
     * theme switcher rendered as 44px buttons containing nothing. Invisible triggers, no error
     * in the console, nothing in the build log. `/commencer/installer` documents this exact
     * trap, which is a good reminder that writing a rule down is not the same as following it.
     *
     * Browser-side only: the element registers against `window.customElements`, so importing it
     * at module scope breaks the prerender.
     */
    if (browser) void import('iconify-icon');

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
    const here = $derived(page.url.pathname.replace(/\/$/, '') || '/');
</script>

<svelte:head>
    <title>muse — le système de design de Facile Studio</title>
    <meta
        name="description"
        content="Pas seulement une bibliothèque de composants : comment concevoir et structurer une app Facile."
    />
</svelte:head>

<div class="flex min-h-dvh w-full bg-fc-page">
    <!-- The rail is a plain nav, not muse's SideBar: SideBar is an *app* shell with a space
         switcher and a user card, and a documentation site has neither. Using it here would be
         the demo dressed as a site. -->
    <nav
        class="fixed inset-y-0 left-0 z-50 w-72 shrink-0 overflow-y-auto border-r border-fc-border bg-fc-bg px-5 py-6 transition-transform md:sticky md:top-0 md:h-dvh md:translate-x-0 md:border-0 md:bg-transparent {open
            ? 'translate-x-0'
            : '-translate-x-full'}"
        aria-label="Sections"
    >
        <div class="flex flex-col gap-8">
            <a href="/" class="flex min-h-11 items-center gap-2.5 rounded-fc-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fc-ring">
                <iconify-icon icon={icons.palette} width="22" height="22" class="block size-5.5 text-fc-fg"
                ></iconify-icon>
                <span class="text-fc-lg font-semibold text-fc-fg">muse</span>
            </a>

            {#each NAV as group (group.title)}
                <div class="flex flex-col gap-2">
                    <p class="text-fc-xs font-semibold tracking-wide text-fc-fg uppercase">
                        {group.title}
                    </p>
                    <p class="text-fc-xs text-fc-fg-muted">{group.intent}</p>
                    <ul class="mt-1 flex flex-col gap-0.5">
                        {#each group.links as link (link.href)}
                            <li>
                                <a
                                    href={link.href}
                                    onclick={() => (open = false)}
                                    aria-current={here === link.href ? 'page' : undefined}
                                    class="block rounded-fc-sm px-2 py-1.5 text-fc-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fc-ring {here ===
                                    link.href
                                        ? 'bg-fc-accent text-fc-accent-fg'
                                        : 'text-fc-fg-muted hover:bg-fc-surface hover:text-fc-fg'}"
                                >
                                    {link.label}
                                </a>
                            </li>
                        {/each}
                    </ul>
                </div>
            {/each}
        </div>
    </nav>

    {#if open}
        <button
            type="button"
            class="fixed inset-0 z-40 bg-fc-scrim md:hidden"
            aria-label="Fermer la navigation"
            onclick={() => (open = false)}
        ></button>
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
                <iconify-icon icon={icons.collapse} width="20" height="20" class="block size-5"
                ></iconify-icon>
            </IconButton>

            <div class="flex items-center gap-1">
                {#each [['light', icons.sun, 'Clair'], ['system', icons.monitor, 'Système'], ['dark', icons.moon, 'Sombre']] as [mode, icon, label] (mode)}
                    <IconButton
                        variant={theme === mode ? 'default' : 'ghost'}
                        aria-label={label}
                        aria-pressed={theme === mode}
                        onclick={() => (theme = mode as typeof theme)}
                    >
                        <iconify-icon {icon} width="18" height="18" class="block size-4.5"></iconify-icon>
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
