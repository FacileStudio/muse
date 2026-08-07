<script lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';
    import { twMerge } from '../../utils/cn.js';
    import { USER_COLORS, USER_COLOR_LABELS } from '../../colors.js';

    type Size = 'sm' | 'md';

    let {
        colors = USER_COLORS,
        value = $bindable(''),
        labels = USER_COLOR_LABELS as Record<string, string>,
        showLabels = false,
        size = 'md',
        name,
        onSelect,
        class: className = '',
        ...rest
    }: Omit<HTMLAttributes<HTMLDivElement>, 'onselect'> & {
        colors?: readonly string[];
        value?: string;
        labels?: Record<string, string>;
        showLabels?: boolean;
        size?: Size;
        name?: string;
        onSelect?: (color: string) => void;
        class?: string;
    } = $props();

    const dots: Record<Size, string> = {
        sm: 'h-5 w-5',
        md: 'h-7 w-7'
    };

    let swatchEls: HTMLButtonElement[] = [];

    const selectedIndex = $derived(
        colors.findIndex((c) => c.trim().toUpperCase() === (value ?? '').trim().toUpperCase())
    );
    const focusIndex = $derived(selectedIndex < 0 ? 0 : selectedIndex);

    function labelFor(color: string): string {
        return labels?.[color] ?? labels?.[color.toUpperCase()] ?? color;
    }

    function select(index: number) {
        const color = colors[index];
        if (color === undefined) return;
        value = color;
        onSelect?.(color);
        swatchEls[index]?.focus();
    }

    function move(delta: number) {
        if (colors.length === 0) return;
        select(selectedIndex < 0 ? 0 : (selectedIndex + delta + colors.length) % colors.length);
    }

    function handleKeydown(event: KeyboardEvent) {
        switch (event.key) {
            case 'ArrowRight':
            case 'ArrowDown':
                event.preventDefault();
                move(1);
                break;
            case 'ArrowLeft':
            case 'ArrowUp':
                event.preventDefault();
                move(-1);
                break;
            case 'Home':
                event.preventDefault();
                select(0);
                break;
            case 'End':
                event.preventDefault();
                select(colors.length - 1);
                break;
        }
    }
</script>

<div
    {...rest}
    role="radiogroup"
    class={twMerge('flex flex-wrap items-start gap-1', className)}
    onkeydown={handleKeydown}
>
    {#each colors as color, i}
        {@const selected = i === selectedIndex}
        <button
            bind:this={swatchEls[i]}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={labelFor(color)}
            title={labelFor(color)}
            tabindex={i === focusIndex ? 0 : -1}
            onclick={() => select(i)}
            class={twMerge(
                'group flex min-h-11 min-w-11 shrink-0 cursor-pointer items-center justify-center rounded-fc-pill focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fc-ring',
                showLabels ? 'h-auto w-auto flex-col gap-1.5 px-2 py-2' : 'h-11 w-11'
            )}
        >
            <span
                class={twMerge(
                    'flex items-center justify-center rounded-fc-pill border border-fc-border/60 transition-transform duration-150 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100',
                    dots[size],
                    selected && 'ring-2 ring-fc-ring ring-offset-2 ring-offset-fc-component'
                )}
                style:background-color={color}
            ></span>
            {#if showLabels}
                <span class={twMerge('text-fc-xs', selected ? 'font-medium text-fc-fg' : 'text-fc-fg-muted')}>
                    {labelFor(color)}
                </span>
            {/if}
        </button>
    {/each}

    {#if name}
        <input type="hidden" {name} value={value ?? ''} />
    {/if}
</div>
