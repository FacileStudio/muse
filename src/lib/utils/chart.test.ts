import { expect, test } from 'bun:test';
import { arcPath, areaPath, chartColor, formatCompact, linePath, niceScale, tickStride } from './chart.js';

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
