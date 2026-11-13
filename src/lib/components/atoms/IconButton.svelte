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
        /**
         * The hover and keyboard-focus hint. Defaults to the `aria-label`, so every icon button names
         * itself on screen. A string shows that text instead; `false` shows none, for a parent that
         * already wraps the button in its own `Tooltip`.
         */
        tooltip?: string | false;
        class?: string;
        children: Snippet;
    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';
    import { iconButtonVariant } from '../../utils/variant.js';
    import { springPress } from '../../utils/press.js';
    import { describes, iconTooltip } from '../../utils/tooltip.js';
    import Tooltip from './Tooltip.svelte';

    let {
        type = 'button',
        variant = 'secondary',
        tooltip,
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

    const hint = $derived(iconTooltip(tooltip, rest['aria-label']));
</script>

<!--
@component
Un bouton rond de 44px pour une action sans libellé. Il prend l'icône en enfant, et toujours un `aria-label`, qu'il affiche en info-bulle au survol et au focus clavier. `tooltip` change ce texte, `tooltip={false}` la retire quand un parent en pose déjà une.
-->

{#snippet button()}
    <button {type} class={classes} use:springPress {...rest}>
        {@render children()}
    </button>
{/snippet}

{#if hint}
    <Tooltip text={hint} describe={describes(hint, rest['aria-label'])} class="contents">
        {@render button()}
    </Tooltip>
{:else}
    {@render button()}
{/if}
