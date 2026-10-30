<script lang="ts">
    import '../app.css';
    import type { Snippet } from 'svelte';
    import { browser } from '$app/environment';
    import { page } from '$app/state';
    import { Icon, IconButton, Page, SideBar, icons } from '@facile/muse';
    import { RAIL } from '$lib/nav.js';


    let { children }: { children: Snippet } = $props();

    let open = $state(false);

    /*
     * Lock the document while the sheet is open. The rail's own column carries
     * `overscroll-contain`, so a gesture that starts inside it no longer chains — but one that
     * starts on the scrim still would, and the page moving behind an open menu is the same bug
     * from the user's side. Restored on close, and on unmount, so a route change cannot leave
     * the document frozen.
     */
    $effect(() => {
        if (!browser || !open) return;
        const previous = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = previous;
        };
    });
    let collapsed = $state(false);
    const here = $derived(page.url.pathname.replace(/\/$/, '') || '/');
    const rail = $derived(RAIL.map((l) => ({ ...l, active: l.href === here })));
</script>

<div class="flex min-h-dvh w-full bg-fc-bg">
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
        <div class="fixed inset-y-0 left-0 z-50 flex w-72 p-3 md:hidden">
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
            class="sticky top-0 z-30 flex items-center justify-between gap-1 border-b border-fc-border bg-fc-bg/90 px-4 py-3 backdrop-blur md:justify-end md:border-0 md:bg-transparent md:px-10"
        >
            <IconButton
                variant="ghost"
                class="md:hidden"
                aria-label="Ouvrir la navigation"
                onclick={() => (open = true)}
            >
                <Icon icon={icons.collapse} size={20} />
            </IconButton>

        </header>

        <main class="min-w-0 flex-1">
            <Page>
                {@render children()}
            </Page>
        </main>
    </div>
</div>
