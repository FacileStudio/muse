<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLSelectAttributes } from 'svelte/elements';

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
</script>

<select
  bind:value
  class="h-11 w-full rounded-fc-md border border-fc-border bg-fc-bg px-3 text-fc-md text-fc-fg focus:outline-2 focus:outline-fc-accent disabled:opacity-50 {className}"
  {...rest}
>
  {@render children()}
</select>
