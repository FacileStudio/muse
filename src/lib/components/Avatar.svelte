<script lang="ts">
  /** Round avatar. Falls back to first initial of `name` if no `src`. */
  type Size = 'sm' | 'md' | 'lg';

  let {
    src,
    alt = '',
    name = '',
    size = 'md',
    class: className = ''
  }: {
    src?: string;
    alt?: string;
    name?: string;
    size?: Size;
    class?: string;
  } = $props();

  const sizes: Record<Size, string> = {
    sm: 'h-8 w-8 text-fc-xs',
    md: 'h-10 w-10 text-fc-sm',
    lg: 'h-14 w-14 text-fc-md'
  };

  const initial = name ? name.trim().charAt(0).toUpperCase() : '?';
</script>

<span
  class="inline-flex items-center justify-center rounded-fc-pill bg-fc-surface text-fc-fg-muted overflow-hidden border border-fc-border {sizes[
    size
  ]} {className}"
>
  {#if src}
    <img {src} {alt} class="h-full w-full object-cover" />
  {:else}
    <span aria-hidden="true">{initial}</span>
  {/if}
</span>
