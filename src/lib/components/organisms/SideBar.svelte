<script lang="ts">
    import { gsap } from 'gsap';
    import { twMerge } from '../../utils/cn.js';
    import NavButton from '../molecules/NavButton.svelte';
    import SpaceSwitcher from '../molecules/SpaceSwitcher.svelte';
    import TextElevate from '../motion/TextElevate.svelte';
    import { icons } from '../../icons.js';
    import { prefersReducedMotion } from '../../utils/motion.js';

    type Page = { label: string; href: string; icon?: string; active?: boolean };
    type User = { name: string; avatar?: string };
    type SpaceItem = { id: string; name: string };

    let {
        icon,
        title = '',
        pages = [],
        user,
        collapsed = $bindable(false),
        showSearch = false,
        spaces = [],
        activeSpaceId = null,
        onSpaceSelect,
        manageSpacesHref,
        class: className = ''
    }: {
        icon?: string;
        title?: string;
        pages?: Page[];
        user?: User;
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

    const stagger = (i: number) => (collapsed ? 0 : 0.2) + i * 0.06;

    $effect(() => {
        if (!navEl) return;
        const w = collapsed ? 77 : 220;
        if (!ready) {
            gsap.set(navEl, { width: w });
            ready = true;
            return;
        }
        if (prefersReducedMotion()) {
            gsap.set(navEl, { width: w });
            return;
        }
        gsap.to(navEl, { width: w, duration: 0.5, delay: 0.1, ease: 'power2.inOut' });
    });

    function springPress(node: HTMLElement) {
        function down() {
            if (prefersReducedMotion()) return;
            gsap.killTweensOf(node, 'scale');
            gsap.to(node, {
                scale: 0.9,
                duration: 0.5,
                ease: 'power2.inOut',
                onComplete: () => gsap.to(node, { scale: 1, duration: 0.2, ease: 'power3.in' })
            });
        }
        node.addEventListener('pointerdown', down);
        return { destroy() { node.removeEventListener('pointerdown', down); } };
    }
</script>

<div
    bind:this={navEl}
    class={twMerge('relative bg-fc-component rounded-fc-lg flex flex-col justify-between h-full min-h-0 gap-6 overflow-hidden py-5 px-3', className)}
>
    <div class="flex flex-col gap-5">
        <div class={twMerge('flex items-center gap-2.5 pt-1', collapsed ? 'justify-center px-0' : 'px-2')}>
            {#if icon}<iconify-icon {icon} width="24" height="24" class="block shrink-0 text-fc-fg"></iconify-icon>{/if}
            {#if !collapsed}
                <span class="flex flex-1 items-center text-fc-xl font-semibold text-fc-fg overflow-hidden">
                    <TextElevate text={title} visible={!collapsed} delay={stagger(0)} />
                </span>
            {/if}
        </div>

        {#if spaces.length > 0 && !collapsed}
            <SpaceSwitcher {spaces} {activeSpaceId} onSelect={onSpaceSelect} manageHref={manageSpacesHref} />
        {/if}

        {#if showSearch}
            <div class="flex flex-col gap-1">
                <NavButton icon={icons.search} label="Search" {collapsed} textDelay={stagger(1)}>
                    {#snippet right()}
                        <span class="text-fc-xs opacity-50 shrink-0">⌘K</span>
                    {/snippet}
                </NavButton>
                <NavButton
                    icon={icons.collapse}
                    label="Collapse"
                    {collapsed}
                    textDelay={stagger(2)}
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
            {#each pages as page, i (page.href)}
                <NavButton href={page.href} icon={page.icon} label={page.label} active={page.active} {collapsed} textDelay={stagger((showSearch ? 3 : 1) + i)}>
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
        <button
            type="button"
            use:springPress
            class={twMerge(
                'flex items-center gap-2.5 rounded-fc-md text-fc-sm transition-colors hover:bg-fc-surface text-fc-fg overflow-hidden',
                collapsed ? 'size-11 shrink-0 self-center justify-center px-0 py-0' : 'w-full min-h-11 px-2.5 py-2.5'
            )}
        >
            {#if user.avatar}
                <img src={user.avatar} alt={user.name} class="h-7 w-7 rounded-fc-pill border border-fc-border object-cover shrink-0" />
            {:else}
                <span class="h-7 w-7 shrink-0 rounded-fc-pill bg-fc-accent text-fc-accent-fg flex items-center justify-center text-fc-xs font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                </span>
            {/if}
            {#if !collapsed}
                <span class="flex flex-1 items-center justify-between gap-2 overflow-hidden">
                    <TextElevate text={user.name} visible={!collapsed} delay={stagger((showSearch ? 3 : 1) + pages.length)} />
                    <iconify-icon icon={icons.settings} width="18" height="18" class="block shrink-0 text-fc-fg-muted"></iconify-icon>
                </span>
            {/if}
        </button>
    {/if}
</div>
