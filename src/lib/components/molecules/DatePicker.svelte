<script module lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';
    import type { IsoDate } from '../../utils/calendar.js';

    export interface DatePickerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
        /** The chosen date as `YYYY-MM-DD`, or an empty string. Bindable. */
        value?: IsoDate | '';
        /** The earliest date that can be chosen, as `YYYY-MM-DD`. */
        min?: IsoDate;
        /** The latest date that can be chosen, as `YYYY-MM-DD`. */
        max?: IsoDate;
        /** The form field name. The submitted value is the ISO date. */
        name?: string;
        placeholder?: string;
        disabled?: boolean;
        /** A BCP 47 tag. Defaults to the active locale of the app. */
        locale?: string;
        /** Called with the new value after a pick or a clear. */
        onChange?: (value: IsoDate | '') => void;
        class?: string;
    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';
    import { getI18n } from '../../i18n/context.svelte.js';
    import { clampDate, firstWeekday, formatDate, isIsoDate, todayIso } from '../../utils/calendar.js';
    import { controlLine, floatingPanel } from '../../utils/control.js';
    import { getFieldContext, resolveField } from '../../utils/field.js';
    import { AnchoredPopup, present, watchPopup } from '../../utils/popup.svelte.js';
    import { icons } from '../../icons.js';
    import Button from '../atoms/Button.svelte';
    import Icon from '../atoms/Icon.svelte';
    import DateGrid from './DateGrid.svelte';

    let {
        value = $bindable(''),
        min,
        max,
        name,
        placeholder,
        disabled = false,
        locale,
        onChange,
        id,
        'aria-describedby': describedBy,
        'aria-invalid': invalid,
        class: className = '',
        ...rest
    }: DatePickerProps = $props();

    const i18n = getI18n();
    const field = getFieldContext();
    const control = $derived(resolveField(field?.(), { id, describedBy, invalid }));
    const uid = $props.id();
    const triggerId = $derived(control.id ?? `${uid}-trigger`);
    const panelId = `${uid}-panel`;
    const tag = $derived(locale ?? i18n.locale);
    const hint = $derived(placeholder ?? i18n.t('datePicker.placeholder'));

    const PANEL_WIDTH = 336;

    let open = $state(false);
    let triggerEl: HTMLButtonElement | null = $state(null);
    let panelEl: HTMLElement | null = $state(null);
    let focused = $state(todayIso());

    const chosen = $derived(isIsoDate(value) ? value : '');
    const geometry = new AnchoredPopup(() => triggerEl, 420, { width: () => PANEL_WIDTH, align: () => 'auto' });

    function show() {
        focused = clampDate(chosen || todayIso(), { min, max });
        geometry.place();
        open = true;
    }

    function close(refocus: boolean) {
        open = false;
        if (refocus) triggerEl?.focus();
    }

    function pick(date: IsoDate | '') {
        value = date;
        onChange?.(date);
        close(true);
    }

    function keydown(event: KeyboardEvent) {
        if (event.key !== 'Escape' || !open) return;
        event.preventDefault();
        event.stopPropagation();
        close(true);
    }

    function leave(event: FocusEvent) {
        const next = event.relatedTarget as Node | null;
        if (next && !panelEl?.contains(next) && next !== triggerEl) close(false);
    }

    $effect(() => {
        if (!open) return;
        const inside = (node: Node) => Boolean(triggerEl?.contains(node) || panelEl?.contains(node));
        return watchPopup(inside, () => close(false), geometry.place);
    });

    $effect(() => {
        if (open && panelEl) {
            geometry.place();
            panelEl.querySelector<HTMLElement>('table [tabindex="0"]')?.focus();
        }
    });

    $effect(() => {
        if (disabled && open) close(false);
    });
</script>

<!--
@component
Un sélecteur de date : un bouton qui affiche la date dans la langue de l'app et ouvre une grille de jours. Flèches, Début, Fin et Pg précédente ou suivante naviguent dans la grille, `min` et `max` grisent les jours exclus, et le formulaire reçoit la date ISO.
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
        class={twMerge(controlLine, 'group flex cursor-pointer items-center justify-between gap-2 text-left')}
        onclick={() => (open ? close(false) : show())}
        onkeydown={keydown}
    >
        <span class={twMerge('min-w-0 flex-1 truncate', !chosen && 'text-fc-fg-muted group-aria-invalid:text-fc-fg')}>
            {chosen ? formatDate(chosen, tag) : hint}
        </span>
        <Icon icon={icons.calendar} size={16} class="text-fc-fg-muted" />
    </button>
    {#if name}<input type="hidden" {name} value={chosen} />{/if}

    {#if open}
        <div
            bind:this={panelEl}
            id={panelId}
            popover="manual"
            role="dialog"
            aria-label={hint}
            tabindex="-1"
            class={twMerge(floatingPanel, 'flex w-[min(21rem,calc(100vw-1rem))] flex-col gap-2 p-2')}
            style:left="{geometry.left}px"
            style:top={geometry.up ? 'auto' : `${geometry.top}px`}
            style:bottom={geometry.up ? `${geometry.bottom}px` : 'auto'}
            style:max-height="{geometry.maxHeight}px"
            onkeydown={keydown}
            onfocusout={leave}
            use:present
        >
            <DateGrid bind:focused value={chosen} {min} {max} firstDay={firstWeekday(tag)} locale={tag} onPick={pick} />
            {#if chosen}
                <Button variant="ghost" size="sm" class="self-end" onclick={() => pick('')}>
                    {i18n.t('datePicker.clear')}
                </Button>
            {/if}
        </div>
    {/if}
</div>
