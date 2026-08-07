<script lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';
    import { twMerge } from '../../utils/cn.js';

    let {
        class: className = '',
        ...rest
    }: HTMLAttributes<HTMLDivElement> & { class?: string } = $props();

    const classes = $derived(twMerge('animate-pulse motion-reduce:animate-none rounded-fc-sm bg-fc-surface/60', className));
</script>

<div class={classes} {...rest}></div>
