<script module lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';

    export interface IconPickerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
        /** The chosen icon name, such as `AddCircle`, or an empty string. Bindable. */
        value?: string;
        /** The names offered. @default every linear Solar icon */
        icons?: readonly string[];
        /** Turns a name into its iconify id. @default solarIconId */
        toIcon?: (name: string) => string;
        /** The form field name. The submitted value is the icon name. */
        name?: string;
        placeholder?: string;
        searchPlaceholder?: string;
        disabled?: boolean;
        /** Called with the new name after a pick. */
        onChange?: (value: string) => void;
        class?: string;
    }
</script>

<script lang="ts">
    import { tick } from 'svelte';
    import { twMerge } from '../../utils/cn.js';
    import { getI18n } from '../../i18n/context.svelte.js';
    import { controlLine, floatingPanel } from '../../utils/control.js';
    import { getFieldContext, resolveField } from '../../utils/field.js';
    import { consumeEscape } from '../../utils/handlers.js';
    import { AnchoredPopup, present, watchPopup } from '../../utils/popup.svelte.js';
    import { solarIconId, solarIconNames } from '../../utils/solar.js';
    import { icons as museIcons } from '../../icons.js';
    import Icon from '../atoms/Icon.svelte';

    let {
        value = $bindable(''),
        icons = solarIconNames,
        toIcon = solarIconId,
        name,
        placeholder,
        searchPlaceholder,
        disabled = false,
        onChange,
        id,
        'aria-describedby': describedBy,
        'aria-invalid': invalid,
        class: className = '',
        ...rest
    }: IconPickerProps = $props();

    const i18n = getI18n();
    const field = getFieldContext();
    const control = $derived(resolveField(field?.(), { id, describedBy, invalid }));
    const uid = $props.id();
    const triggerId = $derived(control.id ?? `${uid}-trigger`);
    const panelId = `${uid}-panel`;
    const hint = $derived(placeholder ?? i18n.t('iconPicker.placeholder'));
    const searchHint = $derived(searchPlaceholder ?? i18n.t('iconPicker.search'));

    const PANEL_WIDTH = 336;
    const CELL = 44;
    const GAP = 4;

    let open = $state(false);
    let search = $state('');
    let columns = $state(6);
    let triggerEl: HTMLButtonElement | null = $state(null);
    let panelEl: HTMLElement | null = $state(null);
    let gridEl: HTMLElement | null = $state(null);
    let searchEl: HTMLInputElement | null = $state(null);
    let cellEls: HTMLButtonElement[] = [];

    const geometry = new AnchoredPopup(() => triggerEl, 420, { width: () => PANEL_WIDTH, align: () => 'auto' });
    const shown = $derived.by(() => {
        const query = search.trim().toLowerCase();
        return query ? icons.filter((icon) => icon.toLowerCase().includes(query)) : icons;
    });
    const selectedIndex = $derived(shown.indexOf(value));
    const focusIndex = $derived(selectedIndex < 0 ? 0 : selectedIndex);

    function show() {
        search = '';
        geometry.place();
        open = true;
    }

    function close(refocus: boolean) {
        open = false;
        if (refocus) triggerEl?.focus();
    }

    function pick(icon: string) {
        value = icon;
        onChange?.(icon);
        close(true);
    }

    function focusCell(index: number) {
        const cell = cellEls[index];
        cell?.focus();
        cell?.scrollIntoView({ block: 'nearest' });
    }

    function step(from: number, delta: number): number {
        return Math.min(Math.max(from + delta, 0), shown.length - 1);
    }

    function gridKeydown(event: KeyboardEvent) {
        if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
            searchEl?.focus();
            return;
        }
        const at = cellEls.indexOf(document.activeElement as HTMLButtonElement);
        const moves: Record<string, number> = {
            ArrowRight: step(at, 1),
            ArrowLeft: step(at, -1),
            ArrowDown: step(at, columns),
            ArrowUp: step(at, -columns),
            Home: 0,
            End: shown.length - 1
        };
        if (at < 0 || !(event.key in moves)) return;
        event.preventDefault();
        focusCell(moves[event.key]);
    }

    function searchKeydown(event: KeyboardEvent) {
        if (event.key !== 'ArrowDown' && event.key !== 'Enter') return;
        event.preventDefault();
        if (event.key === 'Enter' && shown.length === 1) pick(shown[0]);
        else focusCell(0);
    }

    function keydown(event: KeyboardEvent) {
        if (consumeEscape(event, open, () => close(true))) event.preventDefault();
    }

    function leave(event: FocusEvent) {
        const next = event.relatedTarget as Node | null;
        if (next && !panelEl?.contains(next) && next !== triggerEl) close(false);
    }

    function measure() {
        if (gridEl) columns = Math.max(1, Math.floor((gridEl.clientWidth + GAP) / (CELL + GAP)));
    }

    $effect(() => {
        if (!open) return;
        const inside = (node: Node) => Boolean(triggerEl?.contains(node) || panelEl?.contains(node));
        return watchPopup(inside, () => close(false), geometry.place);
    });

    $effect(() => {
        if (!open || !panelEl) return;
        geometry.place();
        measure();
        void tick().then(() => focusCell(focusIndex));
    });

    $effect(() => {
        if (disabled && open) close(false);
    });
