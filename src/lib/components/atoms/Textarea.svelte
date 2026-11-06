<script module lang="ts">
    import type { HTMLTextareaAttributes } from 'svelte/elements';

    export interface TextareaProps extends HTMLTextareaAttributes {
        class?: string; value?: string
    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';
    import { controlFill } from '../../utils/control.js';
    import { getFieldContext, resolveField } from '../../utils/field.js';

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
    const control = $derived(resolveField(field?.(), { id, describedBy, invalid }));

    const classes = $derived(twMerge('w-full resize-y px-3 py-2', controlFill, className));
</script>

<!--
@component
Une zone de texte multiligne, redimensionnable verticalement, qui adopte le contexte de son `Field`.
-->

<textarea
    bind:value
    {rows}
    id={control.id}
    aria-describedby={control.describedBy}
    aria-invalid={control.invalid}
    class={classes}
    {...rest}
></textarea>
