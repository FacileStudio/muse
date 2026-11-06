<script module lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLAttributes } from 'svelte/elements';
    import type { LandingLink } from '../../utils/landing.js';

    export interface LandingHeaderProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
        /** Shown next to the icon, and as the home link's name. */
        appName?: string;
        /** Iconify name drawn before `appName`. */
        icon?: string;
        /** Replaces the icon and the name. Give the home link a visible name or set `appName`. */
        brand?: Snippet;
        /** Where the brand points. Anything unsafe falls back to `/`. */
        homeHref?: string;
        /** Section or page links. Unsafe hrefs are dropped; `active` marks the current one. */
        links?: LandingLink[];
        /** The bar's right side and the foot of the drawer. Defaults to `SignInWithFacile`. Rendered in the bar and in the drawer: do not put ids in it. */
        actions?: Snippet;
        /** An in-page target (`#main`). When set, a skip link is the first thing a keyboard reaches. */
        skipHref?: string;
        class?: string;
    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';
    import { getI18n } from '../../i18n/context.svelte.js';
    import { icons } from '../../icons.js';
    import { landingHref, linkAttrs, safeLinks, watchScrolled } from '../../utils/landing.js';
    import Icon from '../atoms/Icon.svelte';
    import IconButton from '../atoms/IconButton.svelte';
    import SignInWithFacile from '../atoms/SignInWithFacile.svelte';
    import LandingDrawer from './LandingDrawer.svelte';

    let {
        appName,
        icon,
        brand,
        homeHref,
        links: linksProp = [],
        actions,
        skipHref,
        class: className = '',
        ...rest
    }: LandingHeaderProps = $props();

    const i18n = getI18n();
    const drawerId = $props.id();
    const links = $derived(safeLinks(linksProp));
    const home = $derived(landingHref(homeHref) ?? '/');
    const skip = $derived(landingHref(skipHref));

    let wrapper: HTMLDivElement | null = $state(null);
    let scrolled = $state(false);
    let open = $state(false);
    let trigger: HTMLButtonElement | null = null;

    let navEl: HTMLElement | null = $state(null);
    let items: HTMLAnchorElement[] = $state([]);
    let pill = $state<{ x: number; w: number } | null>(null);
    let glide = $state(false);
    const current = $derived(links.findIndex((l) => l.active));

    function openDrawer(event: MouseEvent & { currentTarget: HTMLButtonElement }) {
        trigger = event.currentTarget;
        open = true;
    }

    function measure() {
        const el = current >= 0 ? items[current] : undefined;
        pill = el && el.offsetWidth > 0 ? { x: el.offsetLeft, w: el.offsetWidth } : null;
    }

    $effect(() => (wrapper ? watchScrolled(wrapper, (value) => (scrolled = value)) : undefined));

    $effect(() => {
        void links;
        void current;
        measure();
        if (glide) return;
        const frame = requestAnimationFrame(() => (glide = true));
        return () => cancelAnimationFrame(frame);
    });

    $effect(() => {
        if (!navEl) return;
        const observer = new ResizeObserver(measure);
        observer.observe(navEl);
        return () => observer.disconnect();
    });

    $effect(() => {
        const query = window.matchMedia('(min-width: 64rem)');
        const close = () => query.matches && (open = false);
        query.addEventListener('change', close);
        return () => query.removeEventListener('change', close);
    });

    const wrapClasses = $derived(
        twMerge(
            'fc-chrome pointer-events-none sticky top-0 z-30 h-(--fc-h) w-full transition-[padding] duration-500 ease-fc motion-reduce:transition-none',
            scrolled ? 'px-3' : 'px-4 sm:px-6 md:px-10'
        )
    );

    const barClasses = $derived(
        twMerge(
            'pointer-events-auto mx-auto flex h-full w-full min-w-0 items-center justify-between gap-(--fc-pad) p-(--fc-pad) transition-[max-width,translate,border-radius,background-color,backdrop-filter] duration-500 ease-fc motion-reduce:transition-none',
            scrolled
                ? 'max-w-fc-lg translate-y-3 rounded-fc-outer bg-fc-surface/65 backdrop-blur-xl'
                : 'max-w-fc-xl translate-y-0 rounded-none bg-fc-page/80 backdrop-blur-md',
            className
        )
    );

    const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fc-ring';
    const linkBase = `relative z-10 inline-flex h-(--fc-ctl) items-center gap-1.5 rounded-fc-inner px-4 text-fc-sm font-medium whitespace-nowrap transition-colors duration-200 ${FOCUS}`;
    const linkTone = (active: boolean | undefined) =>
        active
            ? pill
                ? 'text-fc-accent-fg'
                : 'bg-fc-accent text-fc-accent-fg'
            : 'text-fc-fg-muted hover:text-fc-fg';
    const brandClasses = `inline-flex h-(--fc-ctl) min-w-0 shrink-0 items-center gap-2 rounded-fc-inner px-3 text-fc-md font-semibold text-fc-fg transition-colors hover:bg-fc-component/70 ${FOCUS}`;
    const roundClasses = 'size-(--fc-ctl) rounded-fc-inner border-0 bg-fc-surface/70 text-fc-fg hover:bg-fc-surface';
