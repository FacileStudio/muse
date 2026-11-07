import type { ChartLegendItem, ChartSeries } from './types.js';
import { chartColor } from './scale.js';

export function seriesCount(series: ChartSeries[], labels: string[] = []): number {
    return Math.max(labels.length, ...series.map((s) => s.data.length), 0);
}

export function seriesValues(series: ChartSeries[]): number[] {
    return series.flatMap((s) => s.data.filter((v) => Number.isFinite(v)));
}

/**
 * Emptiness is the absence of points, never their value. An all-zero series is real
 * data — "0 errors today" has to draw a confident flat baseline, not an empty state.
 */
export function seriesEmpty(series: ChartSeries[], labels: string[] = []): boolean {
    return series.length === 0 || seriesCount(series, labels) === 0 || seriesValues(series).length === 0;
}

export function seriesColor(series: ChartSeries[], index: number): string {
    return series[index]?.color ?? chartColor(index);
}

export function seriesLegend(series: ChartSeries[]): ChartLegendItem[] {
    return series.map((s, i) => ({ name: s.name, color: seriesColor(series, i) }));
}

/** The series names joined for a screen-reader summary. */
export function seriesNames(series: ChartSeries[]): string {
    return series.map((s) => s.name).join(', ');
}
