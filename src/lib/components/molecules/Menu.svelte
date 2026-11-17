<script module lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLAttributes } from 'svelte/elements';

    export type MenuAction = {
        label: string;
        onselect?: () => void;
        href?: string;
        icon?: string;
        tone?: 'default' | 'danger';
        disabled?: boolean;
        /** A keyboard shortcut such as `mod+shift+k`, shown muted at the end of the row and announced through `aria-keyshortcuts`. The app still binds the key itself. */
        shortcut?: string;
        /** Entries of a submenu. The row then opens it beside itself instead of running `onselect` or following `href`. */
        items?: MenuEntry[];
    };
    export type MenuSeparator = { separator: true };
    export type MenuEntry = MenuAction | MenuSeparator;

    export interface MenuProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
        items: MenuEntry[];
        /** Accessible name of the trigger and of the menu. Also the visible text of the default trigger. */
        label: string;
        /** Replaces the default trigger's content. The button, its name and its state stay muse's. */
        trigger?: Snippet;
        align?: 'start' | 'end';
        class?: string;
    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';
    import { floatingPanel, triggerButton } from '../../utils/control.js';
    import { present, watchPopup } from '../../utils/popup.svelte.js';
    import { MenuState } from '../../utils/menu.svelte.js';
    import { popupMotion } from '../../utils/motion.js';
    import { icons } from '../../icons.js';
    import Icon from '../atoms/Icon.svelte';
    import MenuItems from './MenuItems.svelte';
    import Tooltip from '../atoms/Tooltip.svelte';

    let { items, label, trigger: triggerContent, align = 'start', class: className = '', ...rest }: MenuProps = $props();

    const uid = $props.id();
    const menuId = `${uid}-menu`;
    const triggerId = `${uid}-trigger`;

    let triggerEl: HTMLButtonElement | null = $state(null);
    let menuEl: HTMLElement | null = $state(null);

    const actions = $derived(items.filter((entry): entry is MenuAction => !('separator' in entry)));

    const menu = new MenuState({
        labels: () => actions.map((a) => a.label),
        disabled: () => actions.map((a) => Boolean(a.disabled)),
        trigger: () => triggerEl,
        items: () => Array.from(menuEl?.querySelectorAll<HTMLElement>(':scope > [role="menuitem"]') ?? [])
    });

    $effect(() => {
        if (!menu.open) return;
        const inside = (node: Node) => Boolean(triggerEl?.contains(node) || menuEl?.contains(node));
        return watchPopup(inside, menu.hide, menu.place);
    });

    $effect(() => {
        menu.focusActive();
    });

    function leave(event: FocusEvent) {
        const next = event.relatedTarget as Node | null;
        if (next && !menuEl?.contains(next) && next !== triggerEl) menu.hide();
    }

    function choose(action: MenuAction) {
        if (action.disabled) return;
        action.onselect?.();
        menu.hide(!action.href);
    }
</script>

<!--
@component
Un menu d'actions déclenché par un bouton. Le focus entre dans le menu, les flèches bouclent (Début et Fin sautent aux bouts, les entrées désactivées sont sautées), l'entrée active reste visible dans un menu qui défile, la frappe saute à l'entrée, Échap referme et rend le focus. Chaque entrée est un bouton, ou un lien avec `href`. `shortcut` affiche un raccourci grisé en bout de ligne. `items` fait un sous-menu, ouvert au survol, au clic, par Entrée, Espace ou Flèche droite, et refermé par Flèche gauche ou Échap.
-->

<div class={twMerge('relative inline-block', className)} {...rest}>
    <Tooltip text={label} describe={false} disabled={!triggerContent || menu.open} class="contents">
        <button
            bind:this={triggerEl}
            id={triggerId}
            type="button"
            aria-haspopup="menu"
            aria-expanded={menu.open}
            aria-controls={menu.open ? menuId : undefined}
            aria-label={triggerContent ? label : undefined}
            class={triggerButton}
            onclick={menu.toggle}
            onkeydown={menu.triggerKeydown}
        >
            {#if triggerContent}
                {@render triggerContent()}
            {:else}
                <span>{label}</span>
                <Icon icon={icons.chevronDown} size={16} class={twMerge('transition-transform motion-reduce:transition-none', menu.open && 'rotate-180')} />
            {/if}
        </button>
    </Tooltip>

    {#if menu.open}
        <div
            bind:this={menuEl}
            id={menuId}
            popover="manual"
            role="menu"
            tabindex="-1"
            aria-labelledby={triggerId}
            class={twMerge(floatingPanel, 'min-w-44 p-1')}
            in:popupMotion={{ y: menu.up ? 4 : -4 }}
            out:popupMotion={{ direction: 'out', y: menu.up ? 4 : -4 }}
            style:left={align === 'start' ? `${menu.left}px` : 'auto'}
            style:right={align === 'end' ? `${menu.right}px` : 'auto'}
            style:top={menu.up ? 'auto' : `${menu.top}px`}
            style:bottom={menu.up ? `${menu.bottom}px` : 'auto'}
            style:max-height="{menu.maxHeight}px"
            onkeydown={menu.keydown}
            onfocusout={leave}
            use:present
        >
            <MenuItems entries={items} {menu} {choose} />
        </div>
    {/if}
</div>
