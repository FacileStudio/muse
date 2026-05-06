<script lang="ts">
  import type { Snippet } from 'svelte';

  /** Inline status banner. Tones: info | success | warning | danger. */
  type Tone = 'info' | 'success' | 'warning' | 'danger';

  let {
    tone = 'info',
    title,
    class: className = '',
    children
  }: {
    tone?: Tone;
    title?: string;
    class?: string;
    children?: Snippet;
  } = $props();

  const tones: Record<Tone, string> = {
    info: 'border-fc-border bg-fc-surface text-fc-fg',
    success: 'border-fc-success/40 bg-fc-success/10 text-fc-fg',
    warning: 'border-yellow-500/40 bg-yellow-500/10 text-fc-fg',
    danger: 'border-fc-danger/40 bg-fc-danger/10 text-fc-fg'
  };
</script>

<div class="rounded-fc-md border p-3 text-fc-sm {tones[tone]} {className}" role="alert">
  {#if title}<p class="font-medium mb-1">{title}</p>{/if}
  {#if children}{@render children()}{/if}
</div>
