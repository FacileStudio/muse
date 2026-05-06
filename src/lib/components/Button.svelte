<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';

  /** Generic button. Variants: primary | ghost | outline | danger. Sizes: sm | md | lg. */
  type Variant = 'primary' | 'ghost' | 'outline' | 'danger';
  type Size = 'sm' | 'md' | 'lg';

  let {
    variant = 'primary',
    size = 'md',
    class: className = '',
    children,
    ...rest
  }: HTMLButtonAttributes & {
    variant?: Variant;
    size?: Size;
    class?: string;
    children: Snippet;
  } = $props();

  const variants: Record<Variant, string> = {
    primary: 'bg-fc-accent text-fc-accent-fg hover:opacity-90',
    ghost: 'bg-transparent text-fc-fg hover:bg-fc-surface',
    outline: 'bg-transparent text-fc-fg border border-fc-border hover:bg-fc-surface',
    danger: 'bg-fc-danger text-white hover:opacity-90'
  };
  const sizes: Record<Size, string> = {
    sm: 'h-8 px-3 text-fc-sm rounded-fc-sm',
    md: 'h-11 px-4 text-fc-md rounded-fc-md',
    lg: 'h-12 px-5 text-fc-lg rounded-fc-md'
  };
</script>

<button
  class="inline-flex items-center justify-center gap-2 font-medium transition-opacity disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-fc-accent {variants[variant]} {sizes[size]} {className}"
  {...rest}
>
  {@render children()}
</button>
