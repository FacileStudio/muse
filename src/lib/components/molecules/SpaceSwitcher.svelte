<script lang="ts">
    import { twMerge } from '../../utils/cn.js';
    import { icons } from '../../icons.js';

    type SpaceItem = { id: string; name: string };

    let {
        spaces = [],
        activeId = null,
        onSelect,
        personalLabel = 'Personal',
        manageHref,
        manageLabel = 'Manage spaces',
        class: className = ''
    }: {
        spaces?: SpaceItem[];
        activeId?: string | null;
        onSelect?: (id: string | null) => void;
        personalLabel?: string;
        manageHref?: string;
        manageLabel?: string;
        class?: string;
    } = $props();

    let open = $state(false);
    let rootEl: HTMLElement | null = $state(null);
    const activeSpace = $derived(spaces.find((s) => s.id === activeId) ?? null);

    function select(id: string | null) {
        onSelect?.(id);
        open = false;
    }

    function handleClickOutside(e: MouseEvent) {
        if (rootEl && !rootEl.contains(e.target as Node)) open = false;
    }

    $effect(() => {
        if (!open) return;
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    });
</script>

<div bind:this={rootEl} class={twMerge('relative', className)}>
    <button
        type="button"
        class="flex w-full items-center gap-2.5 min-h-11 rounded-fc-md border border-fc-border bg-fc-surface/50 px-3 py-2 text-left text-fc-sm transition-colors hover:bg-fc-surface"
        onclick={() => (open = !open)}
        aria-expanded={open}
    >
        <iconify-icon
            icon={activeSpace ? icons.usersGroup : icons.userCircle}
            width="18"
            height="18"
            class="block shrink-0 text-fc-fg-muted"
        ></iconify-icon>
        <span class="min-w-0 flex-1 truncate font-medium text-fc-fg">
            {activeSpace?.name ?? personalLabel}
        </span>
        <iconify-icon
            icon={icons.chevronDown}
            width="16"
            height="16"
            class={twMerge('block shrink-0 text-fc-fg-muted transition-transform', open && 'rotate-180')}
        ></iconify-icon>
    </button>

    {#if open}
        <div class="absolute left-0 right-0 z-50 mt-1.5 overflow-hidden rounded-fc-md border border-fc-border bg-fc-component shadow-lg shadow-black/20">
            <div class="max-h-64 overflow-auto p-1">
                <button
                    type="button"
                    class={twMerge(
                        'flex w-full items-center gap-2.5 rounded-fc-sm px-2.5 py-2 text-left text-fc-sm transition-colors',
                        !activeId ? 'bg-fc-accent text-fc-accent-fg font-medium' : 'text-fc-fg hover:bg-fc-surface'
                    )}
                    onclick={() => select(null)}
                >
                    <iconify-icon icon={icons.userCircle} width="16" height="16" class="block shrink-0"></iconify-icon>
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
                        <iconify-icon icon={icons.usersGroup} width="16" height="16" class="block shrink-0"></iconify-icon>
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
                        <iconify-icon icon={icons.settings} width="16" height="16" class="block shrink-0"></iconify-icon>
                        {manageLabel}
                    </a>
                </div>
            {/if}
        </div>
    {/if}
</div>
