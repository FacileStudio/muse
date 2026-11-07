import { seriesColor } from './series.js';
import type { ChartRow, ChartSeries, ChartTipRow } from './types.js';

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
