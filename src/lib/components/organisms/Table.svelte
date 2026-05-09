<script lang="ts">
    import type { Snippet } from 'svelte';
    import { twMerge } from 'tailwind-merge';

    let {
        children,
        class: className = ''
    }: { children: Snippet; class?: string } = $props();

    const classes = $derived(twMerge('w-full overflow-x-auto rounded-fc-md border border-fc-fg/10', className));
</script>

<div class={classes}>
    <table class="w-full border-collapse text-fc-sm text-fc-fg [&_th]:bg-fc-surface [&_th]:text-fc-fg-muted [&_th]:font-medium [&_th]:text-left [&_th]:px-3 [&_th]:py-2 [&_td]:px-3 [&_td]:py-2 [&_tbody_tr]:border-t [&_tbody_tr]:border-fc-fg/10">
        {@render children()}
    </table>
</div>
