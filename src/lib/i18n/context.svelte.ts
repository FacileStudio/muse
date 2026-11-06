import { getContext, setContext } from 'svelte';
import { DEFAULT_LOCALE, matchLocale, resolveLocale, type Locale } from './locale.js';
import { museMessages, type MuseMessages } from './messages/index.js';
import { createTranslator, type Translator } from './translate.js';

export interface I18n {
    readonly locale: Locale;
    /** False when `locale` is only the English fallback: no session, cookie or choice matched. */
    readonly known: boolean;
    set(locale: Locale): void;
    t: Translator<MuseMessages>;
}

export type LocaleSource = string | null | undefined | (() => string | null | undefined);

const KEY = Symbol.for('fc.i18n');

/**
 * A fixed-locale `I18n` with no context and no `<html lang>` effect: tests, emails, SSR helpers.
 * With no argument it is the unknown-locale English fallback.
 */
export function staticI18n(locale?: string | null): I18n {
    const fixed = resolveLocale(locale ?? DEFAULT_LOCALE);
    return {
        locale: fixed,
        known: matchLocale(locale) !== null,
        set: () => undefined,
        t: createTranslator(museMessages, fixed)
    };
}

/**
 * Sets the locale for every muse component below the calling component, and keeps
 * `<html lang>` in step with it. Call once, in the root layout, with the session's locale:
 * `provideLocale(() => data.session?.locale)`. On a page with no session, pass the
 * `LOCALE_COOKIE` value or the `Accept-Language` header instead. A getter follows the source
 * reactively; `set()` (what `LocaleSwitch` calls) overrides it until the page reloads.
 */
export function provideLocale(source: LocaleSource): I18n {
    const read = typeof source === 'function' ? source : () => source;
    const state = $state<{ chosen: Locale | null }>({ chosen: null });
    const i18n: I18n = {
        get locale() {
            return state.chosen ?? resolveLocale(read());
        },
        get known() {
            return state.chosen !== null || matchLocale(read()) !== null;
        },
        set(locale) {
            state.chosen = resolveLocale(locale);
        },
        t: createTranslator(museMessages, () => i18n.locale)
    };
    setContext(KEY, i18n);
    $effect(() => {
        document.documentElement.lang = i18n.locale;
    });
    return i18n;
}

/** The nearest `provideLocale` above the caller, or English when there is none. */
export function getI18n(): I18n {
    return getContext<I18n | undefined>(KEY) ?? staticI18n();
}

/**
 * Pins a subtree to one locale without touching `<html lang>`: a preview of another
 * language, or a block quoted in it. Put `lang={locale}` on the subtree's root element.
 */
export function scopeLocale(source: string | (() => string)): I18n {
    const raw = () => (typeof source === 'function' ? source() : source);
    const read = () => resolveLocale(raw());
    const i18n: I18n = {
        get locale() {
            return read();
        },
        get known() {
            return matchLocale(raw()) !== null;
        },
        set: () => undefined,
        t: createTranslator(museMessages, read)
    };
    setContext(KEY, i18n);
    return i18n;
}
