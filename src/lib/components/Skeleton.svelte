<script lang="ts">
  import { twMerge } from 'tailwind-merge';

  /** Placeholder block while content loads. Size via classes (e.g. `h-4 w-32`). */
  let { class: className = '' }: { class?: string } = $props();

  const classes = $derived(twMerge('animate-pulse motion-reduce:animate-none rounded-fc-sm bg-fc-/60', className));
</script>

<div class={classes}></div>
