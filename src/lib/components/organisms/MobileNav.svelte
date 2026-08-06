<script lang="ts">
    import { twMerge } from '../../utils/cn.js';
    import Avatar from '../atoms/Avatar.svelte';

    type NavItem = { href: string; label: string; icon: string; active?: boolean };
    type User = { name: string; avatar?: string };

    let {
        items = [],
        user,
        profileHref,
        profileActive = false,
        class: className = ''
    }: {
        items?: NavItem[];
        user?: User;
        profileHref?: string;
        profileActive?: boolean;
        class?: string;
    } = $props();
</script>

<nav
    class={twMerge('fixed inset-x-0 z-50 flex justify-center px-4 md:hidden', className)}
    style="bottom: max(0.75rem, env(safe-area-inset-bottom))"
>
    <div class="flex items-center gap-1 rounded-fc-pill border border-fc-border/40 bg-fc-bg/55 p-1.5 shadow-lg shadow-black/10 ring-1 ring-fc-fg/10 backdrop-blur-2xl backdrop-saturate-150">
        {#each items as item (item.href)}
            <a
                href={item.href}
                aria-label={item.label}
                title={item.label}
                class={twMerge(
                    'flex items-center justify-center rounded-fc-pill px-3.5 py-2 transition-all duration-200',
                    item.active
                        ? 'bg-fc-accent text-fc-accent-fg shadow-sm'
                        : 'text-fc-fg-muted hover:bg-fc-surface hover:text-fc-fg'
                )}
            >
                <iconify-icon icon={item.icon} width="22"></iconify-icon>
            </a>
        {/each}

        {#if profileHref && user}
            <a
                href={profileHref}
                aria-label="Profile"
                title="Profile"
                class={twMerge(
                    'flex items-center justify-center rounded-fc-pill px-2.5 py-1.5 transition-all duration-200',
                    profileActive ? 'bg-fc-accent shadow-sm' : 'hover:bg-fc-surface'
                )}
            >
                <Avatar name={user.name} src={user.avatar} size="sm" class="h-7 w-7 border border-fc-border" />
            </a>
        {/if}
    </div>
</nav>
