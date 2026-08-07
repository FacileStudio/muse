<script lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLAttributes } from 'svelte/elements';
    import { twMerge } from '../../utils/cn.js';

    let {
        class: className = '',
        children,
        ...rest
    }: HTMLAttributes<HTMLDivElement> & { class?: string; children: Snippet } = $props();

    /* p-5, not p-4: the fill against the page is a 1.5% lightness step and there is no border,
       so the padding is what separates the card from the page. See CHARTE §5. */
    const classes = $derived(twMerge('rounded-fc-md bg-fc-component p-5', className));
</script>

<div class={classes} {...rest}>
    {@render children()}
</div>
