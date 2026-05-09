<script lang="ts">
    import { gsap } from 'gsap';
    import { twMerge } from 'tailwind-merge';
    import NavButton from '../molecules/NavButton.svelte';
    import TextElevate from '../motion/TextElevate.svelte';
    import { icons } from '../../icons.js';
    import { prefersReducedMotion } from '../../utils/motion.js';

    type Page = { label: string; href: string; icon?: string; active?: boolean };
    type User = { name: string; avatar?: string };

    let {
        icon,
        title = '',
        pages = [],
        user,
        collapsed = $bindable(false),
        showSearch = false,
        class: className = ''
    }: {
        icon?: string;
        title?: string;
        pages?: Page[];
        user?: User;
        collapsed?: boolean;
        showSearch?: boolean;
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
    class={twMerge('relative bg-fc-component rounded-fc-md flex flex-col justify-between h-full min-h-0 gap-12 overflow-hidden py-7 px-4', className)}
>
    <div class="flex flex-col gap-12">
        <div class="flex items-center gap-2 h-10 px-2 mb-1">
            {#if icon}<iconify-icon {icon} width="28" class="shrink-0 text-fc-fg"></iconify-icon>{/if}
            <span class="flex-1 text-fc-xl font-medium text-fc-fg overflow-hidden">
                <TextElevate text={title} visible={!collapsed} delay={stagger(0)} />
            </span>
        </div>

        <div class="flex flex-col gap-1.5">
            {#if showSearch}
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
            {/if}
        </div>

        <nav class="flex flex-col gap-1.5">
            {#each pages as page, i (page.href)}
                <NavButton href={page.href} icon={page.icon} label={page.label} active={page.active} {collapsed} textDelay={stagger((showSearch ? 3 : 1) + i)}>
                    {#snippet right()}
                        {#if page.active}
                            <iconify-icon icon={icons.arrow} width="12" class="text-fc-fg/66 shrink-0"></iconify-icon>
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
            class="flex w-full items-center gap-2 px-2.5 py-2.5 rounded-fc-md text-fc-md transition-colors hover:bg-fc-fg/7 text-fc-fg overflow-hidden"
        >
            {#if user.avatar}
                <img src={user.avatar} alt={user.name} class="h-6 w-6 rounded-full object-cover shrink-0" />
            {:else}
                <span class="h-6 w-6 shrink-0 rounded-full bg-fc-accent/20 text-fc-accent flex items-center justify-center text-fc-xs font-medium">
                    {user.name.charAt(0).toUpperCase()}
                </span>
            {/if}
            <span class="flex flex-1 items-center justify-between overflow-hidden">
                <TextElevate text={user.name} visible={!collapsed} delay={stagger((showSearch ? 3 : 1) + pages.length)} />
                <iconify-icon icon={icons.settings} width="20" class="shrink-0 text-fc-fg/66"></iconify-icon>
            </span>
        </button>
    {/if}
</div>
