<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLSelectAttributes } from 'svelte/elements';
  import { twMerge } from 'tailwind-merge';

  /** Native select. Pass `<option>`s via children. */
  let {
    value = $bindable(''),
    class: className = '',
    children,
    ...rest
  }: HTMLSelectAttributes & {
    class?: string;
    value?: string;
    children: Snippet;
  } = $props();

  const classes = $derived(twMerge('h-11 w-full rounded-fc-md   bg-fc-bg px-3 text-fc-md text-fc-fg focus:outline-2 focus:outline-fc-accent disabled:opacity-50', className));
</script>

<select bind:value class={classes} {...rest}>
  {@render children()}
</select>
