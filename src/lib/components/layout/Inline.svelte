<script lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLAttributes } from 'svelte/elements';
    import { twMerge } from '../../utils/cn.js';
    import { ALIGN, GAP, type Align, type Gap } from '../../utils/layout.js';

    /*
     * Wraps by default. A row that cannot wrap either overflows its container or squeezes its
     * children below their hit target, and at the documented 360px floor an action row of three
     * buttons does one or the other on almost every page. `wrap={false}` is there for the rows
     * that genuinely must stay on one line, and those want `min-w-0` on the child that shrinks.
     */
    let {
        gap = 'tight',
        align = 'center',
        wrap = true,
        class: className = '',
        children,
        ...rest
    }: HTMLAttributes<HTMLDivElement> & {
        gap?: Gap;
        align?: Align;
        wrap?: boolean;
        class?: string;
        children: Snippet;
    } = $props();
</script>

<div
    class={twMerge('flex', wrap && 'flex-wrap', ALIGN[align], GAP[gap], className)}
    {...rest}
>
    {@render children()}
</div>
