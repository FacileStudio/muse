<script module lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLAttributes } from 'svelte/elements';

    export interface TableProps extends HTMLAttributes<HTMLDivElement> {
        children: Snippet; class?: string 
    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';

    let {
        children,
        class: className = '',
        ...rest
    }: TableProps = $props();

    const classes = $derived(twMerge('w-full overflow-x-auto rounded-fc-md bg-fc-component', className));
</script>

<div class={classes} {...rest}>
    <table class="w-full border-collapse text-fc-sm text-fc-fg [&_th]:bg-fc-surface [&_th]:text-fc-fg-muted [&_th]:font-medium [&_th]:text-left [&_th]:px-3 [&_th]:py-2 [&_td]:px-3 [&_td]:py-2 [&_tbody_tr]:border-t [&_tbody_tr]:border-fc-border">
        {@render children()}
    </table>
</div>
