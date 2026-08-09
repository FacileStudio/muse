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

    let {
        label,
        checked = $bindable(false),
        class: className = '',
        ...rest
    }: CheckboxProps = $props();

    const classes = $derived(twMerge('inline-flex items-center gap-2 cursor-pointer text-fc-sm text-fc-fg', className));
</script>

<label class={classes}>
    <input
        type="checkbox"
        bind:checked
        class="h-4 w-4 rounded-fc-sm accent-fc-accent disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fc-ring"
        {...rest}
    />
    {#if label}<span>{label}</span>{/if}
</label>
