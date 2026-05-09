<script lang="ts">
    import type { HTMLInputAttributes } from 'svelte/elements';
    import { twMerge } from 'tailwind-merge';

    let {
        label,
        checked = $bindable(false),
        class: className = '',
        ...rest
    }: HTMLInputAttributes & {
        label?: string;
        checked?: boolean;
        class?: string;
    } = $props();

    const classes = $derived(twMerge('inline-flex items-center gap-2 cursor-pointer text-fc-md text-fc-fg', className));
</script>

<label class={classes}>
    <input
        type="checkbox"
        bind:checked
        class="h-4 w-4 rounded-fc-sm accent-fc-accent disabled:opacity-50"
        {...rest}
    />
    {#if label}<span>{label}</span>{/if}
</label>
