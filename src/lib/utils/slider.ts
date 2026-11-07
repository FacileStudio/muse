export type SliderBounds = { min: number; max: number; step: number };

export type Thumb = 0 | 1;

const DEFAULT_PAGES = 10;

function decimals(step: number): number {
    const text = String(step);
    const dot = text.indexOf('.');
    return dot < 0 ? 0 : text.length - dot - 1;
}

/** Clamps `value` into the bounds and snaps it to the nearest step counted from `min`. */
export function snap(value: number, bounds: SliderBounds): number {
    const { min, max, step } = bounds;
    if (!Number.isFinite(value)) return min;
    const stepped = min + Math.round((value - min) / step) * step;
    const fixed = Number(stepped.toFixed(decimals(step)));
    return Math.min(max, Math.max(min, fixed > max ? fixed - step : fixed));
}

/** Where a value sits along the track, from 0 to 1. */
export function ratioOf(value: number, bounds: SliderBounds): number {
    const span = bounds.max - bounds.min;
    return span <= 0 ? 0 : Math.min(1, Math.max(0, (value - bounds.min) / span));
}

/** The snapped value under a pointer at `ratio` along the track. */
export function valueAt(ratio: number, bounds: SliderBounds): number {
    return snap(bounds.min + Math.min(1, Math.max(0, ratio)) * (bounds.max - bounds.min), bounds);
}

/**
 * The value a key asks for, or `null` for a key a slider ignores. Arrows move one step, Page keys
 * a tenth of the track (at least one step), Home and End jump to the bounds.
 */
export function valueForKey(key: string, value: number, bounds: SliderBounds): number | null {
    const page = Math.max(bounds.step, (bounds.max - bounds.min) / DEFAULT_PAGES);
    const delta: Record<string, number> = {
        ArrowRight: bounds.step,
        ArrowUp: bounds.step,
        ArrowLeft: -bounds.step,
        ArrowDown: -bounds.step,
        PageUp: page,
        PageDown: -page
    };
    if (key === 'Home') return bounds.min;
    if (key === 'End') return bounds.max;
    return key in delta ? snap(value + delta[key], bounds) : null;
}

/** Which thumb a press at `value` should grab: the nearer one, and the upper one on a tie above both. */
export function nearestThumb(values: readonly [number, number], value: number): Thumb {
    const lo = Math.abs(value - values[0]);
    const hi = Math.abs(value - values[1]);
    if (lo === hi) return value > values[1] ? 1 : 0;
    return lo < hi ? 0 : 1;
}

/** The pair after moving one thumb to `next`: the thumbs never cross, and stay `gap` apart. */
export function moveThumb(values: readonly [number, number], thumb: Thumb, next: number, gap = 0): [number, number] {
    if (thumb === 0) return [Math.min(next, values[1] - gap), values[1]];
    return [values[0], Math.max(next, values[0] + gap)];
}
