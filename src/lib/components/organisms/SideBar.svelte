<script lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';
    import { slide } from 'svelte/transition';
    import { gsap } from 'gsap';
    import { twMerge } from '../../utils/cn.js';
    import NavButton from '../molecules/NavButton.svelte';
    import SpaceSwitcher from '../molecules/SpaceSwitcher.svelte';
    import TextElevate from '../motion/TextElevate.svelte';
    import { icons } from '../../icons.js';
    import { prefersReducedMotion } from '../../utils/motion.js';
    import { springPress } from '../../utils/press.js';

    type Page = { label: string; href: string; icon?: string; active?: boolean };
    type User = { name: string; avatar?: string };
    type SpaceItem = { id: string; name: string };

    let {
        icon,
        title = '',
        pages = [],
        user,
        userHref,
        userActive = false,
        collapsed = $bindable(false),
        showSearch = false,
        spaces = [],
        activeSpaceId = null,
        onSpaceSelect,
        manageSpacesHref,
        class: className = '',
        ...rest
    }: HTMLAttributes<HTMLDivElement> & {
        icon?: string;
        title?: string;
        pages?: Page[];
        user?: User;
        userHref?: string;
        userActive?: boolean;
        collapsed?: boolean;
        showSearch?: boolean;
        spaces?: SpaceItem[];
        activeSpaceId?: string | null;
        onSpaceSelect?: (id: string | null) => void;
        manageSpacesHref?: string;
        class?: string;
    } = $props();

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
            duration: 0.3,
            ease: 'power3.inOut',
            onComplete: () => {
                narrow = isCollapsed;
                tween = null;
            }
        });
    });
</script>

<div
    bind:this={navEl}
    class={twMerge('relative bg-fc-component rounded-fc-lg flex flex-col justify-between h-full min-h-0 gap-6 overflow-hidden py-5 px-3', className)}
    {...rest}
>
    <div class="flex flex-col [&>*+*]:mt-5">
        <div class={twMerge('flex min-h-7 items-center gap-2.5 pt-1', narrow ? 'justify-center px-0' : 'px-2')}>
            {#if icon}<iconify-icon {icon} width="24" height="24" class="block shrink-0"></iconify-icon>{/if}
            {#if !narrow}
                <span class="flex min-w-0 flex-1 items-center text-fc-xl font-semibold text-fc-fg overflow-hidden">
                    <TextElevate text={title} visible={!narrow} class="truncate" />
                </span>
            {/if}
        </div>

        {#if spaces.length > 0 && !collapsed}
            <div
                class="w-fc-nav-content shrink-0"
                transition:slide={{ duration: prefersReducedMotion() ? 0 : 300 }}
            >
                <SpaceSwitcher {spaces} activeId={activeSpaceId} onSelect={onSpaceSelect} manageHref={manageSpacesHref} />
            </div>
        {/if}

        {#if showSearch}
            <div class="flex flex-col gap-1">
                <NavButton icon={icons.search} label="Search" collapsed={narrow}>
                    {#snippet right()}
                        <span class="text-fc-xs opacity-50 shrink-0">⌘K</span>
                    {/snippet}
                </NavButton>
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
            </div>
        {/if}

        <nav class="flex flex-col gap-1">
            {#each pages as page (page.href)}
                <NavButton href={page.href} icon={page.icon} label={page.label} active={page.active} collapsed={narrow}>
                    {#snippet right()}
                        {#if page.active}
                            <iconify-icon icon={icons.arrow} width="16" height="16" class="block shrink-0 opacity-70"></iconify-icon>
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
                    <iconify-icon icon={icons.settings} width="18" height="18" class="block shrink-0"></iconify-icon>
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
