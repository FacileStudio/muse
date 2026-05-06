<script lang="ts">
  /** Indeterminate loading spinner. Stops animating under prefers-reduced-motion. */
  type Size = 'sm' | 'md' | 'lg';

  let {
    size = 'md',
    class: className = ''
  }: { size?: Size; class?: string } = $props();

  const sizes: Record<Size, string> = {
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-2',
    lg: 'h-10 w-10 border-[3px]'
  };
</script>

<span
  role="status"
  aria-label="Loading"
  class="inline-block rounded-full border-fc-border border-t-fc-accent animate-spin motion-reduce:animate-none {sizes[
    size
  ]} {className}"
></span>
