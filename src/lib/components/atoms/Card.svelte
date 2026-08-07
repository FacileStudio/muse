<script lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLAttributes } from 'svelte/elements';
    import { twMerge } from '../../utils/cn.js';

    let {
        class: className = '',
        children,
        ...rest
    }: HTMLAttributes<HTMLDivElement> & { class?: string; children: Snippet } = $props();

    const classes = $derived(twMerge('rounded-fc-md bg-fc-component p-4', className));
</script>

<div class={classes} {...rest}>
    {@render children()}
</div>
