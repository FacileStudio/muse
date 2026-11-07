<script module lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';

    export type Option = {
        value: string;
        label: string;
        icon?: string;
        disabled?: boolean;
    };

    export interface OptionCardsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onselect'> {
        options?: Option[];
        value?: string;
        name?: string;
        label?: string;
        onSelect?: (value: string) => void;
        class?: string;

    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';
    import Icon from '../atoms/Icon.svelte';

    let {
        options = [],
        value = $bindable(''),
        name,
        label,
        onSelect,
        class: className = '',
        ...rest
    }: OptionCardsProps = $props();

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

<!--
@component
Le choix d'une option parmi N — thème, mode d'affichage, base de facturation — en cartes à icône plutôt qu'en liste.
-->

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
                'inline-flex h-11 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-fc-md px-4 text-fc-sm font-medium whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fc-ring disabled:cursor-not-allowed disabled:opacity-50',
                selected
                    ? 'bg-fc-accent text-fc-accent-fg'
                    : 'bg-fc-surface text-fc-fg hover:bg-fc-surface/60'
            )}
        >
            {#if option.icon}
                <Icon icon={option.icon} size={16} />
            {/if}
            {option.label}
        </button>
    {/each}

    {#if name}
        <input type="hidden" {name} {value} />
    {/if}
</div>
