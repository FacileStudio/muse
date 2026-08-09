<script lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLAttributes } from 'svelte/elements';
    import { twMerge } from '../../utils/cn.js';
    import { GAP, type Gap } from '../../utils/layout.js';

    let {
        gap = 'content',
        class: className = '',
        children,
        ...rest
    }: HTMLAttributes<HTMLDivElement> & {
        gap?: Gap;
        class?: string;
        children: Snippet;
    } = $props();
</script>

<div class={twMerge('flex flex-col', GAP[gap], className)} {...rest}>
    {@render children()}
</div>
