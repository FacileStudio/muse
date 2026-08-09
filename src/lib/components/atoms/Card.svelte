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

    /*
     * Typed for the <div>, plus the three anchor props by name. Intersecting with
     * `HTMLAnchorAttributes` instead makes each of the ~430 event handlers a union of a
     * div-typed and an anchor-typed signature, and svelte-check gives up with "union type that
     * is too complex to represent" — at the *call sites*, so StatCard and ProfileCard broke
     * rather than this file. Widening to `HTMLAttributes<HTMLElement>` fails the same way,
     * because handler props are invariant in their element.
     */

    let {
        href,
        class: className = '',
        children,
        ...rest
    }: CardProps = $props();

    /* The cast is the price of one component rendering two elements: `rest` is div-shaped by
       declaration and the anchor branch will not take it otherwise. It is a lie about the
       handler signatures only — an `onclick` is an `onclick` at runtime. */
    const anchorRest = $derived(rest as unknown as HTMLAnchorAttributes);

    /* p-5, not p-4: the fill against the page is a 1.5% lightness step and there is no border,
       so the padding is what separates the card from the page. See CHARTE §5. */
    const base = 'rounded-fc-md bg-fc-component p-5';

    /*
     * A card that navigates needs the affordances a div cannot carry: the focus ring, a hover
     * step, and `group` so children can react to the hover (an arrow that nudges, an icon tile
     * that inverts). Hover goes *up* to `fc-surface` rather than tinting — same inversion
     * logic as every other active state.
     */
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
