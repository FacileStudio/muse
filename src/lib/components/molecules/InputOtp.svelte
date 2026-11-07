<script module lang="ts">
    import type { HTMLInputAttributes } from 'svelte/elements';
    import type { OtpKind } from '../../utils/otp.js';

    export interface InputOtpProps extends Omit<HTMLInputAttributes, 'value' | 'type' | 'maxlength' | 'size' | 'children'> {
        /** The code typed so far. Bindable. */
        value?: string;
        /** How many characters the code has, and so how many cells show. @default 6 */
        length?: number;
        /** `numeric` takes digits and opens the number pad. `alphanumeric` takes letters too. @default 'numeric' */
        kind?: OtpKind;
        /** Called once, when the last cell is filled. */
        onComplete?: (value: string) => void;
        class?: string;
    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';
    import { getI18n } from '../../i18n/context.svelte.js';
    import { getFieldContext, resolveField } from '../../utils/field.js';
    import { activeCell, cellsOf, isComplete, sanitizeCode } from '../../utils/otp.js';

    let {
        value = $bindable(''),
        length = 6,
        kind = 'numeric',
        onComplete,
        disabled = false,
        id,
        'aria-describedby': describedBy,
        'aria-invalid': invalid,
        'aria-label': ariaLabel,
        class: className = '',
        ...rest
    }: InputOtpProps = $props();

    const i18n = getI18n();
    const field = getFieldContext();
    const control = $derived(resolveField(field?.(), { id, describedBy, invalid }));

    let input: HTMLInputElement | null = $state(null);

    const cells = $derived(cellsOf(value, length));
    const caret = $derived(activeCell(value, length));

    function change(event: Event & { currentTarget: HTMLInputElement }) {
        const next = sanitizeCode(event.currentTarget.value, length, kind);
        const grew = next.length > value.length;
        value = next;
        event.currentTarget.value = next;
        if (grew && isComplete(next, length)) onComplete?.(next);
    }

    function stayAtEnd() {
        input?.setSelectionRange(value.length, value.length);
    }
</script>

<!--
@component
Un code à usage unique en cases séparées : un seul vrai champ de saisie, donc la saisie, le collage d'un code complet et la saisie automatique d'un SMS fonctionnent. Les cases montrent la progression, `onComplete` part à la dernière.
-->

<div class={twMerge('relative inline-flex gap-2', disabled && 'cursor-not-allowed opacity-50', className)}>
    <input
        bind:this={input}
        type="text"
        inputmode={kind === 'numeric' ? 'numeric' : 'text'}
        autocomplete="one-time-code"
        autocapitalize="off"
        autocorrect="off"
        spellcheck="false"
        maxlength={length}
        pattern={kind === 'numeric' ? '[0-9]*' : '[A-Za-z0-9]*'}
        {...rest}
        id={control.id}
        {value}
        {disabled}
        aria-label={ariaLabel}
        aria-describedby={control.describedBy}
        aria-invalid={control.invalid}
        class="peer absolute inset-0 z-10 size-full cursor-text appearance-none bg-transparent text-transparent caret-transparent opacity-0 disabled:cursor-not-allowed"
        oninput={change}
        onclick={stayAtEnd}
        onselect={stayAtEnd}
    />
    {#each cells as char, i (i)}
        <div
            data-otp-cell
            aria-hidden="true"
            title={i18n.t('otp.digit', { n: i + 1, total: length })}
            class={twMerge(
                'flex h-12 w-10 items-center justify-center rounded-fc-md bg-fc-field text-fc-lg font-medium text-fc-fg tabular-nums',
                control.invalid && 'bg-[color-mix(in_oklab,var(--color-fc-danger)_18%,var(--color-fc-field))]',
                i === caret && 'peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-fc-ring'
            )}
        >
            {char}
        </div>
    {/each}
</div>
