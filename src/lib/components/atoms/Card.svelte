<script lang="ts">
    import type { Snippet } from 'svelte';
    import { twMerge } from '../../utils/cn.js';

    let {
        class: className = '',
        children
    }: { class?: string; children: Snippet } = $props();

    const classes = $derived(twMerge('rounded-fc-md bg-fc-component p-4', className));
</script>

<div class={classes}>
    {@render children()}
</div>
