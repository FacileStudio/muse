<script module lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';

    export type SpaceItem = { id: string; name: string };

    export interface SpaceSwitcherProps extends HTMLAttributes<HTMLDivElement> {
        spaces?: SpaceItem[];
        activeId?: string | null;
        onSelect?: (id: string | null) => void;
        /**
         * Label of the unscoped row, selected as `onSelect(null)`.
         * `null` removes the row; only `null`, never `undefined`.
         */
        personalLabel?: string | null;
        manageHref?: string;
        manageLabel?: string;
        class?: string;

    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';
    import Icon from '../atoms/Icon.svelte';
    import { icons } from '../../icons.js';

    let {
        spaces = [],
        activeId = null,
        onSelect,
        personalLabel = 'Personal',
        manageHref,
        manageLabel = 'Manage spaces',
        class: className = '',
        ...rest
    }: SpaceSwitcherProps = $props();

    let open = $state(false);
    let rootEl: HTMLElement | null = $state(null);
    let triggerEl: HTMLButtonElement | null = $state(null);
    let pos = $state<{ left: number; top: number | null; bottom: number | null }>({ left: 0, top: 0, bottom: null });
    let maxHeight = $state(320);
    const activeSpace = $derived(spaces.find((s) => s.id === activeId) ?? null);

    const showPersonal = $derived(personalLabel !== null);
    const visible = $derived(spaces.length > 0);

    const GAP = 4;
    const MARGIN = 8;
    const MIN_HEIGHT = 160;

    // fixed, not absolute: the rail clips its overflow, so a list beside it would be cut off
    function place() {
        if (!triggerEl) return;

        const box = triggerEl.getBoundingClientRect();
        const below = window.innerHeight - box.top - MARGIN;
        const above = box.bottom - MARGIN;
        const up = below < MIN_HEIGHT && above > below;

        pos = {
            left: box.right + GAP,
            top: up ? null : box.top,
            bottom: up ? window.innerHeight - box.bottom : null
        };
        maxHeight = Math.max(MIN_HEIGHT, Math.floor(up ? above : below));
    }

    function select(id: string | null) {
        onSelect?.(id);
        open = false;
    }

    function handleClickOutside(e: MouseEvent) {
        if (rootEl && !rootEl.contains(e.target as Node)) open = false;
    }

    /*
     * Escape has to put focus back on the trigger: dismissing the menu while focus sits on
     * one of its buttons leaves a keyboard user on a node that just left the document, and
     * the browser drops them back at the top of the page.
     */
    function handleKeydown(e: KeyboardEvent) {
        if (e.key !== 'Escape') return;
        e.stopPropagation();
        open = false;
        triggerEl?.focus();
    }

    function toggle() {
        if (!open) place();
        open = !open;
    }

    $effect(() => {
        if (!open) return;
        place();
        document.addEventListener('click', handleClickOutside);
        document.addEventListener('keydown', handleKeydown);
        window.addEventListener('resize', place);
        window.addEventListener('scroll', place, true);
        return () => {
            document.removeEventListener('click', handleClickOutside);
            document.removeEventListener('keydown', handleKeydown);
            window.removeEventListener('resize', place);
            window.removeEventListener('scroll', place, true);
        };
    });
</script>

<!--
@component
Le sélecteur d'espace du rail. Il se retourne vers le haut quand il manque de place sous lui.
Sans espace il ne rend rien, et `personalLabel={null}` retire la ligne personnelle.
-->

{#if visible}
    <div bind:this={rootEl} class={twMerge('relative', className)} {...rest}>
        <button
            bind:this={triggerEl}
            type="button"
            class="flex w-full items-center gap-3 min-h-fc-nav-item rounded-fc bg-fc-surface backdrop-blur-[32px] py-4 pr-4 pl-4.5 text-left text-fc-p transition-colors hover:bg-fc-surface-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fc-brand"
            onclick={toggle}
            aria-expanded={open}
        >
            <Icon icon={activeSpace ? icons.usersGroup : icons.userCircle} size={16} class="text-fc-muted" />
            <span class="min-w-0 flex-1 truncate font-medium text-fc-ink">
                {activeSpace?.name ?? personalLabel}
            </span>
            <Icon icon={icons.arrow} size={16} class="block size-4 shrink-0 text-fc-muted" />
        </button>

        {#if open}
            <div
                class="fixed z-40 flex w-56 flex-col overflow-hidden rounded-fc bg-fc-surface backdrop-blur-[32px] shadow-lg"
                style:left="{pos.left}px"
                style:top={pos.top === null ? null : `${pos.top}px`}
                style:bottom={pos.bottom === null ? null : `${pos.bottom}px`}
                style:max-height="{maxHeight}px"
            >
                <div class="min-h-0 flex-1 overflow-auto p-1">
                    {#if showPersonal}
                        <button
                            type="button"
                            class={twMerge(
                                'flex w-full items-center gap-3 min-h-fc-nav-item rounded-fc py-4 pr-4 pl-4.5 text-left text-fc-p transition-colors',
                                !activeId ? 'fc-selected font-medium' : 'text-fc-ink hover:bg-fc-surface-hover'
                            )}
                            onclick={() => select(null)}
                        >
                            <Icon icon={icons.userCircle} size={16} />
                            <span class="min-w-0 flex-1 truncate">{personalLabel}</span>
                        </button>
                    {/if}

                    {#each spaces as space (space.id)}
                        <button
                            type="button"
                            class={twMerge(
                                'flex w-full items-center gap-3 min-h-fc-nav-item rounded-fc py-4 pr-4 pl-4.5 text-left text-fc-p transition-colors',
                                activeId === space.id ? 'fc-selected font-medium' : 'text-fc-ink hover:bg-fc-surface-hover'
                            )}
                            onclick={() => select(space.id)}
                        >
                            <Icon icon={icons.usersGroup} size={16} />
                            <span class="min-w-0 flex-1 truncate">{space.name}</span>
                        </button>
                    {/each}
                </div>

                {#if manageHref}
                    <div class="p-1">
                        <a
                            href={manageHref}
                            class="flex w-full items-center gap-3 min-h-fc-nav-item rounded-fc py-4 pr-4 pl-4.5 text-left text-fc-p text-fc-muted transition-colors hover:bg-fc-surface-hover hover:text-fc-ink"
                            onclick={() => (open = false)}
                        >
                            <Icon icon={icons.settings} size={16} />
                            {manageLabel}
                        </a>
                    </div>
                {/if}
            </div>
        {/if}
    </div>
{/if}
