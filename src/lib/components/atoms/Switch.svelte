<script module lang="ts">
    import type { HTMLInputAttributes } from 'svelte/elements';

    export interface SwitchProps extends Omit<HTMLInputAttributes, 'type' | 'checked'> {
        label?: string;
        checked?: boolean;
        disabled?: boolean;
        class?: string;

    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';
    import { getFieldContext, resolveField } from '../../utils/field.js';

    let {
        label,
        id,
        'aria-describedby': describedBy,
        'aria-invalid': invalid,
        checked = $bindable(false),
        disabled = false,
        class: className = '',
        ...rest
    }: SwitchProps = $props();

    const field = getFieldContext();
    const control = $derived(resolveField(field?.(), { id, describedBy, invalid }));

    const classes = $derived(twMerge('relative inline-flex items-center gap-3 cursor-pointer text-fc-sm text-fc-fg', disabled ? 'opacity-50 cursor-not-allowed' : '', className));
</script>

<!--
@component
Un interrupteur. Dans une `SettingsRow` il prend `aria-label` et jamais de libellé visible : la ligne le porte déjà.
-->

<label class={classes}>
    <input
        type="checkbox"
        role="switch"
        id={control.id}
        aria-describedby={control.describedBy}
        aria-invalid={control.invalid}
        bind:checked
        {disabled}
        class="peer sr-only"
        {...rest}
    />
    <span
        class="relative h-6 w-11 shrink-0 rounded-fc-pill bg-fc-field transition-colors peer-checked:bg-fc-accent peer-aria-invalid:bg-[color-mix(in_oklab,var(--color-fc-danger)_18%,var(--color-fc-field))] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-fc-ring peer-checked:[&>span]:translate-x-5 peer-checked:[&>span]:bg-fc-accent-fg"
    >
        <span class="absolute top-[3px] left-[3px] h-4 w-4 rounded-fc-pill bg-fc-fg-muted transition-transform"></span>
    </span>
    {#if label}<span>{label}</span>{/if}
</label>
