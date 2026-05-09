<script lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLButtonAttributes } from 'svelte/elements';
    import { twMerge } from 'tailwind-merge';

    type Variant = 'primary' | 'ghost' | 'outline' | 'danger';
    type Size = 'sm' | 'md' | 'lg';

    let {
        variant = 'primary',
        size = 'md',
        class: className = '',
        children,
        ...rest
    }: HTMLButtonAttributes & {
        variant?: Variant;
        size?: Size;
        class?: string;
        children: Snippet;
    } = $props();

    const variants: Record<Variant, string> = {
        primary: 'bg-fc-accent text-fc-accent-fg hover:opacity-90',
        ghost: 'bg-transparent text-fc-fg hover:bg-fc-surface',
        outline: 'border border-fc-fg/20 bg-transparent text-fc-fg hover:bg-fc-surface',
        danger: 'bg-fc-danger text-white hover:opacity-90'
    };

    const sizes: Record<Size, string> = {
        sm: 'py-2 px-4',
        md: 'py-2 px-4',
        lg: 'py-2 px-4'
    };

    const classes = $derived(twMerge('inline-flex text-fc-xs items-center rounded-fc-md justify-center gap-2 font-medium transition-opacity disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-fc-accent', variants[variant], sizes[size], className));
</script>

<button class={classes} {...rest}>
    {@render children()}
</button>
