<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';

  /** Text-style input. Pass any native input type via `type` prop. */
  let {
    value = $bindable(''),
    class: className = '',
    ...rest
  }: HTMLInputAttributes & { class?: string; value?: string | number } = $props();
</script>

<input
  bind:value
  class="h-11 w-full rounded-fc-md border border-fc-border bg-fc-bg px-3 text-fc-md text-fc-fg placeholder:text-fc-fg-muted focus:outline-2 focus:outline-fc-accent disabled:opacity-50 {className}"
  {...rest}
/>
