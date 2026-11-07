<script module lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';
    import type { UserMenuOptions } from '../../utils/user-menu.js';

    export type UserMenuUser = { name: string; avatar?: string; email?: string; secondary?: string };

    export interface UserMenuProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>, UserMenuOptions {
        user: UserMenuUser;
        /** `card` is the sidebar footer: avatar, name and a second line. `avatar` is the bare pill of the mobile bar. */
        trigger?: 'card' | 'avatar';
        /** `popover` floats beside the trigger. `sheet` is the bottom drawer phones use. */
        presentation?: 'popover' | 'sheet';
        /** The collapsed rail: the card shrinks to the avatar. */
        narrow?: boolean;
        active?: boolean;
        class?: string;
    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';
    import { getI18n } from '../../i18n/context.svelte.js';
    import { present, watchPopup } from '../../utils/popup.svelte.js';
    import { MenuState, pressOnSpace } from '../../utils/menu.svelte.js';
    import { springPress } from '../../utils/press.js';
    import { applyTheme, readTheme, type Theme } from '../../utils/theme.js';
    import {
        ACCOUNT_URL,
        actionable,
        drillKey,
        startIndex,
        userMenuRows,
        type UserMenuLabels,
        type UserMenuRow,
        type UserMenuView
    } from '../../utils/user-menu.js';
    import Avatar from '../atoms/Avatar.svelte';
    import TextElevate from '../motion/TextElevate.svelte';
    import Drawer from './Drawer.svelte';
    import UserMenuList from './UserMenuList.svelte';
    import { userMenuLabels } from '../../utils/user-menu-labels.js';

    let {
        user,
        trigger = 'card',
        presentation = 'popover',
        narrow = false,
        active = false,
        class: className = '',
        align = 'auto',
        items,
        accountHref = ACCOUNT_URL,
        settingsHref,
        subscription,
        helpHref,
        onSignOut,
        showLanguage,
        locales,
        locale,
        onLocaleChange,
        showTheme,
        theme,
        onThemeChange,
        labels: overrides,
        ...rest
    }: UserMenuProps = $props();

    const MENU_MIN_WIDTH = 240;
    const i18n = getI18n();
    const uid = $props.id();
    const menuId = `${uid}-menu`;
    const triggerId = `${uid}-trigger`;

    let triggerEl: HTMLButtonElement | null = $state(null);
    let menuEl: HTMLElement | null = $state(null);
    let view = $state<UserMenuView>('root');
    let detected = $state<Theme>('system');

    const labels = $derived<UserMenuLabels>({ ...userMenuLabels(i18n.t), ...overrides });

    const options = $derived({ items, accountHref, settingsHref, subscription, helpHref, onSignOut, showLanguage, locales, showTheme });
    const model = $derived({
        view,
        labels,
        options,
        locale: locale ?? i18n.locale,
        theme: theme ?? detected,
        onLocale: (next: typeof i18n.locale) => {
            i18n.set(next);
            onLocaleChange?.(next);
        },
        onTheme: (next: Theme) => {
            detected = next;
            if (onThemeChange) onThemeChange(next);
            else applyTheme(next);
        }
    });
    const rows = $derived(userMenuRows(model));
    const stops = $derived(actionable(rows));
    const secondary = $derived(user.secondary ?? user.email);
    const sheet = $derived(presentation === 'sheet');

    const menu = new MenuState({
        labels: () => stops.map((row) => row.label),
        disabled: () => stops.map(() => false),
        trigger: () => triggerEl,
        items: () => Array.from(menuEl?.querySelectorAll<HTMLElement>('[role^="menuitem"]') ?? []),
        across: { width: () => Math.max(menuEl?.offsetWidth ?? 0, MENU_MIN_WIDTH), align: () => align }
    });

    $effect(() => {
        if (!menu.open) return;
        if (!sheet) {
            const inside = (node: Node) => Boolean(triggerEl?.contains(node) || menuEl?.contains(node));
            return watchPopup(inside, menu.hide, menu.place);
        }
    });

    $effect(() => {
        void view;
        if (menu.open && menuEl) menu.place();
        menu.focusActive();
    });

    $effect(() => {
        if (menu.open) {
            detected = readTheme();
            return;
        }
        view = 'root';
    });

    function go(next: UserMenuView, landOn: string) {
        view = next;
        const at = actionable(userMenuRows({ ...model, view: next })).findIndex((row) => row.id === landOn);
        menu.land(at < 0 ? startIndex(userMenuRows({ ...model, view: next })) : at);
    }

    function choose(row: UserMenuRow) {
        if (row.kind === 'submenu') return go(row.id as UserMenuView, '');
        if (row.kind === 'back') return go('root', view);
        row.run?.();
        menu.hide(!row.href);
    }

    function keydown(event: KeyboardEvent) {
        const row = stops[menu.active];
        const step = drillKey(view, row?.kind, event.key);
        if (!step) return menu.keydown(event);
        event.preventDefault();
        event.stopPropagation();
        if (step === 'enter' && row) go(row.id as UserMenuView, '');
        else go('root', view);
    }

    function leave(event: FocusEvent) {
        const next = event.relatedTarget as Node | null;
        if (!sheet && next && !menuEl?.contains(next) && next !== triggerEl) menu.hide();
    }

    const space = (event: KeyboardEvent) => pressOnSpace(event, menu.buffer !== '');

    const cardClasses = $derived(
        narrow ? 'size-fc-nav-item justify-center p-0' : 'min-h-12 w-full gap-2.5 px-2.5 py-1.5'
    );
    const avatarClasses = $derived(active ? 'bg-fc-accent shadow-sm' : 'hover:bg-fc-surface');
    const pillClasses = $derived(
        trigger === 'avatar'
            ? twMerge('size-fc-nav-item justify-center rounded-fc-pill transition-all duration-200', avatarClasses)
            : twMerge('rounded-fc-md text-fc-sm text-fc-fg transition-colors hover:bg-fc-surface', cardClasses, (active || menu.open) && 'bg-fc-surface')
    );
</script>

<!--
@component
Le menu de la carte utilisateur : un déclencheur (carte de la barre latérale ou avatar du mobile) qui ouvre un menu sans bordure. Compte Facile, réglages, abonnement, langue, thème, aide et déconnexion, dans le même ordre dans toutes les apps.
-->

{#snippet list()}
    <UserMenuList
        {rows}
        active={menu.active}
        backLabel={labels.back}
        newTabLabel={i18n.t('userMenu.opensNewTab')}
        onChoose={choose}
        onPoint={menu.point}
        onSpace={space}
    />
{/snippet}

<div class={twMerge('relative', narrow || trigger === 'avatar' ? 'self-center' : 'w-full', className)} {...rest}>
    <button
        bind:this={triggerEl}
        id={triggerId}
        type="button"
        use:springPress
        aria-haspopup="menu"
        aria-expanded={menu.open}
        aria-controls={menu.open ? menuId : undefined}
        aria-label={i18n.t('userMenu.open', { name: user.name })}
        class={twMerge('flex shrink-0 cursor-pointer items-center overflow-hidden text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fc-ring', pillClasses)}
        onclick={menu.toggle}
        onkeydown={menu.triggerKeydown}
    >
        <Avatar src={user.avatar} name={user.name} alt="" size="sm" class="h-7 w-7 text-fc-xs" />
        {#if trigger === 'card' && !narrow}
            <span class="flex min-w-0 flex-1 flex-col leading-tight">
                <TextElevate text={user.name} visible class="truncate text-fc-sm font-medium" />
                {#if secondary}
                    <span class="truncate text-fc-xs text-fc-fg-muted">{secondary}</span>
                {/if}
            </span>
        {/if}
    </button>

    {#if sheet}
        <Drawer bind:open={menu.open} title={user.name} description={secondary}>
            {#if menu.open}
                <div bind:this={menuEl} id={menuId} role="menu" tabindex="-1" aria-labelledby={triggerId} onkeydown={keydown} class="flex flex-col">
                    {@render list()}
                </div>
            {/if}
        </Drawer>
    {:else if menu.open}
        <div
            bind:this={menuEl}
            id={menuId}
            popover="manual"
            role="menu"
            tabindex="-1"
            aria-labelledby={triggerId}
            class="fixed inset-auto m-0 overflow-y-auto overscroll-contain rounded-fc-md bg-fc-bg p-1 text-fc-fg shadow-lg"
            style:min-width="max({menu.width}px, 15rem)"
            style:max-width="calc(100vw - 1rem)"
            style:left="{menu.left}px"
            style:top={menu.up ? 'auto' : `${menu.top}px`}
            style:bottom={menu.up ? `${menu.bottom}px` : 'auto'}
            style:max-height="{menu.maxHeight}px"
            onkeydown={keydown}
            onfocusout={leave}
            use:present
        >
            {@render list()}
        </div>
    {/if}
</div>
