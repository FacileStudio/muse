<script lang="ts">
  import type { Snippet } from 'svelte';

  /** Vertical navigation rail for dashboards. Children = nav items / sections. */
  let {
    children,
    class: className = ''
  }: { children: Snippet; class?: string } = $props();
</script>

<aside
  class="flex flex-col gap-1 h-dvh w-60 shrink-0 border-r border-fc-border bg-fc-surface p-4 {className}"
>
  {@render children()}
</aside>
