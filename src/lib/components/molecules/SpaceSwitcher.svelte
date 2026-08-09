<script module lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';

    export type SpaceItem = { id: string; name: string };

    export interface SpaceSwitcherProps extends HTMLAttributes<HTMLDivElement> {
        spaces?: SpaceItem[];
        activeId?: string | null;
        onSelect?: (id: string | null) => void;
        personalLabel?: string;
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
    let dropUp = $state(false);
    let maxHeight = $state(320);
    const activeSpace = $derived(spaces.find((s) => s.id === activeId) ?? null);

    const GAP = 6;
    const MARGIN = 8;
    const MIN_HEIGHT = 160;

    function place() {
        if (!triggerEl) return;
        const box = triggerEl.getBoundingClientRect();
        const below = window.innerHeight - box.bottom - GAP - MARGIN;
        const above = box.top - GAP - MARGIN;
        dropUp = below < MIN_HEIGHT && above > below;
        maxHeight = Math.max(MIN_HEIGHT, Math.floor(dropUp ? above : below));
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
-->

<div bind:this={rootEl} class={twMerge('relative', className)} {...rest}>
    <button
        bind:this={triggerEl}
        type="button"
        class="flex w-full items-center gap-2.5 min-h-11 rounded-fc-md border border-fc-border bg-fc-surface/50 px-3 py-2 text-left text-fc-sm transition-colors hover:bg-fc-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fc-ring"
        onclick={toggle}
        aria-expanded={open}
    >
        <Icon icon={activeSpace ? icons.usersGroup : icons.userCircle} size={18} class="text-fc-fg-muted" />
        <span class="min-w-0 flex-1 truncate font-medium text-fc-fg">
            {activeSpace?.name ?? personalLabel}
        </span>
        <Icon icon={icons.chevronDown} size={16} class={twMerge(
                'block size-4 shrink-0 text-fc-fg-muted transition-transform',
                open && 'rotate-180'
            )} />
    </button>

    {#if open}
        <div
            class={twMerge(
                'absolute left-0 right-0 z-40 flex flex-col overflow-hidden rounded-fc-md border border-fc-border bg-fc-component shadow-lg',
                dropUp ? 'bottom-full mb-1.5' : 'top-full mt-1.5'
            )}
            style:max-height="{maxHeight}px"
        >
            <div class="min-h-0 flex-1 overflow-auto p-1">
                <button
                    type="button"
                    class={twMerge(
                        'flex w-full items-center gap-2.5 rounded-fc-sm px-2.5 py-2 text-left text-fc-sm transition-colors',
                        !activeId ? 'bg-fc-accent text-fc-accent-fg font-medium' : 'text-fc-fg hover:bg-fc-surface'
                    )}
                    onclick={() => select(null)}
                >
                    <Icon icon={icons.userCircle} size={16} />
                    <span class="min-w-0 flex-1 truncate">{personalLabel}</span>
                </button>

                {#each spaces as space (space.id)}
                    <button
                        type="button"
                        class={twMerge(
                            'flex w-full items-center gap-2.5 rounded-fc-sm px-2.5 py-2 text-left text-fc-sm transition-colors',
                            activeId === space.id ? 'bg-fc-accent text-fc-accent-fg font-medium' : 'text-fc-fg hover:bg-fc-surface'
                        )}
                        onclick={() => select(space.id)}
                    >
                        <Icon icon={icons.usersGroup} size={16} />
                        <span class="min-w-0 flex-1 truncate">{space.name}</span>
                    </button>
                {/each}
            </div>

            {#if manageHref}
                <div class="border-t border-fc-border p-1">
                    <a
                        href={manageHref}
                        class="flex w-full items-center gap-2.5 rounded-fc-sm px-2.5 py-2 text-left text-fc-sm text-fc-fg-muted transition-colors hover:bg-fc-surface hover:text-fc-fg"
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
