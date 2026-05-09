<script lang="ts">
    import { twMerge } from 'tailwind-merge';

    let { class: className = '' }: { class?: string } = $props();

    const classes = $derived(twMerge('border-t border-fc-fg/10 my-4', className));
</script>

<hr class={classes} />
