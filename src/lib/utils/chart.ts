export type ChartSeries = { name: string; data: number[]; color?: string };
export type ChartSlice = { label: string; value: number; color?: string };
export type ChartScale = { min: number; max: number; ticks: number[] };

const SLOT_COUNT = 6;
const TAU = Math.PI * 2;

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
 * Donut segment. Angles are radians measured from 12 o'clock, growing clockwise,
 * which matches SVG's y-down space with `sweep-flag=1`. `rInner` of 0 yields a pie wedge.
 */
export function arcPath(
    cx: number,
    cy: number,
    rOuter: number,
    rInner: number,
    startAngle: number,
    endAngle: number
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
    return `M${px(rOuter, a0)} ${py(rOuter, a0)}A${r2(rOuter)} ${r2(rOuter)} 0 ${large} 1 ${px(rOuter, a1)} ${py(rOuter, a1)}L${px(ri, a1)} ${py(ri, a1)}A${r2(ri)} ${r2(ri)} 0 ${large} 0 ${px(ri, a0)} ${py(ri, a0)}Z`;
}

export function tickStride(count: number, available: number, minSpacing: number): number {
    if (count <= 1 || available <= 0 || minSpacing <= 0) return 1;
    const fits = Math.max(1, Math.floor(available / minSpacing));
    return Math.max(1, Math.ceil(count / fits));
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
