<script module lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';

    export type Own = {
        href?: string;
        icon?: string;
        label?: string;
        active?: boolean;
        collapsed?: boolean;
        textDelay?: number;
        class?: string;
        right?: Snippet;
    };

    export type NavButtonProps = Own & (HTMLAnchorAttributes | HTMLButtonAttributes);
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';
    import Icon from '../atoms/Icon.svelte';
    import { springPress } from '../../utils/press.js';
    import TextElevate from '../motion/TextElevate.svelte';

    let {
        href,
        icon,
        label,
        active = false,
        collapsed = false,
        textDelay = 0.15,
        class: className = '',
        right,
        ...rest
    }: NavButtonProps = $props();

    const anchorRest = $derived(rest as HTMLAnchorAttributes);
    const buttonRest = $derived(rest as HTMLButtonAttributes);

    const classes = $derived(twMerge(
        'flex items-center gap-2.5 rounded-fc-md text-fc-sm transition-colors overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fc-ring',
        collapsed
            ? 'size-fc-nav-item shrink-0 self-center justify-center gap-0 p-0'
            : 'w-full min-h-11 px-3 py-2.5',
        active ? 'bg-fc-accent text-fc-accent-fg font-medium' : 'text-fc-fg-muted hover:bg-fc-surface hover:text-fc-fg',
        className
    ));
</script>

<!--
@component
Une ligne de navigation. Elle se réduit à un carré de 44px quand le rail se replie.
-->

{#snippet inner()}
    {#if icon}<Icon {icon} size={18} />{/if}
    {#if !collapsed}
        <span class="flex min-w-0 flex-1 items-center justify-between gap-2 overflow-hidden">
            {#if label}<TextElevate text={label} visible={!collapsed} delay={textDelay} class="truncate" />{/if}
            {#if right}{@render right()}{/if}
        </span>
    {/if}
{/snippet}

{#if href}
    <a
        {href}
        aria-current={active ? 'page' : undefined}
        class={classes}
        use:springPress
        {...anchorRest}
    >
        {@render inner()}
    </a>
{:else}
    <button type="button" class={classes} use:springPress {...buttonRest}>
        {@render inner()}
    </button>
{/if}
