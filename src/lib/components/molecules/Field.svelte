<script lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLAttributes } from 'svelte/elements';
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
    }: HTMLAttributes<HTMLDivElement> & {
        label?: string;
        helper?: string;
        error?: string;
        for?: string;
        children: Snippet<[{ id: string; describedBy: string | undefined }]>;
        class?: string;
    } = $props();

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

<div class={classes} {...rest}>
    {#if label}<label for={id} class="text-fc-sm text-fc-fg">{label}</label>{/if}
    {@render children({ id, describedBy })}
    {#if error}
        <span id={errorId} class="text-fc-xs text-fc-danger">{error}</span>
    {:else if helper}
        <span id={helperId} class="text-fc-xs text-fc-fg-muted">{helper}</span>
    {/if}
</div>
