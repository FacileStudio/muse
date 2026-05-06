<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';

  /** Native checkbox with optional label. */
  let {
    label,
    checked = $bindable(false),
    class: className = '',
    ...rest
  }: HTMLInputAttributes & {
    label?: string;
    checked?: boolean;
    class?: string;
  } = $props();
</script>

<label class="inline-flex items-center gap-2 cursor-pointer text-fc-md text-fc-fg {className}">
  <input
    type="checkbox"
    bind:checked
    class="h-4 w-4 rounded-fc-sm border border-fc-border accent-fc-accent disabled:opacity-50"
    {...rest}
  />
  {#if label}<span>{label}</span>{/if}
</label>
