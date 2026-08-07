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

const SLOT_COUNT = 6;

/** ~1.1°: below this an arc is sub-pixel at any donut radius we ship and reads as missing. */
const MIN_ARC = 0.02;

export const TAU = Math.PI * 2;

/** Average glyph advance of the bundled Goga face at `text-fc-xs`, used to size axis gutters. */
export const CHAR_W = 6.4;
export const PAD_TOP = 10;
export const PAD_BOTTOM = 24;
export const ENTRY_DURATION = 0.6;
export const AREA_OPACITY = 0.12;

const r2 = (n: number): number => Math.round(n * 100) / 100;
const clean = (n: number): number => Number(n.toPrecision(12));

export function chartColor(index: number): string {
    const i = Number.isFinite(index) ? Math.floor(index) : 0;
    const slot = ((i % SLOT_COUNT) + SLOT_COUNT) % SLOT_COUNT;
    return `var(--color-fc-chart-${slot + 1})`;
}

function niceNum(range: number, round: boolean): number {
    const abs = Math.abs(range);
    if (!(abs > 0)) return 1;
    const exp = Math.floor(Math.log10(abs));
    const frac = abs / Math.pow(10, exp);
    let nice: number;
    if (round) {
        if (frac < 1.5) nice = 1;
        else if (frac < 3) nice = 2;
        else if (frac < 7) nice = 5;
        else nice = 10;
    } else {
        if (frac <= 1) nice = 1;
        else if (frac <= 2) nice = 2;
        else if (frac <= 5) nice = 5;
        else nice = 10;
    }
    return nice * Math.pow(10, exp);
}

/**
 * Axis domain snapped to 1/2/5×10ⁿ steps, returned with its tick list.
 * `includeZero` anchors the domain to 0 — bar charts must pass it, otherwise a
 * truncated baseline makes bar lengths lie about their values.
 */
export function niceScale(min: number, max: number, tickCount = 4, includeZero = false): ChartScale {
    let lo = Number.isFinite(min) ? min : 0;
    let hi = Number.isFinite(max) ? max : 0;
    if (hi < lo) {
        const swap = lo;
        lo = hi;
        hi = swap;
    }
    if (includeZero) {
        lo = Math.min(lo, 0);
        hi = Math.max(hi, 0);
    }
    if (lo === hi) {
        const pad = Math.abs(hi) * 0.5 || 1;
        lo -= pad;
        hi += pad;
        if (includeZero) {
            lo = Math.min(lo, 0);
            hi = Math.max(hi, 0);
        }
    }
    const count = Math.max(1, Math.round(tickCount));
    const step = niceNum((hi - lo) / count, true);
    const niceMin = Math.floor(lo / step) * step;
    const niceMax = Math.ceil(hi / step) * step;
    const steps = Math.min(200, Math.max(1, Math.round((niceMax - niceMin) / step)));
    const ticks: number[] = [];
    for (let i = 0; i <= steps; i++) ticks.push(clean(niceMin + i * step));
    return { min: clean(niceMin), max: clean(niceMax), ticks };
}

export function formatCompact(n: number): string {
    if (!Number.isFinite(n)) return '—';
    const abs = Math.abs(n);
    if (abs < 1000) {
        if (Number.isInteger(n)) return String(n);
        return String(Number(n.toFixed(abs < 1 ? 2 : 1)));
    }
    const units: [number, string][] = [
        [1e12, 'T'],
        [1e9, 'B'],
        [1e6, 'M'],
        [1e3, 'k']
    ];
    for (const [factor, suffix] of units) {
        if (abs >= factor) {
            const scaled = n / factor;
            const digits = Math.abs(scaled) < 10 ? 1 : 0;
            return `${Number(scaled.toFixed(digits))}${suffix}`;
        }
    }
    return String(n);
}

export function seriesCount(series: ChartSeries[], labels: string[] = []): number {
    return Math.max(labels.length, ...series.map((s) => s.data.length), 0);
}

export function seriesValues(series: ChartSeries[]): number[] {
    return series.flatMap((s) => s.data.filter((v) => Number.isFinite(v)));
}

