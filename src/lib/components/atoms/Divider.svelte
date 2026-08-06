<script lang="ts">
    import { twMerge } from '../../utils/cn.js';

    let { class: className = '' }: { class?: string } = $props();

    const classes = $derived(twMerge('border-0 border-t border-fc-border my-4', className));
</script>

<hr class={classes} />
