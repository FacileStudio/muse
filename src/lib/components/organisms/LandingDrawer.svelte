<script module lang="ts">
    import type { Snippet } from 'svelte';
    import type { LandingLink } from '../../utils/landing.js';

    export interface LandingDrawerProps {
        id: string;
        open?: boolean;
        links: LandingLink[];
        home: string;
        appName?: string;
        brandView: () => ReturnType<Snippet>;
        actionsView: () => ReturnType<Snippet>;
        brandClasses: string;
        roundClasses: string;
        onClosed: (restoreFocus: boolean) => void;
    }
</script>

<script lang="ts">
    import { gsap } from 'gsap';
    import { getI18n } from '../../i18n/context.svelte.js';
    import { icons } from '../../icons.js';
    import { createDialog } from '../../utils/dialog.js';
    import { linkAttrs } from '../../utils/landing.js';
    import { prefersReducedMotion } from '../../utils/motion.js';
    import Icon from '../atoms/Icon.svelte';
    import Tooltip from '../atoms/Tooltip.svelte';
    import IconButton from '../atoms/IconButton.svelte';

    let {
        id,
        open = $bindable(false),
        links,
        home,
        appName,
        brandView,
        actionsView,
        brandClasses,
        roundClasses,
        onClosed
    }: LandingDrawerProps = $props();

    const i18n = getI18n();
    const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fc-ring';

    let dialogEl: HTMLDialogElement | null = $state(null);
    let panel: HTMLDivElement | null = $state(null);
    let tween: ReturnType<typeof gsap.to> | null = null;
    let fromLink = false;

    const dialog = createDialog({
        element: () => dialogEl,
        open: () => open,
        setOpen: (value) => (open = value),
        surface: () => panel,
        enter(_el, fresh) {
            tween?.kill();
            tween = null;
            panel?.querySelector('button')?.focus();
            if (!panel || prefersReducedMotion()) return;
            if (fresh) gsap.set(panel, { xPercent: 110 });
            tween = gsap.to(panel, { xPercent: 0, duration: 0.34, ease: 'power3.out' });
        },
        exit(_el, done) {
            tween?.kill();
            tween = null;
            if (!panel || prefersReducedMotion()) return done();
            tween = gsap.to(panel, { xPercent: 110, duration: 0.26, ease: 'power3.in', onComplete: done });
        },
        closed() {
            tween?.kill();
            tween = null;
            if (panel) gsap.set(panel, { xPercent: 0 });
            const restore = !fromLink;
            fromLink = false;
            onClosed(restore);
        }
    });

    function followLink() {
        fromLink = true;
        open = false;
    }

    $effect(() => dialog.sync());
</script>

<!--
@component
Le tiroir de LandingHeader, interne : un dialog natif qui glisse depuis la droite. Un clic sur un lien ne rend pas le focus au bouton du menu, pour que le focus suive la cible.
-->

<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_noninteractive_element_interactions -->
<dialog
    bind:this={dialogEl}
    {id}
    aria-label={i18n.t('landing.menu.title')}
    class="fc-chrome m-0 h-dvh max-h-none w-full max-w-none bg-transparent p-3 text-fc-fg backdrop:bg-fc-scrim backdrop:backdrop-blur-xs lg:hidden"
    {...dialog.handlers}
>
    <div
        bind:this={panel}
        class="ml-auto flex h-full w-72 max-w-full flex-col justify-between gap-6 overflow-y-auto rounded-fc-outer bg-fc-component/95 p-(--fc-pad) backdrop-blur-xl"
    >
        <div class="flex flex-col gap-6">
            <div class="flex items-center justify-between gap-(--fc-pad)">
                <Tooltip text={i18n.t('landing.home')} describe={false} disabled={Boolean(appName)} class="contents">
                    <a href={home} aria-label={appName ? undefined : i18n.t('landing.home')} class={brandClasses} onclick={followLink}>
                        {@render brandView()}
                    </a>
                </Tooltip>
                <IconButton variant="ghost" class={roundClasses} aria-label={i18n.t('landing.menu.close')} onclick={() => (open = false)}>
                    <Icon icon={icons.close} size={18} />
                </IconButton>
            </div>
            <nav aria-label={i18n.t('landing.primary')} class="flex flex-col gap-(--fc-pad)">
                {#each links as link (link.href + link.label)}
                    <a
                        href={link.href}
                        aria-current={link.active ? 'location' : undefined}
                        {...linkAttrs(link)}
                        onclick={followLink}
                        class="inline-flex h-(--fc-ctl) items-center gap-2.5 rounded-fc-inner px-4 text-fc-sm font-medium transition-colors {FOCUS} {link.active ? 'bg-fc-accent text-fc-accent-fg' : 'text-fc-fg-muted hover:bg-fc-surface hover:text-fc-fg'}"
                    >
                        {#if link.icon}<Icon icon={link.icon} size={18} />{/if}
                        <span>{link.label}</span>
                        {#if link.external}<span class="sr-only">{i18n.t('landing.newTab')}</span>{/if}
                    </a>
                {/each}
            </nav>
        </div>
        <div class="flex flex-col gap-(--fc-pad) [&>*]:w-full">{@render actionsView()}</div>
    </div>
</dialog>
