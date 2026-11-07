import { TAU } from './types.js';
import { chartColor } from './scale.js';
import type { ChartSlice, DonutSegment } from './types.js';

const MIN_ARC = 0.02;

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
        const inset = slices.length > 1 && end - start > gap * 2 ? gap / 2 : 0;
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
