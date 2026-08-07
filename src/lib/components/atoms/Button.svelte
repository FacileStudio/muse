<script lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLButtonAttributes } from 'svelte/elements';
    import { twMerge } from '../../utils/cn.js';

    type Variant = 'primary' | 'ghost' | 'outline' | 'danger' | 'ghost-danger';
    type Size = 'sm' | 'md' | 'lg';

    let {
        variant = 'primary',
        size = 'md',
        icon,
        iconRight,
        class: className = '',
        children,
        ...rest
    }: HTMLButtonAttributes & {
        variant?: Variant;
        size?: Size;
        icon?: string;
        iconRight?: string;
        class?: string;
        children?: Snippet;
    } = $props();

    const iconSizes: Record<Size, number> = { sm: 14, md: 16, lg: 16 };
    const glyph = $derived(iconSizes[size]);

    const variants: Record<Variant, string> = {
        primary: 'bg-fc-accent text-fc-accent-fg hover:opacity-90',
        ghost: 'bg-transparent text-fc-fg-muted hover:bg-fc-surface hover:text-fc-fg',
        outline: 'border border-fc-border bg-transparent text-fc-fg hover:bg-fc-surface',
        danger: 'bg-fc-danger/10 text-fc-danger hover:bg-fc-danger/20',
        'ghost-danger': 'bg-transparent text-fc-fg-muted hover:bg-fc-danger/10 hover:text-fc-danger'
    };

    const sizes: Record<Size, string> = {
        sm: 'h-8 px-3.5 text-fc-xs',
        md: 'h-9 px-4 text-fc-sm',
        lg: 'h-11 px-6 text-fc-sm'
    };

    const classes = $derived(twMerge('inline-flex shrink-0 items-center rounded-fc-pill justify-center gap-2 font-medium whitespace-nowrap transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fc-ring', variants[variant], sizes[size], className));
</script>

<button class={classes} {...rest}>
    {#if icon}
        <iconify-icon {icon} width={glyph} height={glyph} class="block shrink-0"></iconify-icon>
    {/if}
    {#if children}{@render children()}{/if}
    {#if iconRight}
        <iconify-icon icon={iconRight} width={glyph} height={glyph} class="block shrink-0"></iconify-icon>
    {/if}
</button>
