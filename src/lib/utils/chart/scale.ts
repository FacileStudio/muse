import { clean } from './round.js';
import type { ChartScale } from './types.js';
import { CHAR_W } from './types.js';

const SLOT_COUNT = 6;

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
