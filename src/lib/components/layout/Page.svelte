<script lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLAttributes } from 'svelte/elements';
    import { twMerge } from '../../utils/cn.js';
    import { GAP, PAGE_WIDTH, type Gap, type PageWidth } from '../../utils/layout.js';

    /*
     * The page column: centring, the width cap, the outer padding, and the rhythm between
     * sections. Every one of those was a per-app decision until now, and the suite shipped
     * eight different answers — max widths spanning `fc-md` to `max-w-7xl`, column gaps of 4, 6,
     * 8 and 10, and one page with no gap at all. None of it was a design choice; it was eight
     * agents each inventing a page shell because none was exported.
     *
     * `<Page>` goes *inside* the app shell's scroll container, not around it. The shell owns the
     * rail, the mobile nav and the single scroller; this owns everything from the content edge
     * inwards.
     */
    let {
        width = 'lg',
        gap = 'section',
        class: className = '',
        children,
        ...rest
    }: HTMLAttributes<HTMLDivElement> & {
        width?: PageWidth;
        gap?: Gap;
        class?: string;
        children: Snippet;
    } = $props();

    /*
     * A responsive ladder rather than one padding: at the documented 360px floor `px-4` leaves
     * 328px of content, where `px-10` would leave 280 and force every card into a scroll.
     * `mx-auto` is self-centring inside a parent that already sized this — the one margin the
     * library allows, and the reason the no-outer-margin check exempts `auto`.
     */
    const classes = $derived(
        twMerge(
            'mx-auto flex w-full flex-col px-4 py-8 sm:px-6 md:px-10 md:py-10',
            PAGE_WIDTH[width],
            GAP[gap],
            className
        )
    );
</script>

<div class={classes} {...rest}>
    {@render children()}
</div>
