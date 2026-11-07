import { r2 } from './round.js';
import { axisPadLeft, labelStride, labelWidth, tickStride } from './scale.js';
import { seriesColor } from './series.js';
import { categoryLabels } from './series-rows.js';
import { PAD_BOTTOM, PAD_TOP } from './types.js';
import type { BarCorner, ChartScale, ChartSeries, BarGeometry, BarSpec, ChartBox, ChartLine, ChartPoint, ChartTick } from './types.js';

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
