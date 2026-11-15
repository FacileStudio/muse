<script module lang="ts">
    import type { HTMLInputAttributes } from 'svelte/elements';

    export interface TagInputProps extends Omit<HTMLInputAttributes, 'value' | 'type' | 'size'> {
        /** The tags, in order. Bindable. */
        value?: string[];
        /** Tags offered under the field while the draft matches them. */
        suggestions?: string[];
        /** Marks a tag that does not pass, such as a malformed address. It is drawn in the danger tint and the field reports `aria-invalid`. */
        validate?: (tag: string) => boolean;
        /** Refuses a tag that fails `validate` instead of keeping it marked. */
        rejectInvalid?: boolean;
        /** The most tags the field takes. */
        max?: number;
        /** Extra classes for one chip, such as a categorical hue. */
        tagClass?: (tag: string) => string | undefined;
        /** Called with the draft as the user types, to load suggestions. */
        onInput?: (draft: string) => void;
        onChange?: (value: string[]) => void;
        class?: string;
    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';
    import { getI18n } from '../../i18n/context.svelte.js';
    import { icons } from '../../icons.js';
    import { getFieldContext, resolveField } from '../../utils/field.js';
    import { addTags, matchSuggestions, splitTags } from '../../utils/tags.js';
    import Icon from '../atoms/Icon.svelte';
    import Tooltip from '../atoms/Tooltip.svelte';

    let {
        value = $bindable([]),
        suggestions = [],
        validate,
        rejectInvalid = false,
        max,
        tagClass,
        onInput,
        onChange,
        id,
        'aria-describedby': describedBy,
        'aria-invalid': invalid,
        placeholder,
        disabled,
        class: className = '',
        ...rest
    }: TagInputProps = $props();

    const i18n = getI18n();
    const field = getFieldContext();
    const control = $derived(resolveField(field?.(), { id, describedBy, invalid }));

    let draft = $state('');
    let status = $state('');
    let input: HTMLInputElement | null = $state(null);

    const full = $derived(max !== undefined && value.length >= max);
    const offered = $derived(full ? [] : matchSuggestions(suggestions, value, draft));
    const anyInvalid = $derived(Boolean(validate) && value.some((tag) => !validate!(tag)));

    function commit(next: string[], message: string) {
        value = next;
        status = message;
        onChange?.(next);
    }

    function add(tags: string[]) {
        const next = addTags(value, tags, { max, validate, allowInvalid: !rejectInvalid });
        const added = next.filter((tag) => !value.includes(tag));
        if (added.length) commit(next, i18n.t('tags.added', { tag: added.join(', ') }));
        draft = '';
        onInput?.('');
    }

    function remove(tag: string) {
        commit(value.filter((candidate) => candidate !== tag), i18n.t('tags.removed', { tag }));
        input?.focus();
    }

    function keydown(event: KeyboardEvent) {
        if (event.key === 'Enter' || event.key === ',') {
            if (draft.trim()) {
                event.preventDefault();
                add(splitTags(draft));
            } else if (event.key === ',') event.preventDefault();
        } else if (event.key === 'Backspace' && draft === '' && value.length > 0) {
            event.preventDefault();
            remove(value[value.length - 1]);
        }
    }

    function paste(event: ClipboardEvent) {
        const text = event.clipboardData?.getData('text') ?? '';
        if (!/[,;\n\r]/.test(text)) return;
        event.preventDefault();
        add(splitTags(draft + text));
    }

    function typed(event: Event) {
        draft = (event.currentTarget as HTMLInputElement).value;
        onInput?.(draft);
    }
</script>

<!--
@component
Un champ de saisie de plusieurs valeurs : chaque valeur validée devient une pastille qu'on retire d'une croix ou d'un retour arrière. Entrée, virgule ou la sortie du champ valident, le collage d'une liste la découpe, et des suggestions s'offrent sous le champ. Il remplace les champs d'adresses et d'étiquettes faits maison.
-->

<div class={twMerge('flex flex-col gap-2', className)}>
    <div
        class="flex min-h-11 flex-wrap items-center gap-2 rounded-fc-md bg-fc-field p-1.5 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-fc-ring"
        role="group"
        aria-label={placeholder}
    >
        {#each value as tag (tag)}
            {@const bad = validate ? !validate(tag) : false}
            <span
                class={twMerge(
                    'inline-flex h-8 max-w-full items-center gap-1 rounded-fc-pill py-0 pr-1 pl-3 text-fc-sm',
                    bad ? 'bg-fc-danger/10 text-fc-danger' : 'bg-fc-surface text-fc-fg',
                    tagClass?.(tag)
                )}
            >
                <span class="truncate">{tag}</span>
                {#if !disabled}
                    <Tooltip text={i18n.t('tags.remove', { tag })} describe={false} class="contents">
                        <button
                            type="button"
                            aria-label={i18n.t('tags.remove', { tag })}
                            class="inline-flex size-8 shrink-0 items-center justify-center rounded-fc-pill opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fc-ring [@media(pointer:coarse)]:size-11"
                            onclick={() => remove(tag)}
                        >
                            <Icon icon={icons.close} size={14} />
                        </button>
                    </Tooltip>
                {/if}
            </span>
        {/each}
        {#if !full}
            <input
                bind:this={input}
                type="text"
                id={control.id}
                aria-describedby={control.describedBy}
                aria-invalid={control.invalid ?? (anyInvalid ? true : undefined)}
                autocomplete="off"
                autocapitalize="off"
                spellcheck="false"
                {disabled}
                placeholder={value.length ? undefined : (placeholder ?? i18n.t('tags.placeholder'))}
                class="h-8 min-w-32 flex-1 bg-transparent px-2 text-fc-md text-fc-fg placeholder:text-fc-fg-muted focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 [@media(pointer:coarse)]:h-11"
                {...rest}
                value={draft}
                oninput={typed}
                onkeydown={(event) => {
                    rest.onkeydown?.(event);
                    keydown(event);
                }}
                onpaste={(event) => {
                    rest.onpaste?.(event);
                    paste(event);
                }}
                onblur={(event) => {
                    rest.onblur?.(event);
                    if (draft.trim()) add(splitTags(draft));
                }}
            />
        {/if}
    </div>

    {#if offered.length > 0}
        <div role="group" aria-label={i18n.t('tags.suggestions')} class="flex flex-wrap gap-2">
            {#each offered as tag (tag)}
                <button
                    type="button"
                    class="inline-flex h-8 cursor-pointer items-center rounded-fc-pill bg-fc-surface px-3 text-fc-sm text-fc-fg-muted transition-colors hover:text-fc-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fc-ring [@media(pointer:coarse)]:h-11"
                    onmousedown={(event) => event.preventDefault()}
                    onclick={() => {
                        add([tag]);
                        input?.focus();
                    }}
                >
                    {tag}
                </button>
            {/each}
        </div>
    {/if}
    <span role="status" class="sr-only">{status}</span>
</div>
