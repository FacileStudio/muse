<script module lang="ts">
    import type { SVGAttributes } from 'svelte/elements';

    export interface IconProps extends SVGAttributes<SVGSVGElement> {
        /** An iconify name (`solar:settings-linear`) — usually from the `icons` map. */
        icon: string;
        /** Rendered size in pixels, applied as width, height and a matching CSS box. @default 16 */
        size?: number;
        class?: string;
    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';
    import { ICON_DATA } from '../../icons-data.js';
    import { extraIcons } from '../../icons.js';

    /*
     * An inline `<svg>`, not a custom element.
     *
     * muse used to render `<iconify-icon>`, which meant three things every consumer paid for:
     * the element had to be registered browser-side or every icon silently vanished, the glyph
     * was fetched from api.iconify.design at runtime, and until that request landed the element
     * was a 0×0 box — so buttons rendered at label width and jumped when the icon arrived.
     *
     * The paths are bundled instead. Icons now render during SSR, cost no request, and have
     * their box from the first frame. `<iconify-icon>` remains the fallback for a name muse
     * does not carry, so an app passing its own `solar:*` string keeps working.
     */
    let { icon, size = 16, class: className = '', ...rest }: IconProps = $props();

    const data = $derived(ICON_DATA[icon] ?? extraIcons[icon]);
    const classes = $derived(twMerge('block shrink-0', className));

    /*
     * Some glyphs are drawn through a `<mask>`, and the mask's id is baked into the path data —
     * `solar:pallete-2-linear` is one. Inlining that body twice on a page puts the same DOM id
     * on two elements: invalid HTML, and worse, unmounting either one leaves the other pointing
     * at a mask that no longer exists, so the icon silently disappears. Iconify's own runtime
     * rewrites these per instance for exactly this reason; inlining has to do the same.
     */
    const uid = $props.id();
    const body = $derived(
        /\bid="/.test(data?.body ?? '')
            ? data!.body.replace(/([#"])(SVG[A-Za-z0-9]+)/g, `$1$2-${uid}`)
            : (data?.body ?? '')
    );
</script>

<!--
@component
Une icône en SVG inline, rendue côté serveur et sans requête réseau. Le nom vient toujours de la map `icons`.
-->

{#if data}
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 {data.width} {data.height}"
        style:width="{size}px"
        style:height="{size}px"
        aria-hidden="true"
        focusable="false"
        class={classes}
        {...rest}
    >
        <!-- eslint-disable-next-line svelte/no-at-html-tags -->
        {@html body}
    </svg>
{:else}
    <!-- Not in the bundle. Falls back to the custom element, which needs the consumer to have
         registered `iconify-icon` and will fetch the glyph — the one case that still touches the
         network. Add the key to muse's `icons` map, or register it with `registerIcons()`.

         `rest` is SVG-typed by declaration and the custom element will not take it, so it is
         cast: the props that matter here are `id`, `data-*` and `aria-*`, which mean the same
         thing on either element. -->
    <iconify-icon
        {icon}
        width={size}
        height={size}
        class={classes}
        {...rest as Record<string, unknown>}
    ></iconify-icon>
{/if}
