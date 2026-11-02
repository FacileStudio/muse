<script module lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLSelectAttributes } from 'svelte/elements';

    export interface SelectProps extends HTMLSelectAttributes {
        class?: string;
        value?: string;
        /** A keyboard shortcut hint drawn left of the chevron, such as `O`. */
        shortcut?: string;
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
        shortcut,
        children,
        ...rest
    }: SelectProps = $props();

    const field = getFieldContext();
    const controlId = $derived(id ?? field?.().id);
    const describes = $derived(describedBy ?? field?.().describedBy);
    const isInvalid = $derived(invalid ?? (field?.().invalid ? 'true' : undefined));

    const classes = $derived(twMerge('h-8 w-full appearance-none rounded-fc bg-fc-surface hover:bg-fc-surface-hover focus:bg-fc-surface-hover bg-(image:--fc-select-chevron) bg-size-[1rem_1rem] bg-position-[right_0.75rem_center] bg-no-repeat pl-3 pr-10 text-fc-subtext text-fc-ink outline-none disabled:opacity-50', shortcut && 'pr-16', className));
</script>

<!--
@component
Une liste déroulante native, alignée sur la hauteur des autres champs.
-->

{#snippet control()}
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
{/snippet}

<!-- `rest` stays on the <select> even when wrapped: ids and aria attributes belong to the control -->
{#if shortcut}
    <span class="relative grid">
        {@render control()}
        <kbd aria-hidden="true" class="pointer-events-none absolute inset-y-0 right-10 flex items-center font-fc-body text-fc-subtext text-fc-ink opacity-25">{shortcut}</kbd>
    </span>
{:else}
    {@render control()}
{/if}
