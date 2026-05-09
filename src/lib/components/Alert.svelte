<script lang="ts">
  import type { Snippet } from 'svelte';
  import { twMerge } from 'tailwind-merge';

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
    info: ' bg-fc-surface text-fc-fg',
    success: '-fc-success/40 bg-fc-success/10 text-fc-fg',
    warning: '-yellow-500/40 bg-yellow-500/10 text-fc-fg',
    danger: '-fc-danger/40 bg-fc-danger/10 text-fc-fg'
  };

  const classes = $derived(twMerge('rounded-fc-md  p-3 text-fc-sm', tones[tone], className));
</script>

<div class={classes} role="alert">
  {#if title}<p class="font-medium mb-1">{title}</p>{/if}
  {#if children}{@render children()}{/if}
</div>
