<script lang="ts">
  import type { Snippet } from 'svelte';

  /** Plain bordered surface. Use as a container for grouped content. */
  let {
    class: className = '',
    children
  }: { class?: string; children: Snippet } = $props();
</script>

<div class="rounded-fc-md border border-fc-border bg-fc-surface p-4 {className}">
  {@render children()}
</div>
