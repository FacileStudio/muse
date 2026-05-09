<script lang="ts">
  import type { Snippet } from 'svelte';
  import { twMerge } from 'tailwind-merge';

  /** Vertical navigation rail for dashboards. Children = nav items / sections. */
  let {
    children,
    class: className = ''
  }: { children: Snippet; class?: string } = $props();

  const classes = $derived(twMerge('flex flex-col gap-1 h-dvh w-60 shrink-0 -r  bg-fc-surface p-4', className));
</script>

<aside class={classes}>
  {@render children()}
</aside>
