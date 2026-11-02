/*
 * One gap: 4px between any two elements, whether buttons in a row, comments in a thread or
 * two sections of a page. `none` is for parts that must touch.
 */
export type Gap = 'none' | 'default';

export const GAP: Record<Gap, string> = {
    none: 'gap-0',
    default: 'gap-1'
};

export type Align = 'start' | 'center' | 'end' | 'baseline' | 'stretch';

export const ALIGN: Record<Align, string> = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    baseline: 'items-baseline',
    stretch: 'items-stretch'
};
