import { DEFAULT_LOCALE, type Locale } from './locale.js';

export type PluralMessage = Partial<Record<Intl.LDMLPluralRule, string>> & { other: string };

export type Message = string | PluralMessage;

export type Catalog = Record<string, Message>;

export type Params = Record<string, string | number>;

export type Catalogs<C extends Catalog> = { en: C } & Record<Exclude<Locale, 'en'>, { [K in keyof C]: Message }>;

export type Translator<C extends Catalog> = (key: keyof C & string, params?: Params) => string;

/** Replaces each `{name}` with its param; numbers are formatted for the locale, unknown names stay. */
export function interpolate(template: string, locale: Locale, params: Params = {}): string {
    const numbers = new Intl.NumberFormat(locale);
    return template.replace(/\{(\w+)\}/g, (whole, name: string) => {
        const value = params[name];
        if (value === undefined) return whole;
        return typeof value === 'number' ? numbers.format(value) : value;
    });
}

/** Picks the plural branch for `params.count` with `Intl.PluralRules`, falling back to `other`. */
export function pick(message: Message, locale: Locale, params: Params = {}): string {
    if (typeof message === 'string') return message;
    const rule = new Intl.PluralRules(locale).select(Number(params.count ?? 0));
    return message[rule] ?? message.other;
}

/** One message, in `locale`, falling back to the English entry and then to the key itself. */
export function translate<C extends Catalog>(
    catalogs: Catalogs<C>,
    locale: Locale,
    key: keyof C & string,
    params?: Params
): string {
    const own = catalogs[locale]?.[key];
    const message = own ?? catalogs[DEFAULT_LOCALE][key];
    if (message === undefined) return key;
    const lang = own === undefined ? DEFAULT_LOCALE : locale;
    return interpolate(pick(message, lang, params), lang, params);
}

/**
 * A `t()` bound to typed catalogs. Pass a getter for `locale` to follow a reactive value,
 * such as `() => getI18n().locale`, so every call re-reads it.
 */
export function createTranslator<C extends Catalog>(
    catalogs: Catalogs<C>,
    locale: Locale | (() => Locale)
): Translator<C> {
    const current = typeof locale === 'function' ? locale : () => locale;
    return (key, params) => translate(catalogs, current(), key, params);
}
