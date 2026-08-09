<script module lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';

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

    export type User = { name: string; avatar?: string };

    export type SpaceItem = { id: string; name: string };

    export interface SideBarProps extends HTMLAttributes<HTMLDivElement> {
        icon?: string;
        title?: string;
        pages?: Page[];
        user?: User;
        userHref?: string;
        userActive?: boolean;
        collapsed?: boolean;
        showSearch?: boolean;
        showCollapse?: boolean;
        onSearch?: () => void;
        spaces?: SpaceItem[];
        activeSpaceId?: string | null;
        onSpaceSelect?: (id: string | null) => void;
        manageSpacesHref?: string;
        personalSpaceLabel?: string;
        manageSpacesLabel?: string;
        class?: string;

    }
</script>

<script lang="ts">
    import { cubicInOut } from 'svelte/easing';
    import { gsap } from 'gsap';
    import { twMerge } from '../../utils/cn.js';
    import Icon from '../atoms/Icon.svelte';
    import NavButton from '../molecules/NavButton.svelte';
    import SpaceSwitcher from '../molecules/SpaceSwitcher.svelte';
    import TextElevate from '../motion/TextElevate.svelte';
    import { icons } from '../../icons.js';
    import { prefersReducedMotion } from '../../utils/motion.js';
    import { springPress } from '../../utils/press.js';

    let {
        icon,
        title = '',
        pages = [],
        user,
        userHref,
        userActive = false,
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

    let navEl: HTMLElement | null = $state(null);
    let ready = false;
    let tween: ReturnType<typeof gsap.to> | null = null;

    /*
     * `narrow` is the *visual* state the rows read, and it deliberately lags `collapsed`.
     * Expanding switches the layout first so the growing rail reveals it; collapsing keeps
     * the wide layout and lets the shrinking rail clip it away, switching only once the
     * tween lands. Reading `collapsed` directly in the rows makes the icons jump to the
     * centre of a still-full-width rail before it has moved a pixel.
     */
    let narrow = $state(false);

    /*
     * The rail width is a token, so the tween has to read the token — hardcoding the pair
     * here is how a retheme silently stops reaching the animation. The fallbacks only cover
     * SSR and a consumer that forgot to import the stylesheet.
     */
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

    /*
     * The ⌘K / ⌘D chips shipped for months with nothing bound behind them — decoration
     * describing a keybinding no one had implemented. This is that binding. The handler
     * reads `collapsed` only inside the closure so the effect does not take it as a
     * dependency and tear the listener down on every toggle.
     *
     * Document-scoped, so two mounted SideBars would both answer ⌘D and cancel each other
     * out. Every consumer mounts exactly one rail; if that ever stops being true, this
     * needs an owner rather than a listener per instance.
     */
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

    /*
     * Every other row morphs into the narrow rail; the space switcher is the one that cannot,
     * because it is a fixed-width control and a shrinking rail simply guillotines it. So it
     * leaves on its own terms: lift and fade over the first half of the tween — gone well
     * before the rail is narrow enough to cut it — then hand its height back so the rows below
     * rise on the same curve. Reversed on expand, it waits for the rail to be wide enough to
     * hold it before it appears.
     *
     * cubicInOut is power3.inOut, so this lands on the same curve as the rail beside it.
     */
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
</script>

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
                    <NavButton icon={icons.search} label="Search" collapsed={narrow} onclick={onSearch}>
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
                        label="Collapse"
                        collapsed={narrow}
                        onclick={() => (collapsed = !collapsed)}
                        aria-label={collapsed ? 'Expand' : 'Collapse'}
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
        <!--
            The user card is the only way into settings — there is deliberately no Settings row
            in the nav above. Settings is where you go to change *yourself*, so it hangs off
            your own name; putting it in the nav makes it compete with the app's actual sections
            and, on every screen, buys a permanent row for the page people visit least.

            Active state is the surface fill, not the inverted pill the nav rows use: the avatar
            already carries `bg-fc-accent`, and an inverted card would swallow it whole.
        -->
        {@const u = user}
        {@const userClasses = twMerge(
            'flex items-center gap-2.5 rounded-fc-md text-fc-sm transition-colors hover:bg-fc-surface text-fc-fg overflow-hidden',
            narrow
                ? 'size-fc-nav-item shrink-0 self-center justify-center gap-0 p-0'
                : 'w-full min-h-11 px-2.5 py-2',
            userActive && 'bg-fc-surface'
        )}

        {#snippet userCard()}
            {#if u.avatar}
                <img src={u.avatar} alt="" class="h-7 w-7 rounded-fc-pill object-cover shrink-0" />
            {:else}
                <span class="h-7 w-7 shrink-0 rounded-fc-pill bg-fc-accent text-fc-accent-fg flex items-center justify-center text-fc-xs font-semibold">
                    {u.name.charAt(0).toUpperCase()}
                </span>
            {/if}
            {#if !narrow}
                <span class="flex min-w-0 flex-1 items-center justify-between gap-2 overflow-hidden">
                    <TextElevate text={u.name} visible={!narrow} class="truncate" />
                    <Icon icon={icons.settings} size={18} />
                </span>
            {/if}
        {/snippet}

        {#if userHref}
            <a
                href={userHref}
                aria-current={userActive ? 'page' : undefined}
                aria-label="{u.name} — settings"
                use:springPress
                class={userClasses}
            >
                {@render userCard()}
            </a>
        {:else}
            <button type="button" use:springPress class={userClasses}>
                {@render userCard()}
            </button>
        {/if}
    {/if}
</div>
