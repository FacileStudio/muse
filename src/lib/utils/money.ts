import type { Locale } from '../i18n/locale.js';

/** Cents in the locale's currency format, with no decimals when the amount is whole. */
export function formatPrice(cents: number, currency: string, locale: Locale): string {
    const whole = cents % 100 === 0;
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: whole ? 0 : 2,
        maximumFractionDigits: whole ? 0 : 2
    }).format(cents / 100);
}

/** A 0–1 fraction as a whole percent in the locale, for example `17 %` in French. */
export const formatPercent = (fraction: number, locale: Locale): string =>
    new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 0 }).format(fraction);
