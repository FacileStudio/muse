<script module lang="ts">
    import type { HTMLInputAttributes } from 'svelte/elements';

    export interface InputProps extends HTMLInputAttributes {
        class?: string;
        value?: string | number;
        /** A keyboard shortcut hint drawn inside the field's right edge, such as `/` or `⌘K`. */
        shortcut?: string;
        /** An icon drawn inside the field's left edge, such as `icons.search`. */
        icon?: string;
    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';
    import { getFieldContext } from '../../utils/field.js';
    import Icon from './Icon.svelte';

    let {
        value = $bindable(''),
        id,
        'aria-describedby': describedBy,
        'aria-invalid': invalid,
        class: className = '',
        shortcut,
        icon,
        ...rest
    }: InputProps = $props();

    /* Inside a `Field`, adopt the ids it generated so the label actually points here.
       An explicit prop always wins, and outside a Field this is a no-op. */
    const field = getFieldContext();
    const controlId = $derived(id ?? field?.().id);
    const describes = $derived(describedBy ?? field?.().describedBy);
    const isInvalid = $derived(invalid ?? (field?.().invalid ? 'true' : undefined));

    const classes = $derived(twMerge('h-8 w-full rounded-fc bg-fc-surface hover:bg-fc-surface-hover focus:bg-fc-surface-hover px-3 text-fc-subtext text-fc-ink placeholder:text-fc-muted outline-none disabled:opacity-50', shortcut && 'pr-8', icon && 'pl-9.5', className));
</script>

<!--
@component
Un champ de saisie en 32px de haut. Dans un `Field`, il adopte l'identifiant, la description et l'état d'erreur du champ.
-->

{#snippet control()}
    <input
        bind:value
        id={controlId}
        aria-describedby={describes}
        aria-invalid={isInvalid}
        class={classes}
        {...rest}
    />
{/snippet}

<!-- `rest` stays on the <input> even when wrapped: ids and aria attributes belong to the control -->
{#if shortcut || icon}
    <!-- the icon and hint follow the input so its fill does not paint over them -->
    <span class="relative grid">
        {@render control()}
        {#if icon}
            <Icon {icon} class="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-fc-muted" />
        {/if}
        {#if shortcut}
            <kbd aria-hidden="true" class="pointer-events-none absolute inset-y-0 right-3 flex items-center font-fc-body text-fc-subtext text-fc-ink opacity-25">{shortcut}</kbd>
        {/if}
    </span>
{:else}
    {@render control()}
{/if}
