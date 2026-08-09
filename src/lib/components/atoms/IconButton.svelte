<script module lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLButtonAttributes } from 'svelte/elements';

    export type Variant = 'default' | 'ghost' | 'danger';

    export interface IconButtonProps extends HTMLButtonAttributes {
        variant?: Variant;
        class?: string;
        children: Snippet;

    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';
    import { springPress } from '../../utils/press.js';

    let {
        type = 'button',
        variant = 'default',
        class: className = '',
        children,
        ...rest
    }: IconButtonProps = $props();

    const variants: Record<Variant, string> = {
        default: 'border border-fc-border text-fc-fg hover:bg-fc-surface',
        ghost: 'bg-transparent text-fc-fg-muted hover:bg-fc-surface hover:text-fc-fg',
        danger: 'bg-transparent text-fc-fg-muted hover:bg-fc-danger/10 hover:text-fc-danger'
    };

    const classes = $derived(twMerge(
        'inline-flex size-11 shrink-0 items-center justify-center rounded-fc-pill [&_svg]:size-4.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fc-ring',
        variants[variant],
        className
    ));
</script>

<button {type} class={classes} use:springPress {...rest}>
    {@render children()}
</button>
