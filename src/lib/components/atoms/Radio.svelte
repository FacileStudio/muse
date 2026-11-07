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
    import { getFieldContext, resolveField } from '../../utils/field.js';

    let {
        label,
        id,
        'aria-describedby': describedBy,
        group = $bindable(''),
        value,
        class: className = '',
        ...rest
    }: RadioProps = $props();

    const field = getFieldContext();
    const control = $derived(resolveField(field?.(), { id, describedBy }));

    const classes = $derived(twMerge('inline-flex items-center gap-2 cursor-pointer text-fc-sm text-fc-fg', className));
</script>

<!--
@component
Un bouton radio. La validité appartient au groupe, pas au bouton, donc il ne porte pas `aria-invalid`.
-->

<label class={classes}>
    <span class="relative inline-flex size-5 shrink-0 before:absolute before:-inset-3 before:content-['']">
        <input
            type="radio"
            id={control.id}
            aria-describedby={control.describedBy}
            bind:group
            {value}
            class="peer size-5 shrink-0 cursor-pointer appearance-none rounded-fc-full bg-fc-field transition-colors checked:bg-fc-accent disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fc-ring"
            {...rest}
        />
        <svg
            viewBox="0 0 20 20"
            aria-hidden="true"
            class="pointer-events-none absolute inset-0 size-5 text-fc-accent-fg opacity-0 transition-opacity peer-checked:opacity-100"
            fill="currentColor"
        >
            <circle cx="10" cy="10" r="3.5" />
        </svg>
    </span>
    {#if label}<span>{label}</span>{/if}
</label>
