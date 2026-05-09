<script lang="ts">
  import { twMerge } from 'tailwind-merge';
  import Component from './Component.svelte';

  type Page = { label: string; href: string; icon?: string; active?: boolean };
  type User = { name: string; avatar?: string };

  let {
    icon,
    title = '',
    pages = [],
    user,
    collapsed = $bindable(false),
    showSearch = false,
    class: className = ''
  }: {
    icon?: string;
    title?: string;
    pages?: Page[];
    user?: User;
    collapsed?: boolean;
    showSearch?: boolean;
    class?: string;
  } = $props();

  const btnBase = 'h-10 w-full flex items-center px-3 rounded-fc-sm text-fc-sm transition-colors border border-[rgba(36,36,36,0.07)]';
</script>

<Component class={twMerge('flex flex-col justify-between h-dvh min-h-0 p-3 gap-4', collapsed ? 'w-16 px-2' : 'w-60', className)}>
  <div class="flex flex-col gap-1">
    <div class="flex items-center justify-between h-10 px-2 mb-1">
      {#if !collapsed}
        <span class="flex items-center gap-2 text-fc-sm font-medium text-fc-fg truncate">
          {#if icon}<iconify-icon {icon} width="16"></iconify-icon>{/if}
          {title}
        </span>
      {/if}
      <button
        onclick={() => (collapsed = !collapsed)}
        class="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-fc-sm text-fc-fg-muted hover:bg-fc-surface transition-colors border border-[rgba(36,36,36,0.07)]"
        aria-label={collapsed ? 'Expand' : 'Collapse'}
      >
        <iconify-icon icon={collapsed ? 'lucide:panel-left-open' : 'lucide:panel-left-close'} width="14"></iconify-icon>
      </button>
    </div>

    {#if showSearch}
      <button class="{btnBase} justify-between text-fc-fg-muted hover:bg-fc-surface mb-1">
        <span class="flex items-center gap-2">
          <iconify-icon icon="lucide:search" width="14"></iconify-icon>
          {#if !collapsed}<span>Search...</span>{/if}
        </span>
        {#if !collapsed}
          <span class="text-fc-xs opacity-50">⌘K</span>
        {/if}
      </button>
    {/if}

    <nav class="flex flex-col gap-1">
      {#each pages as page (page.href)}
        <a
          href={page.href}
          class={twMerge(btnBase, 'justify-between no-underline', page.active ? 'bg-fc-accent/10 text-fc-accent' : 'text-fc-fg hover:bg-fc-surface')}
        >
          <span class="flex items-center gap-2 truncate">
            {#if page.icon}<iconify-icon icon={page.icon} width="16"></iconify-icon>{/if}
            {#if !collapsed}<span class="truncate">{page.label}</span>{/if}
          </span>
          {#if !collapsed && page.active}
            <iconify-icon icon="lucide:chevron-right" width="12" class="shrink-0 opacity-50"></iconify-icon>
          {/if}
        </a>
      {/each}
    </nav>
  </div>

  {#if user}
    <button class="{btnBase} justify-between text-fc-fg hover:bg-fc-surface">
      <span class="flex items-center gap-2 min-w-0">
        {#if user.avatar}
          <img src={user.avatar} alt={user.name} class="h-6 w-6 rounded-full object-cover shrink-0" />
        {:else}
          <span class="h-6 w-6 shrink-0 rounded-full bg-fc-accent/20 text-fc-accent flex items-center justify-center text-fc-xs font-medium">
            {user.name.charAt(0).toUpperCase()}
          </span>
        {/if}
        {#if !collapsed}<span class="truncate text-fc-sm">{user.name}</span>{/if}
      </span>
      {#if !collapsed}
        <iconify-icon icon="lucide:settings" width="14" class="shrink-0 text-fc-fg-muted"></iconify-icon>
      {/if}
    </button>
  {/if}
</Component>