/**
 * Emptiness is the absence of points, never their value. An all-zero series is real
 * data — "0 errors today" has to draw a confident flat baseline, not an empty state.
 */
export function seriesEmpty(series: ChartSeries[], labels: string[] = []): boolean {
    return series.length === 0 || seriesCount(series, labels) === 0 || seriesValues(series).length === 0;
}

export function seriesColor(series: ChartSeries[], index: number): string {
    return series[index]?.color ?? chartColor(index);
}

export function seriesLegend(series: ChartSeries[]): ChartLegendItem[] {
    return series.map((s, i) => ({ name: s.name, color: seriesColor(series, i) }));
}

export function seriesSummary(kind: string, series: ChartSeries[], count: number, unit: string): string {
    return `${kind} chart of ${series.length} series across ${count} ${unit}: ${series
        .map((s) => s.name)
        .join(', ')}`;
}

export function categoryLabels(labels: string[], count: number): string[] {
    return Array.from({ length: count }, (_, i) => labels[i] ?? String(i + 1));
}

export function seriesRows(
    series: ChartSeries[],
    labels: string[],
    count: number,
    format: (n: number) => string
): ChartRow[] {
    return categoryLabels(labels, count).map((label, i) => ({
        label,
        cells: series.map((s) => (Number.isFinite(s.data[i]) ? format(s.data[i]) : ''))
    }));
}

export function seriesTipRows(
    series: ChartSeries[],
    index: number,
    format: (n: number) => string
): ChartTipRow[] {
    if (!(index >= 0)) return [];
    return series.map((s, i) => ({
        name: s.name,
        value: Number.isFinite(s.data[index]) ? format(s.data[index]) : '—',
        color: seriesColor(series, i)
    }));
}

/**
 * Fritsch–Carlson monotone tangents: the slope at each knot is clamped so the
 * cubic can never overshoot past its neighbouring samples — a plain Catmull-Rom
 * would invent peaks that are not in the data.
 */
function monotoneTangents(xs: number[], ys: number[]): number[] {
    const n = xs.length;
    const dx: number[] = [];
    const slopes: number[] = [];
    for (let i = 0; i < n - 1; i++) {
        const h = xs[i + 1] - xs[i];
        dx.push(h);
        slopes.push(h === 0 ? 0 : (ys[i + 1] - ys[i]) / h);
    }
    const m: number[] = new Array(n);
    m[0] = slopes[0];
    m[n - 1] = slopes[n - 2];
    for (let i = 1; i < n - 1; i++) {
        const s0 = slopes[i - 1];
        const s1 = slopes[i];
        if (s0 * s1 <= 0) {
            m[i] = 0;
        } else {
            const h0 = dx[i - 1];
            const h1 = dx[i];
            const common = h0 + h1;
            m[i] = (3 * common) / ((common + h1) / s0 + (common + h0) / s1);
        }
    }
    for (let i = 0; i < n - 1; i++) {
        if (slopes[i] === 0) {
            m[i] = 0;
            m[i + 1] = 0;
            continue;
        }
        const a = m[i] / slopes[i];
        const b = m[i + 1] / slopes[i];
        const s = a * a + b * b;
        if (s > 9) {
            const t = 3 / Math.sqrt(s);
            m[i] = t * a * slopes[i];
            m[i + 1] = t * b * slopes[i];
        }
    }
    return m;
}

function monotonePath(pts: [number, number][]): string {
    const xs = pts.map((p) => p[0]);
    const ys = pts.map((p) => p[1]);
    const m = monotoneTangents(xs, ys);
    let d = `M${r2(xs[0])} ${r2(ys[0])}`;
    for (let i = 0; i < pts.length - 1; i++) {
        const h = (xs[i + 1] - xs[i]) / 3;
        d += `C${r2(xs[i] + h)} ${r2(ys[i] + m[i] * h)} ${r2(xs[i + 1] - h)} ${r2(ys[i + 1] - m[i + 1] * h)} ${r2(xs[i + 1])} ${r2(ys[i + 1])}`;
    }
    return d;
}

