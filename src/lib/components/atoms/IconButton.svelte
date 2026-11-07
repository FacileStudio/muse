<script module lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLButtonAttributes } from 'svelte/elements';
    import type { IconButtonVariant, LegacyIconButtonVariant } from '../../utils/variant.js';

    export type { IconButtonVariant };

    /** @deprecated Use `IconButtonVariant`. */
    export type Variant = IconButtonVariant | LegacyIconButtonVariant;

    export interface IconButtonProps extends HTMLButtonAttributes {
        /** `default` still works and means `secondary`; `danger` still works and means `ghost-danger`. */
        variant?: IconButtonVariant | LegacyIconButtonVariant;
        class?: string;
        children: Snippet;

    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';
    import { iconButtonVariant } from '../../utils/variant.js';
    import { springPress } from '../../utils/press.js';

    let {
        type = 'button',
        variant = 'secondary',
        class: className = '',
        children,
        ...rest
    }: IconButtonProps = $props();

    const variants: Record<IconButtonVariant, string> = {
        secondary: 'bg-fc-surface text-fc-fg hover:bg-fc-surface/60',
        ghost: 'bg-transparent text-fc-fg-muted hover:bg-fc-surface hover:text-fc-fg',
        'ghost-danger': 'bg-transparent text-fc-fg-muted hover:bg-fc-danger/10 hover:text-fc-danger'
    };

    const classes = $derived(twMerge(
        'inline-flex size-11 shrink-0 items-center justify-center rounded-fc-pill [&_svg]:size-4.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fc-ring',
        variants[iconButtonVariant(variant)],
        className
    ));
</script>

<!--
@component
Un bouton rond de 44px pour une action sans libellé. Il prend l'icône en enfant, et toujours un `aria-label`.
-->

<button {type} class={classes} use:springPress {...rest}>
    {@render children()}
</button>
