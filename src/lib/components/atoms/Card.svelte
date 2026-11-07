<script module lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLAnchorAttributes, HTMLAttributes } from 'svelte/elements';

    export interface CardProps extends HTMLAttributes<HTMLDivElement> {
        href?: string;
        target?: HTMLAnchorAttributes['target'];
        rel?: HTMLAnchorAttributes['rel'];
        class?: string;
        children: Snippet;

    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';

    let {
        href,
        class: className = '',
        children,
        ...rest
    }: CardProps = $props();

    const anchorRest = $derived(rest as unknown as HTMLAnchorAttributes);

    const base = 'rounded-fc-md bg-fc-component p-5';

    const classes = $derived(
        twMerge(
            base,
            href &&
                'group block transition-colors hover:bg-fc-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fc-ring',
            className
        )
    );
</script>

<!--
@component
La surface conteneur du système : remplissage sans bordure, `p-5`. Avec `href`, elle devient un lien et gagne le survol et l'anneau de focus.
-->

{#if href}
    <a {href} class={classes} {...anchorRest}>
        {@render children()}
    </a>
{:else}
    <div class={classes} {...rest}>
        {@render children()}
    </div>
{/if}
