import { r2 } from './round.js';

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
