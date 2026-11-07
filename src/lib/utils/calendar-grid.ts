import { addDays, addMonths, startOfWeek, type DateBounds, type IsoDate, type Weekday } from './calendar-date.js';

/** The first and last day of the month that holds `date`. */
export function monthRange(date: IsoDate): { first: IsoDate; last: IsoDate } {
    const first = `${date.slice(0, 7)}-01`;
    return { first, last: addDays(addMonths(first, 1), -1) };
}

/** The weeks of a month, each seven dates, padded with the neighbouring months' days. */
export function monthGrid(date: IsoDate, firstDay: Weekday): IsoDate[][] {
    const { first, last } = monthRange(date);
    const weeks: IsoDate[][] = [];
    for (let start = startOfWeek(first, firstDay); start <= last; start = addDays(start, 7)) {
        weeks.push(Array.from({ length: 7 }, (_, i) => addDays(start, i)));
    }
    return weeks;
}

export function isDisabled(date: IsoDate, bounds: DateBounds): boolean {
    return Boolean((bounds.min && date < bounds.min) || (bounds.max && date > bounds.max));
}

/** Pulls a date back inside `min` and `max`. */
export function clampDate(date: IsoDate, bounds: DateBounds): IsoDate {
    if (bounds.min && date < bounds.min) return bounds.min;
    if (bounds.max && date > bounds.max) return bounds.max;
    return date;
}

/**
 * Where a key in the day grid moves the focus, or `null` for a key the grid ignores. Arrows step a
 * day or a week, Home and End go to the week's ends, Page keys step a month and Shift a year. The
 * result stays inside `min` and `max`.
 */
export function dateForKey(
    date: IsoDate,
    key: string,
    shift: boolean,
    firstDay: Weekday,
    bounds: DateBounds
): IsoDate | null {
    const next: Record<string, () => IsoDate> = {
        ArrowLeft: () => addDays(date, -1),
        ArrowRight: () => addDays(date, 1),
        ArrowUp: () => addDays(date, -7),
        ArrowDown: () => addDays(date, 7),
        Home: () => startOfWeek(date, firstDay),
        End: () => addDays(startOfWeek(date, firstDay), 6),
        PageUp: () => addMonths(date, shift ? -12 : -1),
        PageDown: () => addMonths(date, shift ? 12 : 1)
    };
    return key in next ? clampDate(next[key](), bounds) : null;
}
