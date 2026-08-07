<script lang="ts">
    import type { HTMLInputAttributes } from 'svelte/elements';
    import { twMerge } from '../../utils/cn.js';

    let {
        label,
        group = $bindable(''),
        value,
        class: className = '',
        ...rest
    }: HTMLInputAttributes & {
        label?: string;
        group?: string;
        class?: string;
    } = $props();

    const classes = $derived(twMerge('inline-flex items-center gap-2 cursor-pointer text-fc-sm text-fc-fg', className));
</script>

<label class={classes}>
    <input
        type="radio"
        bind:group
        {value}
        class="h-4 w-4 accent-fc-accent disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fc-ring"
        {...rest}
    />
    {#if label}<span>{label}</span>{/if}
</label>
