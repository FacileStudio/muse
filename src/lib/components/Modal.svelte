<script lang="ts">
  import type { Snippet } from 'svelte';

  /**
   * Native `<dialog>` modal. Bind `open` to control visibility.
   * Escape closes via the browser's built-in dialog behavior.
   */
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
</script>

<dialog
  bind:this={dialog}
  onclose={onClose}
  class="rounded-fc-lg border border-fc-border bg-fc-bg text-fc-fg p-0 max-w-md w-[calc(100%-2rem)] backdrop:bg-black/40 {className}"
>
  <div class="flex flex-col gap-3 p-5">
    {#if title}<h2 class="text-fc-lg font-semibold">{title}</h2>{/if}
    {@render children()}
  </div>
</dialog>
