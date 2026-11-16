import { LOCALES, isLocale, type Locale } from './locale.js';

/** The locales a picker offers: `wanted` without duplicates or unknown values, or all of `LOCALES` when nothing valid is left. */
export function offeredLocales(wanted?: readonly string[] | null): readonly Locale[] {
    const kept = [...new Set((wanted ?? []).filter(isLocale))];
    return kept.length > 0 ? kept : LOCALES;
}
