/*
 * The rhythm, as four named rungs rather than a number the caller picks.
 *
 * muse defines no `--spacing-fc-*` scale on purpose — spacing is Tailwind's stock 4pt scale,
 * and inventing a parallel one buys nothing. What was missing is not values, it is *which
 * value*, and that is what these names carry. CHARTE §4 had the ladder written down as prose;
 * every consumer retyped it by hand and drifted (Vision alone: 57 `gap-4`, 22 `gap-3`, 3
 * `gap-8` — two of those three are off the documented scale).
 *
 * The rungs differ in kind, not only in size, which is what makes naming them defensible:
 *
 *   bound    4px   parts of one thing        a heading and its description
 *   tight    8px   things used together      the buttons of an action row
 *   content 16px   siblings inside a block   items in a card, cards in a grid
 *   section 40px   separate topics           one section of a page and the next
 *
 * There is deliberately no rung between `content` and `section`. A gap of 24 or 32px says
 * "related, but a bit less" — a distinction nobody can apply consistently, and the source of
 * the three different page-column gaps the suite shipped. If a layout genuinely needs one,
 * `class="gap-6"` still wins through twMerge, and it reads as the exception it is.
 */
export type Gap = 'none' | 'bound' | 'tight' | 'content' | 'section';

export const GAP: Record<Gap, string> = {
    none: 'gap-0',
    bound: 'gap-1',
    tight: 'gap-2',
    content: 'gap-4',
    section: 'gap-10'
};

/*
 * Page column widths, mapped onto the `--container-fc-*` tokens. `lg` (960px) is the default
 * because it is the reading width a settings or detail page wants; dashboards that need the
 * extra column take `xl`. Four of the thirteen consumer apps ignored the scale entirely and
 * reached for `max-w-4xl` / `max-w-5xl` / `max-w-7xl`, which is what a scale with no component
 * in front of it gets you.
 */
export type PageWidth = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export const PAGE_WIDTH: Record<PageWidth, string> = {
    sm: 'max-w-fc-sm',
    md: 'max-w-fc-md',
    lg: 'max-w-fc-lg',
    xl: 'max-w-fc-xl',
    full: 'max-w-none'
};

export type Align = 'start' | 'center' | 'end' | 'baseline' | 'stretch';

export const ALIGN: Record<Align, string> = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    baseline: 'items-baseline',
    stretch: 'items-stretch'
};
