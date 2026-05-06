<script lang="ts">
  import type { Snippet } from 'svelte';

  /** Form-row wrapper. Renders a label, the control (via children), and helper or error text. */
  let {
    label,
    helper,
    error,
    children,
    class: className = ''
  }: {
    label?: string;
    helper?: string;
    error?: string;
    children: Snippet;
    class?: string;
  } = $props();
</script>

<div class="flex flex-col gap-1.5 {className}">
  {#if label}<span class="text-fc-sm text-fc-fg">{label}</span>{/if}
  {@render children()}
  {#if error}
    <span class="text-fc-xs text-fc-danger">{error}</span>
  {:else if helper}
    <span class="text-fc-xs text-fc-fg-muted">{helper}</span>
  {/if}
</div>
