<script module lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLSelectAttributes } from 'svelte/elements';

    export interface SelectProps extends HTMLSelectAttributes {
        class?: string;
        value?: string;
        children: Snippet;

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
        children,
        ...rest
    }: SelectProps = $props();

    const field = getFieldContext();
    const controlId = $derived(id ?? field?.().id);
    const describes = $derived(describedBy ?? field?.().describedBy);
    const isInvalid = $derived(invalid ?? (field?.().invalid ? 'true' : undefined));

    const classes = $derived(twMerge('h-11 w-full rounded-fc-md border border-fc-border bg-fc-bg px-3 text-fc-md text-fc-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fc-ring disabled:opacity-50', className));
</script>

<!--
@component
Une liste déroulante native, alignée sur la hauteur des autres champs.
-->

<select
    bind:value
    id={controlId}
    aria-describedby={describes}
    aria-invalid={isInvalid}
    class={classes}
    {...rest}
>
    {@render children()}
</select>
