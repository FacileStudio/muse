<script module lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLAttributes } from 'svelte/elements';
    import type { MenuAction, MenuEntry } from './Menu.svelte';

    /** The entries for one opening. A function receives the element that was right-clicked, so one menu can serve every row of a list. */
    export type ContextMenuItems = MenuEntry[] | ((target: Element) => MenuEntry[]);

    export interface ContextMenuProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
        /** The entries, or a function of the right-clicked element. An empty list leaves the browser's own menu. */
        items: ContextMenuItems;
        /** Accessible name of the menu. */
        label: string;
        /** The region that opens the menu on right-click, long-press, the ContextMenu key or Shift+F10. */
        children: Snippet;
        /** Turns the menu off and leaves the browser's own. */
        disabled?: boolean;
        class?: string;
    }
</script>

<script lang="ts">
    import { untrack } from 'svelte';
    import { twMerge } from '../../utils/cn.js';
    import { floatingPanel } from '../../utils/control.js';
    import { present, watchPopup } from '../../utils/popup.svelte.js';
    import { MenuState } from '../../utils/menu.svelte.js';
    import { LongPress, opensContextMenu, placeAtPoint } from '../../utils/context-menu.js';
    import { popupMotion } from '../../utils/motion.js';
    import MenuItems from './MenuItems.svelte';

    let { items, label, children, disabled = false, class: className = '', ...rest }: ContextMenuProps = $props();

    const MARGIN = 8;
    const REPEAT_MS = 800;
    const uid = $props.id();
    const menuId = `${uid}-context`;

    let menuEl: HTMLElement | null = $state(null);
    let current = $state<MenuEntry[]>([]);
    let spot = $state({ x: 0, y: 0, left: 0, top: 0, maxHeight: 0 });
    let returnTo: HTMLElement | null = null;
    let openedAt = 0;
    const press = new LongPress();

    const actions = $derived(current.filter((entry): entry is MenuAction => !('separator' in entry)));

    const menu = new MenuState({
        labels: () => actions.map((a) => a.label),
        disabled: () => actions.map((a) => Boolean(a.disabled)),
        trigger: () => returnTo,
        items: () => Array.from(menuEl?.querySelectorAll<HTMLElement>(':scope > [role="menuitem"]') ?? [])
    });

    function reclamp() {
        const box = menuEl?.getBoundingClientRect();
        if (!box) return;
        const viewportWidth = document.documentElement.clientWidth;
        const viewportHeight = window.innerHeight;
        const placed = placeAtPoint({ x: spot.x, y: spot.y, width: box.width, height: menuEl?.scrollHeight ?? box.height, viewportWidth, viewportHeight, margin: MARGIN });
        spot = { ...spot, ...placed };
    }

    function openAt(x: number, y: number, target: Element): boolean {
        if (disabled || menuEl?.contains(target)) return false;
        const entries = typeof items === 'function' ? items(target) : items;
        if (entries.length === 0) return false;
        current = entries;
        returnTo = document.activeElement instanceof HTMLElement && document.activeElement !== document.body ? document.activeElement : null;
        spot = { x, y, left: x, top: y, maxHeight: window.innerHeight - MARGIN * 2 };
        openedAt = Date.now();
        menu.show();
        return true;
    }

    function oncontext(event: MouseEvent) {
        press.cancel();
        const target = event.target as Element;
        if (menuEl?.contains(target) || (menu.open && Date.now() - openedAt < REPEAT_MS)) {
            event.preventDefault();
            return;
        }
        const keyboard = event.clientX === 0 && event.clientY === 0;
        const box = target.getBoundingClientRect();
        if (openAt(keyboard ? box.left : event.clientX, keyboard ? box.bottom : event.clientY, target)) event.preventDefault();
    }

    function onkey(event: KeyboardEvent) {
        const target = event.target as Element;
        if (!opensContextMenu(event) || menuEl?.contains(target)) return;
        const box = target.getBoundingClientRect();
        if (openAt(box.left, box.bottom, target)) event.preventDefault();
    }

    function swallow(event: MouseEvent) {
        if (!menu.open || menuEl?.contains(event.target as Node)) return;
        event.preventDefault();
        event.stopPropagation();
    }

    function leave(event: FocusEvent) {
        const next = event.relatedTarget as Node | null;
        if (next && !menuEl?.contains(next)) menu.hide();
    }

    function choose(action: MenuAction) {
        if (action.disabled) return;
        action.onselect?.();
        menu.hide(!action.href);
    }

    $effect(() => {
        if (!menu.open) return;
        return watchPopup((node) => Boolean(menuEl?.contains(node)), menu.hide, reclamp);
    });

    $effect(() => {
        if (menu.open && menuEl) untrack(reclamp);
    });

    $effect(() => {
        menu.focusActive();
    });

    $effect(() => press.cancel);
</script>

<!--
@component
Un menu d'actions ouvert par un clic droit sur une zone, un appui long au doigt, la touche Menu ou Maj+F10. Il s'ouvre au point du clic et reste dans l'écran. `items` peut être une fonction de l'élément cliqué, pour qu'un seul menu serve toutes les lignes d'une liste ; une liste vide laisse le menu du navigateur. Mêmes entrées que `Menu` : icône, séparateur, `tone: 'danger'` en rouge, lien avec `href`, raccourci avec `shortcut`, sous-menu avec `items`. Échap referme et rend le focus.
-->

<div
    class={twMerge(className)}
    oncontextmenu={oncontext}
    onkeydown={onkey}
    onclickcapture={swallow}
    onpointerdown={(event) => press.start(event, openAt)}
    onpointermove={press.move}
    onpointerup={press.cancel}
    onpointercancel={press.cancel}
    {...rest}
>
    {@render children()}

    {#if menu.open}
        <div
            bind:this={menuEl}
            id={menuId}
            popover="manual"
            role="menu"
            tabindex="-1"
            aria-label={label}
            class={twMerge(floatingPanel, 'min-w-44 p-1')}
            in:popupMotion
            out:popupMotion={{ direction: 'out' }}
            style:left="{spot.left}px"
            style:top="{spot.top}px"
            style:max-height="{spot.maxHeight}px"
            onkeydown={menu.keydown}
            onfocusout={leave}
            use:present
        >
            <MenuItems entries={current} {menu} {choose} />
        </div>
    {/if}
</div>
