<script lang="ts">
    import { twMerge } from '../../utils/cn.js';

    let {
        x,
        y,
        title,
        rows = [],
        visible = false,
        class: className = ''
    }: {
        x: number;
        y: number;
        title?: string;
        rows: { name: string; value: string; color?: string }[];
        visible: boolean;
        class?: string;
    } = $props();

    let el: HTMLDivElement | null = $state(null);
    let flip = $state(false);

    const classes = $derived(
        twMerge(
            'absolute z-10 pointer-events-none whitespace-nowrap rounded-fc-sm border border-fc-border bg-fc-component shadow-lg px-2.5 py-2 text-fc-xs',
            className
        )
    );

    $effect(() => {
        const px = x;
        const shown = visible;
        if (!el || !shown) return;
        const parent = el.parentElement;
        if (!parent) return;
        flip = px + 12 + el.offsetWidth > parent.clientWidth;
    });
</script>

{#if visible && rows.length}
    <div
        bind:this={el}
        class={classes}
        style:left="{x}px"
        style:top="{y}px"
        style:transform={flip ? 'translate(calc(-100% - 12px), -50%)' : 'translate(12px, -50%)'}
    >
        {#if title}
            <div class="mb-1 text-fc-fg font-medium">{title}</div>
        {/if}
        <div class="flex flex-col gap-1">
            {#each rows as row, i (row.name + i)}
                <div class="flex items-center gap-1.5">
                    {#if row.color}
                        <span class="h-0.5 w-2.5 shrink-0 rounded-fc-pill" style:background-color={row.color}></span>
                    {/if}
                    <span class="text-fc-fg-muted">{row.name}</span>
                    <span class="ml-auto pl-3 text-fc-fg font-medium tabular-nums">{row.value}</span>
                </div>
            {/each}
        </div>
    </div>
{/if}
