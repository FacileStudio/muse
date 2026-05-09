<script lang="ts">
  import { twMerge } from 'tailwind-merge';

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
  const classes = $derived(twMerge('inline-flex items-center justify-center rounded-fc-pill bg-fc-surface text-fc-fg-muted overflow-hidden  ', sizes[size], className));
</script>

<span class={classes}>
  {#if src}
    <img {src} {alt} class="h-full w-full object-cover" />
  {:else}
    <span aria-hidden="true">{initial}</span>
  {/if}
</span>
