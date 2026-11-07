import { expect, test } from 'bun:test';
import {
    arcCorner,
    arcPath,
    areaPath,
    chartColor,
    donutSegments,
    formatCompact,
    linePath,
    niceScale,
    seriesColor,
    seriesCount,
    seriesEmpty,
    seriesRows,
    seriesNames,
    seriesTipRows,
    seriesValues,
    tickStride,
    TAU,
    type ChartSeries
} from './chart.js';

test('niceScale snaps to 1/2/5 steps and covers the domain', () => {
    const s = niceScale(3, 97, 4);
    expect(s.min).toBeLessThanOrEqual(3);
    expect(s.max).toBeGreaterThanOrEqual(97);
    expect(s.ticks[0]).toBe(s.min);
    expect(s.ticks[s.ticks.length - 1]).toBe(s.max);
    const step = s.ticks[1] - s.ticks[0];
    expect(s.ticks.every((t, i) => i === 0 || Math.abs(t - s.ticks[i - 1] - step) < 1e-9)).toBe(true);
});

test('niceScale never produces a zero-width domain', () => {
    for (const [lo, hi] of [[5, 5], [0, 0], [-2, -2]] as [number, number][]) {
        const s = niceScale(lo, hi, 4);
        expect(s.max).toBeGreaterThan(s.min);
        expect(s.ticks.length).toBeGreaterThan(1);
    }
});

test('niceScale anchors to zero for bars', () => {
    expect(niceScale(40, 90, 4, true).min).toBe(0);
    expect(niceScale(-40, -10, 4, true).max).toBe(0);
});

test('paths survive degenerate input', () => {
    expect(linePath([], true)).toBe('');
    expect(areaPath([], 10, true)).toBe('');
    expect(linePath([[1, 2]], true)).toContain('M1 2');
    expect(linePath([[0, 0], [10, 10]], true)).toBe('M0 0L10 10');
    expect(arcPath(0, 0, 10, 4, 1, 1)).toBe('');
    expect(arcPath(0, 0, 0, 0, 0, 1)).toBe('');
});

test('monotone smoothing never overshoots the samples', () => {
    const pts: [number, number][] = [[0, 10], [10, 10], [20, 0], [30, 0]];
    const nums = linePath(pts, true).match(/-?\d+(\.\d+)?/g)!.map(Number);
    const ys = nums.filter((_, i) => i % 2 === 1);
    expect(Math.min(...ys)).toBeGreaterThanOrEqual(0);
    expect(Math.max(...ys)).toBeLessThanOrEqual(10);
});

test('arcPath closes a full circle without collapsing', () => {
    expect(arcPath(50, 50, 40, 20, 0, Math.PI * 2)).toStartWith('M');
});

test('a single full slice is a clean ring: no corner rounding, no radial edge', () => {
    const slices = donutSegments([{ label: 'a', value: 5 }], 0.12);
    expect(slices).toHaveLength(1);
    const ring = arcPath(50, 50, 40, 20, slices[0].a0, slices[0].a1, 8);
    expect(ring).toBe(arcPath(50, 50, 40, 20, 0, TAU, 0));
    expect(ring.match(/M/g)).toHaveLength(2);
    expect(ring.match(/A/g)).toHaveLength(4);
    expect(ring).not.toContain('L');
    expect(arcPath(50, 50, 40, 0, 0, TAU, 8)).not.toContain('L');
    expect(arcPath(50, 50, 40, 20, 0, TAU * 0.999, 8)).toContain('L');
});

