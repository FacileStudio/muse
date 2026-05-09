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
    ...rest
  }: {
    href?: string;
    icon?: string;
    label?: string;
    active?: boolean;
    collapsed?: boolean;
    class?: string;
    right?: Snippet;
    [key: string]: unknown;
  } = $props();

  const classes = $derived(twMerge(
    'h-10 w-full flex items-center justify-between px-3 rounded-fc-md text-fc-sm transition-colors border border-fc-fg/7 hover:bg-fc-fg/7',
    active ? 'bg-fc-accent/10 text-fc-accent' : 'text-fc-fg',
    className
  ));
</script>

{#snippet inner()}
  {#if icon}<iconify-icon {icon} width="16" class="shrink-0"></iconify-icon>{/if}
  {#if !collapsed}
    <span class="flex items-center gap-2 shrink-0">
      {#if label}<span>{label}</span>{/if}
      {#if right}{@render right()}{/if}
    </span>
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
