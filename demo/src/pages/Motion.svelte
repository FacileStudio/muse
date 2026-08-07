<script lang="ts">
    import { gsap } from 'gsap';
    import { ScrollTrigger } from 'gsap/ScrollTrigger';
    import {
        Badge,
        Button,
        Card,
        Carousel,
        Mosaique,
        Rideau,
        Switch,
        TextElevate,
        WordReveal,
        icons
    } from '@facile/lib';

    let heading = $state(true);

    const releases = [
        {
            id: 'r1',
            version: '2026.8',
            title: 'Charts, overlays and uploads',
            body: 'Six categorical series, a drawer that drags, and a dropzone that validates the drop path — not just the picker.'
        },
        {
            id: 'r2',
            version: '2026.7',
            title: 'The settings standard',
            body: 'SettingsSection, SettingsRow and SecretField, so every tool in the suite lays out its preferences the same way.'
        },
        {
            id: 'r3',
            version: '2026.6',
            title: 'Motion tier',
            body: 'Every GSAP animation is scoped to a context and reverted on teardown, so a route change cannot leave a tween running.'
        }
    ];

    const tiles = [
        { id: 't1', label: 'Goga', note: 'Medium 500 · Semibold 600' },
        { id: 't2', label: 'OKLCH', note: 'Chroma-zero palette' },
        { id: 't3', label: 'Solar', note: 'Linear icons' },
        { id: 't4', label: 'Runes', note: 'Svelte 5 only' },
        { id: 't5', label: 'Tailwind', note: 'v4 @theme tokens' },
        { id: 't6', label: 'GSAP', note: 'power3.inOut' }
    ];

    let curtain = $state<{ close: (href: string) => void } | undefined>();

    /*
     * WordReveal scrubs against ScrollTrigger's default scroller — the window — and in this
     * app the window never scrolls, <main> does. Scroll events do not bubble out of an
     * element, so without this the paragraph sits at progress 0 and never brightens. Any app
     * with an internal scroll area owes ScrollTrigger the same declaration, and it has to
     * land before the paragraph mounts, hence the gate.
     */
    let scrollerReady = $state(false);

    $effect(() => {
        gsap.registerPlugin(ScrollTrigger);
        const scroller = document.querySelector('main');
        if (!scroller) return;
        ScrollTrigger.defaults({ scroller });
        scrollerReady = true;
        return () => {
            ScrollTrigger.defaults({ scroller: undefined });
            scrollerReady = false;
        };
    });
</script>

<!--
    Mounted with the page: Rideau wipes itself away on mount, which is the entrance half of
    the effect, and `close()` plays it back out before navigating.

    `w-full` overrides its own `w-screen` because PageTransition leaves a transform on its
    wrapper, and a transformed ancestor makes `position: fixed` resolve against that wrapper
    instead of the viewport. At screen width that would push a viewport-wide panel past the
    scroll container and give the page a horizontal scroll it never had.
-->
<Rideau bind:this={curtain} duration={0.9} class="w-full" />

<div class="flex flex-col gap-10">
    <div class="flex flex-col gap-2">
        <h1 class="text-fc-2xl font-semibold text-fc-fg">Motion</h1>
        <p class="text-fc-sm text-fc-fg-muted">
            The animated tier. Everything here honours <code class="font-fc-mono text-fc-xs"
                >prefers-reduced-motion</code
            > and reverts its tweens on teardown.
        </p>
    </div>

    <section class="flex flex-col gap-4">
        <h2 class="text-fc-lg font-semibold text-fc-fg">Rideau</h2>
        <p class="text-fc-sm text-fc-fg-muted">
            The full-page curtain, and the reason this section sits at the top: it is anchored
            to the top of the page, so it is only worth pressing from here.
        </p>
        <Button
            variant="outline"
            icon={icons.arrow}
            class="self-start"
            onclick={() => curtain?.close('#/dashboard')}
        >
            Curtain out to Dashboard
        </Button>
    </section>

    <section class="flex flex-col gap-4">
        <h2 class="text-fc-lg font-semibold text-fc-fg">TextElevate</h2>
        <p class="text-fc-sm text-fc-fg-muted">
            A line that rises into place. Used for the sidebar title and every nav label, which
            is why it caps itself at the parent width instead of shrink-wrapping.
        </p>
        <Card class="flex min-h-24 items-center">
            <TextElevate
                text="One login, zero cloud dependency."
                visible={heading}
                class="text-fc-xl font-semibold text-fc-fg"
            />
        </Card>
        <Switch bind:checked={heading} label="Show the line" class="text-fc-sm" />
    </section>

    <section class="flex flex-col gap-4">
        <h2 class="text-fc-lg font-semibold text-fc-fg">WordReveal</h2>
        <p class="text-fc-sm text-fc-fg-muted">
            Words brighten one by one, scrubbed against the scroll position.
        </p>
        <Card class="min-h-40">
            {#if scrollerReady}
                <WordReveal
                    text="Facile builds self-hosted tools for creative studios. Every app federates to one identity provider, emits its events onto one pool, and ships with the same palette, the same typography and the same settings page."
                />
            {/if}
        </Card>
    </section>

    <section class="flex flex-col gap-4">
        <h2 class="text-fc-lg font-semibold text-fc-fg">Carousel</h2>
        <p class="text-fc-sm text-fc-fg-muted">
            Snap scrolling with real arrows, because the scrollbar is hidden suite-wide and a
            scroll area with no affordance is a dead end.
        </p>
        <Carousel slides={releases} ariaLabel="Release notes">
            {#snippet children(release)}
                <Card class="mr-2 flex min-h-40 flex-col gap-2">
                    <Badge tone="accent">{release.version}</Badge>
                    <p class="text-fc-md font-semibold text-fc-fg">{release.title}</p>
                    <p class="text-fc-sm text-fc-fg-muted">{release.body}</p>
                </Card>
            {/snippet}
        </Carousel>
    </section>

    <section class="flex flex-col gap-4">
        <h2 class="text-fc-lg font-semibold text-fc-fg">Mosaique</h2>
        <p class="text-fc-sm text-fc-fg-muted">
            Cards scatter from the centre without overlapping, and re-place themselves when the
            container width changes. Each card has to hand its element back through the third
            snippet argument or nothing gets positioned.
        </p>
        <div class="overflow-hidden rounded-fc-md bg-fc-component">
            <Mosaique items={tiles} class="h-[32rem]">
                {#snippet children(tile, _i, ref)}
                    <button
                        type="button"
                        use:ref
                        class="flex w-40 flex-col gap-1 rounded-fc-md bg-fc-surface p-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fc-ring"
                    >
                        <span class="text-fc-md font-semibold text-fc-fg">{tile.label}</span>
                        <span class="text-fc-xs text-fc-fg-muted">{tile.note}</span>
                    </button>
                {/snippet}
            </Mosaique>
        </div>
    </section>
</div>
