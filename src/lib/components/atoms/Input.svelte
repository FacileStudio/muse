<script lang="ts">
    import type { HTMLInputAttributes } from 'svelte/elements';
    import { twMerge } from 'tailwind-merge';

    let {
        value = $bindable(''),
        class: className = '',
        ...rest
    }: HTMLInputAttributes & { class?: string; value?: string | number } = $props();

    const classes = $derived(twMerge('h-11 w-full rounded-fc-md border border-fc-fg/10 bg-fc-bg px-3 text-fc-md text-fc-fg placeholder:text-fc-fg-muted focus:outline-2 focus:outline-fc-accent disabled:opacity-50', className));
</script>

<input bind:value class={classes} {...rest} />
