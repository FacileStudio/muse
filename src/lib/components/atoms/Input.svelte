<script module lang="ts">
    import type { HTMLInputAttributes } from 'svelte/elements';

    export interface InputProps extends HTMLInputAttributes {
        class?: string; value?: string | number
    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';
    import { controlLine } from '../../utils/control.js';
    import { getFieldContext, resolveField } from '../../utils/field.js';

    let {
        value = $bindable(''),
        id,
        'aria-describedby': describedBy,
        'aria-invalid': invalid,
        class: className = '',
        ...rest
    }: InputProps = $props();

    /* Inside a `Field`, adopt the ids it generated so the label actually points here.
       An explicit prop always wins, and outside a Field this is a no-op. */
    const field = getFieldContext();
    const control = $derived(resolveField(field?.(), { id, describedBy, invalid }));

    const classes = $derived(twMerge(controlLine, className));
</script>

<!--
@component
Un champ de saisie en 44px de haut. Dans un `Field`, il adopte l'identifiant, la description et l'état d'erreur du champ.
-->

<input
    bind:value
    id={control.id}
    aria-describedby={control.describedBy}
    aria-invalid={control.invalid}
    class={classes}
    {...rest}
/>