</script>

<!--
@component
Un sélecteur d'icône : un bouton qui montre l'icône choisie et ouvre, au-dessus de tout, une recherche et une grille de toutes les icônes Solar en style linear. Les flèches, Début et Fin naviguent dans la grille, Entrée dans la recherche choisit le seul résultat, Échap ferme, et le formulaire reçoit le nom de l'icône.
-->

<div class={twMerge('relative', className)} {...rest}>
    <!-- svelte-ignore a11y_role_supports_aria_props_implicit -->
    <button
        bind:this={triggerEl}
        type="button"
        id={triggerId}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-labelledby={control.labelId ? `${control.labelId} ${triggerId}` : undefined}
        aria-describedby={control.describedBy}
        aria-invalid={control.invalid}
        {disabled}
        class={twMerge(controlLine, 'group flex cursor-pointer items-center gap-2 text-left')}
        onclick={() => (open ? close(false) : show())}
        onkeydown={keydown}
    >
        <Icon icon={toIcon(value)} size={18} class="shrink-0" />
        <span class={twMerge('min-w-0 flex-1 truncate', !value && 'text-fc-fg-muted group-aria-invalid:text-fc-fg')}>
            {value || hint}
        </span>
        <Icon icon={museIcons.chevronDown} size={16} class="text-fc-fg-muted" />
    </button>
    {#if name}<input type="hidden" {name} {value} />{/if}

    {#if open}
        <div
            bind:this={panelEl}
            id={panelId}
            popover="manual"
            role="dialog"
            aria-label={hint}
            tabindex="-1"
            class={twMerge(floatingPanel, 'flex w-[min(21rem,calc(100vw-1rem))] flex-col gap-2 overflow-hidden p-2')}
            style:left="{geometry.left}px"
            style:top={geometry.up ? 'auto' : `${geometry.top}px`}
            style:bottom={geometry.up ? `${geometry.bottom}px` : 'auto'}
            style:max-height="{geometry.maxHeight}px"
            onkeydown={keydown}
            onfocusout={leave}
            use:present
        >
            <input
                bind:this={searchEl}
                type="text"
                enterkeyhint="search"
                bind:value={search}
                placeholder={searchHint}
                aria-label={searchHint}
                aria-controls="{panelId}-grid"
                class={twMerge(controlLine, 'shrink-0')}
                onkeydown={searchKeydown}
            />
            {#if shown.length === 0}
                <p class="px-1 py-3 text-center text-fc-sm text-fc-fg-muted">{i18n.t('iconPicker.empty')}</p>
            {:else}
                <div
                    bind:this={gridEl}
                    id="{panelId}-grid"
                    role="radiogroup"
                    aria-label={hint}
                    tabindex="-1"
                    class="grid min-h-0 grid-cols-[repeat(auto-fill,2.75rem)] justify-between gap-1 overflow-y-auto overscroll-contain"
                    onkeydown={gridKeydown}
                >
                    {#each shown as icon, index (icon)}
                        {@const chosen = icon === value}
                        <button
                            bind:this={cellEls[index]}
                            type="button"
                            role="radio"
                            aria-checked={chosen}
                            aria-label={icon}
                            title={icon}
                            tabindex={index === focusIndex ? 0 : -1}
                            class={twMerge(
                                'flex size-11 cursor-pointer items-center justify-center rounded-fc-md text-fc-fg-muted transition-colors hover:bg-fc-surface hover:text-fc-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fc-ring',
                                chosen && 'bg-fc-accent text-fc-accent-fg hover:bg-fc-accent hover:text-fc-accent-fg'
                            )}
                            onclick={() => pick(icon)}
                        >
                            <Icon icon={toIcon(icon)} size={18} />
                        </button>
                    {/each}
                </div>
            {/if}
        </div>
    {/if}
</div>
