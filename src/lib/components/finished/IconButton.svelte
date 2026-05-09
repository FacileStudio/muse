<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import { twMerge } from 'tailwind-merge';

  let {
    class: className = '',
    children,
    ...rest
  }: HTMLButtonAttributes & {
    class?: string;
    children: Snippet;
  } = $props();

  const classes = $derived(twMerge('inline-flex w-10 h-10 items-center justify-center gap-[6px] rounded-fc-full border border-fc-fg/7 text-fc-fg-muted [&_svg]:w-3 [&_svg]:h-3 transition-opacity hover:opacity-70 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-fc-accent', className));
</script>

<button class={classes} {...rest}>
  {@render children()}
</button>
