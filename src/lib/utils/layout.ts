/*
 * One gap: 4px between any two elements, whether buttons in a row, comments in a thread or
 * two sections of a page. `none` is for parts that must touch.
 */
export type Gap = 'none' | 'default';

export const GAP: Record<Gap, string> = {
    none: 'gap-0',
    default: 'gap-1'
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
