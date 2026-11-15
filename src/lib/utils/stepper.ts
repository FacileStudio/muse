export type StepState = 'done' | 'current' | 'upcoming';

/** The state of step `index`: `done` follows `done` when given, else every step before `current`. */
export function stepState(index: number, current: number, done?: readonly number[]): StepState {
    if (index === current) return 'current';
    const finished = done ? done.includes(index) : index < current;
    return finished ? 'done' : 'upcoming';
}

/** The current index kept inside `0..total - 1`; `0` for an empty list. */
export function clampStep(current: number, total: number): number {
    if (total <= 0) return 0;
    return Math.min(Math.max(Math.trunc(current) || 0, 0), total - 1);
}