export function linePath(points: [number, number][], smooth = false): string {
    const pts = points.filter((p) => Number.isFinite(p[0]) && Number.isFinite(p[1]));
    if (pts.length === 0) return '';
    if (pts.length === 1) return `M${r2(pts[0][0])} ${r2(pts[0][1])}L${r2(pts[0][0])} ${r2(pts[0][1])}`;
    if (!smooth || pts.length === 2) {
        return pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${r2(x)} ${r2(y)}`).join('');
    }
    return monotonePath(pts);
}

export function areaPath(points: [number, number][], baselineY: number, smooth = false): string {
    const pts = points.filter((p) => Number.isFinite(p[0]) && Number.isFinite(p[1]));
    if (pts.length === 0) return '';
    const top = linePath(pts, smooth);
    if (!top) return '';
    const first = pts[0][0];
    const last = pts[pts.length - 1][0];
    return `${top}L${r2(last)} ${r2(baselineY)}L${r2(first)} ${r2(baselineY)}Z`;
}

/**
 * Largest corner radius an annulus sector can hold: half its radial thickness, and small
 * enough that the fillets at the two ends of the *inner* edge do not meet — the inner edge
 * is the short one, so it runs out of room first. Returned as 0 when the sector is a full
 * ring, which has no corners to round.
 */
export function arcCorner(
    rOuter: number,
    rInner: number,
    startAngle: number,
    endAngle: number,
    corner: number
): number {
    const span = endAngle - startAngle;
    if (!(corner > 0) || !(span > 0) || span >= TAU - 1e-6) return 0;
    if (!(rOuter > 0) || !(rInner > 0) || rInner >= rOuter) return 0;
    const half = Math.min(span / 2, Math.PI / 2);
    const sin = Math.sin(half);
    if (!(sin > 0)) return 0;
    /* k/(rInner + k) = sin(half) at the point where the two inner fillets touch, and
       k/(rOuter − k) = sin(half) where the outer two do. */
    const byInner = sin >= 1 ? Infinity : (rInner * sin) / (1 - sin);
    const byOuter = (rOuter * sin) / (1 + sin);
    return Math.max(0, Math.min(corner, (rOuter - rInner) / 2, byInner, byOuter));
}

/**
 * Donut segment. Angles are radians measured from 12 o'clock, growing clockwise,
 * which matches SVG's y-down space with `sweep-flag=1`. `rInner` of 0 yields a pie wedge.
 *
 * `corner` rounds the four ends of the ring band, clamped by `arcCorner`. Each fillet is
 * tangent to both the radial edge and the arc it meets, so the segment keeps its exact
 * angular span — the alternative, a round `stroke-linecap`, would push every segment
 * half a thickness past the angle it represents and make the slices lie.
 */
export function arcPath(
    cx: number,
    cy: number,
    rOuter: number,
    rInner: number,
    startAngle: number,
    endAngle: number,
    corner = 0
): string {
    if (!(rOuter > 0) || !(endAngle > startAngle)) return '';
    const full = endAngle - startAngle >= TAU - 1e-6;
    const a0 = startAngle;
    const a1 = full ? startAngle + TAU - 1e-4 : endAngle;
    const large = a1 - a0 > Math.PI ? 1 : 0;
    const px = (r: number, a: number) => r2(cx + r * Math.sin(a));
    const py = (r: number, a: number) => r2(cy - r * Math.cos(a));
    const ri = Math.max(0, Math.min(rInner, rOuter));
    if (ri <= 0) {
        return `M${r2(cx)} ${r2(cy)}L${px(rOuter, a0)} ${py(rOuter, a0)}A${r2(rOuter)} ${r2(rOuter)} 0 ${large} 1 ${px(rOuter, a1)} ${py(rOuter, a1)}Z`;
    }
    const k = arcCorner(rOuter, ri, a0, a1, corner);
    if (k <= 0) {
        return `M${px(rOuter, a0)} ${py(rOuter, a0)}A${r2(rOuter)} ${r2(rOuter)} 0 ${large} 1 ${px(rOuter, a1)} ${py(rOuter, a1)}L${px(ri, a1)} ${py(ri, a1)}A${r2(ri)} ${r2(ri)} 0 ${large} 0 ${px(ri, a0)} ${py(ri, a0)}Z`;
    }
    /* Fillet centres sit at rOuter − k and rInner + k; `dOut`/`dIn` are the angles their
       tangent points are offset by, and `fOut`/`fIn` the radii where they leave the
       radial edge. Every corner turns the same way as the outline, so all four take
       sweep 1 while the inner arc keeps sweep 0. */
    const dOut = Math.asin(k / (rOuter - k));
    const dIn = Math.asin(k / (ri + k));
    const fOut = (rOuter - k) * Math.cos(dOut);
    const fIn = (ri + k) * Math.cos(dIn);
    const arcOut = a1 - dOut - (a0 + dOut) > Math.PI ? 1 : 0;
    const arcIn = a1 - dIn - (a0 + dIn) > Math.PI ? 1 : 0;
    const r = r2(k);
    return (
        `M${px(fIn, a0)} ${py(fIn, a0)}` +
        `L${px(fOut, a0)} ${py(fOut, a0)}` +
        `A${r} ${r} 0 0 1 ${px(rOuter, a0 + dOut)} ${py(rOuter, a0 + dOut)}` +
        `A${r2(rOuter)} ${r2(rOuter)} 0 ${arcOut} 1 ${px(rOuter, a1 - dOut)} ${py(rOuter, a1 - dOut)}` +
        `A${r} ${r} 0 0 1 ${px(fOut, a1)} ${py(fOut, a1)}` +
        `L${px(fIn, a1)} ${py(fIn, a1)}` +
        `A${r} ${r} 0 0 1 ${px(ri, a1 - dIn)} ${py(ri, a1 - dIn)}` +
        `A${r2(ri)} ${r2(ri)} 0 ${arcIn} 0 ${px(ri, a0 + dIn)} ${py(ri, a0 + dIn)}` +
        `A${r} ${r} 0 0 1 ${px(fIn, a0)} ${py(fIn, a0)}Z`
    );
}

export function tickStride(count: number, available: number, minSpacing: number): number {
    if (count <= 1 || available <= 0 || minSpacing <= 0) return 1;
    const fits = Math.max(1, Math.floor(available / minSpacing));
    return Math.max(1, Math.ceil(count / fits));
}

export function labelWidth(labels: string[]): number {
    let longest = 0;
    for (const label of labels) {
        if (label.length > longest) longest = label.length;
    }
    return longest * CHAR_W;
}

export function axisPadLeft(labels: string[]): number {
    return Math.min(96, Math.max(30, labelWidth(labels) + 10));
}

export function labelStride(count: number, available: number, labels: string[]): number {
    return tickStride(count, available, Math.max(28, labelWidth(labels) + 12));
}

const MAX_THICK = 24;
const BAR_GAP = 2;

/**
 * Bar layout in final, un-animated form: `near`/`size` are the position and length along
 * the value axis, `offset`/`thick` the position and breadth along the category axis. The
 * entry tween only interpolates `near` and `size`, so none of this has to be recomputed
 * per frame.
 */
export function barGeometry(input: {
    series: ChartSeries[];
    labels: string[];
    count: number;
    scale: ChartScale;
    width: number;
    height: number;
    stacked: boolean;
    horizontal: boolean;
    format: (n: number) => string;
}): BarGeometry {
    const { series, labels, count, scale, width, height, stacked, horizontal, format } = input;
    const specs: BarSpec[] = [];
    const bands: ChartBox[] = [];
    const grid: ChartLine[] = [];
    const valueTicks: ChartTick[] = [];
    const catTicks: ChartTick[] = [];
    const anchors: ChartPoint[] = [];
    const out: BarGeometry = { specs, bands, grid, valueTicks, catTicks, anchors, base: 0 };
    if (count <= 0 || width <= 0) return out;

    const valueLabels = scale.ticks.map((t) => format(t));
    const catLabels = categoryLabels(labels, count);
    const padLeft = horizontal
        ? Math.min(Math.max(56, width * 0.36), Math.max(56, labelWidth(catLabels) + 12))
        : axisPadLeft(valueLabels);
    const padRight = horizontal ? Math.max(12, labelWidth(valueLabels.slice(-1)) / 2) : 10;
    const plotW = Math.max(0, width - padLeft - padRight);
    const plotH = Math.max(0, height - PAD_TOP - PAD_BOTTOM);
    if (plotW <= 0 || plotH <= 0) return out;

    const span = scale.max - scale.min || 1;
    const vAt = (v: number): number =>
        horizontal
            ? padLeft + ((v - scale.min) / span) * plotW
            : PAD_TOP + (1 - (v - scale.min) / span) * plotH;
    const base = vAt(0);
    const bandSize = (horizontal ? plotH : plotW) / count;
    const bandOrigin = horizontal ? PAD_TOP : padLeft;
    const slots = stacked ? 1 : Math.max(1, series.length);
    const groupSize = Math.min(bandSize * 0.72, slots * MAX_THICK + (slots - 1) * BAR_GAP);
    const thick = Math.max(1, (groupSize - BAR_GAP * (slots - 1)) / slots);
    out.base = base;

    for (const tick of scale.ticks) {
        const p = vAt(tick);
        if (horizontal) grid.push({ x1: p, y1: PAD_TOP, x2: p, y2: PAD_TOP + plotH });
        else grid.push({ x1: padLeft, y1: p, x2: padLeft + plotW, y2: p });
        valueTicks.push(
            horizontal
                ? { x: p, y: PAD_TOP + plotH + 16, anchor: 'middle', text: format(tick) }
                : { x: padLeft - 8, y: p + 4, anchor: 'end', text: format(tick) }
        );
    }

    const catStride = horizontal ? tickStride(count, plotH, 18) : labelStride(count, plotW, catLabels);

    for (let i = 0; i < count; i++) {
        const start = bandOrigin + i * bandSize + (bandSize - groupSize) / 2;
        const along = bandOrigin + i * bandSize;

        if (horizontal) {
            bands.push({ x: padLeft, y: along, w: plotW, h: bandSize });
            if (i % catStride === 0) {
                catTicks.push({ x: padLeft - 10, y: along + bandSize / 2 + 4, anchor: 'end', text: catLabels[i] });
            }
        } else {
            bands.push({ x: along, y: PAD_TOP, w: bandSize, h: plotH });
            if (i % catStride === 0) {
                catTicks.push({
                    x: along + bandSize / 2,
                    y: PAD_TOP + plotH + 16,
                    anchor: 'middle',
                    text: catLabels[i]
                });
            }
        }

        let extreme = base;
        let pos = 0;
        let neg = 0;

        for (let j = 0; j < series.length; j++) {
            const v = series[j].data[i];
            if (!Number.isFinite(v) || v === 0) continue;

            const from = stacked ? (v > 0 ? pos : neg) : 0;
            const to = from + v;
            if (stacked) {
                if (v > 0) pos = to;
                else neg = to;
            }

            const a = vAt(from);
            const b = vAt(to);
            let near = Math.min(a, b);
            let size = Math.abs(b - a);
            if (stacked && from !== 0) {
                if ((v > 0) === horizontal) near += BAR_GAP;
                size = Math.max(0, size - BAR_GAP);
            }
            if (size <= 0) continue;

            /* Only the segment sitting on the baseline keeps a square end there — it is
               resting on the axis, not floating. Every other segment of a stack is bounded
               by BAR_GAP on both sides, so both of its ends get the radius; leaving them
               square drew a sharp seam through the middle of every stacked bar. */
            const grounded = from === 0;
            const offset = stacked ? start : start + j * (thick + BAR_GAP);
            const color = seriesColor(series, j);

            if (horizontal) {
                const corner: BarCorner = grounded ? (v > 0 ? 'right' : 'left') : 'all';
                specs.push({ near, size, offset, thick, corner, color });
                const edge = v > 0 ? near + size : near;
                if (v > 0 ? edge > extreme : edge < extreme) extreme = edge;
            } else {
                const corner: BarCorner = grounded ? (v > 0 ? 'top' : 'bottom') : 'all';
                specs.push({ near, size, offset, thick, corner, color });
                const edge = v > 0 ? near : near + size;
                if (v > 0 ? edge < extreme : edge > extreme) extreme = edge;
            }
        }

        anchors.push(
            horizontal
                ? { x: extreme, y: along + bandSize / 2 }
                : { x: along + bandSize / 2, y: extreme }
        );
    }

    return out;
}

export function barPath(bar: ChartBox & { corner: BarCorner }): string {
    const bw = Math.max(0, bar.w);
    const bh = Math.max(0, bar.h);
    if (bw <= 0 || bh <= 0) return '';
    const x = r2(bar.x);
    const y = r2(bar.y);
    const rv = Math.min(4, bw / 2, bh);
    const rh = Math.min(4, bh / 2, bw);
    if (bar.corner === 'all') {
        const r = Math.min(4, bw / 2, bh / 2);
        return `M${x} ${y + r}Q${x} ${y} ${x + r} ${y}L${x + bw - r} ${y}Q${x + bw} ${y} ${x + bw} ${y + r}L${x + bw} ${y + bh - r}Q${x + bw} ${y + bh} ${x + bw - r} ${y + bh}L${x + r} ${y + bh}Q${x} ${y + bh} ${x} ${y + bh - r}Z`;
    }
    if (bar.corner === 'top') {
        return `M${x} ${y + bh}L${x} ${y + rv}Q${x} ${y} ${x + rv} ${y}L${x + bw - rv} ${y}Q${x + bw} ${y} ${x + bw} ${y + rv}L${x + bw} ${y + bh}Z`;
    }
    if (bar.corner === 'bottom') {
        return `M${x} ${y}L${x} ${y + bh - rv}Q${x} ${y + bh} ${x + rv} ${y + bh}L${x + bw - rv} ${y + bh}Q${x + bw} ${y + bh} ${x + bw} ${y + bh - rv}L${x + bw} ${y}Z`;
    }
    if (bar.corner === 'right') {
        return `M${x} ${y}L${x + bw - rh} ${y}Q${x + bw} ${y} ${x + bw} ${y + rh}L${x + bw} ${y + bh - rh}Q${x + bw} ${y + bh} ${x + bw - rh} ${y + bh}L${x} ${y + bh}Z`;
    }
    if (bar.corner === 'left') {
        return `M${x + bw} ${y}L${x + rh} ${y}Q${x} ${y} ${x} ${y + rh}L${x} ${y + bh - rh}Q${x} ${y + bh} ${x + rh} ${y + bh}L${x + bw} ${y + bh}Z`;
    }
    return `M${x} ${y}h${bw}v${bh}h${-bw}Z`;
}

/**
 * A slice narrower than the separator gap keeps its full span and is floored at
 * `MIN_ARC`: inset by half a gap on each side it would collapse to nothing and vanish
 * from the ring while still being listed in the legend.
 */
export function donutSegments(slices: ChartSlice[], gap: number): DonutSegment[] {
    const out: DonutSegment[] = [];
    const total = slices.reduce((sum, d) => sum + d.value, 0);
    if (!(total > 0)) return out;
    let acc = 0;
    for (let i = 0; i < slices.length; i++) {
        const slice = slices[i];
        const frac = slice.value / total;
        const start = acc * TAU;
        const end = (acc + frac) * TAU;
        acc += frac;
        const inset = end - start > gap * 2 ? gap / 2 : 0;
        const a0 = start + inset;
        out.push({
            label: slice.label,
            value: slice.value,
            frac,
            color: slice.color ?? chartColor(i),
            a0,
            a1: Math.max(a0 + MIN_ARC, end - inset),
            mid: (start + end) / 2
        });
    }
    return out;
}

export function resize(node: HTMLElement, cb: (w: number) => void): { destroy(): void } {
    if (typeof ResizeObserver === 'undefined') {
        return { destroy() {} };
    }
    const observer = new ResizeObserver((entries) => {
        for (const entry of entries) cb(entry.contentRect.width);
    });
    observer.observe(node);
    cb(node.clientWidth);
    return {
        destroy() {
            observer.disconnect();
        }
    };
}
