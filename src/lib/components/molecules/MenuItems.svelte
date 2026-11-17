<script module lang="ts">
    import type { MenuAction, MenuEntry } from './Menu.svelte';
    import type { MenuState } from '../../utils/menu.svelte.js';

    export interface MenuItemsProps {
        /** The entries of one menu level, drawn as direct children of its `role="menu"` panel. */
        entries: MenuEntry[];
        /** The state of the level these rows belong to. */
        menu: MenuState;
        /** Runs an action and closes the whole menu, submenus included. */
        choose: (action: MenuAction) => void;
    }

    /** Milliseconds the pointer rests on a row before its submenu opens, or another one closes. */
    export const SUBMENU_DELAY_MS = 150;
</script>

<script lang="ts">
    import { onMount, untrack } from 'svelte';
    import { twMerge } from '../../utils/cn.js';
    import { hasSubmenu, opensOnKey, pressOnSpace } from '../../utils/menu.svelte.js';
    import { ariaKeyShortcuts, isApplePlatform, shortcutText } from '../../utils/shortcut.js';
    import { icons } from '../../icons.js';
    import Icon from '../atoms/Icon.svelte';
    import MenuSub from './MenuSub.svelte';

    let { entries, menu, choose }: MenuItemsProps = $props();

    const uid = $props.id();
    const NONE = -1;

    let apple = $state(false);
    let sub = $state({ index: NONE, keyboard: false });
    let rows: HTMLElement[] = $state([]);
    let pending: number | null = null;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const actions = $derived(entries.filter((entry): entry is MenuAction => !('separator' in entry)));
    const iconColumn = $derived(actions.some((action) => action.icon));
    const opens = (index: number) => hasSubmenu(actions[index]);

    onMount(() => {
        apple = isApplePlatform();
        return () => clearTimeout(timer);
    });

    $effect(() => {
        if (sub.index !== NONE && menu.mode === 'keyboard' && menu.active !== sub.index) untrack(() => shut(false));
    });

    function settle() {
        clearTimeout(timer);
        pending = null;
    }

    function shut(refocus: boolean) {
        settle();
        if (sub.index === NONE) return;
        const row = rows[sub.index];
        const inside = document.getElementById(`${uid}-sub-${sub.index}`)?.contains(document.activeElement);
        sub = { index: NONE, keyboard: false };
        if (refocus || inside) row?.focus({ preventScroll: true });
    }

    function expand(index: number, keyboard: boolean) {
        settle();
        if (opens(index)) sub = { index, keyboard };
    }

    function hover(index: number) {
        if (!actions[index].disabled) menu.point(index);
        const target = opens(index) ? index : NONE;
        if (target === pending) return;
        clearTimeout(timer);
        pending = target;
        if (target === sub.index) return;
        timer = setTimeout(() => (target === NONE ? shut(false) : expand(target, false)), SUBMENU_DELAY_MS);
    }

    function keydown(event: KeyboardEvent) {
        if (opensOnKey(event, actions[menu.active])) expand(menu.active, true);
    }

    const row =
        'flex min-h-11 w-full cursor-pointer items-center gap-2.5 rounded-fc-sm px-2.5 py-2 text-left text-fc-md transition-colors hover:bg-fc-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fc-ring disabled:cursor-not-allowed disabled:opacity-50';
</script>

{#snippet body(entry: MenuAction)}
    {#if entry.icon}<Icon icon={entry.icon} size={16} />{:else if iconColumn}<span class="size-4 shrink-0" aria-hidden="true"></span>{/if}
    <span class="min-w-0 flex-1 truncate">{entry.label}</span>
    {#if entry.shortcut}<kbd aria-hidden="true" class="shrink-0 pl-3 font-fc-mono text-fc-xs text-fc-fg-muted">{shortcutText(entry.shortcut, apple)}</kbd>{/if}
    {#if entry.items}<Icon icon={icons.arrow} size={16} class="text-fc-fg-muted" />{/if}
{/snippet}

{#each entries as entry, i (i)}
    {#if 'separator' in entry}
        <div role="separator" class="h-2"></div>
    {:else}
        {@const index = actions.indexOf(entry)}
        {@const tone = entry.tone === 'danger' ? 'text-fc-danger' : 'text-fc-fg'}
        {@const keys = entry.shortcut ? ariaKeyShortcuts(entry.shortcut, apple) : undefined}
        {#if entry.items}
            {@const open = sub.index === index}
            <button
                bind:this={rows[index]}
                id="{uid}-row-{index}"
                type="button"
                role="menuitem"
                aria-haspopup="menu"
                aria-expanded={open}
                aria-controls={open ? `${uid}-sub-${index}` : undefined}
                aria-keyshortcuts={keys}
                tabindex={index === menu.active ? 0 : -1}
                disabled={entry.disabled}
                class={twMerge(row, tone)}
                onclick={(event) => expand(index, event.detail === 0)}
                onkeydown={keydown}
                onpointermove={() => hover(index)}
            >
                {@render body(entry)}
            </button>
            {#if open}
                <MenuSub
                    id="{uid}-sub-{index}"
                    labelledby="{uid}-row-{index}"
                    entries={entry.items}
                    anchor={rows[index]}
                    keyboard={sub.keyboard}
                    {choose}
                    close={() => shut(true)}
                    hold={settle}
                />
            {/if}
        {:else if entry.href && !entry.disabled}
            <a
                role="menuitem"
                tabindex={index === menu.active ? 0 : -1}
                href={entry.href}
                aria-keyshortcuts={keys}
                class={twMerge(row, tone)}
                onclick={() => choose(entry)}
                onkeydown={(event) => {
                    pressOnSpace(event, menu.buffer !== '');
                    keydown(event);
                }}
                onpointermove={() => hover(index)}
            >
                {@render body(entry)}
            </a>
        {:else}
            <button
                type="button"
                role="menuitem"
                tabindex={index === menu.active ? 0 : -1}
                disabled={entry.disabled}
                aria-keyshortcuts={keys}
                class={twMerge(row, tone)}
                onclick={() => choose(entry)}
                onkeydown={keydown}
                onpointermove={() => hover(index)}
            >
                {@render body(entry)}
            </button>
        {/if}
    {/if}
{/each}
