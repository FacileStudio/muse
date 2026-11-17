<script module lang="ts">
    import type { MenuAction, MenuEntry } from './Menu.svelte';

    export interface MenuSubProps {
        /** Id of the submenu panel, named by the row's `aria-controls`. */
        id: string;
        /** Id of the row that opened it, which names the submenu. */
        labelledby: string;
        /** The submenu's entries. */
        entries: MenuEntry[];
        /** The row that opened it. The submenu sits to its right, or to its left near the viewport edge. */
        anchor: HTMLElement;
        /** True when the keyboard opened it: focus moves to its first entry. */
        keyboard: boolean;
        /** Runs an action and closes the whole menu. */
        choose: (action: MenuAction) => void;
        /** Closes this submenu and puts focus back on its row. */
        close: () => void;
        /** Keeps the submenu open while the pointer travels into it. */
        hold: () => void;
    }
</script>

<script lang="ts">
    import { untrack } from 'svelte';
    import { twMerge } from '../../utils/cn.js';
    import { floatingPanel } from '../../utils/control.js';
    import { present, watchPopup } from '../../utils/popup.svelte.js';
    import { MenuState, submenuKeydown } from '../../utils/menu.svelte.js';
    import { popupMotion } from '../../utils/motion.js';
    import MenuItems from './MenuItems.svelte';

    let { id, labelledby, entries, anchor, keyboard, choose, close, hold }: MenuSubProps = $props();

    let panel: HTMLElement | null = $state(null);

    const actions = $derived(entries.filter((entry): entry is MenuAction => !('separator' in entry)));

    const menu = new MenuState({
        labels: () => actions.map((a) => a.label),
        disabled: () => actions.map((a) => Boolean(a.disabled)),
        trigger: () => anchor,
        items: () => Array.from(panel?.querySelectorAll<HTMLElement>(':scope > [role="menuitem"]') ?? []),
        across: {
            side: () => 'right',
            align: () => 'start',
            width: () => panel?.offsetWidth ?? 0,
            height: () => panel?.scrollHeight ?? 0
        }
    });
    menu.open = true;

    $effect(() => {
        if (!panel) return;
        untrack(menu.place);
        return watchPopup(() => true, () => {}, menu.place);
    });

    $effect(() => {
        if (keyboard) untrack(() => menu.show());
    });

    $effect(() => {
        menu.focusActive();
    });
</script>

<div
    bind:this={panel}
    {id}
    popover="manual"
    role="menu"
    tabindex="-1"
    aria-labelledby={labelledby}
    class={twMerge(floatingPanel, 'min-w-44 p-1')}
    in:popupMotion={{ y: 0 }}
    style:left="{menu.left}px"
    style:top="{menu.top}px"
    style:max-height="{menu.maxHeight}px"
    onkeydown={(event) => submenuKeydown(event, menu, close)}
    onpointerenter={hold}
    use:present
>
    <MenuItems {entries} {menu} {choose} />
</div>
