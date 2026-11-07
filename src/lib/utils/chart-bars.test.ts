import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
    axisPadLeft,
    barGeometry,
    barPath,
    donutSegments,
    formatCompact,
    labelStride,
    labelWidth,
    niceScale,
    seriesValues,
    TAU,
    type ChartSeries
} from './chart.js';

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

test('barGeometry squares a stack only where it meets the baseline', () => {
    const stack = bars(
        [
            { name: 'a', data: [5, 5] },
            { name: 'b', data: [5, 5] }
        ],
        true
    );
    expect(stack.specs).toHaveLength(4);
    /* One grounded segment per category, rounded at the top only; the segment above it
       floats between two gaps and is rounded all round. */
    expect(stack.specs.filter((s) => s.corner === 'top')).toHaveLength(2);
    expect(stack.specs.filter((s) => s.corner === 'all')).toHaveLength(2);
    expect(stack.specs.every((s) => s.size > 0 && Number.isFinite(s.near))).toBe(true);
    expect(bars([{ name: 'a', data: [5, 5] }]).specs.every((s) => s.corner === 'top')).toBe(true);
});

test('barPath emits a closed path per corner style and nothing for a zero box', () => {
    expect(barPath({ x: 0, y: 0, w: 0, h: 10, corner: 'top' })).toBe('');
    for (const corner of ['top', 'bottom', 'left', 'right', 'all', 'none'] as const) {
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

describe('a stroke never lands on the viewBox edge', () => {
    /*
     * A 2px stroke with round caps paints 1px either side of the path. Padding of exactly 1
     * put the outer edge of the first and last cap on the boundary, where antialiasing shaves
     * it flat — the sparkline read as cut off at both ends, which is how it was reported.
     *
     * The rule generalises past this component: any chart padding has to clear half the stroke
     * it is padding for, plus a hair, or the extremes are shaved.
     */
    const STROKE = 2;

    test('the sparkline padding clears half its stroke', () => {
        const source = readFileSync(
            join(import.meta.dir, '../components/charts/Sparkline.svelte'),
            'utf8'
        );

        const padX = /const padX = \$derived\(showLast \? DOT_R \+ STROKE \/ 2 : STROKE \/ 2 \+ (\d+)\)/.exec(source);
        const padY = /const padY = STROKE \/ 2 \+ (\d+)/.exec(source);

        expect(padX).not.toBeNull();
        expect(padY).not.toBeNull();
        expect(Number(padX![1])).toBeGreaterThan(0);
        expect(Number(padY![1])).toBeGreaterThan(0);

        /* And the stroke the padding is derived from is the stroke actually drawn. */
        expect(source).toContain(`const STROKE = ${STROKE};`);
        expect(source).toContain('stroke-width={STROKE}');
    });
});
