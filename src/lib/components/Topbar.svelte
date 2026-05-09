<script lang="ts">
  import type { Snippet } from 'svelte';
  import { twMerge } from 'tailwind-merge';

  /** Sticky page header. Put logo / title on the left, actions on the right via children. */
  let {
    children,
    class: className = ''
  }: { children: Snippet; class?: string } = $props();

  const classes = $derived(twMerge('sticky top-0 z-40 flex h-14 items-center justify-between gap-3 -b  bg-fc-bg/80 backdrop-blur px-4', className));
</script>

<header class={classes}>
  {@render children()}
</header>
