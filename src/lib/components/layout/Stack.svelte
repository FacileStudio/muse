<script module lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLAttributes } from 'svelte/elements';
    import type { Gap } from '../../utils/layout.js';

    export interface StackProps extends HTMLAttributes<HTMLDivElement> {
        gap?: Gap;
        class?: string;
        children: Snippet;

    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';
    import { GAP } from '../../utils/layout.js';

    let {
        gap = 'content',
        class: className = '',
        children,
        ...rest
    }: StackProps = $props();
</script>

<div class={twMerge('flex flex-col', GAP[gap], className)} {...rest}>
    {@render children()}
</div>
