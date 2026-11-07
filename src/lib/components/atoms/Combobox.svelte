<script module lang="ts">
    import type { HTMLInputAttributes } from 'svelte/elements';
    import type { ComboOption } from '../../utils/combobox.js';

    export type { ComboOption };

    export interface ComboboxProps extends Omit<HTMLInputAttributes, 'value' | 'children' | 'list' | 'role'> {
        /** The text in the field. Bindable, and free: it may match no option. */
        value?: string;
        options: ComboOption[];
        /** Called when an option is chosen, with the option itself. */
        onSelect?: (option: ComboOption) => void;
        /** Shown when nothing matches the text. */
        emptyLabel?: string;
        class?: string;
        /** Lands on the element around the field, which is otherwise layout-neutral. */
        wrapperClass?: string;
    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';
    import { getI18n } from '../../i18n/context.svelte.js';
    import { controlLine } from '../../utils/control.js';
    import { exactOption, filterOptions } from '../../utils/combobox.js';
    import { ComboboxState } from '../../utils/combobox.svelte.js';
    import { getFieldContext, resolveField } from '../../utils/field.js';
    import { parseOptions } from '../../utils/listbox.js';
    import { watchPopup } from '../../utils/popup.svelte.js';
    import SelectListbox from './SelectListbox.svelte';

    let {
        value = $bindable(''),
        options,
        onSelect,
        emptyLabel,
        id,
        'aria-describedby': describedBy,
        'aria-invalid': invalid,
        'aria-label': ariaLabel,
        'aria-labelledby': ariaLabelledby,
        disabled = false,
        class: className = '',
        wrapperClass,
        ...rest
    }: ComboboxProps = $props();

    const i18n = getI18n();
    const field = getFieldContext();
    const control = $derived(resolveField(field?.(), { id, describedBy, invalid }));

    const uid = $props.id();
    const listId = `${uid}-list`;
    const optionId = (index: number) => `${uid}-opt-${index}`;

    let input: HTMLInputElement | null = $state(null);
    let popup: HTMLElement | null = $state(null);

    const chosen = $derived(exactOption(options, value));
    const matches = $derived(filterOptions(options, chosen ? '' : value));
    const model = $derived(
        parseOptions(
            matches.map((o) => ({ tagName: 'option', value: o.value, label: o.label, disabled: o.disabled }))
        )
    );
    const empty = $derived(model.options.length === 0);

    function pick(index: number) {
        const option = matches[index];
        if (!option || option.disabled) return;
        value = option.label;
        onSelect?.(option);
        combo.hide();
        input?.focus();
    }

    const combo = new ComboboxState({
        input: () => input,
        disabled: () => matches.map((o) => Boolean(o.disabled)),
        text: () => value,
        setText: (text) => (value = text),
        pick
    });

    const expanded = $derived(combo.open && !disabled);

    $effect(() => {
        if (!combo.open) return;
        const inside = (node: Node) => Boolean(input?.contains(node) || popup?.contains(node));
        return watchPopup(inside, combo.hide, combo.place);
    });

    $effect(() => {
        if (expanded && combo.active >= 0) {
            document.getElementById(optionId(combo.active))?.scrollIntoView({ block: 'nearest' });
        }
    });
</script>

<!--
@component
Un champ de saisie avec suggestions : on tape, la liste se filtre, les flèches choisissent, Entrée valide et Échap referme puis efface. Le texte reste libre. La liste est celle de `Select`, et la recherche ignore la casse et les accents.
-->

<div class={wrapperClass ? twMerge('relative', wrapperClass) : 'contents'}>
    <input
        bind:this={input}
        bind:value
        type="text"
        {...rest}
        role="combobox"
        id={control.id}
        autocomplete="off"
        aria-autocomplete="list"
        aria-haspopup="listbox"
        aria-expanded={expanded && !empty}
        aria-controls={expanded && !empty ? listId : undefined}
        aria-activedescendant={expanded && combo.active >= 0 ? optionId(combo.active) : undefined}
        aria-describedby={control.describedBy}
        aria-invalid={control.invalid}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        {disabled}
        class={twMerge(controlLine, className)}
        oninput={combo.typed}
        onclick={() => !combo.open && combo.show()}
        onkeydown={combo.keydown}
        onblur={combo.hide}
    />

    {#if expanded}
        {#if !empty}
            <span bind:this={popup} class="contents">
                <SelectListbox
                    id={listId}
                    {optionId}
                    {model}
                    value={chosen?.value ?? ''}
                    active={combo.active}
                    up={combo.up}
                    left={combo.left}
                    top={combo.top}
                    bottom={combo.bottom}
                    width={combo.width}
                    maxHeight={combo.maxHeight}
                    label={ariaLabel ?? undefined}
                    labelledby={ariaLabelledby ?? control.labelId}
                    onpick={pick}
                    onhover={(index) => (combo.active = index)}
                />
            </span>
        {/if}
    {/if}
    <span role="status" class="sr-only" style:position="fixed">{expanded && empty ? (emptyLabel ?? i18n.t('combobox.empty')) : ''}</span>
</div>
