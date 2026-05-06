<script lang="ts">
  import type { Snippet } from 'svelte';

  /** Sticky page header. Put logo / title on the left, actions on the right via children. */
  let {
    children,
    class: className = ''
  }: { children: Snippet; class?: string } = $props();
</script>

<header
  class="sticky top-0 z-40 flex h-14 items-center justify-between gap-3 border-b border-fc-border bg-fc-bg/80 backdrop-blur px-4 {className}"
>
  {@render children()}
</header>
