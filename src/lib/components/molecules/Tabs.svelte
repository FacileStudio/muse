<script lang="ts">
    import { gsap } from 'gsap';
    import { twMerge } from '../../utils/cn.js';
    import { prefersReducedMotion } from '../../utils/motion.js';
    import { resize } from '../../utils/chart.js';

    type Item = {
        id: string;
        label: string;
        icon?: string;
        badge?: string | number;
        href?: string;
        disabled?: boolean;
    };

    let {
        items = [],
        value = $bindable(''),
        onchange,
        panelId,
        label = 'Sections',
        class: className = ''
    }: {
        items?: Item[];
        value?: string;
        onchange?: (id: string) => void;
        panelId?: string;
        label?: string;
        class?: string;
    } = $props();

    let strip: HTMLElement | null = $state(null);
    let indicator: HTMLElement | null = $state(null);
    let placed = false;

    const tabs: Record<string, HTMLElement> = {};
    const routed = $derived(items.some((i) => i.href));
    const enabled = $derived(items.filter((i) => !i.disabled));

    function select(item: Item, scroll = true) {
        if (item.disabled) return;
        value = item.id;
        onchange?.(item.id);
        if (scroll) tabs[item.id]?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }

    /*
     * The pill is one element sliding between tabs rather than a background per tab: with
     * per-tab backgrounds the old one has to fade out while the new fades in, which reads as
     * a blink. Position comes from offsetLeft inside the scrolling strip, so it stays put
     * when the strip is scrolled horizontally on a narrow screen.
     *
     * Every tab is measured through a ResizeObserver, not just once on mount. `<iconify-icon>`
     * is a custom element that upgrades asynchronously and the icon fetch lands after first
     * paint, so a tab measured at mount is one icon too narrow — the pill renders clipped
     * through the label and never corrects itself. Same story for the Goga swap.
     */
    function place(animate = true) {
        const el = tabs[value];
        if (!el || !indicator) return;
        const to = { x: el.offsetLeft, width: el.offsetWidth };
        if (!placed || !animate || prefersReducedMotion()) {
            gsap.set(indicator, { ...to, autoAlpha: 1 });
            placed = true;
            return;
        }
        gsap.to(indicator, { ...to, duration: 0.3, ease: 'power3.inOut' });
    }

    $effect(() => {
        value;
        items.length;
        place();
    });

    function keydown(e: KeyboardEvent) {
        const keys = ['ArrowRight', 'ArrowLeft', 'Home', 'End'];
        if (!keys.includes(e.key) || enabled.length === 0) return;
        e.preventDefault();
        const i = enabled.findIndex((t) => t.id === value);
        const next =
            e.key === 'Home'
                ? 0
                : e.key === 'End'
                  ? enabled.length - 1
                  : (i + (e.key === 'ArrowRight' ? 1 : -1) + enabled.length) % enabled.length;
        const item = enabled[next];
        select(item);
        tabs[item.id]?.focus();
    }
</script>

<div
    bind:this={strip}
    role={routed ? undefined : 'tablist'}
    aria-label={routed ? undefined : label}
    aria-orientation={routed ? undefined : 'horizontal'}
    onkeydown={routed ? undefined : keydown}
    use:resize={() => place(false)}
    class={twMerge('relative flex w-full items-center gap-1 overflow-x-auto', className)}
>
    <span
        bind:this={indicator}
        aria-hidden="true"
        class="pointer-events-none absolute inset-y-0 left-0 -z-0 rounded-fc-pill bg-fc-accent opacity-0"
    ></span>

    {#snippet content(item: Item, active: boolean)}
        {#if item.icon}
            <!--
                `size-4` on top of the width/height attributes is load-bearing. Those attributes
                only take effect once the icon data has been fetched, so an <iconify-icon> is a
                0×0 box until then — long enough for the tab to be measured one icon too narrow.
                The CSS size reserves the box up front, so nothing reflows when the glyph lands.
            -->
            <iconify-icon icon={item.icon} width="16" height="16" class="block size-4 shrink-0"
            ></iconify-icon>
        {/if}
        {item.label}
        {#if item.badge !== undefined}
            <span
                class={twMerge(
                    'rounded-fc-pill px-1.5 text-fc-xs',
                    active ? 'bg-fc-accent-fg/15' : 'bg-fc-surface'
                )}>{item.badge}</span
            >
        {/if}
    {/snippet}

    {#each items as item (item.id)}
        {@const active = item.id === value}
        {@const inner = twMerge(
            'relative z-10 inline-flex min-h-11 shrink-0 items-center gap-2 rounded-fc-pill px-4 text-fc-sm font-medium whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fc-ring',
            active ? 'text-fc-accent-fg' : 'text-fc-fg-muted hover:bg-fc-surface hover:text-fc-fg',
            item.disabled && 'pointer-events-none opacity-50'
        )}

        {#if item.href}
            <a
                bind:this={tabs[item.id]}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                use:resize={() => place(false)}
                class={inner}
            >
                {@render content(item, active)}
            </a>
        {:else}
            <button
                bind:this={tabs[item.id]}
                type="button"
                role="tab"
                id="{item.id}-tab"
                aria-selected={active}
                aria-controls={panelId}
                tabindex={active ? 0 : -1}
                disabled={item.disabled}
                onclick={() => select(item)}
                use:resize={() => place(false)}
                class={inner}
            >
                {@render content(item, active)}
            </button>
        {/if}
    {/each}
</div>
