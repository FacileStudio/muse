import type { IsoDate, Weekday } from './calendar-date.js';

const DAY_MS = 86_400_000;

function utc(iso: IsoDate): Date {
    return new Date(`${iso}T00:00:00Z`);
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
