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
    import { watchPopup } from '../../utils/popup.svelte.js';
    import { MenuState } from '../../utils/menu.svelte.js';
    import { icons } from '../../icons.js';
    import Icon from '../atoms/Icon.svelte';

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
        items: () => Array.from(menuEl?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [])
    });

    $effect(() => {
        if (!menu.open) return;
        const inside = (node: Node) => Boolean(triggerEl?.contains(node) || menuEl?.contains(node));
        return watchPopup(inside, menu.hide, menu.place);
    });

    $effect(() => {
        menu.focusActive();
    });

    function present(node: HTMLElement) {
        if (node.showPopover && !node.matches(':popover-open')) node.showPopover();
    }

    function leave(event: FocusEvent) {
        const next = event.relatedTarget as Node | null;
        if (next && !menuEl?.contains(next) && next !== triggerEl) menu.hide();
    }

    function space(event: KeyboardEvent) {
        if (event.key !== ' ' || menu.buffer !== '') return;
        event.preventDefault();
        (event.currentTarget as HTMLElement).click();
    }

    function choose(action: MenuAction) {
        if (action.disabled) return;
        action.onselect?.();
        menu.hide(!action.href);
    }

    const row =
        'flex min-h-11 w-full cursor-pointer items-center gap-2.5 rounded-fc-sm px-2.5 py-2 text-left text-fc-md transition-colors hover:bg-fc-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fc-ring disabled:cursor-not-allowed disabled:opacity-50';
</script>

<!--
@component
Un menu d'actions déclenché par un bouton. Le focus entre dans le menu, les flèches bouclent, la frappe saute à l'entrée, Échap referme et rend le focus. Chaque entrée est un bouton, ou un lien avec `href`.
-->

<div class={twMerge('relative inline-block', className)} {...rest}>
    <button
        bind:this={triggerEl}
        id={triggerId}
        type="button"
        aria-haspopup="menu"
        aria-expanded={menu.open}
        aria-controls={menu.open ? menuId : undefined}
        aria-label={triggerContent ? label : undefined}
        class="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-fc-md bg-fc-surface px-3 text-fc-sm text-fc-fg transition-colors hover:bg-fc-surface/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fc-ring"
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

    {#if menu.open}
        <div
            bind:this={menuEl}
            id={menuId}
            popover="manual"
            role="menu"
            tabindex="-1"
            aria-labelledby={triggerId}
            class="fixed inset-auto m-0 min-w-44 overflow-y-auto overscroll-contain rounded-fc-md bg-fc-bg p-1 text-fc-fg shadow-lg"
            style:left={align === 'start' ? `${menu.left}px` : 'auto'}
            style:right={align === 'end' ? `${menu.right}px` : 'auto'}
            style:top={menu.up ? 'auto' : `${menu.top}px`}
            style:bottom={menu.up ? `${menu.bottom}px` : 'auto'}
            style:max-height="{menu.maxHeight}px"
            onkeydown={menu.keydown}
            onfocusout={leave}
            use:present
        >
            {#each items as entry, i (i)}
                {#if 'separator' in entry}
                    <div role="separator" class="mx-1 my-1 h-px bg-fc-surface"></div>
                {:else}
                    {@const index = actions.indexOf(entry)}
                    {@const tone = entry.tone === 'danger' ? 'text-fc-danger' : 'text-fc-fg'}
                    {#if entry.href && !entry.disabled}
                        <a
                            role="menuitem"
                            tabindex={index === menu.active ? 0 : -1}
                            href={entry.href}
                            class={twMerge(row, tone)}
                            onclick={() => choose(entry)}
                            onkeydown={space}
                            onpointermove={() => (menu.active = index)}
                        >
                            {#if entry.icon}<Icon icon={entry.icon} size={16} />{/if}
                            <span class="min-w-0 flex-1 truncate">{entry.label}</span>
                        </a>
                    {:else}
                        <button
                            type="button"
                            role="menuitem"
                            tabindex={index === menu.active ? 0 : -1}
                            disabled={entry.disabled}
                            class={twMerge(row, tone)}
                            onclick={() => choose(entry)}
                            onpointermove={() => !entry.disabled && (menu.active = index)}
                        >
                            {#if entry.icon}<Icon icon={entry.icon} size={16} />{/if}
                            <span class="min-w-0 flex-1 truncate">{entry.label}</span>
                        </button>
                    {/if}
                {/if}
            {/each}
        </div>
    {/if}
</div>