</script>

<!--
@component
La barre du haut d'une page d'atterrissage : collée en haut, elle se resserre en pilule flottante au défilement, sans décaler le contenu, et devient un tiroir sur mobile.
-->

{#snippet brandView()}
    {#if brand}
        {@render brand()}
    {:else}
        {#if icon}<Icon {icon} size={22} />{/if}
        {#if appName}<span class="truncate">{appName}</span>{/if}
    {/if}
{/snippet}

{#snippet actionsView()}
    {#if actions}{@render actions()}{:else}<SignInWithFacile />{/if}
{/snippet}

{#if skip}
    <a
        href={skip}
        class="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:inline-flex focus:h-11 focus:items-center focus:rounded-fc-pill focus:bg-fc-accent focus:px-5 focus:text-fc-sm focus:font-semibold focus:text-fc-accent-fg {FOCUS}"
    >
        {i18n.t('landing.skip')}
    </a>
{/if}

<div bind:this={wrapper} class={wrapClasses}>
    <header class={barClasses} {...rest}>
        <a href={home} aria-label={appName ? undefined : i18n.t('landing.home')} class={brandClasses}>
            {@render brandView()}
        </a>

        <nav bind:this={navEl} aria-label={i18n.t('landing.primary')} class="relative hidden items-center gap-(--fc-pad) lg:flex">
            {#if pill}
                <span
                    aria-hidden="true"
                    class="pointer-events-none absolute inset-y-0 left-0 rounded-fc-inner bg-fc-accent motion-reduce:transition-none {glide ? 'transition-[translate,width] duration-300 ease-fc' : ''}"
                    style:translate="{pill.x}px 0"
                    style:width="{pill.w}px"
                ></span>
            {/if}
            {#each links as link, i (link.href + link.label)}
                <a
                    bind:this={items[i]}
                    href={link.href}
                    aria-current={link.active ? 'location' : undefined}
                    {...linkAttrs(link)}
                    class="{linkBase} {linkTone(link.active)}"
                >
                    {#if link.icon}<Icon icon={link.icon} size={16} />{/if}
                    <span>{link.label}</span>
                    {#if link.external}<span class="sr-only">{i18n.t('landing.newTab')}</span>{/if}
                </a>
            {/each}
        </nav>

        <div class="flex shrink-0 items-center gap-(--fc-pad)">
            <div class="hidden items-center gap-(--fc-pad) sm:flex">{@render actionsView()}</div>
            <IconButton
                variant="ghost"
                class="{roundClasses} lg:hidden"
                aria-label={i18n.t('landing.menu.open')}
                aria-expanded={open}
                aria-controls={drawerId}
                aria-haspopup="dialog"
                onclick={openDrawer}
            >
                <Icon icon={icons.menu} size={18} />
            </IconButton>
        </div>
    </header>
</div>

<LandingDrawer
    id={drawerId}
    bind:open
    {links}
    {home}
    {appName}
    {brandView}
    {actionsView}
    {brandClasses}
    {roundClasses}
    onClosed={(restore) => restore && trigger?.focus()}
/>
