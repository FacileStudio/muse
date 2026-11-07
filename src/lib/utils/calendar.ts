/** ISO calendar dates, `YYYY-MM-DD`. All the maths is in UTC so a time zone or a DST change never moves a day. */
export type IsoDate = string;

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type DateBounds = { min?: IsoDate; max?: IsoDate };

const ISO = /^(\d{4})-(\d{2})-(\d{2})$/;
const DAY_MS = 86_400_000;

function utc(iso: IsoDate): Date {
    return new Date(`${iso}T00:00:00Z`);
}

function iso(date: Date): IsoDate {
    return date.toISOString().slice(0, 10);
}

/** Whether `value` is a real calendar date in the `YYYY-MM-DD` form. */
export function isIsoDate(value: unknown): value is IsoDate {
    if (typeof value !== 'string' || !ISO.test(value)) return false;
    const date = utc(value);
    return !Number.isNaN(date.getTime()) && iso(date) === value;
}

/** Today's local date, the one a person means by "today". */
export function todayIso(now = new Date()): IsoDate {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

export function addDays(date: IsoDate, days: number): IsoDate {
    return iso(new Date(utc(date).getTime() + days * DAY_MS));
}

/** Moves by whole months and keeps the day when the target month has it, else its last day. */
export function addMonths(date: IsoDate, months: number): IsoDate {
    const [y, m, d] = date.split('-').map(Number);
    const first = new Date(Date.UTC(y, m - 1 + months, 1));
    const last = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0)).getUTCDate();
    return iso(new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth(), Math.min(d, last))));
}

export function weekdayOf(date: IsoDate): Weekday {
    return utc(date).getUTCDay() as Weekday;
}

export function startOfWeek(date: IsoDate, firstDay: Weekday): IsoDate {
    return addDays(date, -((weekdayOf(date) - firstDay + 7) % 7));
}

/** The weeks of a month, each seven dates, padded with the neighbouring months' days. */
export function monthGrid(date: IsoDate, firstDay: Weekday): IsoDate[][] {
    const [y, m] = date.split('-').map(Number);
    const first = iso(new Date(Date.UTC(y, m - 1, 1)));
    const last = iso(new Date(Date.UTC(y, m, 0)));
    const weeks: IsoDate[][] = [];
    for (let start = startOfWeek(first, firstDay); start <= last; start = addDays(start, 7)) {
        weeks.push(Array.from({ length: 7 }, (_, i) => addDays(start, i)));
    }
    return weeks;
}

/** The first and last day of the month that holds `date`. */
export function monthRange(date: IsoDate): { first: IsoDate; last: IsoDate } {
    const first = `${date.slice(0, 7)}-01`;
    return { first, last: addDays(addMonths(first, 1), -1) };
}

export function sameMonth(a: IsoDate, b: IsoDate): boolean {
    return a.slice(0, 7) === b.slice(0, 7);
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

const WEEK_START: Record<string, Weekday> = { en: 0, ja: 0, he: 0, pt: 0 };

/** The first day of the week in a locale: from `Intl.Locale` when the engine has it, else a short table. */
export function firstWeekday(locale: string): Weekday {
    try {
        const intl = new Intl.Locale(locale) as Intl.Locale & {
            getWeekInfo?: () => { firstDay: number };
            weekInfo?: { firstDay: number };
        };
        const info = intl.getWeekInfo?.() ?? intl.weekInfo;
        if (info) return (info.firstDay % 7) as Weekday;
    } catch {
        return 1;
    }
    return WEEK_START[locale.split('-')[0]] ?? 1;
}

export type WeekdayName = { short: string; long: string };

/** The seven weekday names in a locale, starting on `firstDay`. */
export function weekdayNames(locale: string, firstDay: Weekday): WeekdayName[] {
    const short = new Intl.DateTimeFormat(locale, { weekday: 'short', timeZone: 'UTC' });
    const long = new Intl.DateTimeFormat(locale, { weekday: 'long', timeZone: 'UTC' });
    const sunday = utc('2023-01-01');
    return Array.from({ length: 7 }, (_, i) => {
        const day = new Date(sunday.getTime() + ((firstDay + i) % 7) * DAY_MS);
        return { short: short.format(day), long: long.format(day) };
    });
}

export function formatDate(date: IsoDate, locale: string, options: Intl.DateTimeFormatOptions = { dateStyle: 'long' }): string {
    return new Intl.DateTimeFormat(locale, { ...options, timeZone: 'UTC' }).format(utc(date));
}

/** The month heading, such as "novembre 2026". */
export function monthTitle(date: IsoDate, locale: string): string {
    return formatDate(date, locale, { month: 'long', year: 'numeric' });
}
