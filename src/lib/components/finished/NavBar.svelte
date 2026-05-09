<script lang="ts">
  import { twMerge } from 'tailwind-merge';
  import Component from './Component.svelte';
  import NavButton from './NavButton.svelte';

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
        class="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-fc-sm text-fc-fg-muted transition-colors border border-fc-fg/7 hover:bg-fc-fg/7"
        aria-label={collapsed ? 'Expand' : 'Collapse'}
      >
        <iconify-icon icon="solar:sidebar-minimalistic-bold-duotone" width="14" class="text-fc-fg/66 transition-transform {collapsed ? '' : '-scale-x-100'}"></iconify-icon>
      </button>
    </div>

    {#if showSearch}
      <NavButton icon="solar:magnifer-bold-duotone" label="Search…" {collapsed} class="mb-1">
        {#snippet right()}
          <span class="text-fc-xs opacity-50">⌘K</span>
        {/snippet}
      </NavButton>
    {/if}

    <nav class="flex flex-col gap-1">
      {#each pages as page (page.href)}
        <NavButton href={page.href} icon={page.icon} label={page.label} active={page.active} {collapsed}>
          {#snippet right()}
            {#if page.active}
              <iconify-icon icon="solar:alt-arrow-right-bold-duotone" width="12" class="text-fc-fg/66"></iconify-icon>
            {/if}
          {/snippet}
        </NavButton>
      {/each}
    </nav>
  </div>

  {#if user}
    <button
      type="button"
      class="h-10 w-full flex items-center justify-between px-3 rounded-fc-md text-fc-sm transition-colors border border-fc-fg/7 hover:bg-fc-fg/7 text-fc-fg"
    >
      <span class="flex items-center gap-2 min-w-0">
        {#if user.avatar}
          <img src={user.avatar} alt={user.name} class="h-6 w-6 rounded-full object-cover shrink-0" />
        {:else}
          <span class="h-6 w-6 shrink-0 rounded-full bg-fc-accent/20 text-fc-accent flex items-center justify-center text-fc-xs font-medium">
            {user.name.charAt(0).toUpperCase()}
          </span>
        {/if}
        {#if !collapsed}<span class="truncate">{user.name}</span>{/if}
      </span>
      {#if !collapsed}
        <iconify-icon icon="solar:settings-bold-duotone" width="14" class="shrink-0 text-fc-fg/66"></iconify-icon>
      {/if}
    </button>
  {/if}
</Component>
