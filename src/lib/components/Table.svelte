<script lang="ts">
  import type { Snippet } from 'svelte';

  /**
   * Styled wrapper around a native `<table>`. Pass `<thead>` / `<tbody>` via children.
   * Horizontal scroll on overflow.
   */
  let {
    children,
    class: className = ''
  }: { children: Snippet; class?: string } = $props();
</script>

<div class="w-full overflow-x-auto rounded-fc-md border border-fc-border {className}">
  <table
    class="w-full border-collapse text-fc-sm text-fc-fg [&_th]:bg-fc-surface [&_th]:text-fc-fg-muted [&_th]:font-medium [&_th]:text-left [&_th]:px-3 [&_th]:py-2 [&_td]:px-3 [&_td]:py-2 [&_tbody_tr]:border-t [&_tbody_tr]:border-fc-border"
  >
    {@render children()}
  </table>
</div>