test('arcCorner never lets the fillets of one segment meet', () => {
    /* Half the radial thickness is the ceiling however wide the slice is… */
    expect(arcCorner(40, 20, 0, Math.PI, 999)).toBe(10);
    /* …and a narrow slice is capped by its own inner edge instead. */
    const narrow = arcCorner(40, 20, 0, 0.2, 999);
    expect(narrow).toBeGreaterThan(0);
    expect(narrow).toBeLessThan(10);
    expect(2 * Math.asin(narrow / (20 + narrow))).toBeLessThanOrEqual(0.2 + 1e-9);
    /* A full ring has no corners, and neither has a pie wedge. */
    expect(arcCorner(40, 20, 0, TAU, 4)).toBe(0);
    expect(arcCorner(40, 0, 0, 1, 4)).toBe(0);
});

test('arcPath rounds inside the ring it was given', () => {
    const d = arcPath(50, 50, 40, 20, 0, 1, 4);
    expect(d).toStartWith('M');
    expect(d).toEndWith('Z');
    expect(d).not.toContain('NaN');
    const points = d.match(/-?\d+(\.\d+)?/g)!.map(Number);
    expect(points.every((n) => n >= -1 && n <= 91)).toBe(true);
    /* corner 0 is the old sharp path, byte for byte. */
    expect(arcPath(50, 50, 40, 20, 0, 1, 0)).toBe(arcPath(50, 50, 40, 20, 0, 1));
});

test('chartColor wraps through six fixed slots', () => {
    expect(chartColor(0)).toBe('var(--color-fc-chart-1)');
    expect(chartColor(6)).toBe('var(--color-fc-chart-1)');
    expect(chartColor(-1)).toBe('var(--color-fc-chart-6)');
});

test('formatCompact keeps small numbers exact and abbreviates large ones', () => {
    expect(formatCompact(42)).toBe('42');
    expect(formatCompact(1200)).toBe('1.2k');
    expect(formatCompact(3_400_000)).toBe('3.4M');
    expect(formatCompact(NaN)).toBe('—');
});

test('tickStride thins labels to fit the available width', () => {
    expect(tickStride(12, 600, 50)).toBe(1);
    expect(tickStride(12, 120, 50)).toBeGreaterThan(1);
});

test('an all-zero series is data, not an empty state', () => {
    const zeros: ChartSeries[] = [{ name: 'errors', data: [0, 0, 0] }];
    expect(seriesEmpty(zeros, ['mon', 'tue', 'wed'])).toBe(false);
    expect(seriesEmpty([], [])).toBe(true);
    expect(seriesEmpty([{ name: 'x', data: [] }], [])).toBe(true);
    expect(seriesEmpty([{ name: 'x', data: [NaN] }], [])).toBe(true);
});

test('a flat-zero domain still draws a finite baseline', () => {
    const scale = niceScale(0, 0, 4, true);
    expect(scale.max).toBeGreaterThan(scale.min);
    const span = scale.max - scale.min;
    const pts: [number, number][] = [0, 0, 0].map((v, i) => [i * 20, 100 - ((v - scale.min) / span) * 100]);
    expect(linePath(pts, true)).not.toContain('NaN');
    expect(areaPath(pts, 100, true)).not.toContain('NaN');
});

test('series helpers span labels and data, and mark gaps', () => {
    const series: ChartSeries[] = [
        { name: 'a', data: [1, 2] },
        { name: 'b', data: [3, NaN, 5], color: 'red' }
    ];
    expect(seriesCount(series, ['x'])).toBe(3);
    expect(seriesValues(series)).toEqual([1, 2, 3, 5]);
    expect(seriesColor(series, 1)).toBe('red');
    expect(seriesColor(series, 0)).toBe('var(--color-fc-chart-1)');
    expect(seriesRows(series, ['x'], 3, formatCompact)).toEqual([
        { label: 'x', cells: ['1', '3'] },
        { label: '2', cells: ['2', ''] },
        { label: '3', cells: ['', '5'] }
    ]);
    expect(seriesTipRows(series, 1, formatCompact).map((r) => r.value)).toEqual(['2', '—']);
    expect(seriesTipRows(series, -1, formatCompact)).toEqual([]);
    expect(seriesNames(series)).toBe('a, b');
});
