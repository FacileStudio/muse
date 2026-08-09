<script lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';
    import { twMerge } from '../../utils/cn.js';

    let {
        class: className = '',
        ...rest
    }: HTMLAttributes<HTMLHRElement> & { class?: string } = $props();

    const classes = $derived(twMerge('border-0 border-t border-fc-border', className));
</script>

<hr class={classes} {...rest} />
