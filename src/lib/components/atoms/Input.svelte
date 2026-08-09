<script module lang="ts">
    import type { HTMLInputAttributes } from 'svelte/elements';

    export interface InputProps extends HTMLInputAttributes {
        class?: string; value?: string | number 
    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';
    import { getFieldContext } from '../../utils/field.js';

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
    const controlId = $derived(id ?? field?.().id);
    const describes = $derived(describedBy ?? field?.().describedBy);
    const isInvalid = $derived(invalid ?? (field?.().invalid ? 'true' : undefined));

    const classes = $derived(twMerge('h-11 w-full rounded-fc-md border border-fc-border bg-fc-bg px-3 text-fc-md text-fc-fg placeholder:text-fc-fg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fc-ring disabled:opacity-50', className));
</script>

<!--
@component
Un champ de saisie en 44px de haut. Dans un `Field`, il adopte l'identifiant, la description et l'état d'erreur du champ.
-->

<input
    bind:value
    id={controlId}
    aria-describedby={describes}
    aria-invalid={isInvalid}
    class={classes}
    {...rest}
/>
