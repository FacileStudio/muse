import { expect, test } from 'bun:test';
import {
    arcPath,
    areaPath,
    axisPadLeft,
    barGeometry,
    barPath,
    chartColor,
    donutSegments,
    formatCompact,
    labelStride,
    labelWidth,
    linePath,
    niceScale,
    seriesColor,
    seriesCount,
    seriesEmpty,
    seriesRows,
    seriesSummary,
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
    expect(seriesSummary('Line', series, 3, 'points')).toBe('Line chart of 2 series across 3 points: a, b');
});

const bars = (series: ChartSeries[], stacked = false, horizontal = false) =>
    barGeometry({
        series,
        labels: ['a', 'b'],
        count: 2,
        scale: niceScale(
            Math.min(...seriesValues(series), 0),
            Math.max(...seriesValues(series), 0),
            4,
            true
        ),
        width: 300,
        height: 200,
        stacked,
        horizontal,
        format: formatCompact
    });

test('barGeometry survives a degenerate box and a flat-zero series', () => {
    const flat = bars([{ name: 'errors', data: [0, 0] }]);
    expect(flat.specs).toEqual([]);
    expect(flat.bands).toHaveLength(2);
    expect(flat.anchors.every((a) => Number.isFinite(a.x) && Number.isFinite(a.y))).toBe(true);
    const none = barGeometry({
        series: [],
        labels: [],
        count: 0,
        scale: niceScale(0, 1, 4, true),
        width: 0,
        height: 0,
        stacked: false,
        horizontal: false,
        format: formatCompact
    });
    expect(none.specs).toEqual([]);
    expect(none.base).toBe(0);
});

test('barGeometry rounds only the outer end of a stack', () => {
    const stack = bars(
        [
            { name: 'a', data: [5, 5] },
            { name: 'b', data: [5, 5] }
        ],
        true
    );
    expect(stack.specs).toHaveLength(4);
    expect(stack.specs.filter((s) => s.corner === 'top')).toHaveLength(2);
    expect(stack.specs.filter((s) => s.corner === 'none')).toHaveLength(2);
    expect(stack.specs.every((s) => s.size > 0 && Number.isFinite(s.near))).toBe(true);
});

test('barPath emits a closed path per corner style and nothing for a zero box', () => {
    expect(barPath({ x: 0, y: 0, w: 0, h: 10, corner: 'top' })).toBe('');
    for (const corner of ['top', 'bottom', 'left', 'right', 'none'] as const) {
        const d = barPath({ x: 1, y: 2, w: 10, h: 20, corner });
        expect(d).toStartWith('M');
        expect(d).toEndWith('Z');
        expect(d).not.toContain('NaN');
    }
});

test('donutSegments keeps sub-gap slices visible', () => {
    const segs = donutSegments([{ label: 'huge', value: 999 }, { label: 'sliver', value: 1 }], 0.12);
    expect(segs).toHaveLength(2);
    expect(segs[1].a1 - segs[1].a0).toBeGreaterThan(0.0005);
    expect(segs[0].a1 - segs[0].a0).toBeLessThan(TAU);
    expect(donutSegments([], 0.1)).toEqual([]);
    expect(donutSegments([{ label: 'zero', value: 0 }], 0.1)).toEqual([]);
});

test('label metrics size gutters and thin dense axes', () => {
    expect(labelWidth([])).toBe(0);
    expect(labelWidth(['1k', '10000'])).toBeGreaterThan(labelWidth(['1k']));
    expect(axisPadLeft([])).toBe(30);
    expect(axisPadLeft(['a'.repeat(100)])).toBe(96);
    expect(labelStride(4, 600, ['jan', 'feb', 'mar', 'apr'])).toBe(1);
    expect(labelStride(40, 300, ['2026-08-07'])).toBeGreaterThan(1);
});
