<script module lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLAttributes } from 'svelte/elements';

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
    import { icons } from '../../icons.js';
    import Icon from '../atoms/Icon.svelte';

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

    const id = $derived(htmlFor ?? `${uid}-control`);
    const errorId = `${uid}-error`;
    const helperId = `${uid}-helper`;
    const describedBy = $derived(error ? errorId : helper ? helperId : undefined);

    const labelId = $derived(label ? `${uid}-label` : undefined);

    setFieldContext(() => ({ id, describedBy, invalid: Boolean(error), labelId }));

    const classes = $derived(twMerge('flex flex-col gap-1.5', className));
</script>

<!--
@component
L'étiquetage d'un contrôle. Le champ n'a plus de bordure : son libellé visible est obligatoire, c'est lui qui l'identifie avec le placeholder et l'anneau de focus. Il rend un vrai `label for`, et les contrôles muse adoptent son identifiant par contexte, sans câblage.
-->

<div class={classes} {...rest}>
    {#if label}<label id={labelId} for={id} class="text-fc-sm text-fc-fg">{label}</label>{/if}
    {@render children({ id, describedBy })}
    {#if error}
        <span id={errorId} class="flex items-start gap-1.5 text-fc-xs text-fc-danger">
            <Icon icon={icons.error} size={14} class="mt-0.5" />
            <span>{error}</span>
        </span>
    {:else if helper}
        <span id={helperId} class="text-fc-xs text-fc-fg-muted">{helper}</span>
    {/if}
</div>
