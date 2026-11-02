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

    const classes = $derived(twMerge('w-full overflow-x-auto', className));
</script>

<!--
@component
Un tableau de données dont chaque ligne porte sa propre surface. Le tri et la sélection appartiennent encore au consommateur.
-->

<div class={classes} {...rest}>
    <!-- Rows carry the surface, not the table: border-spacing opens the gap between them. -->
    <table class="w-full border-separate border-spacing-y-2 text-fc-p text-fc-ink [&_th]:text-fc-muted [&_th]:font-medium [&_th]:text-left [&_th]:px-3 [&_th]:py-1 [&_td]:bg-fc-surface [&_td]:px-3 [&_td]:py-3 [&_tbody_tr:hover_td]:bg-fc-surface-hover [&_td:first-child]:rounded-l-fc [&_td:last-child]:rounded-r-fc">
        {@render children()}
    </table>
</div>
