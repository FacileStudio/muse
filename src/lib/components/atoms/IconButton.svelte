<script lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLButtonAttributes } from 'svelte/elements';
    import { twMerge } from '../../utils/cn.js';
    import { springPress } from '../../utils/press.js';

    type Variant = 'default' | 'ghost' | 'danger';

    let {
        type = 'button',
        variant = 'default',
        class: className = '',
        children,
        ...rest
    }: HTMLButtonAttributes & {
        variant?: Variant;
        class?: string;
        children: Snippet;
    } = $props();

    const variants: Record<Variant, string> = {
        default: 'border border-fc-border text-fc-fg hover:bg-fc-surface',
        ghost: 'bg-transparent text-fc-fg-muted hover:bg-fc-surface hover:text-fc-fg',
        danger: 'bg-transparent text-fc-fg-muted hover:bg-fc-danger/10 hover:text-fc-danger'
    };

    const classes = $derived(twMerge(
        'inline-flex size-11 shrink-0 items-center justify-center rounded-fc-pill [&_svg]:size-4.5 [&_iconify-icon]:block transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fc-ring',
        variants[variant],
        className
    ));
</script>

<button {type} class={classes} use:springPress={0.88} {...rest}>
    {@render children()}
</button>
