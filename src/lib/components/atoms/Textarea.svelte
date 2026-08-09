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

    const classes = $derived(twMerge('w-full rounded-fc-md border border-fc-border bg-fc-bg px-3 py-2 text-fc-md text-fc-fg placeholder:text-fc-fg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fc-ring disabled:opacity-50 resize-y', className));
</script>

<textarea
    bind:value
    {rows}
    id={controlId}
    aria-describedby={describes}
    aria-invalid={isInvalid}
    class={classes}
    {...rest}
></textarea>
