<script module lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';

    export type RadioGroupOption = { value: string; label: string; disabled?: boolean };

    export interface RadioGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
        options: RadioGroupOption[];
        /** The checked option's value. Bindable. */
        value?: string;
        /** The form field name. Generated when omitted, so the arrow keys always stay inside the group. */
        name?: string;
        disabled?: boolean;
        /** `vertical` stacks the options, `horizontal` wraps them in a row. @default 'vertical' */
        orientation?: 'vertical' | 'horizontal';
        /** Passed to every `Radio`: the 44px touch area stops at half of `--fc-control-gap` instead of reaching into the next row. */
        dense?: boolean;
        class?: string;
    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';
    import { getFieldContext, resolveField } from '../../utils/field.js';
    import Radio from '../atoms/Radio.svelte';

    let {
        options,
        value = $bindable(''),
        name,
        disabled = false,
        orientation = 'vertical',
        dense = false,
        id,
        'aria-describedby': describedBy,
        'aria-invalid': invalid,
        'aria-labelledby': labelledby,
        class: className = '',
        ...rest
    }: RadioGroupProps = $props();

    const uid = $props.id();
    const field = getFieldContext();
    const control = $derived(resolveField(field?.(), { id, describedBy, invalid }));

    const classes = $derived(
        twMerge('flex gap-x-6', orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap', className)
    );
</script>

<!--
@component
Un groupe de boutons radio. Un seul est dans l'ordre de tabulation, les flèches déplacent le choix et le coche, et le groupe prend le nom de son `Field`. Ce sont des radios natifs : le navigateur fournit le tabindex itinérant.
-->

<div
    role="radiogroup"
    id={control.id}
    aria-labelledby={labelledby ?? control.labelId}
    aria-describedby={control.describedBy}
    aria-invalid={control.invalid}
    class={classes}
    {...rest}
>
    {#each options as option, i (option.value)}
        <Radio
            id="{uid}-{i}"
            name={name ?? uid}
            bind:group={value}
            value={option.value}
            label={option.label}
            {dense}
            class={dense ? '' : 'min-h-11'}
            disabled={disabled || option.disabled}
        />
    {/each}
</div>
