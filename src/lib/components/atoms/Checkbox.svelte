<script module lang="ts">
    import type { HTMLInputAttributes } from 'svelte/elements';

    export interface CheckboxProps extends Omit<HTMLInputAttributes, 'type' | 'checked'> {
        label?: string;
        checked?: boolean;
        class?: string;

    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';
    import { getFieldContext, resolveField } from '../../utils/field.js';

    let {
        label,
        id,
        'aria-describedby': describedBy,
        'aria-invalid': invalid,
        checked = $bindable(false),
        class: className = '',
        ...rest
    }: CheckboxProps = $props();

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
    const control = $derived(resolveField(field?.(), { id, describedBy, invalid }));

    const classes = $derived(twMerge('inline-flex items-center gap-2 cursor-pointer text-fc-sm text-fc-fg', className));
</script>

<!--
@component
Une case à cocher qui adopte l'identifiant de son `Field`. La boîte est un aplat de 20px sans bordure, cochée en accent avec un tracé SVG ; c'est le libellé qui porte la cible tactile.
-->

<label class={classes}>
    <span class="relative inline-flex size-5 shrink-0">
        <input
            type="checkbox"
            id={control.id}
            aria-describedby={control.describedBy}
            aria-invalid={control.invalid}
            bind:checked
            class="peer size-5 shrink-0 cursor-pointer appearance-none rounded-fc-sm bg-fc-field transition-colors checked:bg-fc-accent aria-invalid:bg-[color-mix(in_oklab,var(--color-fc-danger)_18%,var(--color-fc-field))] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fc-ring"
            {...rest}
        />
        <svg
            viewBox="0 0 20 20"
            aria-hidden="true"
            class="pointer-events-none absolute inset-0 size-5 text-fc-accent-fg opacity-0 transition-opacity peer-checked:opacity-100 peer-disabled:opacity-0"
            fill="none"
            stroke="currentColor"
            stroke-width="2.25"
            stroke-linecap="round"
            stroke-linejoin="round"
        >
            <path d="m5.5 10.5 3 3 6-7" />
        </svg>
    </span>
    {#if label}<span>{label}</span>{/if}
</label>
