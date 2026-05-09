<script lang="ts">
  import type { Snippet } from 'svelte';
  import { twMerge } from 'tailwind-merge';

  let {
    href,
    icon,
    label,
    active = false,
    collapsed = false,
    class: className = '',
    right,
    children,
    ...rest
  }: {
    href?: string;
    icon?: string;
    label?: string;
    active?: boolean;
    collapsed?: boolean;
    class?: string;
    right?: Snippet;
    children?: Snippet;
    [key: string]: unknown;
  } = $props();

  const classes = $derived(twMerge(
    'h-10 w-full flex items-center justify-between px-3 rounded-fc-sm text-fc-sm transition-colors border border-[rgba(36,36,36,0.07)] hover:bg-[rgba(36,36,36,0.07)]',
    active ? 'bg-fc-accent/10 text-fc-accent' : 'text-fc-fg',
    className
  ));
</script>

{#snippet inner()}
  <span class="flex items-center gap-2 min-w-0">
    {#if children}
      {@render children()}
    {:else}
      {#if icon}<iconify-icon {icon} width="16"></iconify-icon>{/if}
      {#if !collapsed && label}<span class="truncate">{label}</span>{/if}
    {/if}
  </span>
  {#if !collapsed && right}
    <span class="shrink-0">{@render right()}</span>
  {/if}
{/snippet}

{#if href}
  <a {href} class={classes}>
    {@render inner()}
  </a>
{:else}
  <button type="button" class={classes} {...rest}>
    {@render inner()}
  </button>
{/if}
