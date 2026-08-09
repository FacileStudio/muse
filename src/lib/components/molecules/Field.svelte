<script module lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLAttributes } from 'svelte/elements';

    /*
     * `children` is Omitted rather than intersected. `HTMLAttributes` declares its own
     * `children?: Snippet<[]>`, and an intersection with a parameterised snippet produces a
     * type that accepts neither arity — which is why `{#snippet children({ id })}` failed with
     * "Expected 1 or more, but got 0" and consumers had to reach for `getFieldContext` instead.
     * The intersection swallowed it silently; `interface extends` checks compatibility and
     * surfaced it.
     */
    export interface FieldProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
        label?: string;
        helper?: string;
        error?: string;
        for?: string;
        children: Snippet<[{ id: string; describedBy: string | undefined }]>;
        class?: string;

    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';
    import { setFieldContext } from '../../utils/field.js';

    let {
        label,
        helper,
        error,
        for: htmlFor,
        children,
        class: className = '',
        ...rest
    }: FieldProps = $props();

    const uid = $props.id();

    /*
     * The label, the message and the control have to agree on one id or the label points at
     * nothing. muse's own form atoms pick the ids up from context automatically, so the
     * plain `<Field label="Email"><Input /></Field>` form is correctly labelled with no
     * ceremony; the same ids are also passed as snippet parameters for controls muse does
     * not own. `for` lets a caller that already manages its own id keep it instead.
     */
    const id = $derived(htmlFor ?? `${uid}-control`);
    const errorId = `${uid}-error`;
    const helperId = `${uid}-helper`;
    const describedBy = $derived(error ? errorId : helper ? helperId : undefined);

    setFieldContext(() => ({ id, describedBy, invalid: Boolean(error) }));

    const classes = $derived(twMerge('flex flex-col gap-1.5', className));
</script>

<!--
@component
L'étiquetage d'un contrôle. Il rend un vrai `label for`, et les contrôles muse adoptent son identifiant par contexte, sans câblage.
-->

<div class={classes} {...rest}>
    {#if label}<label for={id} class="text-fc-sm text-fc-fg">{label}</label>{/if}
    {@render children({ id, describedBy })}
    {#if error}
        <span id={errorId} class="text-fc-xs text-fc-danger">{error}</span>
    {:else if helper}
        <span id={helperId} class="text-fc-xs text-fc-fg-muted">{helper}</span>
    {/if}
</div>
