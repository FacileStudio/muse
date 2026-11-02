<script module lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';

    export interface DividerProps extends HTMLAttributes<HTMLHRElement> {
        class?: string 
    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';

    let {
        class: className = '',
        ...rest
    }: DividerProps = $props();

    const classes = $derived(twMerge('h-px border-0 bg-fc-surface-hover', className));
</script>

<!--
@component
Un filet de séparation. Il ne porte aucune marge : son air vient du `gap` de son parent.
-->

<hr class={classes} {...rest} />
