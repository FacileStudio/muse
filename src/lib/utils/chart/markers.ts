import type { ChartMarker, ChartMarkerPoint, ChartSeries, ChartTipRow } from './types.js';

const TONE_COLOR = {
    info: 'var(--color-fc-info)',
    warning: 'var(--color-fc-warning)',
    danger: 'var(--color-fc-danger)'
} as const;

/** The markers that land on a drawn point: a whole index inside the chart, on a series with a finite value there. */
export function markerPoints(markers: ChartMarker[], series: ChartSeries[], count: number): ChartMarkerPoint[] {
    return markers.flatMap((marker) => {
        const { index } = marker;
        if (!Number.isInteger(index) || index < 0 || index >= count) return [];
        const value = series[marker.series ?? 0]?.data[index];
        if (value === undefined || !Number.isFinite(value)) return [];
        return [{ marker, index, value, color: TONE_COLOR[marker.tone ?? 'warning'] }];
    });
}

/** The tooltip rows of the markers at the hovered index. */
export function markerTipRows(points: ChartMarkerPoint[], hover: number): ChartTipRow[] {
    return points.filter((p) => p.index === hover).map((p) => ({ name: p.marker.label, value: '', color: p.color }));
}
