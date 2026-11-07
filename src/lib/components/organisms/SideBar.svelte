<script module lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';
    import type { UserMenuOptions } from '../../utils/user-menu.js';
    import type { UserMenuUser } from './UserMenu.svelte';

    export type Page = {
        label: string;
        href: string;
        icon?: string;
        active?: boolean;
        /**
         * Optional section heading. A run of consecutive pages sharing a group renders under
         * one label; the heading is hidden while the rail is collapsed, because a 68px column
         * has no room for it and the icons still read as a list.
         */
        group?: string;
    };

    export type User = UserMenuUser;

    export type SpaceItem = { id: string; name: string };

    export interface SideBarProps extends HTMLAttributes<HTMLDivElement> {
        icon?: string;
        title?: string;
        pages?: Page[];
        user?: User;
        /** The Settings row of the user menu. `userMenu.settingsHref` wins when both are set. */
        userHref?: string;
        userActive?: boolean;
        /** The user menu: app rows before Settings, a subscription link, help, sign out, and any label. */
        userMenu?: UserMenuOptions;
        collapsed?: boolean;
        showSearch?: boolean;
        showCollapse?: boolean;
        onSearch?: () => void;
        spaces?: SpaceItem[];
        activeSpaceId?: string | null;
        onSpaceSelect?: (id: string | null) => void;
        manageSpacesHref?: string;
        /** Forwarded as the switcher's `personalLabel`. `null` removes the personal row. */
        personalSpaceLabel?: string | null;
        manageSpacesLabel?: string;
        class?: string;

    }
</script>

<script lang="ts">
    import { cubicInOut } from 'svelte/easing';
    import { gsap } from 'gsap';
    import { twMerge } from '../../utils/cn.js';
    import { getI18n } from '../../i18n/context.svelte.js';
    import Icon from '../atoms/Icon.svelte';
    import NavButton from '../molecules/NavButton.svelte';
    import SpaceSwitcher from '../molecules/SpaceSwitcher.svelte';
    import TextElevate from '../motion/TextElevate.svelte';
    import { icons } from '../../icons.js';
    import { prefersReducedMotion } from '../../utils/motion.js';
    import UserMenu from './UserMenu.svelte';

    let {
        icon,
        title = '',
        pages = [],
        user,
        userHref,
        userActive = false,
        userMenu,
        collapsed = $bindable(false),
        showSearch = false,
        showCollapse = true,
        onSearch,
        spaces = [],
        activeSpaceId = null,
        onSpaceSelect,
        manageSpacesHref,
        personalSpaceLabel,
        manageSpacesLabel,
        class: className = '',
        ...rest
    }: SideBarProps = $props();

    const i18n = getI18n();

    let navEl: HTMLElement | null = $state(null);
    let ready = false;
    let tween: ReturnType<typeof gsap.to> | null = null;

    let narrow = $state(false);

    const FALLBACK_WIDTH = { collapsed: 68, expanded: 220 };
    const RAIL_DURATION = 0.3;

    function railWidth(el: HTMLElement, isCollapsed: boolean): number {
        const token = isCollapsed ? '--width-fc-nav-collapsed' : '--width-fc-nav-expanded';
        const fallback = isCollapsed ? FALLBACK_WIDTH.collapsed : FALLBACK_WIDTH.expanded;
        if (typeof window === 'undefined') return fallback;
        const parsed = Number.parseFloat(getComputedStyle(el).getPropertyValue(token));
        return Number.isFinite(parsed) ? parsed : fallback;
    }

    $effect(() => {
        const isCollapsed = collapsed;
        if (!navEl) return;
        const w = railWidth(navEl, isCollapsed);
        tween?.kill();
        tween = null;
        if (!ready || prefersReducedMotion()) {
            gsap.set(navEl, { width: w });
            narrow = isCollapsed;
            ready = true;
            return;
        }
        if (!isCollapsed) narrow = false;
        tween = gsap.to(navEl, {
            width: w,
            duration: RAIL_DURATION,
            ease: 'power3.inOut',
            onComplete: () => {
                narrow = isCollapsed;
                tween = null;
            }
        });
    });

    $effect(() => {
        if (!showCollapse && !onSearch) return;
        const onKeydown = (e: KeyboardEvent) => {
            if (!(e.metaKey || e.ctrlKey) || e.altKey) return;
            const key = e.key.toLowerCase();
            if (key === 'd' && showCollapse) {
                e.preventDefault();
                collapsed = !collapsed;
            } else if (key === 'k' && onSearch) {
                e.preventDefault();
                onSearch();
            }
        };
        document.addEventListener('keydown', onKeydown);
        return () => document.removeEventListener('keydown', onKeydown);
    });

    const FADE_START = 0.45;

    function switcherReveal(node: HTMLElement) {
        const height = node.offsetHeight;
        const marginTop = Number.parseFloat(getComputedStyle(node).marginTop) || 0;
        return {
            duration: prefersReducedMotion() ? 0 : RAIL_DURATION * 1000,
            easing: cubicInOut,
            css: (t: number, u: number) => {
                const fade = Math.max(0, (t - FADE_START) / (1 - FADE_START));
                return `overflow: hidden; height: ${t * height}px; margin-top: ${t * marginTop}px; opacity: ${fade}; transform: translateY(${-u * 8}px)`;
            }
        };
    }

    const secondary = $derived(
        user?.secondary ?? user?.email ?? spaces.find((space) => space.id === activeSpaceId)?.name
    );
