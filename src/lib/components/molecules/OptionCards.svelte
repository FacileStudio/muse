<script lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';
    import { twMerge } from '../../utils/cn.js';

    type Option = {
        value: string;
        label: string;
        icon?: string;
        disabled?: boolean;
    };

    let {
        options = [],
        value = $bindable(''),
        name,
        label,
        onSelect,
        class: className = '',
        ...rest
    }: Omit<HTMLAttributes<HTMLDivElement>, 'onselect'> & {
        options?: Option[];
        value?: string;
        name?: string;
        label?: string;
        onSelect?: (value: string) => void;
        class?: string;
    } = $props();

    let cards: HTMLButtonElement[] = [];

    const selectedIndex = $derived(options.findIndex((o) => o.value === value));
    const focusIndex = $derived(selectedIndex < 0 ? 0 : selectedIndex);

    function select(index: number) {
        const option = options[index];
        if (!option || option.disabled) return;
        value = option.value;
        onSelect?.(option.value);
        cards[index]?.focus();
    }

    /*
     * An unselected group has no anchor to step from, so a forward key opens on the first
     * card and a backward key on the last; stepping from index 0 either way skipped the
     * first card entirely on ArrowRight. Disabled options are stepped over, not landed on.
     */
    function move(delta: number) {
        const n = options.length;
        if (n === 0) return;
        const start = selectedIndex < 0 ? (delta > 0 ? 0 : n - 1) : (selectedIndex + delta + n) % n;
        for (let step = 0; step < n; step++) {
            const next = (start + delta * step + n * n) % n;
            if (!options[next]?.disabled) return select(next);
        }
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
                select(options.length - 1);
                break;
        }
    }
</script>

<div
    class={twMerge('flex flex-wrap gap-2', className)}
    {...rest}
    role="radiogroup"
    aria-label={label}
    onkeydown={handleKeydown}
>
    {#each options as option, i (option.value)}
        {@const selected = i === selectedIndex}
        <button
            bind:this={cards[i]}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={option.disabled}
            tabindex={i === focusIndex ? 0 : -1}
            onclick={() => select(i)}
            class={twMerge(
                'inline-flex h-11 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-fc-md border px-4 text-fc-sm font-medium whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fc-ring disabled:cursor-not-allowed disabled:opacity-50',
                selected
                    ? 'border-fc-accent bg-fc-accent text-fc-accent-fg'
                    : 'border-fc-border bg-fc-bg text-fc-fg hover:bg-fc-surface'
            )}
        >
            {#if option.icon}
                <!-- `size-4` alongside the attributes: an <iconify-icon> has no box until its
                     data arrives, so without it the card visibly reflows when the glyph lands. -->
                <iconify-icon
                    icon={option.icon}
                    width="16"
                    height="16"
                    class="block size-4 shrink-0"
                ></iconify-icon>
            {/if}
            {option.label}
        </button>
    {/each}

    {#if name}
        <input type="hidden" {name} {value} />
    {/if}
</div>
