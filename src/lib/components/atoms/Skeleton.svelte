<script lang="ts">
    import { twMerge } from 'tailwind-merge';

    let { class: className = '' }: { class?: string } = $props();

    const classes = $derived(twMerge('animate-pulse motion-reduce:animate-none rounded-fc-sm bg-fc-surface/60', className));
</script>

<div class={classes}></div>
