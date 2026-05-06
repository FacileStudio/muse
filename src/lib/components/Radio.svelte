<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';

  /** Native radio. Bind `group` to share state between radios in the same set. */
  let {
    label,
    group = $bindable(''),
    value,
    class: className = '',
    ...rest
  }: HTMLInputAttributes & {
    label?: string;
    group?: string;
    class?: string;
  } = $props();
</script>

<label class="inline-flex items-center gap-2 cursor-pointer text-fc-md text-fc-fg {className}">
  <input
    type="radio"
    bind:group
    {value}
    class="h-4 w-4 border border-fc-border accent-fc-accent disabled:opacity-50"
    {...rest}
  />
  {#if label}<span>{label}</span>{/if}
</label>
