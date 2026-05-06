<script lang="ts">
  import type { Snippet } from 'svelte';

  /** Small inline pill label. */
  type Tone = 'neutral' | 'accent' | 'success' | 'danger';

  let {
    tone = 'neutral',
    class: className = '',
    children
  }: { tone?: Tone; class?: string; children: Snippet } = $props();

  const tones: Record<Tone, string> = {
    neutral: 'bg-fc-surface text-fc-fg-muted border-fc-border',
    accent: 'bg-fc-accent text-fc-accent-fg border-transparent',
    success: 'bg-fc-success text-white border-transparent',
    danger: 'bg-fc-danger text-white border-transparent'
  };
</script>

<span
  class="inline-flex items-center gap-1 rounded-fc-pill border px-2 py-0.5 text-fc-xs font-medium {tones[
    tone
  ]} {className}"
>
  {@render children()}
</span>
