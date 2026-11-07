export type ChartSeries = { name: string; data: number[]; color?: string };
export type ChartSlice = { label: string; value: number; color?: string };
export type ChartScale = { min: number; max: number; ticks: number[] };
export type ChartRow = { label: string; cells: string[] };
export type ChartTipRow = { name: string; value: string; color?: string };
export type ChartLegendItem = { name: string; color: string; value?: string };
export type ChartPoint = { x: number; y: number };
export type ChartBox = { x: number; y: number; w: number; h: number };
export type ChartLine = { x1: number; y1: number; x2: number; y2: number };
export type ChartTick = { x: number; y: number; anchor: 'start' | 'middle' | 'end'; text: string };

/** `all` is the stacked-segment case: every edge faces a gap, so every corner is rounded. */
export type BarCorner = 'top' | 'bottom' | 'left' | 'right' | 'all' | 'none';
export type BarSpec = {
    near: number;
    size: number;
    offset: number;
    thick: number;
    corner: BarCorner;
    color: string;
};
export type BarGeometry = {
    specs: BarSpec[];
    bands: ChartBox[];
    grid: ChartLine[];
    valueTicks: ChartTick[];
    catTicks: ChartTick[];
    anchors: ChartPoint[];
    base: number;
};
export type DonutSegment = {
    label: string;
    value: number;
    frac: number;
    color: string;
    a0: number;
    a1: number;
    mid: number;
};

export const TAU = Math.PI * 2;

/**
 * Average glyph advance at `text-fc-xs`, used to size axis gutters. It was measured on the
 * face muse used to bundle; the platform stack now resolves per OS, so treat it as an estimate
 * with slack rather than an exact metric. Axis labels are digits, whose advances vary little.
 */
export const CHAR_W = 6.4;
export const PAD_TOP = 10;
export const PAD_BOTTOM = 24;
export const ENTRY_DURATION = 0.6;
export const AREA_OPACITY = 0.12;