</script>

<!--
@component
Le rail de navigation, une carte flottante et repliable. Il porte la navigation, le sélecteur d'espace et la carte utilisateur.
-->

<div
    bind:this={navEl}
    class={twMerge('relative bg-fc-component rounded-fc-lg flex flex-col justify-between h-full min-h-0 gap-6 overflow-hidden py-5 px-3', className)}
    {...rest}
>
    <!--
        The nav column scrolls, the rail does not. The root keeps `overflow-hidden` because the
        width tween would otherwise show content spilling past a shrinking rail, so a list
        taller than the viewport was simply clipped with no way to reach the rest of it.

        `min-h-0` is load-bearing: a flex child will not shrink below its content without it, so
        `overflow-y-auto` would never engage and the column would just push the user card off
        the bottom. `overscroll-contain` is the other half — without it a flick past either end
        chains into the document, which on a phone reads as "the page scrolls instead of the
        menu". The scrollbar stays hidden, as everywhere else in the suite.
    -->
    <div class="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain [&>*+*]:mt-5">
        <div class={twMerge('flex min-h-7 items-center gap-2.5 pt-1', narrow ? 'justify-center px-0' : 'px-2')}>
            {#if icon}<Icon {icon} size={24} />{/if}
            {#if !narrow}
                <!--
                  This lockup used to carry `translate-y-[0.04em]`, an optical correction
                  computed from the bundled face's own metrics (typoAscender 810 /
                  typoDescender 190 against capHeight 700 per 1000 upm). That face is gone and
                  the platform stack resolves to a different font per OS, so there is no single
                  number left to derive. A hardcoded nudge would now be guesswork on two
                  platforms out of three; alignment falls back to the line box until a licensed
                  face with known metrics comes back.
                -->
                <span class="flex min-w-0 flex-1 items-center text-fc-xl font-semibold text-fc-fg overflow-hidden">
                    <TextElevate text={title} visible={!narrow} class="truncate" />
                </span>
            {/if}
        </div>

        {#if spaces.length > 0 && !collapsed}
            <div class="w-fc-nav-content shrink-0" transition:switcherReveal>
                <!-- Every label the switcher takes is forwarded. It is the only way a consumer
                     can reach them through the rail, and the two that were missing meant an app
                     whose unscoped context is not called "Personal" simply could not say so. -->
                <SpaceSwitcher
                    {spaces}
                    activeId={activeSpaceId}
                    onSelect={onSpaceSelect}
                    manageHref={manageSpacesHref}
                    personalLabel={personalSpaceLabel}
                    manageLabel={manageSpacesLabel}
                />
            </div>
        {/if}

        {#if showSearch || showCollapse}
            <div class="flex flex-col gap-1">
                {#if showSearch}
                    <NavButton icon={icons.search} label={i18n.t('sideBar.search')} collapsed={narrow} onclick={onSearch}>
                        {#snippet right()}
                            <!-- No handler, no chip: the shortcut hint is a promise, and an
                                 unwired Search row cannot keep it. -->
                            {#if onSearch}
                                <span class="text-fc-xs opacity-50 shrink-0">⌘K</span>
                            {/if}
                        {/snippet}
                    </NavButton>
                {/if}
                {#if showCollapse}
                    <NavButton
                        icon={icons.collapse}
                        label={i18n.t('sideBar.collapse')}
                        collapsed={narrow}
                        onclick={() => (collapsed = !collapsed)}
                        aria-label={i18n.t(collapsed ? 'sideBar.expand' : 'sideBar.collapse')}
                    >
                        {#snippet right()}
                            <span class="text-fc-xs opacity-50 shrink-0">⌘D</span>
                        {/snippet}
                    </NavButton>
                {/if}
            </div>
        {/if}

        <nav class="flex flex-col gap-1">
            {#each pages as page, i (page.href)}
                <!-- The heading prints when the group changes, so grouping is expressed by the
                     order of the array rather than by a second nesting level in the prop. A
                     flat list with no `group` behaves exactly as before. -->
                {#if page.group && page.group !== pages[i - 1]?.group}
                    <p
                        class={twMerge(
                            'px-3 pt-4 pb-1 text-fc-xs font-semibold tracking-wide text-fc-fg-muted uppercase',
                            narrow && 'sr-only'
                        )}
                    >
                        {page.group}
                    </p>
                {/if}
                <NavButton href={page.href} icon={page.icon} label={page.label} active={page.active} collapsed={narrow}>
                    {#snippet right()}
                        {#if page.active}
                            <Icon icon={icons.arrow} size={16} class="opacity-70" />
                        {/if}
                    {/snippet}
                </NavButton>
            {/each}
        </nav>
    </div>

    {#if user}
        <UserMenu
            user={{ ...user, secondary }}
            narrow={narrow}
            active={userActive}
            settingsHref={userHref}
            {...userMenu}
        />
    {/if}
</div>
