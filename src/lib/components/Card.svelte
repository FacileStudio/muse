<script lang="ts">
  import type { Snippet } from 'svelte';
  import { twMerge } from 'tailwind-merge';

  /** Plain ed surface. Use as a container for grouped content. */
  let {
    class: className = '',
    children
  }: { class?: string; children: Snippet } = $props();

  const classes = $derived(twMerge('rounded-fc-md   bg-fc-surface p-4', className));
</script>

<div class={classes}>
  {@render children()}
</div>
