<script module lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLSelectAttributes } from 'svelte/elements';

    export type SelectOption = { value: string; label: string; disabled?: boolean };
    export type SelectGroup = { label: string; disabled?: boolean; options: SelectOption[] };

    export interface SelectProps
        extends Omit<HTMLSelectAttributes, 'value' | 'children' | 'multiple' | 'size' | 'placeholder'> {
        class?: string;
        value?: string;
        placeholder?: string;
        options?: (SelectOption | SelectGroup)[];
        children?: Snippet;
    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';
    import { controlLine } from '../../utils/control.js';
    import { getFieldContext, resolveField } from '../../utils/field.js';
    import { parseOptions, type ListModel, type RawNode } from '../../utils/listbox.js';
    import { watchPopup } from '../../utils/popup.svelte.js';
    import { SelectState } from '../../utils/select.svelte.js';
    import { icons } from '../../icons.js';
    import Icon from './Icon.svelte';
    import SelectListbox from './SelectListbox.svelte';

    let {
        value = $bindable(''),
        id,
        'aria-describedby': describedBy,
        'aria-invalid': invalid,
        'aria-label': ariaLabel,
        'aria-labelledby': ariaLabelledby,
        class: className = '',
        placeholder,
        options,
        disabled = false,
        children,
        ...rest
    }: SelectProps = $props();

    const field = getFieldContext();
    const control = $derived(resolveField(field?.(), { id, describedBy, invalid }));

    const uid = $props.id();
    const listId = `${uid}-list`;
    const optionId = (index: number) => `${uid}-opt-${index}`;

    let native: HTMLSelectElement | null = $state(null);
    let trigger: HTMLButtonElement | null = $state(null);
    let popup: HTMLElement | null = $state(null);
    let scanned: ListModel = $state({ options: [], groups: [] });

    const toRaw = (list: (SelectOption | SelectGroup)[]): RawNode[] =>
        list.map((entry) =>
            'options' in entry
                ? { tagName: 'optgroup', label: entry.label, disabled: entry.disabled, children: toRaw(entry.options) }
                : { tagName: 'option', value: entry.value, label: entry.label, disabled: entry.disabled }
        );

    const model = $derived(options ? parseOptions(toRaw(options)) : scanned);
    const chosen = $derived(model.options.find((o) => o.value === value));
    const showPlaceholder = $derived(placeholder !== undefined && (value === '' || !chosen));
    const shown = $derived(showPlaceholder ? placeholder : (chosen?.label ?? ''));

    const select = new SelectState({
        model: () => model,
        value: () => value,
        trigger: () => trigger,
        native: () => native
    });

    $effect(() => {
        if (options || !native) return;
        const el = native;
        const read = () => (scanned = parseOptions(el.children as unknown as ArrayLike<RawNode>));
        read();
        const watcher = new MutationObserver(read);
        watcher.observe(el, { childList: true, subtree: true, characterData: true, attributes: true });
        return () => watcher.disconnect();
    });

    $effect(() => {
        if (!select.open) return;
        const inside = (node: Node) => Boolean(trigger?.contains(node) || popup?.contains(node));
        return watchPopup(inside, select.hide, select.place);
    });

    $effect(() => {
        if (select.open && select.active >= 0) {
            document.getElementById(optionId(select.active))?.scrollIntoView({ block: 'nearest' });
        }
    });

    $effect(() => {
        if (disabled && select.open) select.hide();
    });
</script>

<!--
@component
Une liste déroulante au style de muse, jamais celle du système. Un bouton `combobox` ouvre un `listbox` (motif APG « select-only combobox ») ; un `<select>` natif masqué garde `name`, `required` et la soumission du formulaire. Les `<option>` en enfants ou la prop `options` fonctionnent ; `options` évite aussi le libellé vide au rendu serveur.
-->

{#snippet native_options(list: (SelectOption | SelectGroup)[])}
    {#each list as entry}
        {#if 'options' in entry}
            <optgroup label={entry.label} disabled={entry.disabled}>
                {#each entry.options as option}
                    <option value={option.value} disabled={option.disabled}>{option.label}</option>
                {/each}
            </optgroup>
        {:else}
            <option value={entry.value} disabled={entry.disabled}>{entry.label}</option>
        {/if}
    {/each}
{/snippet}

<div class={twMerge('relative w-full', className)}>
    <select bind:this={native} bind:value {disabled} tabindex="-1" aria-hidden="true" class="sr-only" {...rest}>
        {#if options}{@render native_options(options)}{:else if children}{@render children()}{/if}
    </select>

    <button
        bind:this={trigger}
        type="button"
        role="combobox"
        id={control.id}
        aria-haspopup="listbox"
        aria-expanded={select.open}
        aria-controls={select.open ? listId : undefined}
        aria-activedescendant={select.open && select.active >= 0 ? optionId(select.active) : undefined}
        aria-describedby={control.describedBy}
        aria-invalid={control.invalid}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        {disabled}
        class={twMerge(controlLine, 'flex cursor-pointer items-center justify-between gap-2 text-left')}
        onclick={select.toggle}
        onkeydown={select.keydown}
        onblur={select.hide}
    >
        <span class={twMerge('min-w-0 flex-1 truncate', showPlaceholder && 'text-fc-field-hint')}>{shown}</span>
        <Icon
            icon={icons.chevronDown}
            size={16}
            class={twMerge('text-fc-field-hint transition-transform motion-reduce:transition-none', select.open && 'rotate-180')}
        />
    </button>

    {#if select.open}
        <span bind:this={popup} class="contents">
            <SelectListbox
                id={listId}
                {optionId}
                {model}
                {value}
                active={select.active}
                up={select.up}
                left={select.left}
                top={select.top}
                bottom={select.bottom}
                width={select.width}
                maxHeight={select.maxHeight}
                label={ariaLabel ?? undefined}
                labelledby={ariaLabelledby ?? undefined}
                onpick={select.pick}
                onhover={(index) => (select.active = index)}
            />
        </span>
    {/if}
</div>
