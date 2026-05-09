<script lang="ts">
  import type { Snippet } from 'svelte';
  import { twMerge } from 'tailwind-merge';

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

  const classes = $derived(twMerge('rounded-fc-md   bg-fc-surface p-4 flex flex-col gap-1', className));
</script>

<div class={classes}>
  <span class="text-fc-xs text-fc-fg-muted uppercase tracking-wide">{label}</span>
  <span class="text-fc-2xl text-fc-fg font-semibold">{value}</span>
  {#if delta}<span class="text-fc-xs text-fc-fg-muted">{delta}</span>{/if}
  {#if children}{@render children()}{/if}
</div>
