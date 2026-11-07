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
    return now.toLocaleDateString('en-CA');
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
