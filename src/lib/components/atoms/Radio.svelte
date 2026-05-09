<script lang="ts">
    import type { HTMLInputAttributes } from 'svelte/elements';
    import { twMerge } from 'tailwind-merge';

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

    const classes = $derived(twMerge('inline-flex items-center gap-2 cursor-pointer text-fc-md text-fc-fg', className));
</script>

<label class={classes}>
    <input
        type="radio"
        bind:group
        {value}
        class="h-4 w-4 accent-fc-accent disabled:opacity-50"
        {...rest}
    />
    {#if label}<span>{label}</span>{/if}
</label>
