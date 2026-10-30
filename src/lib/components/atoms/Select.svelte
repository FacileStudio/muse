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

    const classes = $derived(twMerge('h-11 w-full appearance-none rounded-fc bg-fc-surface hover:bg-fc-surface-hover focus:bg-fc-surface-hover bg-(image:--fc-select-chevron) bg-size-[1rem_1rem] bg-position-[right_0.75rem_center] bg-no-repeat pl-3 pr-10 text-fc-lead text-fc-ink outline-none disabled:opacity-50', className));
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
