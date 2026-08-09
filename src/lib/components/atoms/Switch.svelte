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
    import { getFieldContext } from '../../utils/field.js';

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
     */
    const field = getFieldContext();
    const controlId = $derived(id ?? field?.().id);
    const describes = $derived(describedBy ?? field?.().describedBy);
    const isInvalid = $derived(invalid ?? (field?.().invalid ? 'true' : undefined));

    /*
        `relative` is load-bearing, not decoration: `sr-only` is `position: absolute`, and an
        absolutely positioned box whose nearest *positioned* ancestor is the initial containing
        block is laid out against the document — `overflow` on an unpositioned ancestor does not
        clip it. Inside an app shell whose scroller is an inner `<main>`, that puts a 1px input
        at its flow offset in *document* coordinates, several thousand pixels down, and hands
        the page a second scrollbar into empty space. Positioning the label confines it.
    */
    const classes = $derived(twMerge('relative inline-flex items-center gap-3 cursor-pointer text-fc-sm text-fc-fg', disabled ? 'opacity-50 cursor-not-allowed' : '', className));
</script>

<label class={classes}>
    <input
        type="checkbox"
        role="switch"
        id={controlId}
        aria-describedby={describes}
        aria-invalid={isInvalid}
        bind:checked
        {disabled}
        class="peer sr-only"
        {...rest}
    />
    <span
        class="relative h-6 w-11 shrink-0 rounded-fc-pill border border-fc-border bg-fc-surface transition-colors peer-checked:border-fc-accent peer-checked:bg-fc-accent peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-fc-ring peer-checked:[&>span]:translate-x-5 peer-checked:[&>span]:bg-fc-accent-fg"
    >
        <span class="absolute top-[3px] left-[3px] h-4 w-4 rounded-fc-pill bg-fc-fg-muted transition-transform"></span>
    </span>
    {#if label}<span>{label}</span>{/if}
</label>
