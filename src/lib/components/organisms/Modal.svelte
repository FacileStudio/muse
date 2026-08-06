<script lang="ts">
    import type { Snippet } from 'svelte';
    import { twMerge } from '../../utils/cn.js';

    let {
        open = $bindable(false),
        title,
        children,
        class: className = ''
    }: {
        open?: boolean;
        title?: string;
        children: Snippet;
        class?: string;
    } = $props();

    let dialog: HTMLDialogElement | null = $state(null);

    $effect(() => {
        if (!dialog) return;
        if (open && !dialog.open) dialog.showModal();
        if (!open && dialog.open) dialog.close();
    });

    function onClose() {
        open = false;
    }

    /*
     * `m-auto` is load-bearing: a <dialog> opened with showModal() is centred by the UA's
     * own `margin: auto`, and Tailwind preflight's `margin: 0` reset kills exactly that —
     * without this the dialog renders flush against the top-left corner in every consumer.
     */
    const classes = $derived(twMerge('m-auto rounded-fc-lg border border-fc-border bg-fc-component text-fc-fg p-0 max-w-md w-[calc(100%-2rem)] max-h-[calc(100dvh-4rem)] overflow-auto backdrop:bg-black/50', className));
</script>

<dialog bind:this={dialog} onclose={onClose} class={classes}>
    <div class="flex flex-col gap-3 p-5">
        {#if title}<h2 class="text-fc-lg font-semibold">{title}</h2>{/if}
        {@render children()}
    </div>
</dialog>
