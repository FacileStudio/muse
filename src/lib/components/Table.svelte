<script lang="ts">
  import type { Snippet } from 'svelte';
  import { twMerge } from 'tailwind-merge';

  /**
   * Styled wrapper around a native `<table>`. Pass `<thead>` / `<tbody>` via children.
   * Horizontal scroll on overflow.
   */
  let {
    children,
    class: className = ''
  }: { children: Snippet; class?: string } = $props();

  const classes = $derived(twMerge('w-full overflow-x-auto rounded-fc-md  ', className));
</script>

<div class={classes}>
  <table
    class="w-full -collapse text-fc-sm text-fc-fg [&_th]:bg-fc-surface [&_th]:text-fc-fg-muted [&_th]:font-medium [&_th]:text-left [&_th]:px-3 [&_th]:py-2 [&_td]:px-3 [&_td]:py-2 [&_tbody_tr]:-t [&_tbody_tr]:"
  >
    {@render children()}
  </table>
</div>
