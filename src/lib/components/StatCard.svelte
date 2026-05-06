<script lang="ts">
  import type { Snippet } from 'svelte';

  /** KPI tile for dashboards. Optional `delta` for trend text and `children` for a sparkline / extra. */
  let {
    label,
    value,
    delta,
    children,
    class: className = ''
  }: {
    label: string;
    value: string | number;
    delta?: string;
    children?: Snippet;
    class?: string;
  } = $props();
</script>

<div class="rounded-fc-md border border-fc-border bg-fc-surface p-4 flex flex-col gap-1 {className}">
  <span class="text-fc-xs text-fc-fg-muted uppercase tracking-wide">{label}</span>
  <span class="text-fc-2xl text-fc-fg font-semibold">{value}</span>
  {#if delta}<span class="text-fc-xs text-fc-fg-muted">{delta}</span>{/if}
  {#if children}{@render children()}{/if}
</div>
