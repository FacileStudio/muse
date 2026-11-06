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

export const LOCALE_COOKIE = 'fc_locale';

type Weighted = { tag: string; q: number; at: number };

const weigh = (part: string, at: number): Weighted => {
    const [tag, ...params] = part.trim().split(';');
    const q = params.map((p) => /^\s*q=([0-9.]+)\s*$/i.exec(p)?.[1]).find(Boolean);
    return { tag: tag.trim().toLowerCase(), q: q === undefined ? 1 : Number(q), at };
};

/**
 * The best supported locale in a session value, a cookie or a full `Accept-Language` header,
 * or `null` when none matches. Every tag is read, highest `q` first: `it, de;q=0.8` is `de`.
 */
export function matchLocale(value: string | null | undefined): Locale | null {
    const tags = (value ?? '')
        .split(',')
        .map(weigh)
        .filter((w) => w.tag !== '' && w.q > 0)
        .sort((a, b) => b.q - a.q || a.at - b.at);
    for (const { tag } of tags) {
        const base = tag.split(/[-_]/)[0];
        if (isLocale(base)) return base;
    }
    return null;
}

/**
 * Like `matchLocale`, with `en` when nothing matches. `fr-FR`, `FR`, `fr_CA` and
 * `it, fr;q=0.5` all become `fr`.
 */
export function resolveLocale(value: string | null | undefined): Locale {
    return matchLocale(value) ?? DEFAULT_LOCALE;
}
