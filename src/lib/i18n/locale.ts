export const LOCALES = ['fr', 'en', 'es', 'de'] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

export const LOCALE_NAMES: Readonly<Record<Locale, string>> = {
    fr: 'Français',
    en: 'English',
    es: 'Español',
    de: 'Deutsch'
};

/** Narrows any string to a supported locale. */
export function isLocale(value: unknown): value is Locale {
    return typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
}

/**
 * Maps a session, cookie or `Accept-Language` value to a supported locale.
 * `fr-FR`, `FR` and `fr_CA` all become `fr`; anything unknown or empty becomes `en`.
 */
export function resolveLocale(value: string | null | undefined): Locale {
    const base = (value ?? '').trim().toLowerCase().split(/[-_,;]/)[0];
    return isLocale(base) ? base : DEFAULT_LOCALE;
}
