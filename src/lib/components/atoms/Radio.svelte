<script module lang="ts">
    import type { HTMLInputAttributes } from 'svelte/elements';

    export interface RadioProps extends HTMLInputAttributes {
        label?: string;
        group?: string;
        class?: string;

    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';
    import { getFieldContext } from '../../utils/field.js';

    let {
        label,
        id,
        'aria-describedby': describedBy,
        group = $bindable(''),
        value,
        class: className = '',
        ...rest
    }: RadioProps = $props();

    /*
     * Inside a `Field`, adopt the ids it generated. Without this the field renders
     * `<label for="…-control">` pointing at an element that does not exist and the control has
     * no accessible name — the exact silent failure `utils/field.ts` was written to prevent,
     * fixed for `Input`/`Select`/`Textarea` and missed on the three controls that wrap
     * themselves in their own `<label>`.
     *
     * That wrapper stays. It carries no text in field mode, so it adds nothing to the
     * accessible name, and it is what makes clicking the visible control toggle it — dropping
     * it would leave the input with an inert graphic beside it. An explicit prop always wins,
     * and outside a Field the lookup is a no-op.
     *
     * No `aria-invalid` here, unlike the other two: validity is a property of the radio *group*,
     * not of one button in it, and `role="radio"` does not support the attribute.
     */
    const field = getFieldContext();
    const controlId = $derived(id ?? field?.().id);
    const describes = $derived(describedBy ?? field?.().describedBy);

    const classes = $derived(twMerge('inline-flex items-center gap-2 cursor-pointer text-fc-sm text-fc-fg', className));
</script>

<label class={classes}>
    <input
        type="radio"
        id={controlId}
        aria-describedby={describes}
        bind:group
        {value}
        class="h-4 w-4 accent-fc-accent disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fc-ring"
        {...rest}
    />
    {#if label}<span>{label}</span>{/if}
</label>
