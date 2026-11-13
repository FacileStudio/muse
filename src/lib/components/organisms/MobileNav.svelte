<script module lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';
    import type { UserMenuOptions } from '../../utils/user-menu.js';
    import type { UserMenuUser } from './UserMenu.svelte';

    export type NavItem = {
        href: string;
        label: string;
        icon: string;
        active?: boolean;
        /** Draws a dot on the icon when above 0. The count itself is spoken through `hint`. */
        badge?: number;
        /** Draws the dot for work in progress. */
        busy?: boolean;
        /** Spoken after the label, for example "3 new ideas". */
        hint?: string;
    };

    export type User = UserMenuUser;

    export interface MobileNavProps extends HTMLAttributes<HTMLElement> {
        items?: NavItem[];
        user?: User;
        /** The Settings row of the user menu. `userMenu.settingsHref` wins when both are set. */
        profileHref?: string;
        profileActive?: boolean;
        /** The same user menu as the sidebar card, opened as a bottom sheet from the avatar. */
        userMenu?: UserMenuOptions;
        class?: string;

    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';
    import Icon from '../atoms/Icon.svelte';
    import Tooltip from '../atoms/Tooltip.svelte';
    import UserMenu from './UserMenu.svelte';

    let {
        items = [],
        user,
        profileHref,
        profileActive = false,
        userMenu,
        class: className = '',
        ...rest
    }: MobileNavProps = $props();
</script>

<!--
@component
La barre-pilule flottante des écrans étroits. Quatre entrées tiennent au plancher de 360px.
-->

<!-- z-50 is deliberate: viewport-fixed chrome sits above every in-page layer. -->
<nav
    class={twMerge('fixed inset-x-0 z-50 flex justify-center px-2 sm:px-4 md:hidden', className)}
    style="bottom: max(0.75rem, env(safe-area-inset-bottom))"
    {...rest}
>
    <!--
      The width budget is real and it is tight. At the 360px floor: 360 − 16 (px-2) − 8 (p-1)
      leaves 336px, and seven 44px targets with six 2px gaps come to 320. So **six items plus
      the avatar is the ceiling**, and it only fits because the padding and gaps shrink under
      `sm:`. Items were px-3.5/py-2 — 50×38, which both overflowed past four items and missed
      the 44px hit target by 6px vertically.

      `overflow-x-auto` is the safety valve, not the plan: scrollbars are hidden globally, so
      a seventh item degrades to a strip you can swipe with a partial pill showing at the edge
      rather than a bar running off screen. If you need seven destinations on a phone, the nav
      is wrong — move one behind the space switcher or the page it belongs to.
    -->
    <div class="flex max-w-full items-center gap-0.5 overflow-x-auto rounded-fc-pill bg-fc-bg/70 p-1 shadow-lg backdrop-blur-2xl backdrop-saturate-150 sm:gap-1 sm:p-1.5">
        {#each items as item (item.href)}
            <Tooltip text={item.label} describe={false} class="contents">
                <a
                    href={item.href}
                    aria-label={item.hint ? `${item.label}, ${item.hint}` : item.label}
                    aria-current={item.active ? 'page' : undefined}
                    class={twMerge(
                        'flex size-fc-nav-item shrink-0 items-center justify-center rounded-fc-pill transition-all duration-200',
                        item.active
                            ? 'bg-fc-accent text-fc-accent-fg shadow-sm'
                            : 'text-fc-fg-muted hover:bg-fc-surface hover:text-fc-fg'
                    )}
                >
                    <span class="relative flex">
                        <Icon icon={item.icon} size={22} />
                        {#if item.badge || item.busy}
                            <span
                                class="absolute -top-0.5 -right-1 size-2.5 rounded-fc-pill bg-fc-info motion-safe:animate-pulse"
                                aria-hidden="true"
                            ></span>
                        {/if}
                    </span>
                </a>
            </Tooltip>
        {/each}

        {#if user}
            <UserMenu
                {user}
                trigger="avatar"
                presentation="sheet"
                active={profileActive}
                settingsHref={profileHref}
                {...userMenu}
            />
        {/if}
    </div>
</nav>
