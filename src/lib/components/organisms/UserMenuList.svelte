<script module lang="ts">
    import type { UserMenuRow } from '../../utils/user-menu.js';

    export interface UserMenuListProps {
        rows: UserMenuRow[];
        active: number;
        backLabel: string;
        newTabLabel: string;
        onChoose: (row: UserMenuRow) => void;
        onPoint: (index: number) => void;
        onSpace: (event: KeyboardEvent) => void;
    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';
    import { icons } from '../../icons.js';
    import Icon from '../atoms/Icon.svelte';

    let { rows, active, backLabel, newTabLabel, onChoose, onPoint, onSpace }: UserMenuListProps = $props();

    const line =
        'flex min-h-11 w-full cursor-pointer items-center gap-2.5 rounded-fc-sm px-2.5 py-2 text-left text-fc-sm transition-colors hover:bg-fc-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fc-ring';

    const roles = { item: 'menuitem', submenu: 'menuitem', back: 'menuitem', radio: 'menuitemradio', gap: 'none' } as const;

    const stops = $derived(rows.filter((row) => row.kind !== 'gap'));
    const place = (row: UserMenuRow) => stops.indexOf(row);
    const tone = (row: UserMenuRow) => (row.tone === 'danger' ? 'text-fc-danger' : 'text-fc-fg');
</script>

{#snippet content(row: UserMenuRow)}
    {#if row.icon}<Icon icon={row.icon} size={16} class="shrink-0" />{/if}
    <span class={twMerge('min-w-0 flex-1 truncate', row.checked && 'font-semibold')}>{row.label}</span>
    {#if row.detail}
        <span class="max-w-28 shrink-0 truncate text-fc-xs text-fc-fg-muted">{row.detail}</span>
    {/if}
    {#if row.kind === 'submenu'}
        <Icon icon={icons.arrow} size={16} class="shrink-0 text-fc-fg-muted" />
    {:else if row.checked}
        <Icon icon={icons.check} size={16} class="shrink-0" />
    {:else if row.external}
        <Icon icon={icons.external} size={14} class="shrink-0 text-fc-fg-muted" />
        <span class="sr-only">{newTabLabel}</span>
    {/if}
{/snippet}

{#each rows as row (row.id)}
    {#if row.kind === 'gap'}
        <div role="none" class="h-2"></div>
    {:else if row.href}
        <a
            role="menuitem"
            tabindex={place(row) === active ? 0 : -1}
            href={row.href}
            target={row.external ? '_blank' : undefined}
            rel={row.external ? 'noopener noreferrer' : undefined}
            class={twMerge(line, tone(row))}
            onclick={() => onChoose(row)}
            onkeydown={onSpace}
            onpointermove={() => onPoint(place(row))}
        >
            {@render content(row)}
        </a>
    {:else}
        <button
            type="button"
            role={roles[row.kind]}
            aria-checked={row.kind === 'radio' ? row.checked : undefined}
            aria-haspopup={row.kind === 'submenu' ? 'menu' : undefined}
            aria-label={row.kind === 'back' ? `${backLabel} (${row.label})` : undefined}
            tabindex={place(row) === active ? 0 : -1}
            class={twMerge(line, tone(row), row.kind === 'radio' && 'pl-9')}
            onclick={() => onChoose(row)}
            onpointermove={() => onPoint(place(row))}
        >
            {@render content(row)}
        </button>
    {/if}
{/each}
