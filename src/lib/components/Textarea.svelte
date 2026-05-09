<script lang="ts">
  import type { HTMLTextareaAttributes } from 'svelte/elements';
  import { twMerge } from 'tailwind-merge';

  /** Multiline text input. */
  let {
    value = $bindable(''),
    rows = 4,
    class: className = '',
    ...rest
  }: HTMLTextareaAttributes & { class?: string; value?: string } = $props();

  const classes = $derived(twMerge('w-full rounded-fc-md   bg-fc-bg px-3 py-2 text-fc-md text-fc-fg placeholder:text-fc-fg-muted focus:outline-2 focus:outline-fc-accent disabled:opacity-50 resize-y', className));
</script>

<textarea bind:value {rows} class={classes} {...rest}></textarea>
