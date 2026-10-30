<script module lang="ts">
    import type { HTMLTextareaAttributes } from 'svelte/elements';

    export interface TextareaProps extends HTMLTextareaAttributes {
        class?: string; value?: string 
    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';
    import { getFieldContext } from '../../utils/field.js';

    let {
        value = $bindable(''),
        rows = 4,
        id,
        'aria-describedby': describedBy,
        'aria-invalid': invalid,
        class: className = '',
        ...rest
    }: TextareaProps = $props();

    const field = getFieldContext();
    const controlId = $derived(id ?? field?.().id);
    const describes = $derived(describedBy ?? field?.().describedBy);
    const isInvalid = $derived(invalid ?? (field?.().invalid ? 'true' : undefined));

    const classes = $derived(twMerge('w-full rounded-fc bg-fc-surface hover:bg-fc-surface-hover focus:bg-fc-surface-hover px-3 py-2 text-fc-lead text-fc-ink placeholder:text-fc-muted outline-none disabled:opacity-50 resize-y', className));
</script>

<!--
@component
Une zone de texte multiligne, redimensionnable verticalement, qui adopte le contexte de son `Field`.
-->

<textarea
    bind:value
    {rows}
    id={controlId}
    aria-describedby={describes}
    aria-invalid={isInvalid}
    class={classes}
    {...rest}
></textarea>
